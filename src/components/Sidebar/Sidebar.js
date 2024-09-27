// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css'; // Import custom CSS for sidebar styling
import { Link, useNavigate } from 'react-router-dom';
import { getThongTinDangNhap } from '../../services/apiServices';


const Sidebar = ({ isMenuExpanded, toggleMenuWidth, isScreenSmall }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getThongTinDangNhap(token);
        setUser(userData.user);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);
  const MenuItem = ({ to, label, isLink }) => (
    <li className={`${isScreenSmall || !isMenuExpanded ? 'd-flex align-items-center justify-content-center' : ''}`}>
      <i className="fas fa-graduation-cap" />
      <span className="text-center">
        {isLink ? (
          <Link style={{ textDecoration: 'none', color: 'white' }} to={to}>
            {label}
          </Link>
        ) : (
          label
        )}
      </span>
    </li>
  );
  
  const menuItems = [
    ...(role === "ADMIN" ? [{ to: '/admin', label: 'Quản lý', isLink: true }] : []), // Nếu role là "ADMIN", thêm mục vào mảng
    { to: '/quan-ly?action=QuanLyTieuChuan', label: 'Quản lý tiêu chuẩn', isLink: true },
    { to: '/quan-ly?action=DinhNghiaTieuChuan', label: 'Định nghĩa tiêu chuẩn', isLink: true },
    { to: '/quan-ly?action=BaoCaoTuDanhGia', label: 'Báo cáo tự đánh giá', isLink: true }
  ];
  
  return (
    <div className={`menu-scroll no-padding ${isScreenSmall ? 'text-center' : ''}`}>
      <i
        className='fas fa-university'
        style={{
          marginTop: '20px',
          fontSize: '26px',
          border: '1px solid white',
          padding: '5px',
          borderRadius: '50%'
        }}
      />
      {!isScreenSmall && (
        <span style={{ fontSize: '25px', marginLeft: '10px' }}>VKU!</span>
      )}

      <div className={isScreenSmall || !isMenuExpanded ? 'd-none' : ''} style={{ marginTop: '25px', marginBottom: '25px' }}>
        <Row>
          <Col md={4}>
            <img
              className='avatar-circle'
              src={user ? user.avatar : ''}
              style={{ maxHeight: '100px', border: '5px solid white' }}
              alt={user ? `${user.fullName}` : 'User Avatar'}
            />
          </Col>
          <Col md={8} className='text-left align-content-center'>
            <span>Xin chào,</span><br />
            {user && <p>{user.fullName}</p>}
            <Link style={{ color: '#EDEDED9B', textDecoration: 'none' }} onClick={Logout}>Thoát</Link>
          </Col>
        </Row>
      </div>

      <div className={`${isScreenSmall ? 'text-center' : ''}`} style={{ fontSize: '16px', marginTop: '20px' }}>
        <ul className='list-style responsive-text'>
          <p
            className={`${isScreenSmall || !isMenuExpanded ? 'd-flex align-items-center justify-content-center' : ''}`}
          >
            <i
              className='fas fa-university'
              style={{
                fontSize: '20px',
                marginRight: isScreenSmall || !isMenuExpanded ? '0px' : '10px'
              }}
            />
            <b className='text-center' style={{ fontSize: '16px' }}> ĐẢM BẢO CHẤT LƯỢNG</b>
          </p>
          <br />
          {menuItems.map((item, index) => (
            <MenuItem key={index} to={item.to} label={item.label} isLink={item.isLink}  />
          ))}
        </ul>
      </div>
    </div>


  );
};
export default Sidebar;