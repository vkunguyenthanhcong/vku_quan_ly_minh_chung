// src/components/Navbar.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { Button } from 'react-bootstrap';

const Navbar = ({ toggleMenuWidth }) => {
  const currentYear = new Date().getFullYear();
  return (
    <div className='nav-menu' style={{paddingTop : '10px', paddingBottom : '10px'}}>
      <ul className='d-flex justify-content-end align-items-center' style={{marginRight : '50px', flexWrap : 'wrap'}}>
        <li className='nav-item-left'>
          <Button className='toggle-icon' onClick={toggleMenuWidth}>
            <i className='fas fa-bars'></i>
          </Button>
        </li>
        <li className='pc-margin-right' style={{padding : '10px', fontSize : '14px'}}><img style={{width: '29px', marginRight : '10px', maxHeight : '29px', borderRadius : '50%'}} src={'https://daotao.vku.udn.vn/uploads/sinhvien/20IT199.jpg'}/><span>Nguyễn Thành Công</span> </li>
        <li className=''  style={{padding : '10px', fontSize : '14px'}}><span>Năm {currentYear}</span></li>
      </ul>
    </div>
  );
};
export default Navbar;