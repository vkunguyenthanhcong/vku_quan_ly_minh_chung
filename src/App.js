// src/App.js
import React, { useEffect } from 'react';
import  router from './routes';
import { RouterProvider } from 'react-router-dom';

const App = () => (
  useEffect(() => {
    document.title = 'Quản Lý Minh Chứng | VKU';
  }, []),
    <RouterProvider router={router} />
);

export default App;
