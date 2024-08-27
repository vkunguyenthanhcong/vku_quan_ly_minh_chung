
import React, { useEffect, useState } from 'react';
import './DanhSachTieuChuan.css'
import { styled } from '@mui/material/styles';
import colors from '../../../../components/color';
import font from '../../../../components/font'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
    getAllGoiYWithIdMocChuan,
    getAllMocChuanWithIdTieuChi,
    getAllTieuChiWithIdTieuChuan, getThongTinCTDT,
    getTieuChuanWithMaCtdt
} from "../../../../services/apiServices";
import PopupForm from "./PopupForm/PopupForm";
const CustomTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    fontFamily : font.inter
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontSize: '16px',
    color : 'white !important',
    fontFamily : font.inter
}));;
const ListGoiY = ({ idMocChuan , token}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const showPopup = () => setIsPopupVisible(true);
    const hidePopup = () => setIsPopupVisible(false);

    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchGoiY = async () => {
        try {
            const result = await getAllGoiYWithIdMocChuan(idMocChuan, token);
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
            {goiY.map((row, index) => (
                <TableRow>
                    <TableCell>{row.tenGoiY}</TableCell>
                </TableRow>
            ))}
            <div className='d-flex justify-content-center'>
            <button onClick={showPopup} className='btn'><i className='fas fa-edit'> </i> <span>  Bổ sung thêm gợi ý minh chứng</span></button>
            </div>
            <PopupForm isVisible={isPopupVisible} onClose={hidePopup} idMocChuan={idMocChuan} fetchGoiY ={fetchGoiY} token={token} />
        </>
    );
};
const ListMocChuan = ({ idTieuChi, token }) => {
    const [mocChuan, setMocChuan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllMocChuanWithIdTieuChi(idTieuChi, token);
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
                <TableRow>
                    <TableCell style={{width : '50%'}}>{row.tenMocChuan}</TableCell>
                    <TableCell style={{width : '50%'}}><ListGoiY idMocChuan={row.idMocChuan} token={token}/></TableCell>
                </TableRow>
            ))}
        </>
    );
};
const ListTieuChi = ({ idTieuChuan, stt, token }) => {
    const [tieuChi, setTieuChi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTieuChi = async () => {
            try {
                const result = await getAllTieuChiWithIdTieuChuan(idTieuChuan, token);
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
                <TableRow>
                    <TableCell><b>{stt}.{index+1}</b> {row.tenTieuChi}</TableCell>
                    <TableCell>{row.yeuCau}</TableCell>
                    <TableCell colSpan={2}><ListMocChuan idTieuChi={row.idTieuChi} token ={token} /></TableCell>
                </TableRow>
            ))}
        </>
    );
};

const DanhSachTieuChuan = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungChuongTrinhID = queryParams.get('KhungChuongTrinhID');

    const [tieuChuan, setTieuChuan] = useState([]);
    const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        try {
            const result = await getTieuChuanWithMaCtdt(KhungChuongTrinhID, token);
            const result_1 = await getThongTinCTDT(KhungChuongTrinhID, token);
            setTieuChuan(result);
            setChuongTrinhDaoTao(result_1);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="content" style={{ background: "white", margin: '20px' }}>
            {chuongTrinhDaoTao.map((row, index)=> (
                <p className='text-center' style={{fontSize: '20px'}}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH <span
                    style={{color: colors.secondary}}>{row.tenCtdt}</span></b></p>
            ))}
            <TableContainer component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <CustomTableHeadCell style={{width : '15%'}}>Tiêu chuẩn/ <br/>Tiêu chí</CustomTableHeadCell>
                        <CustomTableHeadCell style={{width : '15%'}}>Yêu cầu của tiêu chí</CustomTableHeadCell>
                        <CustomTableHeadCell style={{width : '35%'}}>Mốc chuẩn để tham chiếu để đánh giá tiêu chí đạt mức 4</CustomTableHeadCell>
                        <CustomTableHeadCell style={{width : '35%'}}>Các gợi ý bắt buộc</CustomTableHeadCell>
                    </TableHead>
                    {tieuChuan.map((row, index) => (
                    <TableBody>
                            <TableRow>
                                <TableCell style={{backgroundColor : colors.grayColorLess, fontSize : '16px'}} colSpan={4}><b>Tiêu chuẩn {index + 1}. {row.tenTieuChuan}</b></TableCell>
                            </TableRow>
                            <ListTieuChi idTieuChuan={row.idTieuChuan} stt = {index + 1} token = {token}/>
                    </TableBody>
                    ))}
                </Table>
            </TableContainer>

        </div>
    );
};

export default DanhSachTieuChuan;