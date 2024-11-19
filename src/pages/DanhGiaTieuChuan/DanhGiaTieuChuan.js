import React, {useEffect, useState, useRef} from "react";
import {
    getAllMinhChung,
    getAllPhieuDanhGia, getAllPhieuDanhGiaTieuChuan, getAllTieuChi, getPhongBanById, getTieuChiById, getTieuChuanById
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

const DanhGiaTieuChuan = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const [phieuDanhGia, setPhieuDanhGia] = useState([]);
    const [phongBan, setPhongBan] = useState([])
    const [tieuChuan, setTieuChuan] = useState([])
    const [tieuChi, setTieuChi] = useState([])
    const [minhChung, setMinhChung] = useState([])
    const [mota, setMota] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllPhieuDanhGiaTieuChuan();
                const filtered = response.filter(
                    (item) => item.idTieuChuan == TieuChuan_ID
                );
                setPhieuDanhGia(filtered);
                if (filtered.length > 0) {
                    const phongBanData = await getPhongBanById(filtered[0].idPhongBan);
                    setPhongBan(phongBanData);
                }
                const tieuChuanData = await getTieuChuanById(TieuChuan_ID);
                setTieuChuan(tieuChuanData);
                const tieuChiData = await getAllTieuChi();
                const tieuChiFilter = tieuChiData.filter((item) => item.idTieuChuan == TieuChuan_ID);
                setTieuChi(tieuChiFilter);

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
        if (TieuChuan_ID) {
            fetchData();
        }
    }, [TieuChuan_ID]);

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
        };;

        // Hàm xử lý các node con theo kiểu khác nhau
        const parseChildNodes = (nodes, isBold = false, isItalic = false, isUnderline = false) => {
            const textRuns = [];

            nodes.forEach((child) => {
                console.log(child)
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
            } else if (node.nodeName === "H2" || node.nodeName === "H1" || node.nodeName === "H3") {
                const textRuns = parseChildNodes(node.childNodes);
                paragraphs.push(
                    new Paragraph({
                        children: textRuns,
                        indent: {firstLine: 720},
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

                                    },
                                    run: {
                                        font: "Times New Roman",
                                        italic : true,
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
                                    text: `TIÊU CHUẨN ${tieuChuan.stt}. ${tieuChuan.tenTieuChuan}`.toUpperCase(),
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
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.moTa))
                        ),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Đánh giá chung về Tiêu chuẩn ${tieuChuan.stt}`,
                                    size: 26,
                                    font: "Times New Roman",
                                    bold : true
                                })
                            ],
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
                                    italics : true
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
                                    text: 'Tóm tắt các điểm tồn tại',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
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
                                    text: 'Kế hoạch cải tiến',
                                    size: 26,
                                    font: "Times New Roman",
                                    italics: true
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
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.keHoach))
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
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                            spacing: {
                                before: 360,
                                line: 360,
                            },
                        }),
                        ...[].concat(
                            ...phieuDanhGia.map((item) => convertHtmlToDocxParagraphs(item.mucDanhGia))
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
                            <p className="heading-1 mb-3">
                                <b className="text-uppercase" style={{fontSize: '14pt'}}>TIÊU CHUẨN {tieuChuan.stt}. {tieuChuan.tenTieuChuan}</b>
                            </p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: mota}}/>
                            </p>
                            <p className="mt-3"><b>Đánh giá chung về Tiêu chuẩn {tieuChuan.stt}</b></p>
                            <p><i>1. Tóm tắt các điểm mạnh</i></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.diemManh}}/>
                            </p>
                            <p><i>2. Tóm tắt các điểm tồn tại</i></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.diemTonTai}}/>
                            </p>
                            <p><i>3. Kế hoạch cải tiến</i></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.keHoach}}/>
                            </p>
                            <p><i>4. Mức đánh giá</i></p>
                            <p className="a4-mota">
                                <div dangerouslySetInnerHTML={{__html: item.mucDanhGia}}/>
                            </p>

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

export default DanhGiaTieuChuan;
