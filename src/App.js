// src/App.js
import React, { useEffect } from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage'
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChuongTrinhDaoTao from './components/CTDTPage/CtdtPage';


const App = () => (
  useEffect(() => {
    document.title = 'VKU | Quản Lý Minh Chứng';
  }, []),
  <AuthProvider>
    <Router>
      <Routes>
      <Route path="/quan-ly/chuong-trinh-dao-tao" element={<ProtectedRoute><ChuongTrinhDaoTao /></ProtectedRoute>} />
        <Route path="/quan-ly" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
