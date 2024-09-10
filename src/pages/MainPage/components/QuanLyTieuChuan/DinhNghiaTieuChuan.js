
import React, { useEffect, useState } from 'react';
import './DinhNghiaTieuChuan.css'
import { styled } from '@mui/material/styles';
import colors from '../../../../components/color';
import font from '../../../../components/font'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getKdclData, getCtdtDataByMaKDCL } from '../../../../services/apiServices'
import { useNavigate } from 'react-router-dom';

const GenericList = ({ maKdcl }) => {
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleButtonClick = (maCtdt) => {
        navigate(`../tieu-chuan?KhungChuongTrinh_ID=${maCtdt}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCtdtDataByMaKDCL(maKdcl);
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [maKdcl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <ul>
            {data.map((item, index) => (
                <li style={{marginBottom : '20px', marginTop : '20px'}} key={index}><button onClick={() => handleButtonClick(item.maCtdt, item.tenCtdt)} className='btn btn-success'>{item.tenCtdt}</button></li>
            ))}
        </ul>
    );
};
const DinhNghiaTieuChuan = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataFromAPI = async () => {
            try {
                const result = await getKdclData();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataFromAPI();
    }, []);
    return (
        <div className="content" style={{ background: "white", margin: '20px' }}>
            <style>
                {`
                th{
                    color:white !important;
                }
                `}
            </style>
            <p style={{ fontSize: '20px' }}>DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
            <hr />
            
            <TableContainer  component={Paper}>
                <Table className='font-Inter'>
                    <TableHead>
                        <TableRow >
                            <TableCell >STT</TableCell>
                            <TableCell>Tên Chuẩn đánh giá</TableCell>
                            <TableCell>Năm áp dụng</TableCell>
                            <TableCell>Tên Chương Trình Đào Tạo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.tenKdcl}</TableCell>
                                <TableCell>{row.namBanHanh}</TableCell>
                                <TableCell><GenericList maKdcl={row.maKdcl}/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DinhNghiaTieuChuan;