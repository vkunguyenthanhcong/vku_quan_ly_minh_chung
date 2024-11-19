import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    getTieuChuanById,
    deleteMinhChung,
    getAllTieuChi,
    getAllMocChuan, getAllGoiY, getAllMinhChung, getAllKhoMinhChung, downSlotMinhChung, upSlotMinhChung
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";
import {useClickViewPdfStore} from "../../../../stores";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Table_MinhChung = ({setNoCase, idGoiY, idTieuChi,setDataTransfer, dataTransfer, minhChung, fetchData}) => {
    console.log(minhChung)

    const handleClickViewPDF = useClickViewPdfStore((state) => state.handleClickViewPDF);

    const handleClick = (idGoiY, idTieuChi) => {
        // navigate(`/quan-ly/minh-chung?GoiY_ID=${idGoiY}&TieuChi_ID=${idTieuChi}&KhungCTDT_ID=${KhungCTDT_ID}&TieuChuan_ID=${TieuChuan_ID}`);
        setNoCase(3)
        setDataTransfer({
            ...dataTransfer,
            GoiY_ID : idGoiY,
            TieuChi_ID : idTieuChi
        })
    };
    const deleteMC = async (idMc, parentMaMc) => {
        const response = await deleteMinhChung(idMc, parentMaMc);
        if(response === "OK"){
            fetchData();
        }
    }

    const downSlotMC = async (idMc) => {
        try {
            const response = await downSlotMinhChung(idMc);
            if(response == "OK"){
                fetchData();
            }
        }catch (e) {
            console.log(e);
        }
    }
    const upSlotMC = async (idMc) => {
        try {
            const response = await upSlotMinhChung(idMc);
            if(response == "OK"){
                fetchData();
            }
        }catch (e) {
            console.log(e);
        }
    }
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
                    {minhChung.filter(item=>item.idGoiY == idGoiY).map((row, index) => {
                        return (
                            <TableRow key={index} className='border-black'>
                                <TableCell className='p-1' style={{width: '25%'}}>{row.maMinhChung}</TableCell>
                                <TableCell className='p-1' style={{width: '25%'}}>{row.khoMinhChung.soHieu}</TableCell>
                                <TableCell className='p-1'
                                           style={{width: '30%'}}>{row.khoMinhChung.tenMinhChung}</TableCell>
                                <TableCell className='p-0' style={{width: '20%'}}>
                                    <button style={{width: '100%', marginTop: '5px'}} className='btn btn-secondary'
                                            onClick={() => handleClickViewPDF("https://drive.google.com/file/d/" + row.linkLuuTru + "/preview")}>Xem
                                    </button>
                                    <button style={{width: '100%', marginTop: '5px'}} className='btn btn-danger'
                                            onClick={() => deleteMC(row.idMc, row.parentMaMc)}
                                    >Xóa
                                    </button>
                                    <br/>
                                    {row.childMaMc == "01" ? (null) : (
                                        <>
                                            <button style={{width: '100%', marginTop: '5px'}}
                                                    className='btn btn-primary' onClick={()=>upSlotMC(row.idMc)}>
                                                <FontAwesomeIcon icon={faArrowUp}/>
                                            </button>
                                            <br/>
                                        </>
                                    )}
                                    {row.stt == minhChung.length ? (null) : (<>
                                        <button style={{width: '100%', marginTop: '5px'}}
                                                className='btn btn-primary' onClick={()=>downSlotMC(row.idMc)}>
                                            <FontAwesomeIcon icon={faArrowDown}/>
                                        </button>
                                        <br/>
                                    </>)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>


            </Table>

        </>

    );
};
const Table_GoiY = ({setNoCase, idMocChuan, idTieuChi, setDataTransfer, dataTransfer, minhChung, fetchData}) => {
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
                            <Table_MinhChung setNoCase={setNoCase} idGoiY={row.idGoiY} idTieuChi={idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData}/>
                        </TableCell>
                    </TableRow>
                    {index < goiY.length - 1 && <hr style={{border: '1px solid black'}}/>}
                </>
            ))}
        </>

    );
};
const Table_MocChuan = ({idTieuChi, setNoCase, setDataTransfer, dataTransfer, minhChung, fetchData}) => {
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
                            <Table_GoiY setNoCase={setNoCase} idMocChuan={row.idMocChuan} idTieuChi={idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData}/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
};

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

const TieuChi = ({TieuChuan_ID, KhungCTDT_ID, setNoCase, setDataTransfer, dataTransfer}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([]);
    const [tieuChi, setTieuChi] = useState([]);
    const [minhChung, setMinhChung] = useState([])


    const isModalOpen = useClickViewPdfStore((state) => state.isModalOpen);
    const closeModal = useClickViewPdfStore((state) => state.closeModal);
    const link = useClickViewPdfStore((state) => state.link);

    const fetchData = async () => {
        try {
            const result = await getAllMinhChung();
            const allKhoMinhChung = await getAllKhoMinhChung();
            let i = 0;
            const updatedData = result.map(item => {
                i++;
                let maMinhChung;
                let linkLuuTru;
                let parentMaMc;
                if(item.maDungChung == 0){
                    maMinhChung = `${item.parentMaMc}${item.childMaMc}`;
                    linkLuuTru = item.linkLuuTru;
                    parentMaMc = item.parentMaMc;
                }else{
                    const filter = result.find((rs) => rs.idMc == item.maDungChung);
                    maMinhChung = `${filter.parentMaMc}${filter.childMaMc}`;
                    linkLuuTru = filter.linkLuuTru;
                    parentMaMc = 0;
                }
                const khoMinhChung = allKhoMinhChung.find(kmc => kmc.idKhoMinhChung === item.idKhoMinhChung);
                return {
                    ...item,
                    stt : i,
                    maMinhChung : maMinhChung,
                    khoMinhChung : khoMinhChung,
                    linkLuuTru : linkLuuTru,
                    parentMaMc :parentMaMc
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
        fetchData();
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
                                    <Table_MocChuan setNoCase={setNoCase} idTieuChi={row.idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData}/>
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
