import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCtdtData, getCtdtDataByMaKDCL, getMinhChungByMaCtdt, getMinhChungKhongDungChung, getThongTinCTDT } from '../../../../services/apiServices';
import { Table } from 'react-bootstrap';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import PdfPreview from '../../../../services/PdfPreview';

const DanhSachMinhChung = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minhChung, setMinhChung] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [link, setLink] = useState("");
    const [timKiem, setTimKiem] = useState("");
    const handleClickViewPDF = (link) => {
        setLink(link);
        openModal();
    };

    const fetchData = async () => {
        try {
            const result = await getMinhChungKhongDungChung();
            setMinhChung(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div
            className="content"
            style={{ background: "white", margin: "20px", padding: "20px" }}
        >
            
          <div className='col-md-2'> 
          <b>Tìm kiếm </b>
            <input
            className="form-control"
            type="text"
            value={timKiem}
            onChange={(e) => setTimKiem(e.target.value)}
            /></div>
            <br/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Mã</TableCell>
                        <TableCell>Trích dẫn</TableCell>
                        <TableCell>Xem nhanh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {minhChung.map((item, index) => (
                        <TableRow>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{item.parentMaMc}{item.childMaMc}</TableCell>
                            <TableCell>{item.tenMinhChung}</TableCell>
                            <TableCell><button style={{ width: '30%', marginTop: '10px' }} className='btn btn-secondary' onClick={() => handleClickViewPDF(item.linkLuuTru)}>Xem</button></TableCell>
                          </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link} />
        </div>
    )
}
export default DanhSachMinhChung;