import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medremind_token');
    if (token) {
      API.get('/auth/profile')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('medremind_token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('medremind_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('medremind_token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('medremind_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await API.put('/auth/profile', data);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
