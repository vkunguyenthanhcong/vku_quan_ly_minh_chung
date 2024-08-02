// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import {getThongTinCTDT, getTieuChuanWithMaCtdt, getMinhChung } from '../../apiServices'
import useQuery from '../../useQuery';
import { useNavigate } from 'react-router-dom';
import './ChuongTrinhDaoTao.css'

const ChuongTrinhDaoTao = () => {
  const query = useQuery();
  const ctdt = query.get('ctdt');
  const tenCtdt = query.get('tenCtdt');
  const [data, setData] = useState([]);
  const [ tieuChuan, setTieuChuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuExpanded, setMenuExpanded] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 576);
  const navigate = useNavigate();
  const handleClick = (rowData, rowIndex) => {
    navigate(`/tieuchuan?idTieuChuan=${rowData.idTieuChuan}&ctdt=${tenCtdt}&tenTC=${rowData.tenTieuChuan}&stt=${rowIndex+1}`);
  };
  const toggleMenuWidth = () => {
    setMenuExpanded(!isMenuExpanded)
  };

  const handleResize = () => {
    setIsScreenSmall(window.innerWidth < 576);
  };
  useEffect(() => {
    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Automatically hide sidebar on small screens
    if (isScreenSmall) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [isScreenSmall]);
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getThongTinCTDT(ctdt);
        setData(result);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, []);
  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const tieuChuanData = await getTieuChuanWithMaCtdt(ctdt);
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
  const columns = React.useMemo(
    () => [
        {
          Header: 'STT',
          accessor: (row, index) => index + 1, // Accessor function for row number
        },
        {
            Header: 'Tiêu chuẩn',
            accessor: 'tenTieuChuan',
        },
        {
            Header: 'Minh chứng',
            accessor: 'idTieuChuan',
            Cell: ({ row }) => (
              <button onClick={() =>handleClick(row.original, row.index)} className='btn btn-success'>
                Quản lý minh chứng
              </button>
            ),
        },
        {
          Header: 'Số lượng minh chứng đã thu thập',
          accessor: 'count',
          Cell: ({ value }) => (
            <p>{value} minh chứng</p>
          ),
      },
    ],
    []
);
const Table = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()}>
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => (
              <td {...cell.getCellProps()}>
                {cell.render('Cell')}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
  );
};
return (
    <Container fluid style={{ color: '#73879C' }}>
      <Row>
        <Col
          md={isMenuExpanded ? 2 : 1}
          xs={2}
          style={{ paddingTop: '10px' }}
          className={isScreenSmall ? isMenuExpanded ? 'menu-col nopadding' : 'd-none' : isMenuExpanded ? 'menu-col' : 'menu-col'}
        >
          <Sidebar isMenuExpanded={isMenuExpanded} toggleMenuWidth={toggleMenuWidth} isScreenSmall={isScreenSmall} />
        </Col>

        <Col md={isMenuExpanded ? 10 : 11} xs={isMenuExpanded ? 10 : 12} className="content-col nopadding" style={{ background: '#E6E9ED68' }}>
          <Navbar toggleMenuWidth={toggleMenuWidth} />
          <div className="content" style={{ background: "white", margin: '20px', padding: '20px' }}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <div key={index}>
                  <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>{tenCtdt}</b></p>
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
          </div>
          <div className='content' >
            <Table columns={columns} data={tieuChuan} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChuongTrinhDaoTao;
