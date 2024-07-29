// src/components/MainContent.js
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';


const ChuongTrinhDaoTao = () => {
//   const Table = ({ columns, data }) => {
//     const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
//       columns,
//       data
//     });

//     return (
//       <table {...getTableProps()}>
//         <thead>
//           {headerGroups.map(headerGroup => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map(column => (
//                 <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {rows.map(row => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map(cell => (
//                   <td {...cell.getCellProps()}>
//                     {cell.column.id === 'ten' ? (
//                       <ul>
//                         {cell.value.map((item, index) => (
//                           <li key={index}><button className='btn-color btn'>{item}</button></li>
//                         ))}
//                       </ul>
//                     ) : (
//                       cell.render('Cell')
//                     )}
//                   </td>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     );
//   };
//   const data = [
//     { stt: 1, tencdg: 'Thông tư 04/2016/TT-BGDĐT', nam: 'Từ năm học 2017', ten: ['CTĐT Công nghệ Kỹ thuật máy tính 2017', 'CTĐT Công nghệ Thông tin 2017', 'CTĐT Quản trị kinh doanh 2017'] },
//     { stt: 2, tencdg: 'AUV VER 4.0', nam: 'Từ năm học 2017', ten: ['CTĐT Công nghệ Kỹ thuật máy tính 2017', 'CTĐT Công nghệ Thông tin 2017', 'CTĐT Quản trị kinh doanh 2017'] },
//   ];

//   const columns = [
//     { Header: 'STT', accessor: 'stt' },
//     { Header: 'Tên Chuẩn đánh gía', accessor: 'tencdg' },
//     { Header: 'Năm áp dụng', accessor: 'nam' },
//     { Header: 'Tên CTĐT', accessor: 'ten' }
//   ];

const [isMenuExpanded, setMenuExpanded] = useState(true);
const [isSidebarVisible, setSidebarVisible] = useState(true);
const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 576);

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

return (
  <Container fluid style={{color:'#73879C'}}>
    <Row>
      <Col
        md={isMenuExpanded ? 2 : 1}
        xs = {2}
        style={{paddingTop : '10px'}}
        className={isScreenSmall ? isMenuExpanded ? 'menu-col nopadding' : 'd-none' : isMenuExpanded ? 'menu-col' : 'menu-col'}
      >
        <Sidebar isMenuExpanded={isMenuExpanded} toggleMenuWidth={toggleMenuWidth} isScreenSmall={isScreenSmall} />
      </Col>

      <Col md={isMenuExpanded ? 10 : 11} xs = {isMenuExpanded ? 10 : 12} className="content-col nopadding" style={{background : '#E6E9ED68'}}>
        <Navbar toggleMenuWidth={toggleMenuWidth}/>
        <div className="content" style={{ background: "white", margin: '20px' }}>
          <p style={{ fontSize: '20px' }}>Giới thiệu khung chương trình <b>CTĐT Công nghệ kỹ thuật máy tính 2017</b></p>
          <p>- Chuẩn đánh giá ĐBCL: <button style={{color : 'white', background : 'gray', border : 'none', borderRadius : '10px'}}><b>Thông tư 04/2016/TT-BGDĐT</b></button></p>
          <p>Thuộc Khoa: <b></b></p>
        </div>
      </Col>
    </Row>
  </Container>
);
};

export default ChuongTrinhDaoTao;
