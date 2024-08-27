import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { getCtdtData, getCtdtDataByMaKDCL, getMinhChungByMaCtdt, getThongTinCTDT } from '../../../../services/apiServices';
import { Table } from 'react-bootstrap';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const DanhSachMinhChung = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');
    
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);
    const [minhChung, setMinhChung] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [
                minhChungData,
                chuongTrinhDaoTaoData
            ] = await Promise.all([
                getMinhChungByMaCtdt(KhungCTDT_ID, token),
                getThongTinCTDT(KhungCTDT_ID, token)
            ]);
            setMinhChung(minhChungData);
            setChuongTrinhDaoTao(chuongTrinhDaoTaoData);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    console.log(chuongTrinhDaoTao);
    useEffect(() => {
        fetchData();
    }, []);

    return(
        <div
            className="content"
            style={{ background: "white", margin: "20px", padding: "20px" }}
        >
            <p>Chuong Trinh Dao Tao {KhungCTDT_ID}</p>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Mã</TableCell>
                        <TableCell>Trích dẫn</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {minhChung.map((item, index) => (
                        <TableRow>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{item.parentMaMc}{item.childMaMc}</TableCell>
                            <TableCell>{item.tenMinhChung}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
export default DanhSachMinhChung;