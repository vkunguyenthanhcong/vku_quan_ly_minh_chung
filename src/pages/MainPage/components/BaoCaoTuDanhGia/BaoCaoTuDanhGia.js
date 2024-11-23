import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
    findTieuChuaByMaCtdt, getAllGoiY, getAllMocChuan, getAllPhieuDanhGia, getAllPhieuDanhGiaTieuChuan,
    getAllTieuChi,
    getPhieuDanhGiaTieuChiByMaCtdt,
    getThongTinCTDT
} from "../../../../services/apiServices";
import {Col, Row} from "react-bootstrap";
import {saveAs} from 'file-saver';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    ExternalHyperlink,
    LevelFormat,
    Table,
    TableCell,
    TableRow,
    WidthType,
    VerticalAlign,
    convertInchesToTwip, ImageRun, HeadingLevel, TableOfContents
} from 'docx';
import {Buffer} from "buffer";

const BaoCaoTuDanhGia = ({KhungCTDT_ID, setNoCase}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [phieuDanhGia, setPhieuDanhGia] = useState([])
    const [tieuChuan, setTieuChuan] = useState([])

    const convertHtmlToDocxParagraphs = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const paragraphs = [];

        // Tạo TextRun cho các node
        const createTextRun = (node, isBold = false, isItalic = false, isUnderline = false, color = "#000000") => {
            const text = node.textContent || "";
            return new TextRun({
                text: text,
                bold: isBold,
                italics: isItalic,
                underline: isUnderline ? {} : undefined, // Hỗ trợ underline
                size: 26,
                font: "Times New Roman",
                color : color
            });
        };

        // Hàm xử lý các ô trong bảng
        const parseTableCell = (cell, isBold) => {
            const textRuns = parseChildNodes(cell.childNodes, isBold);
            return new TableCell({
                children: [new Paragraph({children: textRuns, spacing: {line: 360}, alignment: AlignmentType.CENTER,})],
                verticalAlign: VerticalAlign.CENTER,
            });
        };

        // Hàm xử lý các hàng trong bảng
        const parseTableRow = (row) => {
            const thCells = Array.from(row.querySelectorAll("th"));
            const cells = Array.from(row.querySelectorAll("td"));
            const tableCells = [...thCells.map(cell => parseTableCell(cell, true)), ...cells.map(cell => parseTableCell(cell, false))];

            return new TableRow({
                children: tableCells,
                verticalAlign: VerticalAlign.CENTER
            });
        };

        // Hàm xử lý bảng
        const parseTable = (table) => {
            const headerRows = Array.from(table.querySelectorAll("thead tr"));
            const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
            const tableRows = [
                ...headerRows.map(parseTableRow),
                ...bodyRows.map(parseTableRow)
            ];
            if(table.id == "mucdanhgia"){
                return new Table({
                    rows: tableRows,
                    alignment : AlignmentType.CENTER,
                    width: { size: 50, type: WidthType.PERCENTAGE }, // Set table width to 100%
                });
            }else{
                return new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE }, // Set table width to 100%
                    spacing: {line: 360},
                });
            }
        };
        const parseChildNodes = (nodes, isBold = false, isItalic = false, isUnderline = false, color = "#000000") => {
            const textRuns = [];

            nodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    if (child.textContent.trim()) {
                        textRuns.push(createTextRun(child, isBold, isItalic, isUnderline, color));
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    switch (child.nodeName) {
                        case "B":
                        case "STRONG":
                            textRuns.push(...parseChildNodes(child.childNodes, true, isItalic, isUnderline));
                            break;
                        case "I":
                        case "EM":
                            textRuns.push(...parseChildNodes(child.childNodes, isBold, true, isUnderline));
                            break;
                        case "U":
                            textRuns.push(...parseChildNodes(child.childNodes, isBold, isItalic, true));
                            break;
                        case "A":
                            const linkUrl = child.getAttribute("href");
                            const linkText = child.textContent || "";

                            textRuns.push(
                                new ExternalHyperlink({
                                    children: [
                                        new TextRun({
                                            text: linkText,
                                            color: "000000", // Màu đen thay vì màu xanh dương
                                            size: 26,
                                            font: "Times New Roman",
                                        }),
                                    ],
                                    link: linkUrl,
                                })
                            );
                            break;
                        default:
                            textRuns.push(...parseChildNodes(child.childNodes, isBold, isItalic, isUnderline));
                    }
                }
            });

            return textRuns;
        };

        const parseNode = async (node) => {
            if (node.nodeName === "P") {
                const textRuns = parseChildNodes(node.childNodes);
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: {firstLine: 720},
                        spacing: {line: 360},
                        alignment: AlignmentType.JUSTIFIED,
                    })
                );
            } else if (node.nodeName === "FIGURE" && node.classList.contains("table")) {
                const table = node.querySelector("table");

                if (table) {
                    paragraphs.push(parseTable(table));
                }
            } else if (node.nodeName === "FIGURE" && node.classList.contains("image")) {
                const img = node.querySelector("img");
                const url = img.src;
                const imageData = url.split(",")[1];
                if (imageData) {
                    const imgWidth = img.width; // Original image width in pixels
                    const imgHeight = img.height;
                    const aspectRatio = imgWidth / imgHeight;
                    const newWidth = Math.min((((8.27 * 1440) - 1701 - 1134)/1440)*96, imgWidth);
                    const newHeight = Math.round(newWidth / aspectRatio);

                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: Buffer.from(imageData, "base64"),
                                    transformation: {
                                        width: newWidth,
                                        height : newHeight
                                    },
                                }),
                            ],
                        })
                    );
                }
            }else if (node.nodeName === "UL") {
                node.childNodes.forEach((li) => {
                    if (li.nodeName === "LI") {
                        const textRuns = parseChildNodes(li.childNodes);
                        paragraphs.push(
                            new Paragraph({
                                children: textRuns,
                                numbering: {reference: "my-unique-bullet-points", level: 0},
                                indent: {firstLine: 720},
                                spacing: {line: 360},
                            })
                        );
                    }
                });
            } else if (node.nodeName === "H2") {
                const textRuns = parseChildNodes(node.childNodes);
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: {firstLine: 720},
                        heading: HeadingLevel.HEADING_2,
                        spacing: {line: 360},
                        alignment: AlignmentType.JUSTIFIED,
                    })
                );
            }
            else if (node.nodeName === "H1") {
                const textRuns = parseChildNodes(node.childNodes);
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: {firstLine: 720},
                        heading: HeadingLevel.HEADING_1,
                        spacing: {line: 360},
                        alignment: AlignmentType.JUSTIFIED,
                    })
                );
            } else if (node.nodeName === "H3") {
                const textRuns = parseChildNodes(node.childNodes);
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: {firstLine: 720},
                        heading: HeadingLevel.HEADING_3,
                        spacing: {line: 360},
                        alignment: AlignmentType.JUSTIFIED,
                    })
                );
            }
        };

        // Xử lý từng node trong body của tài liệu HTML
        doc.body.childNodes.forEach((node) => {
            parseNode(node);
        });
        return paragraphs;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getThongTinCTDT(KhungCTDT_ID);
                setChuongTrinhDaoTao(response);
                const tieuChuanData = await findTieuChuaByMaCtdt(KhungCTDT_ID);
                setTieuChuan(tieuChuanData);
                const phieuDanhGiaData = await getAllPhieuDanhGiaTieuChuan()
                const filteredPhieuDanhGia = phieuDanhGiaData.filter(mch =>
                    tieuChuanData.some(tc => tc.idTieuChuan === mch.idTieuChuan)
                );
                setPhieuDanhGia(filteredPhieuDanhGia)
            } catch (e) {
                setLoading(true);
                setError(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [KhungCTDT_ID])



    const handleExportToDocx = async () => {
        // Create a document
        const doc = new Document({
            features: {
                updateFields: true,
            },
            numbering: {
                config: [
                    ...tieuChuan.map(item => ({
                        reference: `my-crazy-numbering-${item.stt}`,  // Dynamic numbering reference for each tieuChuan
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.DECIMAL,
                                text: "%1.",  // Numbering format
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {},
                                    run: {
                                        font: "Times New Roman",
                                        italic: true,
                                        size: 26,
                                    },
                                },
                            },
                        ],
                    })),
                    {
                        reference: "my-unique-bullet-points",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.BULLET,
                                text: "-",
                                alignment: AlignmentType.LEFT,
                                style: {
                                    paragraph: {
                                        indent: { firstLine: 720 },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            sections: tieuChuan.map((tieuChuanItem, index) => {
                const filteredPhieuDanhGia = phieuDanhGia.filter(item => item.idTieuChuan === tieuChuanItem.idTieuChuan);

                return {
                    properties: {
                        page: {
                            size: {
                                width: 8.27 * 1440,   // Set to A4 page size
                                height: 11.69 * 1440,  // Set to A4 page size
                            },
                            margin: {
                                left: 1701,  // 3cm = 1701 twips
                                right: 1134, // 2cm = 1134 twips
                                top: 1134,   // 2cm = 1134 twips
                                bottom: 1134 // 2cm = 1134 twips
                            },
                        },
                    },
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `TIÊU CHUẨN ${tieuChuanItem.stt}. ${tieuChuanItem.tenTieuChuan}`.toUpperCase(),
                                    size: 28,
                                    bold: true,
                                    font: "Times New Roman",
                                    color: "#000000"
                                }),
                            ],
                            heading: HeadingLevel.HEADING_1,
                            spacing: {
                                line: 360,
                            },
                            alignment: AlignmentType.CENTER,
                        }),

                        ...[].concat(
                            ...filteredPhieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.moTa))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Đánh giá chung về Tiêu chuẩn ${tieuChuanItem.stt}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true,
                                    color: "#000000",
                                })
                            ],
                            heading: HeadingLevel.HEADING_1,
                            spacing: {
                                line: 360,
                            },
                        }),

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Tóm tắt các điểm mạnh',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
                                })
                            ],
                            numbering: {
                                reference: `my-crazy-numbering-${tieuChuanItem.stt}`,  // Unique reference per tieuChuan
                                level: 0,  // Reset level to 0 for each tieuChuan
                            },
                            spacing: {
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...filteredPhieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.diemManh))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Tóm tắt các điểm tồn tại',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
                                })
                            ],
                            numbering: {
                                reference: `my-crazy-numbering-${tieuChuanItem.stt}`,  // Unique reference per tieuChuan
                                level: 0,  // Reset level to 0 for each tieuChuan
                            },
                            spacing: {
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...filteredPhieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.diemTonTai))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Kế hoạch cải tiến',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
                                })
                            ],
                            numbering: {
                                reference: `my-crazy-numbering-${tieuChuanItem.stt}`,  // Unique reference per tieuChuan
                                level: 0,  // Reset level to 0 for each tieuChuan
                            },
                            spacing: {
                                line: 360,
                            },

                        }),
                        ...[].concat(
                            ...filteredPhieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.keHoach))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Mức đánh giá',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
                                })
                            ],
                            numbering: {
                                reference: `my-crazy-numbering-${tieuChuanItem.stt}`,  // Unique reference per tieuChuan
                                level: 0,  // Reset level to 0 for each tieuChuan
                            },
                            spacing: {
                                before: 360,
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...filteredPhieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.mucDanhGia))
                        ),
                    ],
                };
            }),
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'phieu-danh-gia.docx');
        });
    };

    if (loading === true) {
        return (<p>Loading...</p>)
    }
    const goToVietBaoCao = () => {
        setNoCase(2)
        // navigate(`../viet-bao-cao?KhungCTDT_ID=${KhungCTDT_ID}`)
    }
    return (
        <div className="content bg-white m-3 p-4">
            <style>

            </style>
            <p>BÁO CÁO TỰ ĐÁNH GIÁ <b>{chuongTrinhDaoTao.tenCtdt}</b></p>
            <b>Kế hoạch</b>
            <div className="mt-2">
                <Row>
                    <Col md={2} xs={12}>
                        <button className="btn btn-success">Kế hoạch tự đánh giá</button>
                    </Col>
                    <Col md={2} xs={12}>
                        <button className="btn btn-success">Hội đồng tự đánh giá</button>
                    </Col>
                    <Col md={2} xs={12}>
                        <button className="btn btn-success">Các nhóm chuyên trách</button>
                    </Col>
                </Row>
            </div>
            <br/>
            <b>Viết báo cáo</b>
            <div className="mt-2">
                <Row>
                    <Col md={3} xs={12}>
                        <button className="btn btn-success" onClick={() => goToVietBaoCao()}>Viết báo cáo tiêu chuẩn / tiêu chí
                        </button>
                    </Col>
                </Row>
            </div>
            <br/>
            <b>Tổng hợp</b>
            <div className="mt-2">
                <Row>
                    <Col md={2} xs={12}>
                        <button className="btn btn-primary" onClick={() => handleExportToDocx()}>Tổng hợp</button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default BaoCaoTuDanhGia;
