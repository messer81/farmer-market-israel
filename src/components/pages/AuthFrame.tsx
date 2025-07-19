import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Typography, 
  Dialog, 
  DialogContent,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import GoogleLogo from '../common/GoogleLogo';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUser, clearUser, setToken } from '../../store/slices/userSlice';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';

interface AuthFrameProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const AuthFrame: React.FC<AuthFrameProps> = ({ open, onClose, onSuccess }) => {
  const [tab, setTab] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const { t } = useTranslation();

  React.useEffect(() => {
    // Автоматический логин, если есть токен в localStorage
    const token = localStorage.getItem('jwt');
    if (token) {
      dispatch(setToken(token));
      // Здесь можно добавить логику получения пользователя по токену, если нужно
    }
  }, [dispatch]);

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
      if (rememberMe) {
        localStorage.setItem('jwt', token);
      } else {
        sessionStorage.setItem('jwt', token);
      }
      onSuccess?.();
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
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Проверяем, есть ли уже профиль пользователя
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Создаем новый профиль
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Пользователь',
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date()
        });
      }
      
      dispatch(setUser({
        id: user.uid,
        name: user.displayName || 'Пользователь',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: '',
        preferredLanguage: 'ru' as const
      }));
      
      const token = await user.getIdToken();
      dispatch(setToken(token));
      localStorage.setItem('jwt', token);
      onSuccess?.();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Ошибка авторизации через Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    localStorage.removeItem('jwt');
  };

  const content = (
    <Box sx={{ width: 400, p: 3 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label={t('login')} />
        <Tab label={t('register')} />
      </Tabs>
      {user && !user.isGuest ? (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h6">{t('hello')}, {user.name}!</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleLogout}>{t('logout')}</Button>
        </Box>
      ) : (
        <>
          {/* Google кнопка */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleLogo />}
              onClick={handleGoogleAuth}
              disabled={loading}
              sx={{
                borderColor: '#4285F4',
                color: '#4285F4',
                fontWeight: 500,
                fontSize: '0.95rem',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(66, 133, 244, 0.1)',
                '&:hover': {
                  borderColor: '#3367D6',
                  backgroundColor: 'rgba(66, 133, 244, 0.08)',
                  boxShadow: '0 4px 8px rgba(66, 133, 244, 0.2)',
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#999',
                  backgroundColor: '#f5f5f5'
                },
                py: 1.5,
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {t('google_auth')}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('or')}
            </Typography>
          </Divider>

          {tab === 0 && (
            <form onSubmit={handleLogin} style={{ marginTop: 16 }}>
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
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                label={t('remember_me') || 'Запомнить меня'}
                sx={{ mt: 1 }}
              />
              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
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
            <form onSubmit={handleRegister} style={{ marginTop: 16 }}>
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
              {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
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

  // Если передан open, показываем как диалог
  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Иначе показываем как обычный компонент
  return content;
};

export default AuthFrame; 