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
        <div className="content bg-white p-4 m-3">
            <h5 className="text-center fw-bold mb-4">Quản lý</h5>

            <div className="row g-4">
                {/* Quản lý Chuẩn Kiểm Định */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</h6>
                        <hr/>
                        <button className="btn btn-success w-100" onClick={goToChuanKiemDinh}>
                            <i className="fas fa-users-cog me-2"></i>Quản lý và chia nhóm đánh giá
                        </button>
                    </div>
                </div>

                {/* Quản lý Chương Trình Đào Tạo */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO</h6>
                        <hr/>
                        <button className="btn btn-success w-100" onClick={goToChuongTrinhDaoTao}>
                            <i className="fas fa-chalkboard-teacher me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Phòng Ban */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ PHÒNG BAN</h6>
                        <hr/>
                        <button className="btn btn-success w-100" onClick={goToQuanLyPhongBan}>
                            <i className="fas fa-building me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Giảng Viên */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ GIẢNG VIÊN</h6>
                        <hr/>
                        <button className="btn btn-success w-100" onClick={goToQuanLyGiangVien}>
                            <i className="fas fa-user-tie me-2"></i>Quản lý
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default TrangChuAdmin;