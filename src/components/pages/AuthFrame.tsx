import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUser, clearUser, setToken } from '../../store/slices/userSlice';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      dispatch(setUser({
        id: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '',
        preferredLanguage: 'ru' as const
      }));
      const token = await user.getIdToken();
      dispatch(setToken(token));
      localStorage.setItem('jwt', token);
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = userCredential.user;
      // Сохраняем профиль в Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: regName,
        email: user.email,
      });
      dispatch(setUser({
        id: user.uid,
        name: regName,
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '',
        preferredLanguage: 'ru' as const
      }));
      const token = await user.getIdToken();
      dispatch(setToken(token));
      localStorage.setItem('jwt', token);
      // (Опционально) здесь можно добавить сохранение профиля в Firestore
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    localStorage.removeItem('jwt');
  };

  return (
    <Box sx={{ width: 350, p: 2 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label={t('login')} />
        <Tab label={t('register')} />
      </Tabs>
      {user ? (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6">{t('hello')}, {user.name}!</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>{t('logout')}</Button>
        </Box>
      ) : (
        <>
          {tab === 0 && (
            <form onSubmit={handleLogin} style={{ marginTop: 24 }}>
              <TextField
                label={t('email')}
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t('password')}
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
                {t('login')}
              </Button>
            </form>
          )}
          {tab === 1 && (
            <form onSubmit={handleRegister} style={{ marginTop: 24 }}>
              <TextField
                label={t('name')}
                value={regName}
                onChange={e => setRegName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t('email')}
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t('password')}
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
                {t('register')}
              </Button>
            </form>
          )}
        </>
      )}
    </Box>
  );
};

export default AuthFrame; 