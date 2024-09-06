import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getAllTieuChiWithIdTieuChuan,
    getTieuChuanById,
    getThongTinCTDT,
    getAllMocChuanWithIdTieuChi, getAllGoiYWithIdMocChuan, getAllMinhChungWithIdGoiY, deleteMinhChung,
    getTotalMinhChungWithTieuChi
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    verticalAlign: 'top',
    border: '1px solid #ddd'
}));
const CustomTableCellNoPadding = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    verticalAlign: 'top',
    border: '1px solid #ddd',
    padding: '0 !important'
}));
const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    color: 'white !important',
    border: '1px solid #ddd'
}));;
const Table_MinhChung = React.memo(({ idTieuChi, idGoiY }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minhChung, setMinhChung] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');


    const navigate = useNavigate();
    const handleClick = (idGoiY, idTieuChi) => {
        navigate(`/quan-ly/minh-chung?GoiY_ID=${idGoiY}&TieuChi_ID=${idTieuChi}&KhungCTDT_ID=${KhungCTDT_ID}`);
    };
    const deleteMC = async (idMc, parentMaMc) => {
        deleteMinhChung(idMc, parentMaMc);
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
        <>
                <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead >
                        <TableRow style={{ maxWidth: '100%'}}>
                            {minhChung.length > 0 ?
                                <>
                                <TableCell
                                    style={{ 
                                        width: '20%'
                                    }}
                                    className='bg-white p-1 border-top-1-solid-white border-1-solid-black'
                                    >
                                        <b>Mã</b>
                                    </TableCell>
                                    <TableCell
                                        style={{ width: '20%' }}
                                        className='bg-white p-1 border-top-1-solid-white border-1-solid-black'
                                    >
                                        <b>Số hiệu</b>
                                    </TableCell>
                                    <TableCell
                                        style={{ width: '45%' }}
                                        className='bg-white p-1 border-top-1-solid-white border-1-solid-black'
                                    >
                                        <b>Tên VB</b>
                                    </TableCell>
                                    <TableCell
                                        style={{ width: '15%' }}
                                        className='bg-white p-0 border-top-1-solid-white border-right-1-solid-white border-1-solid-black'
                                    >
                                        <button
                                        style={{ width: '100%' }}
                                        className='btn btn-success'
                                        onClick={() => handleClick(idGoiY, idTieuChi)}
                                        >
                                        Bổ sung
                                        </button>
                                    </TableCell>
                                    </> :
                                <>
                                    <TableCell style={{ width: '75%'}} colSpan={3} className='bg-white p-1 border-1-solid-white'>
                                        <button className='btn btn-danger'>Thiếu</button>
                                    </TableCell>
                                    <TableCell style={{ width: '25%' }} className='bg-white p-1 border-1-solid-white'>
                                        <button onClick={() => handleClick(idGoiY, idTieuChi)} className='btn btn-success' style={{ float: 'right' }}>Bổ sung</button>
                                    </TableCell>
                                </>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {minhChung.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className='p-1 border-1-solid-black'>{row.parentMaMc}{row.childMaMc}</TableCell>
                                <TableCell className='p-1 border-1-solid-black'>{row.soHieu}</TableCell>
                                <TableCell className='p-1 border-1-solid-black'>{row.tenMinhChung}</TableCell>
                                <TableCell className='p-0 border-right-1-solid-white border-1-solid-black'>
                                    <button style={{ width: '100%', marginTop: '10px' }} className='btn btn-secondary'>Xem</button>
                                    <button style={{ width: '100%', marginTop: '10px' }} className='btn btn-danger' onClick={() => deleteMC(row.idMc, row.parentMaMc)}>Xóa</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </>

    );
});
const Table_GoiY = React.memo(({ idMocChuan, idTieuChi }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goiY, setGoiY] = useState([]);
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
    return (
        <>
            {goiY.map((row, index) => (
                <React.Fragment key={row.id}>
                    <TableRow style={{ maxWidth: '100%', border: 'none', borderCollapse: 'collapse', borderSpacing: 0 }}>
                        <CustomTableCell style={{ maxWidth: '100%', width: '25%', border: 'none' }}>
                            <span>{row.tenGoiY}</span>
                        </CustomTableCell>
                        <CustomTableCellNoPadding style={{ padding: 0, width: '75%', maxWidth: '100%', border: 'none', height: '100%' }}>
                            <Table_MinhChung idTieuChi={idTieuChi} idGoiY={row.idGoiY} />
                        </CustomTableCellNoPadding>
                    </TableRow>
                    {index < goiY.length - 1 && <hr style={{ border: '1px solid black' }} />}
                </React.Fragment>
            ))}
        </>

    );
});
const Table_MocChuan = React.memo(({ idTieuChi }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mocChuan, setMocChuan] = useState([]);
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
    return (
        <>
            {mocChuan.map((row, index) => (
                <TableBody>
                    <TableRow key={row.id} >
                        <CustomTableCell style={{ width: '20%' }} className='border-1'>{index + 1}. {row.tenMocChuan}</CustomTableCell>
                        <CustomTableCell className='border-1 p-0' style={{ width: '80%' }}>
                            <Table_GoiY idMocChuan={row.idMocChuan} idTieuChi={idTieuChi} />
                        </CustomTableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
});

const TotalTieuChi = ({ idTieuChi }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [total, setTotal] = useState([]);
    useEffect(() => {
        setLoading(true);
        const fetchDataFromAPI = async () => {
            try {
                const result = await getTotalMinhChungWithTieuChi(idTieuChi);
                setTotal(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, [idTieuChi]);
    return (
        <>
            {total.length > 0 ? (

                total.map((item) => (
                    <p>{item.total}</p>
                ))

            ) : (null)}
        </>
    )
}

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
    }, [TieuChuan_ID, KhungCTDT_ID]);
    return (
        <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>
            <div>
                {chuongTrinhDaoTao.map((row, index) => (
                    <p style={{ fontSize: '20px', textAlign: 'center' }}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b
                        style={{ color: 'green' }}>{row.tenCtdt}</b></p>
                ))}
            </div>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow >
                            <CustomTableHeadCell style={{ border: '0', width: '10%' }}>Tiêu Chuẩn/<br />Tiêu Chí</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0', width: '10%' }}>Yêu cầu của tiêu chí</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0', width: '10%' }}>Mốc chuẩn tham chiếu để đánh giá tiêu chí đạt mức 4</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0', width: '10%' }}>Gợi ý nguồn minh chứng</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0', width: '30%' }}>Minh Chứng</CustomTableHeadCell>
                            <CustomTableHeadCell style={{ border: '0', width: '1%' }}>Tổng số MC</CustomTableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}><b>Tiêu chuẩn {tieuChuan.stt}. {tieuChuan.tenTieuChuan}</b></TableCell>
                        </TableRow>
                        {tieuChi.map((row, index) => (
                            <TableRow key={row.id}>
                                <CustomTableCell><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}</CustomTableCell>
                                <CustomTableCell>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                                    <p key={index}>{item.trim()}</p>
                                ))}</CustomTableCell>
                                <CustomTableCell colSpan={3} className='p-0'>
                                    <Table_MocChuan idTieuChi={row.idTieuChi} />
                                </CustomTableCell>
                                <CustomTableCell><TotalTieuChi idTieuChi={row.idTieuChi} /></CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    );
};

export default TieuChi;
