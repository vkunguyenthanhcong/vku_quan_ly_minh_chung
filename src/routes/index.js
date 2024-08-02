import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ChuongTrinhDaoTao from '../components/CTDTPage/CtdtPage';
import HomePage from '../pages/HomePage';
import MainContent from '../components/MainContent/MainContent';

const routes = [
  {
    path: "/quan-ly/",
    element: <MainPage />,
    children: [
      { path: "", element: <MainContent /> },
      { path: "chuong-trinh-dao-tao", element: <ChuongTrinhDaoTao /> },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
];

const router = createBrowserRouter(routes);
export default router;