// src/App.js
import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import  router from './routes';
import { RouterProvider } from 'react-router-dom';

const App = () => (
  useEffect(() => {
    document.title = 'VKU | Quản Lý Minh Chứng';
  }, []),
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
