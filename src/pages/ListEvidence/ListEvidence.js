// src/Homepage.js
import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ExcelJS from 'exceljs';
import html2pdf from 'html2pdf.js';
import {useLocation, useNavigate} from 'react-router-dom';
import htmlDocx from 'html-docx-js/dist/html-docx';
import './ListEvidence.css';
import {
    getAllTieuChiWithIdTieuChuan,
    getMinhChungWithIdTieuChi,
    getTieuChuanWithMaCtdt
} from "../../services/apiServices";
import { saveAs } from 'file-saver';

const MinhChung = ({ criteriaID }) => {
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMinhChung = async () => {
            try {
                const result = await getMinhChungWithIdTieuChi(criteriaID);
                setMinhChung(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMinhChung();
    }, [criteriaID]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {minhChung.map((row, index) => (
                <tr>
                    <td></td>
                    <td>{index + 1}</td>
                    <td>{row.parentMaMc}{row.childMaMc}</td>
                    <td>{row.tenMinhChung}</td>
                    <td>{row.soHieu}<br/>{row.thoiGian}</td>
                    <td>{row.donViBanHanh}<br/>{row.caNhan}</td>
                    <td></td>
                </tr>
            ))}
        </>
    );
};
const TieuChi = ({standardID, numberNO}) => {
    const [tieuChi, setTieuChi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(standardID);
                setTieuChi(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTieuChi();
    }, [standardID]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {tieuChi.map((row, index) => (
                <React.Fragment key={row.idTieuChi}>
                    <tr>
                        <td className='bold-italic'>Tiêu chí {numberNO}.{index + 1}</td>
                        <td className='bold' colSpan={6}>{row.tenTieuChi}</td>
                    </tr>
                    <MinhChung criteriaID={row.idTieuChi} />
                </React.Fragment>
            ))}
        </>
    );
};

const ListEvidence = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungDaoTao_ID = queryParams.get('KhungDaoTao_ID');
    const exportToWord = () => {
        const table = document.getElementById('myTable');
    let html = table.outerHTML;

    // Add CSS styles to the HTML
    html = `
      <html>
        <head>
          <style>
            body { font-family: "Times New Roman", serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    const converted = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(converted);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.docx';
    a.click();
      };
    
    const exportPDF = () => { 
        const table = document.getElementById('myTable');
        const opt = {
            margin: 0.2,
            filename: 'table.pdf',
            image: { type: 'jpeg', quality: 0.99 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: [11.7, 8.3], orientation: 'landscape' } // A4 landscape dimensions in inches
          };

    // Add CSS styles for "Times New Roman" font
    const style = `
      <style>
        body { font-family: "Times New Roman", serif; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr { page-break-inside: avoid; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
      </style>
    `;
    
    // Combine the style and HTML content
    const content = `
      <html>
        <head>${style}</head>
        <body>${table.outerHTML}</body>
      </html>
    `;
    
    html2pdf().from(content).set(opt).save();

    };

    const [tieuChuan, setTieuChuan] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTieuChuan = async () => {
        try {
            const result = await getTieuChuanWithMaCtdt(KhungDaoTao_ID);
            setTieuChuan(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTieuChuan();
    }, []); 
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
    
        const table = document.getElementById('myTable');
        const headerCells = table.querySelectorAll('thead th');
        const rows = table.querySelectorAll('tr');
        
        const mergedCells = [];
        const rowHeights = {};
        const columnWidths = {};
        let sttColumnIndex = null;
        headerCells.forEach((th, index) => {
        if (th.id === 'STT') {
            sttColumnIndex = index + 1; // +1 because ExcelJS is 1-based indexing
        }
         });
    
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            cells.forEach((cell, cellIndex) => {
                const cellAddress = { row: rowIndex + 1, column: cellIndex + 1 };
                const cellValue = cell.innerText;
                const excelCell = worksheet.getCell(cellAddress.row, cellAddress.column);
                excelCell.value = cellValue;

                // Set font style: first row is bold
                if (rowIndex == 0) {
                    excelCell.font = {
                        name: 'Times New Roman',  // Font name
                        family: 2,
                        size: 12,       // Font size
                        bold: true      // Set bold text for the first row
                    };
                } else {
                    if (row.id === 'TieuChuan') {
                        excelCell.font = {
                            name: 'Times New Roman',  // Font name
                            family: 2,
                            size: 12,       // Font size
                            bold: true      // Set bold text for rows with id="TieuChuan"
                        };
                    } else {
                        // Default font for other rows
                        excelCell.font = {
                            name: 'Times New Roman',  // Font name
                            family: 2,
                            size: 12        // Font size without bold
                        };
                    }
                }
                
        
                // Enable text wrapping and align text to the top
                excelCell.alignment = { wrapText: true, vertical: 'middle' };
    
                // Estimate row height based on content length (simple estimation)
                const lines = Math.ceil(cellValue.length / 50); // Assuming 50 characters per line
                if(lines === 1){
                    rowHeights[cellAddress.row] = Math.max((rowHeights[cellAddress.row] || 0), lines * 40); // 15 points per line
                }else{
                    rowHeights[cellAddress.row] = Math.max((rowHeights[cellAddress.row] || 0), lines * 15); // 15 points per line
                }
                
        
                // Update the max width for the column, special case for column B (columnIndex = 1)
            if (cellAddress.column === sttColumnIndex) {
                columnWidths[cellAddress.column] = 5; // Fixed width for column B (Số thứ tự)
            } else {
                if (!columnWidths[cellAddress.column]) {
                    columnWidths[cellAddress.column] = cellValue.length;
                } else {
                    columnWidths[cellAddress.column] = Math.max(columnWidths[cellAddress.column], cellValue.length);
                }
            }
    
                // Check for colspan and rowspan attributes for merging
                const colspan = parseInt(cell.getAttribute('colspan')) || 1;
                const rowspan = parseInt(cell.getAttribute('rowspan')) || 1;
    
                if (colspan > 1 || rowspan > 1) {
                    const endRow = cellAddress.row + rowspan - 1;
                    const endCol = cellAddress.column + colspan - 1;
                    mergedCells.push({
                        top: cellAddress.row,
                        left: cellAddress.column,
                        bottom: endRow,
                        right: endCol
                    });
                }
            });
        });
    
        // Apply merged cells
        mergedCells.forEach(merge => {
            worksheet.mergeCells(merge.top, merge.left, merge.bottom, merge.right);
        });
    
        // Apply borders
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FF000000' } },
                    left: { style: 'thin', color: { argb: 'FF000000' } },
                    bottom: { style: 'thin', color: { argb: 'FF000000' } },
                    right: { style: 'thin', color: { argb: 'FF000000' } }
                };
            });
        });
    
        // Set specific header row height (e.g., row 1)
        worksheet.getRow(1).height = 40; // Adjust the height for the header row as needed
    
        // Set column widths based on maximum length
        worksheet.columns = Object.keys(columnWidths).map(colIndex => ({
            width: columnWidths[colIndex] + 2 // Add padding
        }));
    
        // Set row heights based on content
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            if (rowHeights[row.number]) {
                row.height = rowHeights[row.number];
            }
        });
    
        // Create blob and download file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'styled_table_with_borders.xlsx');
    };
    
    
    return (
        <Container fluid style={{ height: '100vh' }}>
            <h1 className='font'><b>DANH MỤC MINH CHỨNG</b></h1>
            <table className="simple-table" id="myTable" border="1">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            <th id="STT">STT</th>
            <th>Mã minh chứng</th>
            <th>Tên minh chứng</th>
            <th>Số, ngày ban hành, ...</th>
            <th>Nơi ban hành hoặc nhóm, cá nhân thực hành</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {tieuChuan.map((row, index) => (
            <React.Fragment key={row.idTieuChuan}>
              <tr id="TieuChuan">
                <td><b>Tiêu chuẩn {index + 1}</b></td>
                <td colSpan={6}><b>{row.tenTieuChuan}</b></td>
              </tr>
              <TieuChi standardID={row.idTieuChuan} numberNO={index + 1} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
            <footer style={{ 
                textAlign: 'center', 
                position: 'fixed', 
                left: 0, 
                bottom: 10, 
                width: '100%', 
                padding: '10px 0' }}>
                <button className="btn btn-primary me-2"  onClick={exportToWord}>Xuất File Word</button>
                <button className="btn btn-danger me-2"  onClick={exportPDF}>Xuất File PDF</button>
                <button className="btn btn-success" onClick={exportToExcel}>Xuất File Excel</button>
            </footer>
        </Container>
    );
};

export default ListEvidence;
