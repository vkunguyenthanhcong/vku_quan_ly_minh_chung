// src/Homepage.js
import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import LogInForm from './Components/DangNhapForm/LogInForm';
import useAuth from '../../services/useAuth';


const Homepage = () => {
  useAuth();
  const [isLogInVisiable, setIsLogInVisiable] = useState(false);

  const showLogIn = () => setIsLogInVisiable(true);
  const hideLogIn = () => setIsLogInVisiable(false);

  const navigate = useNavigate();
  return (
    <Container fluid style={{ height: '100vh' }}>
      <LogInForm isVisible={isLogInVisiable} onClose={hideLogIn} />
      <Row className="no-gutters h-100">
        <Col xs={12} md={8} className="text-white d-flex no-padding">
          <div>
            <img src={'https://my.vku.udn.vn/public/images/hinh_truong_VKU.jpg'} width="100%" height="" />
          </div>
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center align-items-center shadow no-padding h-100">
          <div className="text-center">
            <img src={'https://my.vku.udn.vn/images/logo2.png'} width='80%' /><br />
            <img src={'https://my.vku.udn.vn/public/images/sict2.jpg'} width='80%' /><br />
             <Button variant="success" onClick={showLogIn}><b>ĐĂNG NHẬP HỆ THỐNG TÁC NGHIỆP</b></Button><br />
            <Button className='btn-2'><b>HỆ THỐNG QUẢN LÝ ĐÀO TẠO</b></Button><br />
            <Button className='btn-2'><b>HỆ THỐNG HỌC TRỰC TUYẾN ELEARNING</b></Button><br />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;
