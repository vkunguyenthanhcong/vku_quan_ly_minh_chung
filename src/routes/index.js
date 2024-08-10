import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../pages/MainPage/components/CTDTPage/CtdtPage';
import HomePage from '../pages/HomePage';
import MainContent from '../pages/MainPage/components/MainContent/MainContent';
import TieuChi from '../pages/MainPage/components/TCPage/TCPage';
import MinhChung from "../pages/MainPage/components/AddMinhChung/minhChung";
import StandardManagement from "../pages/MainPage/components/StandardManagement/StandardManagement";
import ListStandard from "../pages/MainPage/components/ListStandard/ListStandard";
import ManageEvidence from "../pages/MainPage/components/ManageEvidence/ManageEvidence";
import ListEvidence from "../pages/ListEvidence";
import Admin from "../pages/Admin";

//admin
import AdminMainContent from "../pages/Admin/components/MainContent/AdminMainContent";

const routes = [
  {
    path: "/quan-ly/",
    element: <MainPage />,
    children: [
      { path: "", element: <MainContent /> },
      { path: "chuong-trinh-dao-tao", element: <ChuongTrinhDaoTao /> },
      { path: "tieu-chi", element: <TieuChi /> },
      { path: "minh-chung", element: <MinhChung /> },
      { path: "quan-ly-minh-chung", element: <ManageEvidence /> },
      {
        path: "quan-ly-tieu-chuan",
        element: <StandardManagement />,

      },
      {
        path: "tieu-chuan",
        element: <ListStandard />,

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
      { path: "", element: <AdminMainContent /> },
      { path: "chuong-trinh-dao-tao", element: <ChuongTrinhDaoTao /> },
      { path: "tieu-chi", element: <TieuChi /> },
      { path: "minh-chung", element: <MinhChung /> },
      { path: "quan-ly-minh-chung", element: <ManageEvidence /> },
      {
        path: "quan-ly-tieu-chuan",
        element: <StandardManagement />,

      },
      {
        path: "tieu-chuan",
        element: <ListStandard />,

      },

    ],
  }
];

const router = createBrowserRouter(routes);
export default router;