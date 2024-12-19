import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {
    getTieuChuanById,
    deleteMinhChung,
    getAllTieuChi,
    getAllMocChuan, getAllGoiY, getAllMinhChung, getAllKhoMinhChung, downSlotMinhChung, upSlotMinhChung
} from '../../../../services/apiServices';
import './TieuChi.css';
import PdfPreview from "../../../../services/PdfPreview";
import { useClickViewPdfStore } from "../../../../stores";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const Table_MinhChung = ({ setNoCase, idGoiY, idTieuChi, setDataTransfer, dataTransfer, minhChung, fetchData }) => {
    const handleClickViewPDF = useClickViewPdfStore((state) => state.handleClickViewPDF);

    const handleClick = (idGoiY, idTieuChi) => {
        // navigate(`/quan-ly/minh-chung?GoiY_ID=${idGoiY}&TieuChi_ID=${idTieuChi}&KhungCTDT_ID=${KhungCTDT_ID}&TieuChuan_ID=${TieuChuan_ID}`);
        setNoCase(3)
        setDataTransfer({
            ...dataTransfer,
            GoiY_ID: idGoiY,
            TieuChi_ID: idTieuChi
        })
    };
    const deleteMC = async (idMc, parentMaMc) => {
        const response = await deleteMinhChung(idMc, parentMaMc);
        if (response === "OK") {
            fetchData();
        }
    }

    const downSlotMC = async (idMc) => {
        try {
            const response = await downSlotMinhChung(idMc);
            if (response === "OK") {
                fetchData();
            }
        } catch (e) {
            console.log(e);
        }
    }
    const upSlotMC = async (idMc) => {
        try {
            const response = await upSlotMinhChung(idMc);
            if (response === "OK") {
                fetchData();
            }
        } catch (e) {
            console.log(e);
        }
    }
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
                                style={{ width: '40%' }}
                                className='p-1'
                            >
                                <b>Tên văn bản</b>
                            </TableCell>
                            <TableCell
                                style={{ width: '10%' }}
                                className='p-1'
                            >
                                <button
                                    style={{ width: '100%', fontSize: 14 }}
                                    className='btn btn-success fw-bold text-uppercase'
                                    onClick={() => handleClick(idGoiY, idTieuChi)}
                                >
                                    <i className="fas fa-plus-circle"></i>
                                </button>
                            </TableCell>
                        </TableRow> :
                        <TableRow style={{ maxWidth: '100%' }}>
                            <TableCell style={{ width: '75%' }} colSpan={3} className='p-1 border-1-solid-white'>
                                <button className='btn btn-danger fw-bold' style={{ fontSize: 14 }}><i className="fas fa-times-circle"></i> THIẾU</button>
                            </TableCell>
                            <TableCell style={{ width: '25%' }} className='p-1 border-1-solid-white'>
                                <button onClick={() => handleClick(idGoiY, idTieuChi)} className='btn btn-success fw-bold'
                                    style={{ float: 'right', fontSize: 14 }}><i className="fas fa-plus-circle"></i> BỔ SUNG
                                </button>
                            </TableCell>
                        </TableRow>
                    }
                </TableHead>
                <TableBody>
                    {minhChung.filter(item => item.idGoiY === idGoiY).map((row, index) => {
                        return (
                            <TableRow key={index} className='border-black'>
                                <TableCell className='p-1' style={{ width: '25%' }}>{row.maMinhChung}</TableCell>
                                <TableCell className='p-1' style={{ width: '25%' }}>{row.khoMinhChung.soHieu}</TableCell>
                                <TableCell className='p-1'
                                    style={{ width: '30%' }}>{row.khoMinhChung.tenMinhChung}</TableCell>
                                <TableCell className='p-1' style={{ width: '10%' }}>
                                    <button style={{ width: '100%', marginTop: '5px', fontSize: 14 }} className='btn btn-secondary fw-bold text-uppercase'
                                        onClick={() => handleClickViewPDF("https://drive.google.com/file/d/" + row.linkLuuTru + "/preview")}>  
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button style={{ width: '100%', marginTop: '5px', fontSize: 14 }} className='btn btn-danger fw-bold text-uppercase'
                                        onClick={() => deleteMC(row.idMc, row.parentMaMc)}
                                    > <i className="fas fa-trash"></i>
                                    </button>
                                    <br />
                                    {(() => {
                                        if (row.childMaMc === "01") {
                                            return (
                                                <button
                                                    style={{ width: '100%', marginTop: '5px' }}
                                                    className="btn btn-primary"
                                                    onClick={() => downSlotMC(row.idMc)}
                                                >
                                                    <FontAwesomeIcon icon={faArrowDown} />
                                                </button>
                                            );
                                        } else if (row.childMaMc != minhChung.length) {
                                            return (
                                                <>
                                                    <button
                                                        style={{ width: '100%', marginTop: '5px' }}
                                                        className="btn btn-primary"
                                                        onClick={() => downSlotMC(row.idMc)}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowDown} />
                                                    </button>
                                                    <button
                                                        style={{ width: '100%', marginTop: '5px' }}
                                                        className="btn btn-primary"
                                                        onClick={() => upSlotMC(row.idMc)}
                                                    >
                                                        <FontAwesomeIcon icon={faArrowUp} />
                                                    </button>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <button
                                                    style={{ width: '100%', marginTop: '5px' }}
                                                    className="btn btn-primary"
                                                    onClick={() => upSlotMC(row.idMc)}
                                                >
                                                    <FontAwesomeIcon icon={faArrowUp} />
                                                </button>
                                            );
                                        }
                                    })()}


                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>


            </Table>

        </>

    );
};
const Table_GoiY = ({ setNoCase, idMocChuan, idTieuChi, setDataTransfer, dataTransfer, minhChung, fetchData, gy }) => {
    const [goiY, setGoiY] = useState([]);
    useEffect(() => {
        const filter = gy.filter((item) => item.idMocChuan === idMocChuan);
        setGoiY(filter);
    }, [idMocChuan, gy])
    return (
        <>
            {goiY.map((row, index) => (
                <>
                    <TableRow style={{ maxWidth: '100%', border: 'none', borderCollapse: 'collapse', borderSpacing: 0 }}>
                        <TableCell style={{ maxWidth: '100%', width: '25%', border: 'none' }}>
                            <span>{row.tenGoiY}</span>
                        </TableCell>
                        <TableCell style={{ width: '75%', maxWidth: '100%', border: 'none', height: '100%' }}>
                            <Table_MinhChung setNoCase={setNoCase} idGoiY={row.idGoiY} idTieuChi={idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData} />
                        </TableCell>
                    </TableRow>
                    {index < goiY.length - 1 && <hr style={{ border: '1px solid black' }} />}
                </>
            ))}
        </>

    );
};
const Table_MocChuan = ({ idTieuChi, setNoCase, setDataTransfer, dataTransfer, minhChung, fetchData, mc, gy }) => {
    const [mocChuan, setMocChuan] = useState([]);
    useEffect(() => {
        const filter = mc.filter((item) => item.idTieuChi === idTieuChi);
        console.log(filter)
        setMocChuan(filter);
    }, [idTieuChi, mc])
    return (
        <>
            {mocChuan.map((row, index) => (
                <TableBody>
                    <TableRow key={row.id}>
                        <TableCell style={{ width: '20%' }}
                            className='border-1'>{index + 1}. {row.tenMocChuan}</TableCell>
                        <TableCell className='border-1 p-0' style={{ width: '80%' }}>
                            <Table_GoiY setNoCase={setNoCase} idMocChuan={row.idMocChuan} idTieuChi={idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData} gy={gy} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </>
    );
};
const TotalTieuChi = ({ idTieuChi, minhChungData, mocChuanData, goiYData }) => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Step 1: Find all MocChuan items matching idTieuChi
        const mocChuanFilter = mocChuanData.filter(item => item.idTieuChi === idTieuChi);
        if (mocChuanFilter.length === 0) {
            setTotal(0); // No matching MocChuan
            return;
        }

        // Step 2: Find all GoiY items matching the idMocChuan of the filtered MocChuan
        const goiYFilter = goiYData.filter(item =>
            mocChuanFilter.some(mc => mc.idMocChuan === item.idMocChuan)
        );
        if (goiYFilter.length === 0) {
            setTotal(0); // No matching GoiY
            return;
        }

        // Step 3: Find all MinhChung items matching the idGoiY of the filtered GoiY
        const minhChungFilter = minhChungData.filter(item =>
            goiYFilter.some(gy => gy.idGoiY === item.idGoiY)
        );

        // Step 4: Update the total
        setTotal(minhChungFilter.length);
    }, [idTieuChi, minhChungData, mocChuanData, goiYData]);

    return (
        <>
            <p>{total}</p>
        </>
    );
};

const TieuChi = ({ TieuChuan_ID, KhungCTDT_ID, setNoCase, setDataTransfer, dataTransfer }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tieuChuan, setTieuChuan] = useState([]);
    const [tieuChi, setTieuChi] = useState([]);
    const [minhChung, setMinhChung] = useState([]);
    const [mocChuan, setMocChuan] = useState([]);
    const [goiY, setGoiY] = useState([]);

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
                if (item.maDungChung === 0) {
                    maMinhChung = `${item.parentMaMc}${item.childMaMc}`;
                    linkLuuTru = item.linkLuuTru;
                    parentMaMc = item.parentMaMc;
                } else {
                    const filter = result.find((rs) => rs.idMc === item.maDungChung);
                    maMinhChung = `${filter.parentMaMc}${filter.childMaMc}`;
                    linkLuuTru = filter.linkLuuTru;
                    parentMaMc = 0;
                }
                const khoMinhChung = allKhoMinhChung.find(kmc => kmc.idKhoMinhChung === item.idKhoMinhChung);
                return {
                    ...item,
                    stt: i,
                    maMinhChung: maMinhChung,
                    khoMinhChung: khoMinhChung,
                    linkLuuTru: linkLuuTru,
                    parentMaMc: parentMaMc
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
                const tieuChiDataFilter = tieuChiData.filter((item) => item.idTieuChuan === TieuChuan_ID);
                setTieuChi(tieuChiDataFilter);
                const mocChuanData = await getAllMocChuan();
                setMocChuan(mocChuanData);
                const goiYData = await getAllGoiY();
                setGoiY(goiYData);
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
        <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>

            <PdfPreview show={isModalOpen} handleClose={closeModal} link={link} />
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
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Tiêu Chuẩn/<br />Tiêu
                                Chí</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Yêu cầu của tiêu
                                chí</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Mốc chuẩn tham chiếu
                                để đánh giá tiêu chí đạt mức 4</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '10%' }}>Gợi ý nguồn minh
                                chứng</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '30%' }}>Minh Chứng</TableCell>
                            <TableCell className='text-white' style={{ border: '0', width: '1%' }}>Tổng số MC</TableCell>
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
                                    style={{ verticalAlign: 'top' }}><b>{tieuChuan.stt}.{index + 1}</b> {row.tenTieuChi}
                                </TableCell>
                                <TableCell
                                    style={{ verticalAlign: 'top' }}>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                                        <p key={index}>{item.trim()}</p>
                                    ))}</TableCell>
                                <TableCell colSpan={3} className='p-0'>
                                    <Table_MocChuan setNoCase={setNoCase} idTieuChi={row.idTieuChi} setDataTransfer={setDataTransfer} dataTransfer={dataTransfer} minhChung={minhChung} fetchData={fetchData} mc={mocChuan} gy={goiY} />
                                </TableCell>
                                <TableCell style={{ verticalAlign: 'top' }}>
                                    <TotalTieuChi
                                        idTieuChi={row.idTieuChi} minhChungData={minhChung} mocChuanData={mocChuan} goiYData={goiY} /></TableCell>
                            </TableRow>
                        )) : 'Loading...'}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>

    );
};

export default TieuChi;
