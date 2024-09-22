import React, { useEffect, useState, useRef } from "react";
import { getPhieuDanhGiaTieuChiByTieuChuanAndTieuChi } from "../../services/apiServices";
import { useLocation } from "react-router-dom";
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, ExternalHyperlink, LevelFormat, Table, TableCell, TableRow, WidthType, VerticalAlign, convertInchesToTwip } from 'docx';
const DanhGiaTieuChi = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const TieuChuan_ID = queryParams.get('TieuChuan_ID');
  const TieuChi_ID = queryParams.get('TieuChi_ID');
  const [phieuDanhGia, setPhieuDanhGia] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPhieuDanhGiaTieuChiByTieuChuanAndTieuChi(TieuChuan_ID, TieuChi_ID);
        setPhieuDanhGia(response);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    if (TieuChuan_ID && TieuChi_ID) {
      fetchData();
    }
  }, [TieuChuan_ID, TieuChi_ID]);
  const contentRef = useRef(null);
  const convertHtmlToDocxParagraphs = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = [];

    const parseNode = (node) => {
      if (node.nodeName === 'P') {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: node.textContent || '',
              size: 26,
              font: "Times New Roman"
            }),
          ],
          indent: {
            firstLine: 720, // Indent for list items
          },
          spacing: {
            line: 360, // 360 twips = 18pt line spacing (1.5 lines)
          },
          alignment: AlignmentType.JUSTIFIED,
        }));
      } else if (node.nodeName === 'UL') {
        node.childNodes.forEach((li) => {
          if (li.nodeName === 'LI') {
            const textRuns = [];

            li.childNodes.forEach((child) => {
              if (child.nodeName === 'A') {
                const linkUrl = child.getAttribute('href');
                const linkText = child.textContent || '';

                textRuns.push(new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: linkText,
                      color: '0000FF',
                      size: 26,
                      font: "Times New Roman",
                    })
                  ],
                  link: linkUrl,
                  spacing: {
                    line: 360, // 360 twips = 18pt line spacing (1.5 lines)
                  }
                }));
              } else {
                textRuns.push(new TextRun({
                  text: child.textContent || '',
                  size: 26,
                  font: "Times New Roman",
                }));
              }
            });

            paragraphs.push(new Paragraph({
              children: textRuns,
              numbering: {
                reference: "my-unique-bullet-points",
                level: 0,
              },
              spacing: { line: 360 },
              indent: {
                firstLine: 720, // Indent for list items
              },
              alignment: AlignmentType.JUSTIFIED,
            }));
          }
        });
      } else if (node.nodeName === 'A') {
        const linkUrl = node.getAttribute('href');
        const linkText = node.textContent || '';

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: linkText, // Simulate hyperlink style
              color: '0000FF', // Blue color
            }),
          ],
          hyperlink: linkUrl, // Link URL
        }));
      }
    };

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
                    indent: { firstLine: 720 },
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
                    indent: { firstLine: 720 },
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
                  text: `Nhóm công tác: ${phieuDanhGia ? phieuDanhGia.phongBan.tenPhongBan : 'Loading...'}`,
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
                  text: `Tiêu chuẩn: ${phieuDanhGia ? phieuDanhGia.tieuChuan.tenTieuChuan : 'Loading...'}`,
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
                  text: `Tiêu chí: ${phieuDanhGia ? phieuDanhGia.tieuChi.tenTieuChi : 'Loading...'}`,
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
            ...convertHtmlToDocxParagraphs(phieuDanhGia ? phieuDanhGia.moTa : 'Loading...'),
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
            createTableMucDanhGia(phieuDanhGia ? phieuDanhGia.mucDanhGia : 1)
          ],
        },
      ],
    });

    // Convert the document to a .docx Blob
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'phieu-danh-gia.docx');
    });
  };
  const mucTieu = ['Khắc phục tồn tại', 'Phát huy điểm mạnh'];
  const noiDung = [phieuDanhGia ? phieuDanhGia.noiDungKhacPhuc : '', phieuDanhGia ? phieuDanhGia.noiDungPhatHuy : ''];
  const donVi = [phieuDanhGia ? phieuDanhGia.donViKhacPhuc : '', phieuDanhGia ? phieuDanhGia.donViPhatHuy : ''];
  const thoiGian = [phieuDanhGia ? phieuDanhGia.thoiGianKhacPhuc : '', phieuDanhGia ? phieuDanhGia.thoiGianPhatHuy : ''];
  const ghiChu = [phieuDanhGia ? phieuDanhGia.ghiChuKhacPhuc : '', phieuDanhGia ? phieuDanhGia.ghiChuPhatHuy : ''];

  const tableData = mucTieu.map((mucTieuItem, i) => ({
    tt: (i + 1).toString(),
    mucTieu: mucTieuItem,
    noiDung: noiDung[i],
    donVi: donVi[i],
    thoiGian: thoiGian[i],
    ghiChu: ghiChu[i],
  }));

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
    const numberCells = Array.from({ length: 7 }, (_, index) => new TableCell({
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
    const checkCells = Array.from({ length: 7 }, (_, index) => {
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
      <div ref={contentRef} className="a4-size" id="phieudanhgia">
      <style>
                {`
                td{
                    color : black !important;
                }
                `}
            </style>
        <div className="a4-content">
          <p className="heading-1">
            <b style={{ fontSize: '14pt' }}>PHIẾU ĐÁNH GIÁ TIÊU CHÍ</b>
          </p>
          <p className="a4-tab mt-3" style={{ textAlign: "justify" }}><b>Nhóm công tác: {phieuDanhGia ? phieuDanhGia.phongBan.tenPhongBan : 'Loading...'}</b></p>
          <p className="a4-tab" style={{ textAlign: "justify" }}><b>Tiêu chuẩn: {phieuDanhGia ? phieuDanhGia.tieuChuan.tenTieuChuan : 'Loading...'}</b></p>
          <p className="a4-tab" style={{ textAlign: "justify" }}><b>Tiêu chí: {phieuDanhGia ? phieuDanhGia.tieuChi.tenTieuChi : 'Loading...'}</b></p>
          <p className="a4-tab"><b>1. Mô tả</b></p>
          <p className="a4-mota">{phieuDanhGia ? (
            <div dangerouslySetInnerHTML={{ __html: phieuDanhGia.moTa }} />
          ) : (
            'Loading...'
          )}</p>
          <p className="a4-tab"><b>2. Điểm mạnh</b></p>
          <p className="a4-mota">{phieuDanhGia ? (
            <div dangerouslySetInnerHTML={{ __html: phieuDanhGia.diemManh }} />
          ) : (
            'Loading...'
          )}</p>
          <p className="a4-tab"><b>3. Điểm tồn tại</b></p>
          <p className="a4-mota">{phieuDanhGia ? (
            <div dangerouslySetInnerHTML={{ __html: phieuDanhGia.diemTonTai }} />
          ) : (
            'Loading...'
          )}</p>
          <p className="a4-tab"><b>4. Kế hoạch hành động</b></p>
          <tables style={{ borderCollapse: "collapse" }} className="mt-2">
            <thead>
              <tr>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>TT</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>Mục tiêu</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>Nội dung</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>Đơn vị/ cá nhân thực hiện</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>Thời gian thực hiện hoặc hoàn thành</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center"
                }}>Ghi chú</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left"
                }}>1</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left"
                }}>Khắc phục tồn tại</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.noiDungKhacPhuc : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px", textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.donViKhacPhuc : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px", textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.thoiGianKhacPhuc : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px", textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.ghiChuKhacPhuc : ''}</td>
              </tr>
              <tr>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left"
                }}>2</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "left"
                }}>Phát huy điểm mạnh</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.noiDungPhatHuy : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.donViPhatHuy : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.thoiGianPhatHuy : ''}</td>
                <td style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "justify"
                }}>{phieuDanhGia ? phieuDanhGia.ghiChuPhatHuy : ''}</td>
              </tr>
            </tbody>
          </tables>
          <p className="a4-tab mt-2"><b>5. Mức đánh giá tiêu chí</b></p>
          <table style={{ width: "100%" }}>
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
                    {num === (phieuDanhGia ? phieuDanhGia.mucDanhGia : 1) ? "X" : ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      <button onClick={handleExportToDocx} style={{position : "fixed", bottom : "20px", right : "20px",cursor : "pointer"}} className="btn btn-success">Xuất File Word</button>
    </>

  );
};

export default DanhGiaTieuChi;
