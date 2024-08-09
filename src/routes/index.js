import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../components/CTDTPage/CtdtPage';
import HomePage from '../pages/HomePage';
import MainContent from '../components/MainContent/MainContent';
import TieuChi from '../components/TCPage/TCPage';
import MinhChung from "../components/AddMinhChung/minhChung";
import StandardManagement from "../components/StandardManagement/StandardManagement";
import ListStandard from "../components/ListStandard/ListStandard";
import ManageEvidence from "../components/ManageEvidence/ManageEvidence";
import ListEvidence from "../pages/ListEvidence";

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
];

const router = createBrowserRouter(routes);
export default router;