
import React, { useEffect, useState } from 'react';
import colors from '../../../../components/color';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
    getAllGoiYWithIdMocChuan,
    getAllMocChuanWithIdTieuChi,
    getAllTieuChiWithIdTieuChuan, getThongTinCTDT,
} from "../../../../services/apiServices";
import PopupForm from "./PopupForm/PopupForm";

const ListGoiY = ({ idMocChuan }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const showPopup = () => setIsPopupVisible(true);
    const hidePopup = () => setIsPopupVisible(false);

    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchGoiY = async () => {
        try {
            const result = await getAllGoiYWithIdMocChuan(idMocChuan);
            setGoiY(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchGoiY();
    }, [idMocChuan]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {goiY.map((row) => (
                <React.Fragment key={row.id}> {/* Sử dụng key để tránh cảnh báo từ React */}
                    <TableRow className="no-border">
                    <TableCell>{row.tenGoiY}</TableCell>
                    </TableRow>
                    <hr />
                </React.Fragment>
                ))}
            <div className='d-flex justify-content-center'>
                <button onClick={showPopup} className='btn'><i className='fas fa-edit'> </i> <span>  Bổ sung thêm gợi ý minh chứng</span></button>
            </div>
            <PopupForm isVisible={isPopupVisible} onClose={hidePopup} idMocChuan={idMocChuan} fetchGoiY={fetchGoiY} />
        </>
    );
};
const ListMocChuan = ({ idTieuChi }) => {
    const [mocChuan, setMocChuan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllMocChuanWithIdTieuChi(idTieuChi);
                setMocChuan(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTieuChi();
    }, [idTieuChi]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {mocChuan.map((row, index) => (
                <React.Fragment key={row.idMocChuan}>
                    <TableRow >
                        <TableCell style={{ width: '50%' }}>{index + 1}. {row.tenMocChuan}</TableCell>
                        <TableCell style={{ width: '50%' }}><ListGoiY idMocChuan={row.idMocChuan} /></TableCell>
                    </TableRow>
                    
                </React.Fragment>
            ))}

        </>
    );
};
const ListTieuChi = ({ idTieuChuan, stt }) => {
    const [tieuChi, setTieuChi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(idTieuChuan);
                setTieuChi(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTieuChi();
    }, [idTieuChuan]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            {tieuChi.map((row, index) => (
                <TableRow className='border-gray'>
                    <TableCell><b>{stt}.{index + 1}</b> {row.tenTieuChi}</TableCell>
                    <TableCell>{row.yeuCau.split(/(?=\d+\.\s)/).map((item, index) => (
                                    <p key={index}>{item.trim()}</p>
                                ))}</TableCell>
                    <TableCell colSpan={2}><ListMocChuan idTieuChi={row.idTieuChi} /></TableCell>
                </TableRow>
            ))}
        </>
    );
};

const DanhSachTieuChuan = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungChuongTrinhID = queryParams.get('KhungCTDT_ID');

    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result_1 = await getThongTinCTDT(KhungChuongTrinhID);
                setChuongTrinhDaoTao(result_1);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [KhungChuongTrinhID]);
    if(loading === true) {return (<p>Loading...</p>)}
    return (
        <div className="content" style={{ background: "white", margin: '20px' }}>
            <style>
                {`
                th{
                    color:white !important;
                }
                .border-gray > td{
                    border : 1px solid #ccc !important;
                }

                .no-border > td{
                    border : 1px solid white !important;
                }
                `}
            </style>
            <p className='text-center' style={{ fontSize: '20px' }}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH <span
                    style={{ color: colors.secondary }}>{chuongTrinhDaoTao ? chuongTrinhDaoTao.tenCtdt : 'Loading...'}</span></b></p>
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead id="table-row-color">
                        <TableCell style={{ width: '15%' }}>Tiêu chuẩn/ <br />Tiêu chí</TableCell>
                        <TableCell style={{ width: '15%' }}>Yêu cầu của tiêu chí</TableCell>
                        <TableCell style={{ width: '35%' }}>Mốc chuẩn để tham chiếu để đánh giá tiêu chí đạt mức 4</TableCell>
                        <TableCell style={{ width: '35%' }}>Các gợi ý bắt buộc</TableCell>
                    </TableHead>
                    {chuongTrinhDaoTao ? chuongTrinhDaoTao.tieuChuan.map((row, index) => (
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ backgroundColor: colors.grayColorLess, fontSize: '16px' }} colSpan={4}><b>Tiêu chuẩn {index + 1}. {row.tenTieuChuan}</b></TableCell>
                            </TableRow>
                            <ListTieuChi idTieuChuan={row.idTieuChuan} stt={index + 1} />
                        </TableBody>
                    )) : 'Loading...'}
                </Table>
            </TableContainer>

        </div>
    );
};

export default DanhSachTieuChuan;