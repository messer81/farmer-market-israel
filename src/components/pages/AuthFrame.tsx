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
import { clearCart } from '../../store/slices/cartSlice';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AuthFrameProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  initialTab?: number;
}

const AuthFrame: React.FC<AuthFrameProps> = ({ open, onClose, onSuccess, initialTab = 0 }) => {
  const [tab, setTab] = useState(initialTab);

  // Синхронизируем tab с initialTab при изменении
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  // Инициализация email из localStorage
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Удаляем useEffect с localStorage (автоматический логин)
  // React.useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   if (token) {
  //     dispatch(setToken(token));
  //     // Здесь можно добавить логику получения пользователя по токену, если нужно
  //   }
  // }, [dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await setPersistence(auth, browserLocalPersistence); // всегда localPersistence, чтобы браузер мог подставить пароль
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
        localStorage.setItem('rememberedEmail', loginEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
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
      await setPersistence(auth, browserLocalPersistence);
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
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', regEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
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
      await setPersistence(auth, browserLocalPersistence);
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
      if (rememberMe && user.email) {
        localStorage.setItem('rememberedEmail', user.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      onSuccess?.();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Ошибка авторизации через Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess(t('reset_password_sent'));
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || t('reset_password_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    dispatch(clearCart()); // Очищаем корзину
    // localStorage.removeItem('jwt'); // больше не нужно
  };

  const content = (
    <Box sx={{ width: 450, p: 3 }}>
      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            color: '#666',
            fontSize: '0.85rem',
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 48,
            minWidth: 'auto',
            padding: '6px 12px',
            '&.Mui-selected': {
              color: '#4CAF50',
              fontWeight: 600
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#4CAF50',
            height: 3
          },
          '& .MuiTabs-scrollButtons': {
            color: '#666',
            '&.Mui-disabled': {
              opacity: 0.3
            }
          }
        }}
      >
        <Tab label={t('login_short')} />
        <Tab label={t('register_short')} />
        <Tab label={t('forgot_password_short')} />
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                  label={t('remember_me')}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setTab(2)}
                  sx={{ 
                    color: '#4CAF50',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    padding: '4px 8px',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.08)',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {t('forgot_password')}
                </Button>
              </Box>
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
          {tab === 2 && (
            <form onSubmit={handlePasswordReset} style={{ marginTop: 16 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {t('reset_password')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('reset_password_description')}
                </Typography>
              </Box>
              <TextField
                label={t('email')}
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ mb: 2 }}
              />
              {error && <Alert severity="error" sx={{ mt: 1, mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 1, mb: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#2E7D32' }
                }}
                disabled={loading}
              >
                {loading ? t('sending') : t('send_reset_link')}
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => setTab(0)}
                sx={{ 
                  color: '#666',
                  '&:hover': { 
                    backgroundColor: 'rgba(102, 102, 102, 0.08)',
                    textDecoration: 'underline'
                  }
                }}
              >
                {t('back_to_login')}
              </Button>
            </form>
          )}
        </>
      )}
    </Box>
  );

  // Greeting-контент для залогиненного пользователя
  const greeting = (
    <Box sx={{ width: 450, p: 3, textAlign: 'center' }}>
      <Typography variant="h6">{t('hello')}, {user?.name || ''}!</Typography>
      <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => {
          handleLogout();
          setShowLoginForm(true);
        }}>{t('change_user')}</Button>
        <Button variant="contained" color="primary" onClick={() => { if (onClose) onClose(); navigate('/catalog'); }}>{t('to_shop') || 'В магазин'}</Button>
      </Box>
    </Box>
  );

  // Если используется как модалка
  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          {(user && !user.isGuest && !showLoginForm) ? greeting : content}
        </DialogContent>
      </Dialog>
    );
  }

  // Если не модалка — просто рендерим content (старый вариант)
  return content;
};

export default AuthFrame; 