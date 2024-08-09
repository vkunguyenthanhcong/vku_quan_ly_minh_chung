import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import font from '../font';
import { useNavigate } from 'react-router-dom';
import {
    getAllGoiYWithIdTieuChi,
    getAllTieuChiWithIdTieuChuan,
    getAllMinhChungWithIdGoiY,
    deleteMinhChung
} from '../../services/apiServices';
import './TCPage.css';
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    fontFamily: font.inter,
    verticalAlign: 'top',
    border: '1px solid #ddd'
}));
const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    color: 'white !important',
    border: '1px solid #ddd',
    fontFamily: font.inter, 
}));;
const Table_GoiY = ({ idTieuChi, tenTieuChi , sttTieuChi }) => {
    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllGoiYWithIdTieuChi(idTieuChi);
                setGoiY(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idTieuChi]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {goiY.map((row, index) => (
                <TableBody>
                    <TableRow key={row.id} >
                        <CustomTableCell width={200}  className='border-1'>{row.tenGoiY}</CustomTableCell>
                        <CustomTableCell width={750} className='border-1 p-5' >
                            <Table_MinhChung idGoiY={row.idGoiY} tenTieuChi = {tenTieuChi} tenGoiY = {row.tenGoiY} sttTieuChi = {sttTieuChi}></Table_MinhChung>
                        </CustomTableCell>
                        <CustomTableCell width={1} style={{ border: '1px solid black' }}>{row.total}</CustomTableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
};
const Table_MinhChung = ({ idGoiY, tenTieuChi, tenGoiY , sttTieuChi}) => {
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleClick = (tenTieuChi, tenGoiY, idGoiY, stt) => {
        const addMinhChung = { idGoiY: idGoiY, tenGoiY : tenGoiY, tenTieuChi : tenTieuChi, stt : sttTieuChi};
        localStorage.setItem('addMinhChung', JSON.stringify(addMinhChung));
        navigate('/quan-ly/minh-chung');
    };
    const fetchMinhChung = async () => {
        try {
            const result = await getAllMinhChungWithIdGoiY(idGoiY);
            setMinhChung(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMinhChung();
    }, [idGoiY]);
    const deleteMC = async (idMc, parentMaMc) => {

        const response = await deleteMinhChung(idMc, parentMaMc);
        fetchMinhChung();
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>  <Table>
            <TableBody >
                <TableRow>
                    {minhChung.length > 0 ? 
                    <>
                    <TableCell className='bg-white p-5 border-1' ><b>Mã</b></TableCell>
                    <TableCell className='bg-white p-5 border-1'><b>Số hiệu</b></TableCell>
                    <TableCell className='bg-white p-5 border-1'><b>Tên VB</b></TableCell>
                    <TableCell className='bg-white p-5 border-1'><button onClick={() => handleClick(tenTieuChi, tenGoiY, idGoiY)} style={{ width: '100%' }} className='btn btn-success'>Bổ sung</button></TableCell>
                    </> : 
                    <>
                    <TableCell width = {1000} colSpan={3} className='bg-white p-5' style={{border : '0 !important'}}><button  className='btn btn-danger'>Thiếu</button></TableCell>
                    <TableCell  width={100}  style={{float: 'right'}} className='bg-white p-5'style={{border : '0 !important'}}><button onClick={() => handleClick(tenTieuChi, tenGoiY, idGoiY)} className='btn btn-success'>Bổ sung</button></TableCell>
                    </>
                    }
                </TableRow>
            </TableBody>
            {minhChung.map((row, index) => (
                <TableBody>
                    <TableRow>
                        <TableCell width ={100} className='p-5 border-1'>{row.parentMaMc}{row.childMaMc}</TableCell>
                        <TableCell  width ={150} className='p-5 border-1'>{row.soHieu}</TableCell>
                        <TableCell className='p-5 border-1'>{row.tenMinhChung}</TableCell>
                        <TableCell width={100} className='p-5 border-1'>
                            <button style={{ width: '100%', marginTop : '10px' }} className='btn btn-secondary'>Xem</button>
                            <button style={{ width: '100%', marginTop : '10px' }} onClick={() => deleteMC(row.idMc, row.parentMaMc)} className='btn btn-danger'>Xóa</button>
                        </TableCell>
                    </TableRow>
                </TableBody>

            ))}
        </Table>
        </>
    );
};

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
                            <CustomTableHeadCell style={{ border: '0' }} width={300} >Gợi ý nguồn minh chứng</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0' }}>Minh Chứng</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0' }} width={1} >Tổng số MC</CustomTableHeadCell>
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
                                <CustomTableCell colSpan={3} className='p-5'>
                                    <Table_GoiY sttTieuChi ={index + 1} idTieuChi={row.idTieuChi} tenTieuChi={row.tenTieuChi}></Table_GoiY>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

    );
};

export default TieuChi;
