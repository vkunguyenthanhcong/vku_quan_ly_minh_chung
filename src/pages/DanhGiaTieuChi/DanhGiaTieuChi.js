import React, {useEffect, useState, useRef} from "react";
import {
    getAllMinhChung,
    getAllPhieuDanhGia, getPhongBanById, getTieuChiById, getTieuChuanById
} from "../../services/apiServices";
import {useLocation} from "react-router-dom";
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
    convertInchesToTwip, ImageRun
} from 'docx';
import {Buffer} from "buffer";
const replaceTextInLinks = (html, replacements) => {
    if (!html || !Array.isArray(replacements) || replacements.length === 0) {
        return html; // Return the original HTML if no replacements are provided
    }

    let updatedHtml = html;
    replacements.forEach(replacement => {
        const { tenMinhChung, maMinhChung } = replacement;
        const regExp = new RegExp(`\\[${tenMinhChung}\\]`, 'g'); // Match the text in the brackets
        updatedHtml = updatedHtml.replace(regExp, `[${maMinhChung}]`);
    });

    return updatedHtml;
};

const DanhGiaTieuChi = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const TieuChi_ID = queryParams.get('TieuChi_ID');
    const [phieuDanhGia, setPhieuDanhGia] = useState([]);
    const [phongBan, setPhongBan] = useState([])
    const [tieuChuan, setTieuChuan] = useState([])
    const [tieuChi, setTieuChi] = useState([])
    const [minhChung, setMinhChung] = useState([])
    const [mota, setMota] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPhieuDanhGia();
                const filtered = response.filter(
                    (item) => item.idTieuChuan == TieuChuan_ID && item.idTieuChi == TieuChi_ID
                );
                setPhieuDanhGia(filtered);
                if (filtered.length > 0) {
                    const phongBanData = await getPhongBanById(filtered[0].idPhongBan);
                    setPhongBan(phongBanData);
                }
                const tieuChuanData = await getTieuChuanById(TieuChuan_ID);
                setTieuChuan(tieuChuanData);
                const tieuChiData = await getTieuChiById(TieuChi_ID);
                setTieuChi(tieuChiData);

                const mc = await getAllMinhChung();
                const updateMc = mc.filter(item=>item.idTieuChuan == TieuChuan_ID).map(row=>{
                    let maMinhChung;
                    if(row.maDungChung == 0){
                        maMinhChung = row.parentMaMc+row.childMaMc;
                    }else{
                        const filter = mc.find(item=>item.idMc == row.maDungChung);
                        maMinhChung = filter.parentMaMc+filter.childMaMc;
                    }
                    return {
                        ...row,
                        maMinhChung : maMinhChung,
                    };
                })

                const updatedHtml = replaceTextInLinks(filtered[0].moTa, updateMc);
                setMota(updatedHtml)
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        // Fetch data only if both IDs are available
        if (TieuChuan_ID && TieuChi_ID) {
            fetchData();
        }
    }, [TieuChuan_ID, TieuChi_ID]);

    const contentRef = useRef(null);
    const convertHtmlToDocxParagraphs = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const paragraphs = [];

        // Tạo TextRun cho các node
        const createTextRun = (node, isBold = false, isItalic = false, isUnderline = false) => {
            const text = node.textContent || "";
            return new TextRun({
                text: text,
                bold: isBold,
                italics: isItalic,
                underline: isUnderline ? {} : undefined, // Hỗ trợ underline
                size: 26,
                font: "Times New Roman",
            });
        };

        // Hàm xử lý các ô trong bảng
        const parseTableCell = (cell, isBold) => {
            const textRuns = parseChildNodes(cell.childNodes, isBold);
            return new TableCell({
                children: [new Paragraph({children: textRuns, spacing: {line: 360}})],
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
            });
        };

        // Hàm xử lý bảng
        const parseTable = (table) => {
            // Select rows from thead and tbody
            const headerRows = Array.from(table.querySelectorAll("thead tr"));

            const bodyRows = Array.from(table.querySelectorAll("tbody tr"));

            const tableRows = [
                ...headerRows.map(parseTableRow),
                ...bodyRows.map(parseTableRow)
            ];

            return new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE }, // Set table width to 100%
            });
        };;

        // Hàm xử lý các node con theo kiểu khác nhau
        const parseChildNodes = (nodes, isBold = false, isItalic = false, isUnderline = false) => {
            const textRuns = [];

            nodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    if (child.textContent.trim()) {
                        textRuns.push(createTextRun(child, isBold, isItalic, isUnderline));
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

        // Hàm xử lý các node trong HTML
        const parseNode = (node) => {
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
                    paragraphs.push(
                        new Paragraph({
                            children: [],
                            spacing: {line: 360},
                        })
                    );
                }
            }
            else if (node.nodeName === "FIGURE" && node.classList.contains("image")) {
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
            }
        };

        // Xử lý từng node trong body của tài liệu HTML
        doc.body.childNodes.forEach((node) => {
            parseNode(node);
        });

        return paragraphs;
    };


    const handleExportToDocx = () => {
        // Create a document
        const doc = new Document({
            numbering: {
                config: [
                    {
                        reference: "my-crazy-numbering",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.DECIMAL,
                                text: "%1.",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: {firstLine: 720},
                                    },
                                    run: {
                                        font: "Times New Roman",
                                        bold: true,
                                        size: 26
                                    },
                                },
                            },
                        ],
                    },
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
                                        indent: {firstLine: 720},
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            sections: [
                {
                    properties: {
                        size: {
                            width: 8.27 * 1440,   // Set to A4 page size
                            height: 11.69 * 1440,  // Set to A4 page size
                        },
                        page: {
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
                                    text: 'PHIẾU ĐÁNH GIÁ TIÊU CHÍ',
                                    size: 28,
                                    bold: true,
                                    font: "Times New Roman",
                                }),
                            ],
                            spacing: {
                                after: 360,
                                line: 360,
                            },
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Nhóm công tác: ${phongBan.tenPhongBan}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            spacing: {
                                line: 360,
                            },
                            indent: {
                                firstLine: 720,
                            },
                            alignment: AlignmentType.JUSTIFIED
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Tiêu chuẩn ${tieuChuan.stt}: ${tieuChuan.tenTieuChuan}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            spacing: {

                                line: 360,
                            },
                            indent: {
                                firstLine: 720,
                            },
                            alignment: AlignmentType.JUSTIFIED
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Tiêu chí ${tieuChi.stt}: ${tieuChi.tenTieuChi}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            spacing: {

                                line: 360,
                            },
                            indent: {
                                firstLine: 720,
                            },
                            alignment: AlignmentType.JUSTIFIED
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Mô tả',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.moTa))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Điểm mạnh',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.diemManh))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Điểm tồn tại',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.diemTonTai))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Kế hoạch hành động',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                line: 360,
                            },

                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(`<p>${item.keHoach}</p>`))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Mức đánh giá tiêu chí',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                before: 360,
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => createTableMucDanhGia(item.mucDanhGia))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: 'Người Viết Báo Cáo',
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            spacing: {
                                before: 360,
                                line: 1080,
                            },
                            alignment: AlignmentType.END
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${phieuDanhGia.map((item) => item.nguoiVietBaoCao)}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold: true
                                })
                            ],
                            spacing: {
                                before: 360,
                                line: 360,
                            },
                            alignment: AlignmentType.END
                        }),
                    ],
                },
            ],
        });

        // Convert the document to a .docx Blob
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'phieu-danh-gia.docx');
        });
    };
    const createTableMucDanhGia = (n) => {
        const rows = [];
        const columnWidths = [
            1300, // Column widths can be adjusted
            1300,
            1300,
            1300,
            1300,
            1300,
            1300,
        ];
        // First row with colspan 7
        const headerCell = new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Thang đánh giá",
                            bold: true,
                            size: 26, // Set size (1/2 point)
                            font: "Times New Roman", // Set font family
                        }),
                    ],
                    spacing: {
                        before: 100,
                        line: 360, // Adjust the margin as needed (in 1/20 pt)
                    },
                    alignment: AlignmentType.CENTER,
                }),
            ],
            width: {
                size: 9117, // Set total width of the cell to match the table
                type: WidthType.DXA,
            },
            verticalAlignment: VerticalAlign.CENTER, // Center vertically
            columnSpan: 7,
        });

        rows.push(new TableRow({
            children: [headerCell], // First row with colspan
        }));

        // Data rows
        const numberCells = Array.from({length: 7}, (_, index) => new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${index + 1}`,
                            size: 26,
                            font: "Times New Roman",
                        }),
                    ],
                    spacing: {
                        before: 100,
                        line: 360, // Adjust the margin as needed (in 1/20 pt)
                    },
                    alignment: AlignmentType.CENTER,
                }),
            ],
            width: {
                size: columnWidths[index],
                type: WidthType.DXA,
            },
            verticalAlignment: VerticalAlign.CENTER,
        }));

        rows.push(new TableRow({
            children: numberCells,
        }));
        const checkCells = Array.from({length: 7}, (_, index) => {
            const cellText = (index + 1 == n) ? "X" : "";
            return new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: cellText,
                                size: 26,
                                font: "Times New Roman",
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            before: 100,
                            line: 360, // Adjust the margin as needed (in 1/20 pt)
                        },
                    }),
                ],
                width: {
                    size: columnWidths[index],
                    type: WidthType.DXA,
                },
                verticalAlignment: VerticalAlign.CENTER,
            });
        });
        rows.push(new TableRow({
            children: checkCells,
        }));
        return new Table({
            rows: rows,
            width: {
                size: 9117, // Total width from column widths
                type: WidthType.DXA,
            },
        });
    };


    return (
        <>
            <style>
                {
                    `table {
                          width: 100%;
                          border-collapse: collapse;
                        }
                        td, th {
                          border: 1px solid #ddd;
                          padding: 8px;
                        }`
                }
            </style>
            {phieuDanhGia && phieuDanhGia.length > 0 ? (
                phieuDanhGia.map((item, index) => (

                    <div ref={contentRef} className="a4-size" id="phieudanhgia" key={index}>

                        <style>
                            {`
                          td{
                            color : black !important;
                          }
                          .image img {
                             max-width : 100%;
                             height : auto;
                          }
                          .image {
                          margin-left: auto;
                             margin-right: auto;}
                          
                        `}
                        </style>
                        <div className="a4-content">
                            <p className="heading-1">
                                <b style={{fontSize: '14pt'}}>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b>
                            </p>
                            <p className="a4-tab mt-3" style={{textAlign: "justify"}}><b>Nhóm công
                                tác: {phongBan.tenPhongBan}</b></p>
                            <p className="a4-tab" style={{textAlign: "justify"}}><b>Tiêu
                                chuẩn {tieuChuan.stt} : {tieuChuan.tenTieuChuan}</b>
                            </p>
                            <p className="a4-tab" style={{textAlign: "justify"}}><b>Tiêu
                                chí {tieuChi.stt} : {tieuChi.tenTieuChi}</b>
                            </p>
                            <p className="a4-tab"><b>1. Mô tả</b></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: mota}}/>
                            </p>
                            <p className="a4-tab"><b>2. Điểm mạnh</b></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.diemManh}}/>
                            </p>
                            <p className="a4-tab"><b>3. Điểm tồn tại</b></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.diemTonTai}}/>
                            </p>
                            <p className="a4-tab"><b>4. Kế hoạch hành động</b></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.keHoach}}/>
                            </p>
                            <p className="a4-tab mt-2"><b>5. Mức đánh giá tiêu chí</b></p>
                            <table style={{width: "100%"}}>
                                <thead>
                                <tr>
                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}><b>Thang đánh giá</b></td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                        <td key={num} style={{
                                            border: "1px solid black",
                                            padding: "8px",
                                            textAlign: "center"
                                        }}>{num}</td>
                                    ))}
                                </tr>
                                <tr>
                                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                        <td key={num} style={{
                                            border: "1px solid black",
                                            padding: "8px",
                                            textAlign: "center"
                                        }}>
                                            {num === (item.mucDanhGia) ? "X" : ""}
                                        </td>
                                    ))}
                                </tr>
                                </tbody>
                            </table>
                            <p className="text-end mt-5"><b>Người Viết Báo Cáo</b></p>
                            <p className="text-end mt-5"><b>{item.nguoiVietBaoCao}</b></p>
                        </div>
                    </div>
                ))
            ) : (
                'Loading...'
            )}

            <button onClick={handleExportToDocx}
                    style={{position: "fixed", bottom: "20px", right: "20px", cursor: "pointer"}}
                    className="btn btn-success">Xuất File Word
            </button>
        </>

    );
};

export default DanhGiaTieuChi;
