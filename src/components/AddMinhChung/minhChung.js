import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import font from '../font';
import './minhChung.css';
import {useNavigate} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
const MinhChung = () =>{
    const addMinhChung = JSON.parse(localStorage.getItem('addMinhChung'));
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/quan-ly/them-minh-chung');
    }
    return (
        <div className="content" style={{background: "white", margin: '20px', padding: '20px'}}>
            <p style={{fontSize: '20px'}}>Tìm kiếm minh chứng cho Tiêu Chuẩn Mục tiêu và chuẩn đầu ra của chương trình
                đào tạo</p>
            <button className='btn btn-success'>Quản lý minh chứng</button>
            <button onClick={handleClick} className='btn btn-success' style={{marginLeft : '20px'}}>Thêm minh chứng</button>
            <br/>
            <br/>
            <Row>
                <Col xs = {12} md = {6}>
                    <TableContainer component={Paper}>
                        <Table className='font-Inter'>
                            <TableBody>
                                <TableRow >
                                    <TableCell className='text-black' style={{backgroundColor:'#DEF3FE'}}><b>Số văn bản</b></TableCell>
                                    <TableCell ><input className='form-control' type="text"/></TableCell>
                                    <TableCell className='text-black' style={{backgroundColor:'#DEF3FE'}}><b>Trích dẫn</b></TableCell>
                                    <TableCell><input className='form-control' type="text"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='text-black' style={{backgroundColor:'#DEF3FE'}}><b>Ngày ban hành</b></TableCell>
                                    <TableCell><span>Từ ngày</span><input className='form-control' type="date"/><br/>
                                        <span>Đến ngày</span><input className='form-control' type="date"/>
                                    </TableCell>
                                    <TableCell className='text-black' style={{backgroundColor:'#DEF3FE'}}><b>Loại văn bản</b></TableCell>
                                    <TableCell>
                                        <select className='form-select' name="" id="">
                                        <option value="">--Vui lòng chọn--</option>
                                    </select></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button style={{width : '100%'}} className='btn btn-primary'>Tìm kiếm</button>
                    <hr style={{border : '1px solid black'}}/>
                </Col>
                <Col xs={12} md={6}>
                    <p>Minh chứng đang có</p>
                    <p><b>- Tên tiêu chí: </b>{addMinhChung.tenTieuChi} </p>
                    <p><b>- Nguồn minh chứng: </b>{addMinhChung.tenGoiY}</p>
                    <br/>
                    <TableContainer component={Paper}>
                        <Table className='font-Inter'>
                            <TableHead style={{backgroundColor : 'transparent'}}>
                                <TableRow>
                                    <TableCell>
                                        Mã
                                    </TableCell>
                                    <TableCell>
                                        Tên minh chứng
                                    </TableCell>
                                    <TableCell>
                                        Tùy chọn
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
            </Row>
        </div>
    );
}
export default MinhChung;
