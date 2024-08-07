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
import NewMinhChung from "../components/ManageEvidence/AddNewMinhChung/NewMinhChung";

const routes = [
  {
    path: "/quan-ly/",
    element: <MainPage />,
    children: [
      { path: "", element: <MainContent /> },
      { path: "chuong-trinh-dao-tao", element: <ChuongTrinhDaoTao /> },
      { path: "tieu-chi", element: <TieuChi /> },
      { path: "minh-chung", element: <MinhChung /> },
      { path: "them-minh-chung", element: <NewMinhChung /> },
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
];

const router = createBrowserRouter(routes);
export default router;