// src/App.js
import React, { useEffect } from 'react';
import HomePage from './components/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChuongTrinhDaoTao from './components/MainContent/ChuongTrinhDaoTao/ChuongTrinhDaoTao';


const App = () => (

  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/mainpage" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/chuongtrinhdaotao" element={<ProtectedRoute><ChuongTrinhDaoTao /></ProtectedRoute>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
