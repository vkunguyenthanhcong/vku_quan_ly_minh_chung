import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

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
    const goToQuanLyGiangVien = () => {
        navigate('quan-ly-giang-vien')
    }
    return (
        <div className="content" style={{background: "white", margin: "20px"}}>
            <div>
                <p>QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</p>
                <hr/>
                <button className='btn btn-success' onClick={goToChuanKiemDinh}>Quản lý và chia nhóm đánh giá</button>
            </div>

            <div className="mt-4">
                <p>QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO</p>
                <hr/>
                <button style={{marginRight: '10px'}} className='btn btn-success' onClick={goToChuongTrinhDaoTao}>Quản
                    lý
                </button>

            </div>
            <div className="mt-4">
                <p>QUẢN LÝ PHÒNG BAN</p>
                <hr/>
                <button className='btn btn-success' onClick={goToQuanLyPhongBan}>Quản lý</button>
            </div>

            <div className="mt-4">
                <p>QUẢN LÝ GIẢNG VIÊN</p>
                <hr/>
                <button className='btn btn-success' onClick={goToQuanLyGiangVien}>Quản lý</button>
            </div>

        </div>


    )
}
export default TrangChuAdmin;