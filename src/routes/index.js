import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../services/ProtectedRoute';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../pages/MainPage/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao';
import HomePage from '../pages/HomePage';
import TieuChi from '../pages/MainPage/components/TieuChi/TieuChi';
import DinhNghiaTieuChuan from '../pages/MainPage/components/QuanLyTieuChuan/DinhNghiaTieuChuan';
import MinhChung from "../pages/MainPage/components/MinhChung/minhChung";
import DanhSachTieuChuan from "../pages/MainPage/components/DanhSachTieuChuan/DanhSachTieuChuan";
import QuanLyMinhChung from "../pages/MainPage/components/QuanLyMinhChung/QuanLyMinhChung";
import ListEvidence from "../pages/ListEvidence";

import TrangChu from '../pages/MainPage/components/TrangChu/TrangChu';
//admin
import ChuanKiemDinh from "../pages/Admin/components/MainContent/ChuanKiemDinh";
import AdminChuongTrinhDaoTao from "../pages/Admin/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao";
import DanhSachMinhChung from '../pages/MainPage/components/DanhSachMinhChung/DanhSachMinhChung';
import Admin from "../pages/Admin";

const routes = [
  {
    path: "/quan-ly/",
    element: <ProtectedRoute element={<MainPage />} requiredRole="USER" />, // Example role check for non-admin sections
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChu />} requiredRole="USER" /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<ChuongTrinhDaoTao />} requiredRole="USER" /> },
      { path: "tieu-chi", element: <ProtectedRoute element={<TieuChi />} requiredRole="USER" /> },
      { path: "minh-chung", element: <ProtectedRoute element={<MinhChung />} requiredRole="USER" /> },
      { path: "quan-ly-minh-chung", element: <ProtectedRoute element={<QuanLyMinhChung />} requiredRole="USER" /> },
      { path: "dinh-nghia-tieu-chuan", element: <ProtectedRoute element={<DinhNghiaTieuChuan />} requiredRole="USER" /> },//them goi
      { path: "tieu-chuan", element: <ProtectedRoute element={<DanhSachTieuChuan />} requiredRole="USER" /> },
      { path: "danh-sach-minh-chung", element: <ProtectedRoute element={<DanhSachMinhChung />} requiredRole="USER" /> },
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
    element: <ProtectedRoute element={<Admin />} requiredRole="ADMIN" />, // Protect admin routes with ADMIN role
    children: [
      { path: "", element: <ProtectedRoute element={<TrangChu />} requiredRole="ADMIN" /> },
      { path: "chuan-kiem-dinh", element: <ProtectedRoute element={<ChuanKiemDinh />} requiredRole="ADMIN" /> },
      { path: "chuong-trinh-dao-tao", element: <ProtectedRoute element={<AdminChuongTrinhDaoTao />} requiredRole="ADMIN" /> },
    ],
  }
];

const router = createBrowserRouter(routes);
export default router;