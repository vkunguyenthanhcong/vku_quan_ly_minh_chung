import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    getAllTieuChiWithIdTieuChuan,
    getTieuChuanById,
    getThongTinCTDT,
    getAllMocChuanWithIdTieuChi, getAllGoiYWithIdMocChuan, deleteMinhChung,
    getTotalMinhChungWithTieuChi,
    getAllMinhChungAndTieuChi
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";

const Table_MinhChung = React.memo(({ idTieuChi, idGoiY }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minhChung, setMinhChung] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [link, setLink] = useState("");
    const handleClickViewPDF = (link) => {
        setLink(link);
        openModal();
    };


    const navigate = useNavigate();
    const handleClick = (idGoiY, idTieuChi) => {
        navigate(`/quan-ly/minh-chung?GoiY_ID=${idGoiY}&TieuChi_ID=${idTieuChi}&KhungCTDT_ID=${KhungCTDT_ID}&TieuChuan_ID=${TieuChuan_ID}`);
    };
    const deleteMC = async (idMc, parentMaMc) => {
        deleteMinhChung(idMc, parentMaMc);
        fetchData();
    }
    const fetchData = async () => {
        try {
            const result = await getAllMinhChungAndTieuChi();
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead className='bg-white'>

                    {minhChung.filter(item => item.idGoiY === idGoiY).length > 0 ?
                        <TableRow style={{ maxWidth: '100%' }} className='border-black'>
                            <TableCell
                                style={{
                                    width: '20%'
                                }}
                                className='p-1'
                            >
                                <b>Mã</b>
                            </TableCell>
                            <TableCell
                                style={{ width: '20%' }}
                                className='p-1'
                            >
                                <b>Số hiệu</b>
                            </TableCell>
                            <TableCell
                                style={{ width: '45%' }}
                                className='p-1'
                            >
                                <b>Tên VB</b>
                            </TableCell>
                            <TableCell
                                style={{ width: '15%' }}
                                className='p-0'
                            >
                                <button
                                    style={{ width: '100%' }}
                                    className='btn btn-success'
                                    onClick={() => handleClick(idGoiY, idTieuChi)}
                                >
                                    Bổ sung
                                </button>
                            </TableCell>
                        </TableRow> :
                        <TableRow style={{ maxWidth: '100%' }}>
                            <TableCell style={{ width: '75%' }} colSpan={3} className='p-1 border-1-solid-white'>
                                <button className='btn btn-danger'>Thiếu</button>
                            </TableCell>
                            <TableCell style={{ width: '25%' }} className='p-1 border-1-solid-white'>
                                <button onClick={() => handleClick(idGoiY, idTieuChi)} className='btn btn-success' style={{ float: 'right' }}>Bổ sung</button>
                            </TableCell>
                        </TableRow>
                    }
                </TableHead>
                <TableBody>
                    {minhChung.filter(item => item.idGoiY === idGoiY).map((row, index) => {
                        const filteredItem = minhChung.filter(i => i.idMc === row.maDungChung);
                        const maMinhChungDisplay = row.maDungChung === 0 ? row.maMinhChung : (filteredItem[0].maMinhChung);
                        const modifiedString = row.maDungChung === 0 ? (row.maMinhChung.slice(0, -3) + '.') : (0);

                        return (
                            <TableRow key={index} className='border-black'>
                                <TableCell className='p-1' style={{ width: '25%' }}>{maMinhChungDisplay}</TableCell>
                                <TableCell className='p-1' style={{ width: '25%' }}>{row.soHieu}</TableCell>
                                <TableCell className='p-1' style={{ width: '30%' }}>{row.tenMinhChung}</TableCell>
                                <TableCell className='p-0' style={{ width: '20%' }}>
                                    <button style={{ width: '100%', marginTop: '5px' }} className='btn btn-secondary' onClick={() => handleClickViewPDF(row.linkLuuTru)}>Xem</button>
                                    <button style={{ width: '100%', marginTop: '5px' }} className='btn btn-danger' onClick={() => deleteMC(row.idMc, modifiedString)}>Xóa</button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>


            </Table>
            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link} />
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
                <>
                    <TableRow style={{ maxWidth: '100%', border: 'none', borderCollapse: 'collapse', borderSpacing: 0 }}>
                        <TableCell style={{ maxWidth: '100%', width: '25%', border: 'none' }}>
                            <span>{row.tenGoiY}</span>
                        </TableCell>
                        <TableCell style={{ width: '75%', maxWidth: '100%', border: 'none', height: '100%' }}>
                            <Table_MinhChung idTieuChi={idTieuChi} idGoiY={row.idGoiY} />
                        </TableCell>
                    </TableRow>
                    {index < goiY.length - 1 && <hr style={{ border: '1px solid black' }} />}
                </>
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
                        <TableCell style={{ width: '20%' }} className='border-1'>{index + 1}. {row.tenMocChuan}</TableCell>
                        <TableCell className='border-1 p-0' style={{ width: '80%' }}>
                            <Table_GoiY idMocChuan={row.idMocChuan} idTieuChi={idTieuChi} />
                        </TableCell>
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
            <style>
                {`
                .border-gray > td{
                    border : 1px solid #ccc !important;
                }
                .border-black > td, .border-black > th {
                    border : 1px solid black !important}
                `}
            </style>
            <div>
                {chuongTrinhDaoTao.map((row, index) => (
                    <p style={{ fontSize: '20px', textAlign: 'center' }}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b
                        style={{ color: 'green' }}>{row.tenCtdt}</b></p>
                ))}
            </div>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow id='table-row-color'>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Tiêu Chuẩn/<br />Tiêu Chí</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Yêu cầu của tiêu chí</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Mốc chuẩn tham chiếu để đánh giá tiêu chí đạt mức 4</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Gợi ý nguồn minh chứng</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '30%' }}>Minh Chứng</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '1%' }}>Tổng số MC</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}><b>Tiêu chuẩn {tieuChuan.stt}. {tieuChuan.tenTieuChuan}</b></TableCell>
                        </TableRow>
                        {tieuChi.map((row, index) => (
                            <TableRow key={row.id} className="border-gray">
                                <TableCell style={{ verticalAlign: 'top' }}><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}</TableCell>
                                <TableCell style={{ verticalAlign: 'top' }}>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                                    <p key={index}>{item.trim()}</p>
                                ))}</TableCell>
                                <TableCell colSpan={3} className='p-0'>
                                    <Table_MocChuan idTieuChi={row.idTieuChi} />
                                </TableCell>
                                <TableCell style={{ verticalAlign: 'top' }}><TotalTieuChi idTieuChi={row.idTieuChi} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    );
};

export default TieuChi;
