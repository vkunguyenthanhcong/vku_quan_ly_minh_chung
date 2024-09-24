// src/components/ChuanKiemDinh.js
import React, { useEffect, useState, memo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getThongTinCTDT, getTotalMinhChungWithTieuChuan } from '../../../../services/apiServices';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px'
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  color: 'white !important'
}));;
const TotalMinhChung = memo(({ idTieuChuan }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTotalMinhChungWithTieuChuan(idTieuChuan);
        setTotal(response);
      } catch (error) {
        setError('Could not fetch total.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idTieuChuan]);

  if (loading) return <CustomTableCell>Loading...</CustomTableCell>;
  if (error) return <CustomTableCell>{error}</CustomTableCell>;

  return (
    <CustomTableCell><b>{total}</b> minh chứng</CustomTableCell>
  );
});

const ChuongTrinhDaoTao = () => {
  const navigate = useNavigate();
  const [chuongTrinhDaoTao, setChuongTrinhDaoTao] = useState(null);
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
        const response = await getThongTinCTDT(KhungCTDT_ID);
        setChuongTrinhDaoTao(response);
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

      <div>
        <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>{chuongTrinhDaoTao ? chuongTrinhDaoTao.tenCtdt : 'Loading...'}</b></p>
        <p>
          - Chuẩn đánh giá ĐBCL:
          <button style={{ color: 'white', background: 'gray', border: 'none', borderRadius: '10px', padding: '5px 10px' }}>
            <b>{chuongTrinhDaoTao.chuanKdcl.tenKdcl}</b>
          </button>
        </p>
        {chuongTrinhDaoTao.khoa && chuongTrinhDaoTao.khoa.tenKhoa && (
          <p>
            - Thuộc Khoa: <b>{chuongTrinhDaoTao.khoa.tenKhoa}</b>
          </p>
        )}

        {chuongTrinhDaoTao.khoa && (
          <p>
            Web <b>{chuongTrinhDaoTao.khoa.web || ''}</b> -
            Email <b>{chuongTrinhDaoTao.khoa.email || ''}</b> -
            Điện thoại <b>{chuongTrinhDaoTao.khoa.sdt || ''}</b>
          </p>
        )}

        {chuongTrinhDaoTao.nganh && chuongTrinhDaoTao.nganh.tenNganh && (
          <p>
            - Thuộc Ngành: <b>{chuongTrinhDaoTao.nganh.tenNganh}</b>
          </p>
        )}

        {chuongTrinhDaoTao.nganh && chuongTrinhDaoTao.nganh.trinhDo && (
          <p>
            - Thuộc Trình độ: <b>{chuongTrinhDaoTao.nganh.trinhDo}</b>
          </p>
        )}

        {chuongTrinhDaoTao.soTinChi != null && chuongTrinhDaoTao.soTinChi != 0 && (
          <p>
            - Số tín chỉ áp dụng: <b>{chuongTrinhDaoTao.soTinChi}</b>
          </p>
        )}
      </div>
      <TableContainer>
        <Table className='font-Inter'>
          <TableHead>
            <TableRow id='table-row-color'>
              <CustomTableHeadCell>STT</CustomTableHeadCell>
              <CustomTableHeadCell>Tiêu Chuẩn</CustomTableHeadCell>
              <CustomTableHeadCell>Minh Chứng</CustomTableHeadCell>
              <CustomTableHeadCell>Số lượng minh chứng đã thu thập</CustomTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chuongTrinhDaoTao ? (chuongTrinhDaoTao.tieuChuan.map((row, index) => (
              <TableRow key={row.id}>
                <CustomTableCell>{index + 1}</CustomTableCell>
                <CustomTableCell>{row.tenTieuChuan}</CustomTableCell>
                <CustomTableCell><button onClick={() => handleClick(row.idTieuChuan)} className='btn btn-light text-white'>Quản lý minh chứng</button></CustomTableCell>
                <TotalMinhChung idTieuChuan={row.idTieuChuan} />
              </TableRow>
            ))) : 'Loading...'}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  );
};

export default ChuongTrinhDaoTao;
