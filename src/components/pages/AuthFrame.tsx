import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUser, clearUser, setToken } from '../../store/slices/userSlice';
import { mockLogin, mockRegister } from '../../utils/mockApi';

const AuthFrame: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await mockLogin(loginEmail, loginPassword);
      dispatch(setUser(res.user));
      dispatch(setToken(res.token));
      localStorage.setItem('jwt', res.token);
    } catch {
      setError('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await mockRegister(regName, regEmail, regPassword);
      dispatch(setUser(res.user));
      dispatch(setToken(res.token));
      localStorage.setItem('jwt', res.token);
    } catch {
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('jwt');
  };

  return (
    <Box sx={{ width: 350, p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="Вход" />
        <Tab label="Регистрация" />
      </Tabs>
      {user ? (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6">Привет, {user.name}!</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>Выйти</Button>
        </Box>
      ) : (
        <>
          {tab === 0 && (
            <form onSubmit={handleLogin} style={{ marginTop: 24 }}>
              <TextField
                label="Email"
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Пароль"
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                Войти
              </Button>
            </form>
          )}
          {tab === 1 && (
            <form onSubmit={handleRegister} style={{ marginTop: 24 }}>
              <TextField
                label="Имя"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Пароль"
                type="password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                Зарегистрироваться
              </Button>
            </form>
          )}
        </>
      )}
    </Box>
  );
};

export default AuthFrame; 