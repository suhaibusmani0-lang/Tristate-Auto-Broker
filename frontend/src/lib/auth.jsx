import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'tsab_admin_token';
const USER_KEY = 'tsab_admin_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token still valid
      api
        .get('/admin/me')
        .then((r) => {
          setUser(r.data);
          localStorage.setItem(USER_KEY, JSON.stringify(r.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post('/admin/login', { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username, role: 'admin' }));
    setToken(data.token);
    setUser({ username: data.username, role: 'admin' });
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
