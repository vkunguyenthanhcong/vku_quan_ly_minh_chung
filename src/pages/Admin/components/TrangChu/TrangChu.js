import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

const TrangChu = () => {
    const navigate = useNavigate();
    const goToChuanKiemDinh = () => {
        navigate('chuan-kiem-dinh');
    }
    const goToChuongTrinhDaoTao = () => {
        navigate('chuong-trinh-dao-tao')
    }
    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <p>QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
            <hr/>
            <button className='btn btn-success' onClick={goToChuanKiemDinh}>Quản lý</button>
            <br/><br/>
            <p>QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO</p>
            <hr/>
            <button className='btn btn-success' onClick={goToChuongTrinhDaoTao}>Quản lý</button>
            <button className='btn btn-primary'>Thêm</button>
            <br/><br/>
            <p>QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
            <hr/>
            <button className='btn btn-success'>Quản lý</button>
        </div>
    )
}
export default TrangChu;