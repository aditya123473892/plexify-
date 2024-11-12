import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const login = (token) => {
    setTimeout(() => {
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    }, 1000); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const token = localStorage.getItem('token');
const API = process.env.NODE_ENV =='development' ? 'http://localhost:3523':'LIVE LINK'

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout ,API,token}}>
      {children}
    </AuthContext.Provider>
  );
}
