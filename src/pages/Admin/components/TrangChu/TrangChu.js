import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrangChuAdmin = () => {
    const navigate = useNavigate();
    const goToChuanKiemDinh = () => {
        navigate('chuan-kiem-dinh');
    }
    const goToChuongTrinhDaoTao = () => {
        navigate('chuong-trinh-dao-tao')
    }
    const goToQuanLyPhongBan = () => {
        navigate('quan-ly-phong-ban')
    }
    return (
        <div className="content" style={{ background: "white", margin: "20px" }}>
            <div>
                <p>QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
                <hr />
                <button className='btn btn-success' onClick={goToChuanKiemDinh}>Quản lý</button>
            </div>

            <div className="mt-4">
                <p>QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO</p>
                <hr />
                <button style={{ marginRight: '10px' }} className='btn btn-success' onClick={goToChuongTrinhDaoTao}>Quản lý</button>
                <button className='btn btn-primary'>Thêm</button></div>

            <div className="mt-4">
                <p>QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
                <hr />
                <button className='btn btn-success'>Quản lý</button>
            </div>

            <div className="mt-4">
                <p>QUẢN LÝ PHÒNG BAN</p>
                <hr />
                <button className='btn btn-success' onClick={goToQuanLyPhongBan}>Quản lý</button>
            </div>
                
        </div>
            
            
    )
}
export default TrangChuAdmin;