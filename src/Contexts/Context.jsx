import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
const [beneficiaryUser,setBeneficiaryUser]=useState([])
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








useEffect(()=>{
  const beneficiarydata = async()=>{
    try {
      const response = await axios.get(`${API}/beneficiary_user`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data);
      setBeneficiaryUser(response.data)
    } catch (error) {
      console.error("Error submitting deposit data:", error);
    }
  }
  beneficiarydata()
},[])









  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout ,API,token,beneficiaryUser}}>
      {children}
    </AuthContext.Provider>
  );
}
