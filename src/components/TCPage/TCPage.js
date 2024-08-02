import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import font from '../font'
import { getAllTieuChiWithIdTieuChuan } from '../../services/apiServices';
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    fontFamily: font.inter,
    verticalAlign: 'top',
    border : '1px solid #ddd'
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    color: 'white',
    border : '1px solid #ddd',
    fontFamily: font.inter
}));;
const TieuChi = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieuChi, setTieuChi] = useState([]);
    const chuongTrinhDaoTao = JSON.parse(localStorage.getItem('data'));
    const tieuChuan = JSON.parse(localStorage.getItem('tieuChuan'));
    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(tieuChuan.idTieuChuan);
                setTieuChi(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, []);
    return (
        <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>
            <div>
                <p style={{ fontSize: '20px', textAlign: 'center' }}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b style={{ color: 'green' }}>{chuongTrinhDaoTao.tenCtdt}</b></p>
            </div>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow >
                            <CustomTableHeadCell>Tiêu Chuẩn/<br />Tiêu Chí</CustomTableHeadCell>
                            <CustomTableHeadCell>Yêu cầu của tiêu chí</CustomTableHeadCell>
                            <CustomTableHeadCell>Mốc chuẩn tham chiếu để đánh giá tiêu chí đạt mức 4</CustomTableHeadCell>
                            <CustomTableHeadCell style={{border : '0'}} width={150} >Gợi ý nguồn minh chứng</CustomTableHeadCell>
                            <CustomTableHeadCell  style={{border : '0'}}>Minh Chứng</CustomTableHeadCell>
                            <CustomTableHeadCell  style={{border : '0'}} width={1} >Tổng số MC</CustomTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}><b>Tiêu chuẩn {tieuChuan.stt}. {tieuChuan.tenTieuChuan}</b></TableCell>
                        </TableRow>
                        {tieuChi.map((row, index) => (
                            <TableRow key={row.id}>
                                <CustomTableCell width={150}><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}</CustomTableCell>
                                <CustomTableCell width={150}>{row.yeuCau}</CustomTableCell>
                                <CustomTableCell width={250}>{row.mocChuan}</CustomTableCell>
                                <CustomTableCell colSpan={3}>
                                    <TableBody>
                                        <TableRow style={{ border: '1px solid black' }} key={row.id}>
                                            <CustomTableCell width={150} style={{ border: '1px solid black' }}>Văn bản chính thức phát biểu về tầm nhìn, sứ mạng của CSGD</CustomTableCell>
                                            <CustomTableCell style={{ border: '1px solid black' }}>{row.yeuCau}</CustomTableCell>
                                            <CustomTableCell width={1} style={{ border: '1px solid black' }}>3</CustomTableCell>
                                        </TableRow>

                                    </TableBody></CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
};

export default TieuChi;
