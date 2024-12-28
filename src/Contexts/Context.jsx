import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [beneficiaryUser, setBeneficiaryUser] = useState([]);
  const [error, setError] = useState(null);

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
  const API = process.env.NODE_ENV === 'development' ? 'http://localhost:3523' : 'LIVE LINK';

  useEffect(() => {
    if (token) {
      const beneficiarydata = async () => {
        try {
          const response = await axios.get(`${API}/beneficiaries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBeneficiaryUser(response.data.beneficiaries
          );
        } catch (error) {
          console.error('Error fetching beneficiary data:', error);
          setError('Failed to fetch beneficiary data. Please try again.');
        }
      };
      beneficiarydata();
    }
  }, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, API, token, beneficiaryUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}
