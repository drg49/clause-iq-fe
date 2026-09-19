import { createContext, useContext, useEffect, useState } from 'react';
import { validateUser } from '../api/authentication';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    validateUser()
      .then((data) => {
        setUser(data.user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
