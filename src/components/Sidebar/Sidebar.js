// src/components/Sidebar.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; // Import custom CSS for sidebar styling
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMenuExpanded, toggleMenuWidth, isScreenSmall }) => {
  const { logout } = useAuth();

  return (
    <div className={isScreenSmall ? "menu-scroll no-padding text-center" : "menu-scroll no-padding"} >
      <i className='fas fa-university' style={{ marginTop : '20px',fontSize: '26px', border: '1px solid white', padding: '5px', borderRadius: '50%'}}></i>
      <span className={isScreenSmall ? 'd-none' : ''} style={{ fontSize: '25px', marginLeft: '10px' }}>VKU!</span>
      <div className={isScreenSmall ? 'd-none' : isMenuExpanded ? '' : 'd-none'} style={{ marginTop: '25px', marginBottom: '25px' }}>
        <Row>
          <Col md={4}>
            <img className='avatar-circle' src={'https://daotao.vku.udn.vn/uploads/sinhvien/20IT199.jpg'} style={{ maxHeight: '100px', border: '5px solid white' }} />
          </Col>
          <Col md={8} className='text-left align-content-center'>
            <span>Xin chào,</span><br />
            <p>Nguyễn Thành Công</p>
            <Link style={{color : '#EDEDED9B', textDecoration : 'none',}} onClick={logout}>Thoát</Link>
          </Col>
        </Row>
      </div>

      <div className={isScreenSmall ? 'text-center' : ''} style={{ fontSize: '16px', marginTop: '20px' }}>

        <ul className='list-style responsive-text'>
          <p className={isScreenSmall ? 'd-flex align-items-center justify-content-center' : isMenuExpanded ? '' : 'd-flex align-items-center justify-content-center'} ><i className='fas fa-university' style={{ fontSize: '20px', marginRight : isScreenSmall ? '' : isMenuExpanded ? '10px' : '0px' }}></i><b className='text-center' style={{fontSize: '16px' }}>ĐẢM BẢO CHẤT LƯỢNG</b></p>
          <br/>
          <li className={isScreenSmall ? 'd-flex align-items-center justify-content-center' : isMenuExpanded ? '' : 'd-flex align-items-center justify-content-center'}><i className='fas fa-graduation-cap'></i> <span className='text-center'><Link style={{textDecoration: 'none', color: 'white'}} to={'/quan-ly'}>Quản lý tiêu chuẩn</Link></span></li>
          <li className={isScreenSmall ? 'd-flex align-items-center justify-content-center' : isMenuExpanded ? '' : 'd-flex align-items-center justify-content-center'}><i className='fas fa-graduation-cap'></i> <span className='text-center'>Báo cáo tự đánh giá</span></li>
        </ul>
      </div>
    </div>

  );
};
export default Sidebar;
