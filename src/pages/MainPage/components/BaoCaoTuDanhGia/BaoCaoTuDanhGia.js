import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
    findTieuChuaByMaCtdt, getAllGoiY, getAllMocChuan, getAllPhieuDanhGia,
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
    convertInchesToTwip
} from 'docx';

const BaoCaoTuDanhGia = ({KhungCTDT_ID, setNoCase}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [phieuDanhGia, setPhieuDanhGia] = useState(null)
    const [tieuChuan, setTieuChuan] = useState(null)

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
        const parseTableCell = (cell) => {
            const textRuns = parseChildNodes(cell.childNodes);
            return new TableCell({
                children: [new Paragraph({children: textRuns, spacing: {line: 360}})],
                verticalAlign: VerticalAlign.CENTER,
            });
        };

        // Hàm xử lý các hàng trong bảng
        const parseTableRow = (row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            const tableCells = cells.map(parseTableCell);

            return new TableRow({
                children: tableCells,
            });
        };

        // Hàm xử lý bảng
        const parseTable = (table) => {
            const rows = Array.from(table.querySelectorAll("tbody tr"));
            const tableRows = rows.map(parseTableRow);

            return new Table({
                rows: tableRows,
                width: {size: 100, type: WidthType.PERCENTAGE}, // Đặt chiều rộng của bảng

            });
        };

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
            } else if (node.nodeName === "UL") {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getThongTinCTDT(KhungCTDT_ID);
                setChuongTrinhDaoTao(response);

                const tieuChuanData = await findTieuChuaByMaCtdt(KhungCTDT_ID);
                const tieuChiData = await getAllTieuChi();
                const phieuDanhGiaData = await getAllPhieuDanhGia()

                const tieuChuanMap = Object.fromEntries(
                    tieuChuanData.map(tc => [tc.idTieuChuan, tc])
                );
                const tieuChiMap = Object.fromEntries(
                    tieuChiData.map(tc => [tc.idTieuChi, tc])
                );
                const updatedPhieuDanhGia = phieuDanhGiaData
                    .filter(pd =>
                        tieuChuanMap[pd.idTieuChuan] &&
                        tieuChiMap[pd.idTieuChi]
                    )
                    .map(pd => ({
                        ...pd,
                        tieuChuan: tieuChuanMap[pd.idTieuChuan],
                        tieuChi: tieuChiMap[pd.idTieuChi],
                    }));
                setPhieuDanhGia(updatedPhieuDanhGia)
                const updatedTieuChuan = tieuChuanData.map(tch => {
                    const filteredTieuChi = tieuChiData.filter(tc => tc.idTieuChuan === tch.idTieuChuan);
                    return {
                        ...tch,
                        tieuChi: filteredTieuChi
                    };
                });
                setTieuChuan(updatedTieuChuan);
            } catch (e) {
                setLoading(true);
                setError(e);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [KhungCTDT_ID])
    const createTableKeHoach = (filterDanhGiaTieuChuan) => {
        const columnWidths = [
            500,   // TT
            1500,  // Mục tiêu
            3000,  // Nội dung
            1500,  // Đơn vị/ cá nhân thực hiện
            1500,  // Thời gian thực hiện hoặc hoàn thành
            700    // Ghi chú
        ];

        // Create header cells
        const headerCells = [
            'TT',
            'Mục tiêu',
            'Nội dung',
            'Đơn vị/ cá nhân thực hiện',
            'Thời gian thực hiện',
            'Ghi chú'
        ].map((header, index) => new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: header,
                            size: 26,
                            font: "Times New Roman",
                            bold: true
                        }),
                    ],
                    spacing: {
                        line: 360,
                    },
                    alignment: AlignmentType.CENTER,
                }),
            ],
            width: {
                size: columnWidths[index],
                type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
        }));

        // Initialize rows array and add header row
        const rows = [new TableRow({
            children: headerCells,
        })];

        let stt = 1;

        const createCells = (data, prefix, index) => {
            return [
                `${stt}`, // TT
                prefix === "KhacPhuc" ? `Khắc phục tồn tại ${index + 1}` : `Phát huy điểm mạnh ${index + 1}`,
                data[`noiDung${prefix}`] || '',
                data[`donVi${prefix}`] || '',
                data[`thoiGian${prefix}`] || '',
                data[`ghiChu${prefix}`] || ''
            ].map((text, cellIndex) => new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: text,
                                size: 26,
                                font: "Times New Roman",
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),
                ],
                width: {
                    size: columnWidths[cellIndex],
                    type: WidthType.DXA,
                },
                margins: {
                    top: convertInchesToTwip(0.1),
                    bottom: convertInchesToTwip(0.1),
                    right: convertInchesToTwip(0.1),
                    left: convertInchesToTwip(0.1),
                },
            }));
        };

        filterDanhGiaTieuChuan.filter(item => item.noiDungKhacPhuc != '').forEach((data, index) => {
            rows.push(new TableRow({
                children: createCells(data, 'KhacPhuc', index),
            }));
            stt++;
        });

        filterDanhGiaTieuChuan.filter(item => item.noiDungPhatHuy != '').forEach((data, index) => {
            rows.push(new TableRow({
                children: createCells(data, 'PhatHuy', index),
            }));
            stt++;
        });
        return new Table({
            rows: rows,
            width: {
                size: 9117, // Total width from column widths
                type: WidthType.DXA,
            },
            spacing: {
                line: 360,
            },

        });
    };
    const createTableMucDanhGia = (filterDanhGiaTieuChuan, sttTieuChuan, score, total) => {
        const columnWidths = [1500, 1500];

        // Create header cells
        const headerCells = ['Tiêu chuẩn/Tiêu chí', 'Tự đánh giá'].map((header, index) => new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: header,
                            size: 26,
                            font: "Times New Roman",
                            bold: true
                        }),
                    ],
                    spacing: {
                        line: 360,
                    },
                    alignment: AlignmentType.CENTER,
                }),
            ],
            width: {
                size: columnWidths[index],
                type: WidthType.DXA,
            },
            verticalAlign: VerticalAlign.CENTER,
        }));

        const rows = [new TableRow({children: headerCells})];
        // Create the initial score row
        const initialCells = [
            `Tiêu chuẩn ${sttTieuChuan}`,
            `${score / total}`
        ].map((text, cellIndex) => new TableCell({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: text,
                            size: 26,
                            font: "Times New Roman",
                        }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                }),
            ],
            width: {
                size: columnWidths[cellIndex],
                type: WidthType.DXA,
            },
            margins: {
                top: convertInchesToTwip(0.1),
                bottom: convertInchesToTwip(0.1),
                right: convertInchesToTwip(0.1),
                left: convertInchesToTwip(0.1),
            },
        }));

        rows.push(new TableRow({children: initialCells}));
        // Process each item in filterDanhGiaTieuChuan
        filterDanhGiaTieuChuan.forEach(data => {
            const cells = [
                `Tiêu chí ${data.tieuChuan.stt}.${data.tieuChi.stt}`,
                `${data.mucDanhGia}`
            ].map((text, cellIndex) => new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: text,
                                size: 26,
                                font: "Times New Roman",
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                    }),
                ],
                width: {
                    size: columnWidths[cellIndex],
                    type: WidthType.DXA,
                },
                margins: {
                    top: convertInchesToTwip(0.1),
                    bottom: convertInchesToTwip(0.1),
                    right: convertInchesToTwip(0.1),
                    left: convertInchesToTwip(0.1),
                },
            }));
            rows.push(new TableRow({children: cells}));

        });


        return new Table({
            rows: rows,
            width: {
                size: 9117 / 2, // Total width from column widths
                type: WidthType.DXA,
            },
            alignment: AlignmentType.CENTER
        });
    };

    const paragraphs = (tieuChuan || []).flatMap((item, index) => {
        const filterDanhGiaTieuChuan = phieuDanhGia
            ? phieuDanhGia.filter(
                (data) =>
                    data.tieuChuan.idTieuChuan === item.idTieuChuan
            )
            : [];
        let score = 0;
        filterDanhGiaTieuChuan.map((mucDanhGia) => {
            score += mucDanhGia.mucDanhGia;
        })
        // Create a paragraph for the tiêu chuẩn
        const tieuChuanParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: `${item.tenTieuChuan}`,
                    size: 26,
                    bold: true,
                    font: "Times New Roman",
                }),

            ],
            numbering: {
                reference: "tieu-chuan",
                level: 0,
            },
            spacing: {
                line: 360,
            },

        });

        const tieuChiParagraphs = item.tieuChi.flatMap((tieuChiItem) => {

            const filteredPhieuDanhGia = phieuDanhGia
                ? phieuDanhGia.filter(
                    (data) =>
                        data.tieuChuan.idTieuChuan === item.idTieuChuan &&
                        data.tieuChi.idTieuChi === tieuChiItem.idTieuChi
                )
                : [];

            return [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Tiêu chí ${item.stt}.${tieuChiItem.stt}. ${tieuChiItem.tenTieuChi}`,
                            size: 26,
                            font: "Times New Roman",
                            bold: true,
                        }),
                    ],
                    spacing: {
                        line: 360,
                    },
                    indent: {
                        firstLine: 720, // Indent for list items
                    },
                    alignment: AlignmentType.JUSTIFIED,
                }),
                ...filteredPhieuDanhGia.flatMap((phieu) =>
                    convertHtmlToDocxParagraphs(phieu.moTa || "<p>Loading...</p>"),
                ),
            ];
        });

        const danhGiaTieuChuan = new Paragraph({
            children: [
                new TextRun({
                    text: `Đánh giá chung về tiêu chuẩn ${item.stt}:`,
                    size: 26,
                    font: "Times New Roman",
                    bold: true,
                }),
            ],
            spacing: {
                line: 360,
            },
            indent: {
                firstLine: 720, // Indent for this conclusion paragraph
            },
            alignment: AlignmentType.JUSTIFIED,
        });
        const tomTatCacDiemManh = () => [
            new Paragraph({
                children: [
                    new TextRun({
                        text: `1. Tóm tắt các điểm mạnh:`,
                        size: 26,
                        font: "Times New Roman",
                        bold: true,
                        italics: true,
                    }),
                ],
                spacing: {
                    line: 360,
                },
                indent: {
                    firstLine: 720, // Indent for this conclusion paragraph
                },
                alignment: AlignmentType.JUSTIFIED,
            }),
            ...filterDanhGiaTieuChuan.flatMap((data) =>
                convertHtmlToDocxParagraphs(data.diemManh || "")
            ),
        ];
        const tomTatCacDiemTonTai = () => [
            new Paragraph({
                children: [
                    new TextRun({
                        text: `2. Tóm tắt các điểm tồn tại:`,
                        size: 26,
                        font: "Times New Roman",
                        bold: true,
                        italics: true,
                    }),
                ],
                spacing: {
                    line: 360,
                },
                indent: {
                    firstLine: 720, // Indent for this conclusion paragraph
                },
                alignment: AlignmentType.JUSTIFIED,
            }),
            ...filterDanhGiaTieuChuan.flatMap((data) =>
                convertHtmlToDocxParagraphs(data.diemTonTai || "")
            ),
        ];
        const keHoachCaiTien = () => [
            new Paragraph({
                children: [
                    new TextRun({
                        text: `3. Kế hoạch cải tiến:`,
                        size: 26,
                        font: "Times New Roman",
                        bold: true,
                        italics: true,
                    }),
                ],
                spacing: {
                    line: 360,
                },
                indent: {
                    firstLine: 720, // Indent for this conclusion paragraph
                },
                alignment: AlignmentType.JUSTIFIED,
            }),
            createTableKeHoach(filterDanhGiaTieuChuan),
            new Paragraph({
                children: [],
                spacing: {
                    line: 360, // Có thể điều chỉnh giá trị này để tạo khoảng cách lớn hơn nếu cần
                },
            }),

        ];

        const mucDanhGia = () => [
            new Paragraph({
                children: [
                    new TextRun({
                        text: `4. Mức đánh giá:`,
                        size: 26,
                        font: "Times New Roman",
                        bold: true,
                        italics: true,
                    }),
                ],
                spacing: {
                    line: 360,
                },
                indent: {
                    firstLine: 720, // Indent for this conclusion paragraph
                },
                alignment: AlignmentType.JUSTIFIED,
            }),
            createTableMucDanhGia(filterDanhGiaTieuChuan, item.stt, score, filterDanhGiaTieuChuan.length),
            new Paragraph({
                children: [],
                spacing: {
                    line: 360, // Có thể điều chỉnh giá trị này để tạo khoảng cách lớn hơn nếu cần
                },
            }),

        ];
        return [tieuChuanParagraph, ...tieuChiParagraphs, danhGiaTieuChuan, ...tomTatCacDiemManh(), ...tomTatCacDiemTonTai(), ...keHoachCaiTien(), ...mucDanhGia()];
    });

    const handleExportToDocx = () => {
        // Create a document
        const doc = new Document({
            numbering: {
                config: [
                    {
                        reference: "tieu-chuan",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.DECIMAL,
                                text: "Tiêu chuẩn %1. ",
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
                        page: {
                            margin: {
                                left: 1701,  // 3cm = 1701 twips
                                right: 1134, // 2cm = 1134 twips
                                top: 1134,   // 2cm = 1134 twips
                                bottom: 1134 // 2cm = 1134 twips
                            },
                        },
                    },
                    children: paragraphs,
                },
            ],
        });

        // Convert the document to a .docx Blob
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'danh-gia-chuong-trinh-dao-tao.docx');
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
