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
    const goToQuanLyKhoa = () => {
        navigate('khoa')
    }
    const goToQuanLyNganh = () => {
        navigate('nganh')
    }
    return (
        <div className="content bg-white p-4 m-3">
        <style>
                {
                    `.btn {
                          font-size : 14px;
                          padding-top : 12px;
                          padding-bottom : 12px;
                        }
                        `
                }
            </style>
            <h5 className="text-center fw-bold mb-4">QUẢN LÝ HỆ THỐNG</h5>

            <div className="row g-4">
                {/* Quản lý Chuẩn Kiểm Định */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ CHUẨN KIỂM ĐỊNH CHẤT LƯỢNG</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToChuanKiemDinh}>
                            <i className="fas fa-users-cog me-2"></i>Quản lý và chia nhóm đánh giá
                        </button>
                    </div>
                </div>

                {/* Quản lý Chương Trình Đào Tạo */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToChuongTrinhDaoTao}>
                            <i className="fas fa-chalkboard-teacher me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Phòng Ban */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ PHÒNG BAN</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToQuanLyPhongBan}>
                            <i className="fas fa-building me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Giảng Viên */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ GIẢNG VIÊN</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToQuanLyGiangVien}>
                            <i className="fas fa-user-tie me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Khoa */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ KHOA</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToQuanLyKhoa}>
                            <i className="fas fa-briefcase me-2"></i>Quản lý
                        </button>
                    </div>
                </div>

                {/* Quản lý Nganh */}
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light">
                        <h6 className="fw-bold text-primary">QUẢN LÝ NGÀNH</h6>
                        <hr/>
                        <button className="btn btn-success w-100 text-uppercase fw-bold" onClick={goToQuanLyNganh}>
                            <i className="fas fa-book me-2"></i>Quản lý
                        </button>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default TrangChuAdmin;