// src/components/ChuanKiemDinh.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getThongTinCTDT, getTieuChuanWithMaCtdt } from '../../../../services/apiServices';
import {useLocation, useNavigate} from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px'
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  color : 'white !important'
}));;

const ChuongTrinhDaoTao = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [tieuChuan, setTieuChuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const KhungCTDT_ID = queryParams.get('KhungCTDT_ID');

  const handleClick = (idTieuChuan) => {
    navigate(`../tieu-chi?KhungCTDT_ID=${KhungCTDT_ID}&TieuChuan_ID=${idTieuChuan}`);
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      setLoading(true);
      try {
        const [result, result_1] = await Promise.all([
          getThongTinCTDT(KhungCTDT_ID),
          getTieuChuanWithMaCtdt(KhungCTDT_ID)
        ]);
        setData(result);
        setTieuChuan(result_1);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataFromAPI();
  }, [KhungCTDT_ID]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="content bg-white m-3 p-4">
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>{item.tenCtdt}</b></p>
            <p>
              - Chuẩn đánh giá ĐBCL:
              <button style={{ color: 'white', background: 'gray', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>
                <b>{item.tenKdcl}</b>
              </button>
            </p>
            <p>
              - Thuộc Khoa: <b>{item.tenKhoa}</b>
            </p>
            <p>
              Web <b>{item.web}</b> - Email <b>{item.email}</b> - Điện thoại <b>{item.soDienThoai}</b>
            </p>
            <p>
              - Thuộc Ngành: <b>{item.tenNganh}</b>
            </p>
            <p>
              - Thuộc Trình độ: <b>{item.trinhDo}</b>
            </p>
            <p>
              - Số tín chỉ áp dụng: <b>{item.soTinChi}</b>
            </p>
          </div>
        ))
      ) : (
        <p>Trường Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn</p>
      )}
      <TableContainer>
        <Table className='font-Inter'>
          <TableHead>
            <TableRow >
              <CustomTableHeadCell>STT</CustomTableHeadCell>
              <CustomTableHeadCell>Tiêu Chuẩn</CustomTableHeadCell>
              <CustomTableHeadCell>Minh Chứng</CustomTableHeadCell>
              <CustomTableHeadCell>Số lượng minh chứng đã thu thập</CustomTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tieuChuan.map((row, index) => (
              <TableRow key={row.id}>
                <CustomTableCell>{index + 1}</CustomTableCell>
                <CustomTableCell>{row.tenTieuChuan}</CustomTableCell>
                <CustomTableCell><button onClick={() => handleClick(row.idTieuChuan)} className='btn btn-light text-white'>Quản lý minh chứng</button></CustomTableCell>
                <CustomTableCell><b>{row.total}</b> minh chứng</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    
  );
};

export default ChuongTrinhDaoTao;
