// src/Homepage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HomePage.css';
import LogInForm from './Components/DangNhapForm/LogInForm';
import LoadingProcess from '../../components/LoadingProcess/LoadingProcess';

const Homepage = () => {
  useEffect(() => {
    document.title = 'Trang Chủ | VKU';
  },[])
  const [isLogInVisible, setIsLogInVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const showLogIn = () => setIsLogInVisible(true);
  const hideLogIn = () => setIsLogInVisible(false);

  return (
      <Container fluid style={{ height: '100vh' }}> 
      <LoadingProcess open={open}/>
        <LogInForm isVisible={isLogInVisible} setOpen={setOpen} onClose={hideLogIn} />
        <Row className="no-gutters h-100">
          <Col xs={12} md={8} className="text-white d-flex no-padding d-none d-md-flex">
            <div>
              <img
                  src={require('../../components/images/hinh_truong_VKU.jpg')}
                  alt="Trường Đại học Công nghệ thông tin và Truyền thông Việt - Hàn"
                  style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </Col>
          <Col xs={12} md={4} className="d-flex justify-content-center align-items-center shadow no-padding h-100">
            <div className="text-center">
              <img
                  src={require('../../components/images/logo2.png')}
                  alt="VKU University Logo"
                  style={{ width: '80%' }}
              />
              <br />
              <img
                  src={require('../../components/images/sict2.jpg')}
                  alt="SICT Department Building"
                  style={{ width: '80%' }}
              />
              <br />
              <Button variant="success" onClick={showLogIn}>
                <b>ĐĂNG NHẬP HỆ THỐNG TÁC NGHIỆP</b>
              </Button>
              <br />
              <Button className="btn-2">
                <b>HỆ THỐNG QUẢN LÝ ĐÀO TẠO</b>
              </Button>
              <br />
              <Button className="btn-2">
                <b>HỆ THỐNG HỌC TRỰC TUYẾN ELEARNING</b>
              </Button>
              <br />
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Homepage;
