// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getThongTinCTDT, getTieuChuanWithMaCtdt, getMinhChung } from '../../services/apiServices';
import { useNavigate } from 'react-router-dom';
import './CtdtPage.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import font from '../font'

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  fontFamily : font.inter 
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  color : 'white !important',
  fontFamily : font.inter 
}));;

const ChuongTrinhDaoTao = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ tieuChuan, setTieuChuan] = useState([]);
  const [error, setError] = useState(null);
  const transfer = JSON.parse(localStorage.getItem('data'));
  const handleClick = (idTieuChuan, tenTieuChuan, stt) => {
    const transfer = { idTieuChuan: idTieuChuan, tenTieuChuan : tenTieuChuan, stt : stt};
    localStorage.setItem('tieuChuan', JSON.stringify(transfer));
    navigate(`../tieu-chi`);
  };
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const tieuChuanData = await getTieuChuanWithMaCtdt(transfer.maCtdt);
        const minhChungData = await getMinhChung();
        const countMap = minhChungData.reduce((acc, item) => {
          const idTieuChuan = item.idTieuChuan;
          acc[idTieuChuan] = (acc[idTieuChuan] || 0) + 1;
          return acc;
        }, {});
        const updatedJsonArray2 = tieuChuanData.map(item => {
          return {
            ...item,
            count: countMap[item.idTieuChuan] || 0
          };
        });
        setTieuChuan(updatedJsonArray2);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDataFromAPI();
  }, []);
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getThongTinCTDT(transfer.maCtdt);
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
    <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>{}</b></p>
            <p>
              - Chuẩn đánh giá ĐBCL:
              <button style={{ color: 'white', background: 'gray', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>
                <b>{item.ten_kdcl}</b>
              </button>
            </p>
            <p>
              - Thuộc Khoa: <b>{item.ten_khoa}</b>
            </p>
            <p>
              Web <b>{item.web}</b> - Email <b>{item.email}</b> - Điện thoại <b>{item.sdt}</b>
            </p>
            <p>
              - Thuộc Ngành: <b>{item.ten_nganh}</b>
            </p>
            <p>
              - Thuộc Trình độ: <b>{item.trinhdo}</b>
            </p>
            <p>
              - Số tín chỉ áp dụng: <b>{item.sotinchi}</b>
            </p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
      <TableContainer  component={Paper}>
        <Table className='font-Inter'>
          <TableHead>
            <TableRow >
              <CustomTableHeadCell >STT</CustomTableHeadCell>
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
                <CustomTableCell><button onClick={() => handleClick(row.idTieuChuan, row.tenTieuChuan, index + 1)} className='btn btnMinhChung'>Quản lý minh chứng</button></CustomTableCell>
                <CustomTableCell><b>{row.count}</b> minh chứng</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    
  );
};

export default ChuongTrinhDaoTao;
