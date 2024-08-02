
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import Navbar from '../../../../components/Navbar/Navbar';
import './TieuChuan.css'
import useQuery from '../../../../utils/useQuery';
import { getAllTieuChiWithIdTieuChuan, getAllGoiYWithIdTieuChi } from '../../../../services/apiServices'

const TieuChuan = () => {
  const query = useQuery();
  const tenCtdt = query.get('ctdt');
  const tenTC = query.get('tenTC');

  const stt = query.get('stt');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idTieuChuan = query.get('idTieuChuan');
  const [data, setData] = useState([]);
  const [goiy, setGoiY] = useState([]);
  const [isMenuExpanded, setMenuExpanded] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 576);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const result = await getAllTieuChiWithIdTieuChuan(idTieuChuan);
        setData(result);
        try {
          const result_1 = await getAllGoiYWithIdTieuChi(result[0]['idTieuChi']);
          console.log(result_1);
          setGoiY(result_1);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDataFromAPI();

  }, []);

  const toggleMenuWidth = () => {
    setMenuExpanded(!isMenuExpanded)
  };

  const handleResize = () => {
    setIsScreenSmall(window.innerWidth < 576);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Tiêu chuẩn/Tiêu chí',
        accessor: 'tenTieuChi',
        Cell: ({ row }) => (
          <>
            <b style={{ fontSize: '18px' }}>{stt}.{row.index + 1}. </b>
            <span>{row.original.tenTieuChi}</span>
          </>
        ),
      },
      {
        Header: 'Yêu cầu của tiêu chí',
        accessor: 'yeuCau',
      },
      {
        Header: 'Mốc chuẩn tham chiếu để đánh giá mức 4',
        accessor: 'mocChuan',

      },
      {
        Header: 'Gợi ý nguồn minh chứng',
        accessor: 'count',
        Cell: ({ row }) => (
          <>
          
          </>
        ),
      },
      {
        Header: 'Minh chứng',
        accessor: '',
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
          <tr>
            <td colSpan={5} style={{ background: '#E0E0E0', fontSize: '20px' }}>
              <p><b>Tiêu chuẩn {stt} : {tenTC}</b></p>
            </td>
          </tr>,
          {rows.map(row => {
            prepareRow(row);
            return (

              <tr  {...row.getRowProps()}>

                {row.cells.map(cell => (
                  <td  {...cell.getCellProps()}>
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
  const Table_1 = ({ data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      data
    });

    return (
      <table {...getTableProps()}>

        <tbody {...getTableBodyProps()}>
          <tr>
            <td colSpan={5} style={{ background: '#E0E0E0', fontSize: '20px' }}>
              <p><b>Tiêu chuẩn {stt} : {tenTC}</b></p>
            </td>
          </tr>,
          {rows.map(row => {
            prepareRow(row);
            return (

              <tr  {...row.getRowProps()}>

                {row.cells.map(cell => (
                  <td  {...cell.getCellProps()}>
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
          <div className='content' >
            <div>
              <p style={{ fontSize: '20px', textAlign: 'center' }}><b>CHƯƠNG TRÌNH ĐÀO TẠO NGÀNH </b><b style={{ color: 'green' }}>{tenCtdt}</b></p>
            </div>
          </div>
          <Table columns={columns} data={data} />
        </Col>
      </Row>
    </Container>
  );
};

export default TieuChuan;
