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

const routes = [
  {
    path: "/quan-ly/",
    element: <ProtectedRoute element={<MainPage />} requiredRoles={["USER", "ADMIN"]} />, // Example role check for non-admin sections
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChu />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<ChuongTrinhDaoTao />} requiredRoles={["USER", "ADMIN"]} /> },
        
      { path: "minh-chung", element: <ProtectedRoute element={<MinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "quan-ly-minh-chung", element: <ProtectedRoute element={<QuanLyMinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "tieu-chuan", element: <ProtectedRoute element={<DanhSachTieuChuan />} requiredRoles={["USER", "ADMIN"]} /> },
      { path: "danh-sach-minh-chung", element: <ProtectedRoute element={<DanhSachMinhChung />} requiredRoles={["USER", "ADMIN"]} /> },
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
    path: "/admin/",
    element: <ProtectedRoute element={<Admin />} requiredRoles={["ADMIN"]} />, // Protect admin routes with ADMIN role
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChuAdmin />} requiredRoles={["ADMIN"]} /> },
      { path: "chuan-kiem-dinh", element: <ProtectedRoute element={<ChuanKiemDinh />} requiredRoles={["ADMIN"]} /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<AdminChuongTrinhDaoTao />} requiredRoles={["ADMIN"]} /> },
      { path: "chi-tiet-chuong-trinh-dao-tao", element: <ProtectedRoute element={<ChiTietChuongTrinhDaoTao />} requiredRoles={["ADMIN"]} /> },
    ],
  }
];

const router = createBrowserRouter(routes);
export default router;