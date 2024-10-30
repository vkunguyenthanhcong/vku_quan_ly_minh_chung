import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    getTieuChuanById,
    deleteMinhChung,
    getTotalMinhChungWithTieuChi,
    getMinhChungByIdGoiY,
    getTieuChiByMaCtdt,
    getAllTieuChi,
    getAllMocChuanWithIdTieuChi,
    getAllMocChuan, getAllGoiYWithIdMocChuan, getAllGoiY, getAllMinhChung
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";
import {useClickViewPdfStore} from "../../../../stores";

const Table_MinhChung = React.memo(({idGoiY, idTieuChi}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minhChung, setMinhChung] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');

    const handleClickViewPDF = useClickViewPdfStore((state) => state.handleClickViewPDF);

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
            const result = await getAllMinhChung();
            const filterResult = result.filter((item)=> item.idGoiY == idGoiY);
            const updatedData = filterResult.map(item => {
                const maMinhChung = `${item.parentMaMc}${item.childMaMc}`;
                const {parentMaMc, childMaMc, ...rest} = item;
                return {
                    ...rest,
                    maMinhChung
                };
            });
            setMinhChung(updatedData);
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

            <Table style={{tableLayout: 'fixed', width: '100%'}}>
                <TableHead className='bg-white'>

                    {minhChung.filter(item => item.idGoiY === idGoiY).length > 0 ?
                        <TableRow style={{maxWidth: '100%'}} className='border-black'>
                            <TableCell
                                style={{
                                    width: '20%'
                                }}
                                className='p-1'
                            >
                                <b>Mã</b>
                            </TableCell>
                            <TableCell
                                style={{width: '20%'}}
                                className='p-1'
                            >
                                <b>Số hiệu</b>
                            </TableCell>
                            <TableCell
                                style={{width: '45%'}}
                                className='p-1'
                            >
                                <b>Tên VB</b>
                            </TableCell>
                            <TableCell
                                style={{width: '15%'}}
                                className='p-0'
                            >
                                <button
                                    style={{width: '100%'}}
                                    className='btn btn-success'
                                    onClick={() => handleClick(idGoiY, idTieuChi)}
                                >
                                    Bổ sung
                                </button>
                            </TableCell>
                        </TableRow> :
                        <TableRow style={{maxWidth: '100%'}}>
                            <TableCell style={{width: '75%'}} colSpan={3} className='p-1 border-1-solid-white'>
                                <button className='btn btn-danger'>Thiếu</button>
                            </TableCell>
                            <TableCell style={{width: '25%'}} className='p-1 border-1-solid-white'>
                                <button onClick={() => handleClick(idGoiY, idTieuChi)} className='btn btn-success'
                                        style={{float: 'right'}}>Bổ sung
                                </button>
                            </TableCell>
                        </TableRow>
                    }
                </TableHead>
                <TableBody>
                    {minhChung.map((row, index) => {
                        const filteredItem = minhChung.filter(i => i.idMc === row.maDungChung);
                        const maMinhChungDisplay = row.maDungChung === 0 ? row.maMinhChung : (filteredItem[0].maMinhChung);
                        const modifiedString = row.maDungChung === 0 ? (row.maMinhChung.slice(0, -3) + '.') : (0);

                        return (
                            <TableRow key={index} className='border-black'>
                                <TableCell className='p-1' style={{width: '25%'}}>{maMinhChungDisplay}</TableCell>
                                <TableCell className='p-1' style={{width: '25%'}}>{row.khoMinhChung.soHieu}</TableCell>
                                <TableCell className='p-1'
                                           style={{width: '30%'}}>{row.khoMinhChung.tenMinhChung}</TableCell>
                                <TableCell className='p-0' style={{width: '20%'}}>
                                    <button style={{width: '100%', marginTop: '5px'}} className='btn btn-secondary'
                                            onClick={() => handleClickViewPDF(row.linkLuuTru)}>Xem
                                    </button>
                                    <button style={{width: '100%', marginTop: '5px'}} className='btn btn-danger'
                                            onClick={() => deleteMC(row.idMc, modifiedString)}>Xóa
                                    </button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>


            </Table>

        </>

    );
});
const Table_GoiY = React.memo(({idMocChuan, idTieuChi}) => {
    const [goiY, setGoiY] = useState([]);
    useEffect(() => {
        const fetchMocChuan = async () => {
            try {
                const response = await getAllGoiY();
                const filter = response.filter((item) => item.idMocChuan == idMocChuan);
                setGoiY(filter);
            }catch (e) {

            }
        }
        fetchMocChuan();
    },[])
    return (
        <>
            {goiY.map((row, index) => (
                <>
                    <TableRow style={{maxWidth: '100%', border: 'none', borderCollapse: 'collapse', borderSpacing: 0}}>
                        <TableCell style={{maxWidth: '100%', width: '25%', border: 'none'}}>
                            <span>{row.tenGoiY}</span>
                        </TableCell>
                        <TableCell style={{width: '75%', maxWidth: '100%', border: 'none', height: '100%'}}>
                            <Table_MinhChung idGoiY={row.idGoiY} idTieuChi={idTieuChi}/>
                        </TableCell>
                    </TableRow>
                    {index < goiY.length - 1 && <hr style={{border: '1px solid black'}}/>}
                </>
            ))}
        </>

    );
});
const Table_MocChuan = React.memo(({idTieuChi}) => {
    const [mocChuan, setMocChuan] = useState([]);
    useEffect(() => {
        const fetchMocChuan = async () => {
            try {
                const response = await getAllMocChuan();
                const filter = response.filter((item) => item.idTieuChi == idTieuChi);
                setMocChuan(filter);
            }catch (e) {

            }
        }
        fetchMocChuan();
    },[])
    return (
        <>
            {mocChuan.map((row, index) => (
                <TableBody>
                    <TableRow key={row.id}>
                        <TableCell style={{width: '20%'}}
                                   className='border-1'>{index + 1}. {row.tenMocChuan}</TableCell>
                        <TableCell className='border-1 p-0' style={{width: '80%'}}>
                            <Table_GoiY idMocChuan={row.idMocChuan} idTieuChi={idTieuChi}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
});

const TotalTieuChi = ({idTieuChi}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [total, setTotal] = useState(0);
    useEffect(() => {
        setLoading(true);
        const fetchDataFromAPI = async () => {
            try {

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
            <p>{total}</p>
        </>
    )
}

const TieuChi = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([]);
    const [tieuChi, setTieuChi] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const TieuChuan_ID = queryParams.get('TieuChuan_ID');
    const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');

    const isModalOpen = useClickViewPdfStore((state) => state.isModalOpen);
    const closeModal = useClickViewPdfStore((state) => state.closeModal);
    const link = useClickViewPdfStore((state) => state.link);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const tieuChuanData = await getTieuChuanById(TieuChuan_ID);
                setTieuChuan(tieuChuanData);
                const tieuChiData = await getAllTieuChi();
                const tieuChiDataFilter = tieuChiData.filter((item) => item.idTieuChuan == TieuChuan_ID);
                setTieuChi(tieuChiDataFilter);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, [TieuChuan_ID, KhungCTDT_ID]);
    return (
        <div className="content" style={{background: "white", margin: '20px', padding: '20px'}}>

            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link}/>
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
                {tieuChuan && tieuChuan.ctdt ?
                    <p style={{fontSize: '20px', textAlign: 'center'}}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b
                        style={{color: 'green'}}>{tieuChuan.ctdt.tenCtdt}</b></p>
                    : 'Loading...'}
            </div>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow id='table-row-color'>
                            <TableCell className='text-white' style={{border: '0', width: '10%'}}>Tiêu Chuẩn/<br/>Tiêu
                                Chí</TableCell>
                            <TableCell className='text-white' style={{border: '0', width: '10%'}}>Yêu cầu của tiêu
                                chí</TableCell>
                            <TableCell className='text-white' style={{border: '0', width: '10%'}}>Mốc chuẩn tham chiếu
                                để đánh giá tiêu chí đạt mức 4</TableCell>
                            <TableCell className='text-white' style={{border: '0', width: '10%'}}>Gợi ý nguồn minh
                                chứng</TableCell>
                            <TableCell className='text-white' style={{border: '0', width: '30%'}}>Minh Chứng</TableCell>
                            <TableCell className='text-white' style={{border: '0', width: '1%'}}>Tổng số MC</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={6}><b>Tiêu
                                chuẩn {tieuChuan ? tieuChuan.stt : 'Loading...'}. {tieuChuan ? tieuChuan.tenTieuChuan : 'Loading...'}</b></TableCell>
                        </TableRow>
                        {tieuChi ? tieuChi.map((row, index) => (
                            <TableRow key={row.id} className="border-gray">
                                <TableCell
                                    style={{verticalAlign: 'top'}}><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}
                                </TableCell>
                                <TableCell
                                    style={{verticalAlign: 'top'}}>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                                    <p key={index}>{item.trim()}</p>
                                ))}</TableCell>
                                <TableCell colSpan={3} className='p-0'>
                                    <Table_MocChuan idTieuChi={row.idTieuChi}/>
                                </TableCell>
                                <TableCell style={{verticalAlign: 'top'}}><TotalTieuChi
                                    idTieuChi={row.idTieuChi}/></TableCell>
                            </TableRow>
                        )) : 'Loading...'}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    );
};

export default TieuChi;
