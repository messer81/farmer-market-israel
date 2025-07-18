import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      'login': 'Войти',
      'register': 'Зарегистрироваться',
      'logout': 'Выйти',
      'email': 'Email',
      'password': 'Пароль',
      'name': 'Имя',
      'search_products': 'Поиск продуктов...'
    }
  },
  en: {
    translation: {
      'login': 'Login',
      'register': 'Register',
      'logout': 'Logout',
      'email': 'Email',
      'password': 'Password',
      'name': 'Name',
      'search_products': 'Search products...'
    }
  },
  he: {
    translation: {
      'login': 'התחבר',
      'register': 'הרשמה',
      'logout': 'התנתק',
      'email': 'אימייל',
      'password': 'סיסמה',
      'name': 'שם',
      'search_products': 'חפש מוצרים...'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 