import React, {useEffect, useState, useRef} from "react";
import {
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
    convertInchesToTwip
} from 'docx';

const DanhGiaTieuChi = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const TieuChi_ID = queryParams.get('TieuChi_ID');
    const [phieuDanhGia, setPhieuDanhGia] = useState([]);
    const [phongBan, setPhongBan] = useState([])
    const [tieuChuan, setTieuChuan] = useState([])
    const [tieuChi, setTieuChi] = useState([])
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
                                    text: `Tiêu chuẩn: ${tieuChuan.tenTieuChuan}`,
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
                                    text: `Tiêu chí: ${tieuChi.tenTieuChi}`,
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
                        createTableKeHoach(),
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

                    ],
                },
            ],
        });

        // Convert the document to a .docx Blob
        Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'phieu-danh-gia.docx');
        });
    };

    const tableData = phieuDanhGia.flatMap((item) => {
        const mucTieu = ['Khắc phục tồn tại', 'Phát huy điểm mạnh'];
        const noiDung = [item.noiDungKhacPhuc, item.noiDungPhatHuy];
        const donVi = [item.donViKhacPhuc, item.donViPhatHuy];
        const thoiGian = [item.thoiGianKhacPhuc, item.thoiGianPhatHuy];
        const ghiChu = [item.ghiChuKhacPhuc, item.ghiChuPhatHuy];

        return mucTieu.map((mucTieuItem, i) => ({
            tt: (i + 1).toString(),
            mucTieu: mucTieuItem,
            noiDung: noiDung[i],
            donVi: donVi[i],
            thoiGian: thoiGian[i],
            ghiChu: ghiChu[i],
        }));
    });


    const createTableKeHoach = () => {
        const rows = [];
        const columnWidths = [
            500, // TT
            1500, // Mục tiêu
            3000, // Nội dung
            1500, // Đơn vị/ cá nhân thực hiện
            1500, // Thời gian thực hiện hoặc hoàn thành
            700  // Ghi chú
        ];

        // Header row
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
                            size: 26, // Set size for data cells
                            font: "Times New Roman", // Set font family
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

        rows.push(new TableRow({
            children: headerCells,
        }));

        // Data rows
        tableData.forEach(data => {
            const cells = [
                data.tt,
                data.mucTieu,
                data.noiDung,
                data.donVi,
                data.thoiGian,
                data.ghiChu,
            ].map((text, index) => new TableCell({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: text,
                                size: 26, // Set size for data cells
                                font: "Times New Roman", // Set font family
                            }),
                        ],
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: {
                            line: 360
                        },

                    }),
                ],
                width: {
                    size: columnWidths[index],
                    type: WidthType.DXA,
                },
                margins: {
                    top: convertInchesToTwip(0.1),
                    bottom: convertInchesToTwip(0.1),
                    right: convertInchesToTwip(0.1),
                    left: convertInchesToTwip(0.1),
                },
            }));

            rows.push(new TableRow({
                children: cells,
            }));
        });

        return new Table({
            rows: rows,
            width: {
                size: 9117, // Total width from column widths
                type: WidthType.DXA,
            },

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
                        `}
                        </style>
                        <div className="a4-content">
                            <p className="heading-1">
                                <b style={{fontSize: '14pt'}}>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b>
                            </p>
                            <p className="a4-tab mt-3" style={{textAlign: "justify"}}><b>Nhóm công
                                tác: {phongBan.tenPhongBan}</b></p>
                            <p className="a4-tab" style={{textAlign: "justify"}}><b>Tiêu
                                chuẩn: {tieuChuan.tenTieuChuan}</b>
                            </p>
                            <p className="a4-tab" style={{textAlign: "justify"}}><b>Tiêu chí: {tieuChi.tenTieuChi}</b>
                            </p>
                            <p className="a4-tab"><b>1. Mô tả</b></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.moTa}}/>
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
                            <table style={{borderCollapse: "collapse"}} className="mt-2">
                                <thead>
                                <tr>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>TT
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>Mục tiêu
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>Nội dung
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>Đơn vị/ cá nhân thực hiện
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>Thời gian thực hiện hoặc hoàn thành
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "center"
                                    }}>Ghi chú
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "left"
                                    }}>1
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "left"
                                    }}>Khắc phục tồn tại
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "justify"
                                    }}>{item.noiDungKhacPhuc}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px", textAlign: "justify"
                                    }}>{item.donViKhacPhuc}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px", textAlign: "justify"
                                    }}>{item.thoiGianKhacPhuc}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px", textAlign: "justify"
                                    }}>{item.ghiChuKhacPhuc}</td>
                                </tr>
                                <tr>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "left"
                                    }}>2
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "left"
                                    }}>Phát huy điểm mạnh
                                    </td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "justify"
                                    }}>{item.noiDungPhatHuy}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "justify"
                                    }}>{item.donViPhatHuy}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "justify"
                                    }}>{item.thoiGianPhatHuy}</td>
                                    <td style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        textAlign: "justify"
                                    }}>{item.ghiChuPhatHuy}</td>
                                </tr>
                                </tbody>
                            </table>
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
