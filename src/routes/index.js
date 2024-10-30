import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../services/ProtectedRoute';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../pages/MainPage/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao';
import HomePage from '../pages/HomePage';
import TieuChi from '../pages/MainPage/components/TieuChi/TieuChi';
import MinhChung from "../pages/MainPage/components/MinhChung/minhChung";
import DanhSachTieuChuan from "../pages/MainPage/components/DanhSachTieuChuan/DanhSachTieuChuan";
import QuanLyMinhChung from "../pages/MainPage/components/QuanLyMinhChung/QuanLyMinhChung";
import ListEvidence from "../pages/ListEvidence";
import DanhSachMinhChung from '../pages/MainPage/components/DanhSachMinhChung/DanhSachMinhChung';

import TrangChu from '../pages/MainPage/components/TrangChu/TrangChu';
//admin
import ChuanKiemDinh from "../pages/Admin/components/ChuanKiemDinhChatLuong/ChuanKiemDinh";
import AdminChuongTrinhDaoTao from "../pages/Admin/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao";

import Admin from "../pages/Admin";
import TrangChuAdmin from "../pages/Admin/components/TrangChu/TrangChu";
import ChiTietChuongTrinhDaoTao from '../pages/Admin/components/ChiTietiChuongTrinhDaoTao/ChiTietChuongTrinhDaoTao';
import BaoCaoTuDanhGia from '../pages/MainPage/components/BaoCaoTuDanhGia/BaoCaoTuDanhGia';
import PhongBan from '../pages/Admin/components/QuanLyPhongBan/PhongBan';
import PhanCongBaoCao from '../pages/Admin/components/PhanCongBaoCao/PhanCongBaoCao';
import VietBaoCao from '../pages/MainPage/components/VietBaoCao/VietBaoCao';
import VietBaoCaoTieuChi from '../pages/MainPage/components/VietBaoCaoTieuChi/VietBaoCaoTieuChi';
import DanhGiaTieuChi from '../pages/DanhGiaTieuChi/DanhGiaTieuChi';
import QuanLyGiangVien from "../pages/Admin/components/QuanLyGiangVien/QuanLyGiangVien";
import ThemChuongTrinhDaoTao from "../pages/Admin/components/ThemChuongTrinhDaoTao/ThemChuongTrinhDaoTao";
import DinhNghiaTieuChuan from "../pages/Admin/components/DinhNghiaTieuChuan/DinhNghiaTieuChuan";

const routes = [
  {
    path: "/quan-ly/",
    element: <ProtectedRoute element={<MainPage />} requiredRoles={["USER", "ADMIN"]} />, // Example role check for non-admin sections
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChu />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<ChuongTrinhDaoTao />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "tieu-chi", element: <ProtectedRoute element={<TieuChi />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "minh-chung", element: <ProtectedRoute element={<MinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "quan-ly-minh-chung", element: <ProtectedRoute element={<QuanLyMinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "tieu-chuan", element: <ProtectedRoute element={<DanhSachTieuChuan />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "danh-sach-minh-chung", element: <ProtectedRoute element={<DanhSachMinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "bao-cao-tu-danh-gia", element: <ProtectedRoute element={<BaoCaoTuDanhGia />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "viet-bao-cao", element: <ProtectedRoute element={<VietBaoCao />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "viet-bao-cao-tieu-chi", element: <ProtectedRoute element={<VietBaoCaoTieuChi />} requiredRoles={["USER", "ADMIN"]} /> }
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/danh-muc-minh-chung",
    element: <ListEvidence />,
  },
  {
    path: "/danh-gia-tieu-chi",
    element: <DanhGiaTieuChi />,
  },
  {
    path: "/admin/",
    element: <ProtectedRoute element={<Admin />} requiredRoles={["ADMIN"]} />, // Protect admin routes with ADMIN role
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChuAdmin />} requiredRoles={["ADMIN"]} /> },
      { path: "chuan-kiem-dinh", element: <ProtectedRoute element={<ChuanKiemDinh />} requiredRoles={["ADMIN"]} /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<AdminChuongTrinhDaoTao />} requiredRoles={["ADMIN"]} /> },
      { path: "chi-tiet-chuong-trinh-dao-tao", element: <ProtectedRoute element={<ChiTietChuongTrinhDaoTao />} requiredRoles={["ADMIN"]} /> },
      { path: "quan-ly-phong-ban", element: <ProtectedRoute element={<PhongBan />} requiredRoles={["ADMIN"]} /> },
      { path: "phan-cong", element: <ProtectedRoute element={<PhanCongBaoCao />} requiredRoles={["ADMIN"]} /> },
      { path: "quan-ly-giang-vien", element: <ProtectedRoute element={<QuanLyGiangVien />} requiredRoles={["ADMIN"]} /> },
      { path: "them-chuong-trinh-dao-tao", element: <ProtectedRoute element={<ThemChuongTrinhDaoTao />} requiredRoles={["ADMIN"]} /> },
      { path: "dinh-nghia-tieu-chuan", element: <ProtectedRoute element={<DinhNghiaTieuChuan />} requiredRoles={["ADMIN"]} /> }
    ],
  }
];

const router = createBrowserRouter(routes);
export default router;