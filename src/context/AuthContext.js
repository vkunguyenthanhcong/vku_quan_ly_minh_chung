// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuthState = localStorage.getItem('isLoggedIn');
    return savedAuthState === 'true';
  }); 
  const login = () => {
    console.log('Logging in...');
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    console.log('Logging out...');
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');  
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
