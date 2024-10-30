
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {getKdclData, getCtdtDataByMaKDCL, getAllChuongTrinhDaoTao} from '../../../../services/apiServices';
import { useNavigate, useLocation } from 'react-router-dom';

//danh sach chuong trinh dao tao

const TrangChu = () => {
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');
    const [chuanKdcl, setChuanKdcl] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //danh sach chuan kiem dinh chat luong
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getKdclData();
        setChuanKdcl(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataFromAPI();
  }, []);
  const GenericList = ({ maKdcl }) => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const handleButtonClick = (maCtdt) => {
      if(action === "QuanLyTieuChuan"){
        navigate(`chuong-trinh-dao-tao?KhungCTDT_ID=${maCtdt}`);
      }else if(action === "DinhNghiaTieuChuan"){
        navigate(`tieu-chuan?KhungCTDT_ID=${maCtdt}`);
      }else if(action === "BaoCaoTuDanhGia"){
        navigate(`bao-cao-tu-danh-gia?KhungCTDT_ID=${maCtdt}`);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await getAllChuongTrinhDaoTao();
          const filteredData = result.filter(item => item.chuanKdcl && item.chuanKdcl.maKdcl === maKdcl);
          setData(filteredData)
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
    return (
        <ul>
          {data ? data.map((item, index) => (
              <li style={{marginBottom : '20px', marginTop : '20px', listStyleType : 'none'}} key={index}><button onClick={() => handleButtonClick(item.maCtdt, item.tenCtdt)} className='btn btn-primary'>{item.tenCtdt}</button></li>
          )) : ('')}
        </ul>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="content" style={{ background: "white", margin: '20px' }}>
      <p style={{ fontSize: '20px' }}>DANH SÁCH CÁC CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
      <hr />
      <TableContainer  component={Paper}>
        <Table className='font-Inter'>
          <TableHead>
            <TableRow id='table-row-color'>
              <TableCell className='text-white'>STT</TableCell>
              <TableCell className='text-white'>Tên Chuẩn đánh giá</TableCell>
              <TableCell className='text-white'>Năm áp dụng</TableCell>
              <TableCell className='text-white'>Tên CTĐT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chuanKdcl.map((row, index) => (
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

export default TrangChu;