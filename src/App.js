// src/App.js
import React, { useEffect } from 'react';
import HomePage from './components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChuongTrinhDaoTao from './components/MainContent/ChuongTrinhDaoTao/ChuongTrinhDaoTao';
import TieuChuan from './components/MainContent/ChuongTrinhDaoTao/TieuChuan/TieuChuan';


const App = () => (
  useEffect(() => {
    document.title = 'VKU | Quản Lý Minh Chứng';
  }, []),
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/mainpage" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/chuongtrinhdaotao" element={<ProtectedRoute><ChuongTrinhDaoTao /></ProtectedRoute>} />
        <Route path="/tieuchuan" element={<ProtectedRoute><TieuChuan /></ProtectedRoute>} />
        
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
