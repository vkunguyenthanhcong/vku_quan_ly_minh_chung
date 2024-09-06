// src/App.js
import React, { useEffect } from 'react';
import  router from './routes';
import { RouterProvider } from 'react-router-dom';

const App = () => (
  useEffect(() => {
    document.title = 'VKU | Quản Lý Minh Chứng';
  }, []),
    <RouterProvider router={router} />
);

export default App;
