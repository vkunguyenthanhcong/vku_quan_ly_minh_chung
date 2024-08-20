import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import font from '../../../../components/font';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    getAllTieuChiWithIdTieuChuan,
    getTieuChuanById,
    getThongTinCTDT,
    getAllMocChuanWithIdTieuChi, getAllGoiYWithIdMocChuan, getAllMinhChungWithIdGoiY, deleteMinhChung
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    fontFamily: font.inter,
    verticalAlign: 'top',
    border: '1px solid #ddd'
}));
const CustomTableCellNoPadding = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    fontFamily: font.inter,
    verticalAlign: 'top',
    border: '1px solid #ddd',
    padding : '0 !important'
}));
const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    color: 'white !important',
    border: '1px solid #ddd',
    fontFamily: font.inter, 
}));;
const Table_MinhChung = ({ idTieuChi, idGoiY}) => {
    const [minhChung, setMinhChung] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const navigate = useNavigate();
    const handleClick = (idGoiY,idTieuChi ) => {
        navigate(`/quan-ly/minh-chung?GoiY_ID=${idGoiY}&TieuChi_ID=${idTieuChi}`);
    };
    const deleteMC = async (idMc, parentMaMc) => {
        const response = await deleteMinhChung(idMc, parentMaMc);
        fetchData();
    }
    const fetchData = async () => {
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

        fetchData();
    }, [idGoiY]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>  <Table >
            <TableHead>
                <TableRow>
                    {minhChung.length > 0 ?
                        <>
                            <TableCell style={{ width: '20%', maxWidth: '100%' }} className='bg-white p-5 border-1'>
                                <b>Mã</b>
                            </TableCell>
                            <TableCell style={{ width: '20%', maxWidth: '100%' }} className='bg-white p-5 border-1'>
                                <b>Số hiệu</b>
                            </TableCell>
                            <TableCell style={{ width: '45%', maxWidth: '100%' }} className='bg-white p-5 border-1'>
                                <b>Tên VB</b>
                            </TableCell>
                            <TableCell style={{ width: '15%', maxWidth: '100%' }} className='bg-white p-5 border-1'>
                                <button style={{ width: '100%' }} className='btn btn-success' onClick={() => handleClick(idGoiY, idTieuChi)}>Bổ sung</button>
                            </TableCell>
                        </> :
                        <>
                            <TableCell style={{ width: '75%', maxWidth: '100%', border : '0 !important' }} colSpan={3} className='bg-white p-5'><button  className='btn btn-danger'>Thiếu</button></TableCell>
                            <TableCell style={{ width: '25%', maxWidth: '100%',  }}  width={100}  className='bg-white p-5'><button onClick={() => handleClick(idGoiY, idTieuChi)} className='btn btn-success' style={{float: 'right', right : '0'}}>Bổ sung</button></TableCell>
                        </>
                    }
                </TableRow>
            </TableHead>
            {minhChung.map((row, index) => (
                <TableBody>
                    <TableRow>
                        <TableCell className='p-5 border-1'>{row.parentMaMc}{row.childMaMc}</TableCell>
                        <TableCell className='p-5 border-1'>{row.soHieu}</TableCell>
                        <TableCell className='p-5 border-1'>{row.tenMinhChung}</TableCell>
                        <TableCell  className='p-5 border-1'>
                            <button style={{ width: '100%', marginTop : '10px' }} className='btn btn-secondary'>Xem</button>
                            <button style={{ width: '100%', marginTop : '10px' }}  className='btn btn-danger' onClick={() => deleteMC(row.idMc, row.parentMaMc)}>Xóa</button>
                        </TableCell>
                    </TableRow>
                </TableBody>

            ))}
        </Table>
        </>
    );
};
const Table_GoiY= ({ idMocChuan, idTieuChi }) => {
    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllGoiYWithIdMocChuan(idMocChuan);
                setGoiY(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idMocChuan]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {goiY.map((row, index) => (
                    <TableRow key={row.id} style={{maxWidth: '100%'}}>
                        <CustomTableCell style={{maxWidth: '100%', width :'25%'}} className='border-1'>{row.tenGoiY}</CustomTableCell>
                        <CustomTableCellNoPadding style={{padding : '0px !important',maxWidth : '100%'}}><Table_MinhChung idTieuChi={idTieuChi} idGoiY={row.idGoiY}/></CustomTableCellNoPadding>
                    </TableRow>

            ))}
        </>
    );
};
const Table_MocChuan = ({ idTieuChi }) => {
    const [mocChuan, setMocChuan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllMocChuanWithIdTieuChi(idTieuChi);
                setMocChuan(result);
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
            {mocChuan.map((row, index) => (
                <TableBody>
                    <TableRow key={row.id} >
                        <CustomTableCell width={250}  className='border-1'>{index+1}. {row.tenMocChuan}</CustomTableCell>
                        <CustomTableCell className='border-1 p-5' width={1000}>
                            <Table_GoiY idMocChuan={row.idMocChuan} idTieuChi={idTieuChi}/>
                        </CustomTableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
};

const TieuChi = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieuChi, setTieuChi] = useState([]);
    const [tieuChuan, setTieuChuan] = useState([]);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');


    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(TieuChuan_ID);
                const result_1 = await getTieuChuanById(TieuChuan_ID);
                const result_2 = await getThongTinCTDT(KhungCTDT_ID);
                setTieuChi(result);
                setTieuChuan(result_1);
                setChuongTrinhDaoTao(result_2);
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
                {chuongTrinhDaoTao.map((row, index) => (
                    <p style={{fontSize: '20px', textAlign: 'center'}}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b
                        style={{color: 'green'}}>{row.tenCtdt}</b></p>
                ))}
            </div>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                    <TableRow >
                            <CustomTableHeadCell>Tiêu Chuẩn/<br />Tiêu Chí</CustomTableHeadCell>
                            <CustomTableHeadCell>Yêu cầu của tiêu chí</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0' }} width={250}>Mốc chuẩn tham chiếu để đánh giá tiêu chí đạt mức 4</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0' }} width={250} >Gợi ý nguồn minh chứng</CustomTableHeadCell>
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
                                <CustomTableCell width={200}><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}</CustomTableCell>
                                <CustomTableCell width={200}>{row.yeuCau}</CustomTableCell>
                                <CustomTableCell colSpan={3} className='p-5'>
                                    <Table_MocChuan idTieuChi={row.idTieuChi} />
                                </CustomTableCell>
                                <CustomTableCell>0</CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    );
};

export default TieuChi;
