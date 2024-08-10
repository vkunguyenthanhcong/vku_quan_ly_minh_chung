
import React, { useEffect, useState } from 'react';
import './ListStandard.css'
import { styled } from '@mui/material/styles';
import colors from '../../../../components/color';
import font from '../../../../components/font'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    getAllGoiYWithIdTieuChi,
    getAllKhoMinhChung,
    getAllTieuChiWithIdTieuChuan,
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
                <TableRow>
                    <TableCell>{stt}.{index+1} {row.tenTieuChi}</TableCell>
                    <TableCell>{row.yeuCau}</TableCell>
                    <TableCell>{row.mocChuan}</TableCell>
                    <TableCell><ListGoiY idTieuChi={row.idTieuChi} /></TableCell>
                </TableRow>
            ))}
        </>
    );
};
const ListGoiY = ({ idTieuChi }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const showPopup = () => setIsPopupVisible(true);
    const hidePopup = () => setIsPopupVisible(false);

    const [goiY, setGoiY] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchGoiY = async () => {
        try {
            const result = await getAllGoiYWithIdTieuChi(idTieuChi);
            setGoiY(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGoiY();
    }, [idTieuChi]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
                    {goiY.map((row, index) => (
                        <div><p>{row.tenGoiY}</p>
                            <hr/>
                        </div>
                    ))}
            <div className='d-flex justify-content-center'>
                <button onClick={showPopup} className='btn'><i className='fas fa-edit'> </i> <span>  Bổ sung thêm gợi ý minh chứng</span></button>
            </div>
            <PopupForm isVisible={isPopupVisible} onClose={hidePopup} idTieuChi={idTieuChi} fetchGoiY ={fetchGoiY} />
        </>
    );
};
const ListStandard = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const KhungChuongTrinhID = queryParams.get('KhungChuongTrinhID');

    const [tieuChuan, setTieuChuan] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTieuChuan = async () => {
        try {
            const result = await getTieuChuanWithMaCtdt(KhungChuongTrinhID);
            setTieuChuan(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTieuChuan();
    }, []);
    return (
        <div className="content" style={{ background: "white", margin: '20px' }}>
            <p className='text-center' style={{fontSize : '20px'}}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH <span style={{color : colors.secondary}}>CTĐT Công nghệ Kỹ thuật máy tính 2017</span></b></p>
            <TableContainer  component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow >
                            <CustomTableHeadCell width={250}>Tiêu chuẩn/ <br/>Tiêu chí</CustomTableHeadCell>
                            <CustomTableHeadCell width={250}>Yêu cầu của tiêu chí</CustomTableHeadCell>
                            <CustomTableHeadCell width={250}>Mốc chuẩn để tham chiếu để đánh giá tiêu chí đạt mức 4</CustomTableHeadCell>
                            <CustomTableHeadCell width={250}>Các gợi ý bắt buộc</CustomTableHeadCell>
                        </TableRow>
                    </TableHead>
                    {tieuChuan.map((row, index) => (
                    <TableBody>

                            <TableRow>
                                <TableCell style={{backgroundColor : colors.grayColorLess, fontSize : '16px'}} colSpan={4}><b>Tiêu chuẩn {index+1}. {row.tenTieuChuan}</b></TableCell>
                            </TableRow>
                            <ListTieuChi idTieuChuan={row.idTieuChuan} stt = {index + 1} />
                    </TableBody>
                    ))}
                </Table>
            </TableContainer>

        </div>
    );
};

export default ListStandard;