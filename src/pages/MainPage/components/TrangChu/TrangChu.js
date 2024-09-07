
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getKdclData, getCtdtDataByMaKDCL } from '../../../../services/apiServices';
import { useNavigate } from 'react-router-dom';
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px'
}));

const CustomTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  color : 'white !important'
}));;

const TrangChu = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //danh sach chuan kiem dinh chat luong
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
  

  //danh sach chuong trinh dao tao
  const GenericList = ({ maKdcl}) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const handleButtonClick = (maCtdt) => {
      navigate(`chuong-trinh-dao-tao?KhungCTDT_ID=${maCtdt}`);
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
    return (
      <ul>
        {data.map((item, index) => (
          <li style={{marginBottom : '20px', marginTop : '20px'}} key={index}><button onClick={() => handleButtonClick(item.maCtdt, item.tenCtdt)} className='btn btn-primary'>{item.tenCtdt}</button></li>
        ))}
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
            <TableRow >
              <CustomTableHeadCell>STT</CustomTableHeadCell>
              <CustomTableHeadCell>Tên Chuẩn đánh giá</CustomTableHeadCell>
              <CustomTableHeadCell>Năm áp dụng</CustomTableHeadCell>
              <CustomTableHeadCell>Tên CTĐT</CustomTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id}>
                <CustomTableCell>{index + 1}</CustomTableCell>
                <CustomTableCell>{row.tenKdcl}</CustomTableCell>
                <CustomTableCell>{row.namBanHanh}</CustomTableCell>
                <CustomTableCell><GenericList maKdcl={row.maKdcl}/></CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TrangChu;