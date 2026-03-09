
import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'pijama-admin-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(async (username, password) => {
    const data = await api.post('/api/auth/login', { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsername(null);
    navigate('/admin/login');
  }, [navigate]);

  const isAdmin = !!token;

  return (
    <AuthContext.Provider value={{ token, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
