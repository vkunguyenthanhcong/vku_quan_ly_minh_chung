import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../pages/MainPage/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao';
import HomePage from '../pages/HomePage';
import MainContent from '../pages/MainPage/components/MainContent/MainContent';
import TieuChi from '../pages/MainPage/components/TieuChi/TieuChi';
import MinhChung from "../pages/MainPage/components/MinhChung/minhChung";
import QuanLyTieuChuan from "../pages/MainPage/components/QuanLyTieuChuan/QuanLyTieuChuan";
import DanhSachTieuChuan from "../pages/MainPage/components/DanhSachTieuChuan/DanhSachTieuChuan";
import QuanLyMinhChung from "../pages/MainPage/components/QuanLyMinhChung/QuanLyMinhChung";
import ListEvidence from "../pages/ListEvidence";
import Admin from "../pages/Admin";

//admin
import ChuanKiemDinh from "../pages/Admin/components/MainContent/ChuanKiemDinh";
import AdminChuongTrinhDaoTao from "../pages/Admin/components/ChuongTrinhDaoTao/ChuongTrinhDaoTao";
import TrangChu from "../pages/Admin/components/TrangChu/TrangChu";

const routes = [
  {
    path: "/quan-ly/",
    element: <MainPage />,
    children: [
      { path: "", element: <MainContent /> },
      { path: "chuong-trinh-dao-tao", element: <ChuongTrinhDaoTao /> },
      { path: "tieu-chi", element: <TieuChi /> },
      { path: "minh-chung", element: <MinhChung /> },
      { path: "quan-ly-minh-chung", element: <QuanLyMinhChung /> },
      {
        path: "quan-ly-tieu-chuan",
        element: <QuanLyTieuChuan />,

      },
      {
        path: "tieu-chuan",
        element: <DanhSachTieuChuan />,
      },

    ],
  }
,
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
    element: <Admin />,
    children: [
      { path: "", element: <TrangChu /> },
      { path: "chuan-kiem-dinh", element: <ChuanKiemDinh /> },
      { path: "chuong-trinh-dao-tao", element: <AdminChuongTrinhDaoTao /> },
    ],
  }
];

const router = createBrowserRouter(routes);
export default router;