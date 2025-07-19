# 🏗️ Архитектура проекта Farm Market Israel

## 📋 Обзор архитектуры

Проект построен на современном стеке технологий с использованием React, TypeScript, Redux Toolkit и Firebase.

## 🎯 Принципы архитектуры

- **Компонентный подход** - Переиспользуемые компоненты
- **Типизация** - TypeScript для безопасности типов
- **Централизованное состояние** - Redux Toolkit
- **Серверная архитектура** - Firebase Backend-as-a-Service
- **Интернационализация** - i18next для многоязычности

## 📁 Структура проекта

```
farmer-market-israel/
├── 📁 public/                    # Статические файлы
│   ├── favicon.ico              # Иконка сайта
│   ├── logo192.png              # Manifest иконка
│   └── manifest.json            # PWA манифест
├── 📁 src/                      # Исходный код
│   ├── 📁 assets/               # Ресурсы
│   │   └── 📁 images/           # Изображения
│   │       ├── Farm Sharing background.jpg
│   │       └── products/        # Изображения товаров
│   ├── 📁 components/           # React компоненты
│   │   ├── 📁 common/           # Общие компоненты
│   │   │   ├── CartDrawer.tsx   # Корзина покупок
│   │   │   └── GoogleLogo.tsx   # Логотип Google
│   │   ├── 📁 layout/           # Макет
│   │   │   └── Header.tsx       # Верхняя панель
│   │   └── 📁 pages/            # Страницы
│   │       ├── WelcomePage.tsx  # Стартовая
│   │       ├── AuthPage.tsx     # Авторизация
│   │       ├── AuthFrame.tsx    # Форма входа
│   │       ├── ProductCatalog.tsx # Каталог
│   │       ├── CheckoutPage.tsx # Оформление заказа
│   │       └── AdminPage.tsx    # Админка
│   ├── 📁 hooks/                # Кастомные хуки
│   │   └── redux.ts             # Redux хуки
│   ├── 📁 store/                # Redux состояние
│   │   ├── index.ts             # Настройка store
│   │   └── 📁 slices/           # Redux слайсы
│   │       ├── cartSlice.ts     # Корзина
│   │       ├── userSlice.ts     # Пользователь
│   │       ├── productsSlice.ts # Товары
│   │       └── languageSlice.ts # Язык
│   ├── 📁 types/                # TypeScript типы
│   │   ├── index.ts             # Основные типы
│   │   └── images.d.ts          # Типы изображений
│   ├── 📁 utils/                # Утилиты
│   │   └── mockApi.ts           # Mock API
│   ├── App.tsx                  # Главный компонент
│   ├── App.css                  # Стили приложения
│   ├── firebase.ts              # Firebase конфигурация
│   ├── i18n.ts                  # Интернационализация
│   └── main.tsx                 # Точка входа
├── package.json                 # Зависимости
├── tsconfig.json               # TypeScript конфигурация
├── vite.config.ts              # Vite конфигурация
└── README.md                   # Документация
```

## 🔄 Поток данных

### 1. Инициализация приложения
```
main.tsx → App.tsx → Redux Store → Firebase Auth
```

### 2. Авторизация пользователя
```
AuthPage → Firebase Auth → Redux Store → Каталог товаров
```

### 3. Работа с товарами
```
ProductCatalog → Redux Store → Firebase Firestore
```

### 4. Оформление заказа
```
CartDrawer → CheckoutPage → Firebase Firestore → Подтверждение
```

## 🎯 Компонентная архитектура

### Страницы (Pages)
Каждая страница - это отдельный компонент с собственной логикой:

```typescript
// Пример структуры страницы
const PageComponent: React.FC = () => {
  // 1. Хуки состояния
  const [state, setState] = useState();
  
  // 2. Redux хуки
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.data);
  
  // 3. Эффекты
  useEffect(() => {
    // Инициализация
  }, []);
  
  // 4. Обработчики событий
  const handleEvent = () => {
    // Логика
  };
  
  // 5. Рендер
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Общие компоненты (Common)
Переиспользуемые компоненты без бизнес-логики:

```typescript
// Пример общего компонента
interface CommonComponentProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

const CommonComponent: React.FC<CommonComponentProps> = ({
  title,
  onClick,
  disabled = false
}) => {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {title}
    </Button>
  );
};
```

## 🔧 Redux архитектура

### Store структура
```typescript
interface RootState {
  cart: CartState;
  user: UserState;
  products: ProductsState;
  language: LanguageState;
}
```

### Слайсы (Slices)
Каждый слайс управляет определенной областью состояния:

```typescript
// Пример слайса
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Логика добавления
    },
    removeItem: (state, action) => {
      // Логика удаления
    }
  },
  extraReducers: (builder) => {
    // Асинхронные действия
  }
});
```

## 🌐 Интернационализация

### Структура переводов
```typescript
const resources = {
  ru: {
    translation: {
      'welcome.title': 'Farm Market Israel',
      'welcome.subtitle': 'Добро пожаловать',
      // ...
    }
  },
  en: {
    translation: {
      'welcome.title': 'Farm Market Israel',
      'welcome.subtitle': 'Welcome',
      // ...
    }
  },
  he: {
    translation: {
      'welcome.title': 'שוק החקלאי ישראל',
      'welcome.subtitle': 'ברוכים הבאים',
      // ...
    }
  }
};
```

### Использование переводов
```typescript
const { t } = useTranslation();

return (
  <Typography>
    {t('welcome.title')}
  </Typography>
);
```

## 🔥 Firebase интеграция

### Конфигурация
```typescript
// firebase.ts
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Коллекции Firestore
```
firestore/
├── users/           # Пользователи
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       └── createdAt: timestamp
├── products/        # Товары
│   └── {productId}/
│       ├── name: string
│       ├── price: number
│       ├── category: string
│       └── image: string
└── orders/          # Заказы
    └── {orderId}/
        ├── userId: string
        ├── items: array
        ├── total: number
        ├── status: string
        └── createdAt: timestamp
```

## 🎨 Стилизация

### Material-UI тема
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Зеленый
    },
    secondary: {
      main: '#FF9800', // Оранжевый
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
      'Arial Hebrew',
      'David',
    ].join(','),
  },
});
```

### CSS модули
```css
/* App.css */
.App {
  background-image: url('./assets/images/Farm Sharing background.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}
```

## 🔐 Безопасность

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать/писать только свои данные
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Товары доступны всем
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Заказы доступны пользователям и админам
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Валидация форм
```typescript
// Пример валидации
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};
```

## 📱 Адаптивность

### Breakpoints
```typescript
// Material-UI breakpoints
xs: 0px    // Мобильные
sm: 600px  // Планшеты
md: 900px  // Малые десктопы
lg: 1200px // Средние десктопы
xl: 1536px // Большие десктопы
```

### Адаптивные компоненты
```typescript
// Пример адаптивного компонента
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Карточка товара */}
  </Grid>
</Grid>
```

## 🚀 Производительность

### Оптимизации
- **Code Splitting** - Разделение кода по страницам
- **Lazy Loading** - Ленивая загрузка компонентов
- **Memoization** - Кэширование вычислений
- **Bundle Optimization** - Оптимизация сборки

### Мониторинг
- **Firebase Analytics** - Отслеживание событий
- **Error Boundaries** - Обработка ошибок
- **Performance Monitoring** - Мониторинг производительности

## 🔄 Жизненный цикл компонентов

### 1. Монтирование
```typescript
useEffect(() => {
  // Инициализация
  dispatch(fetchProducts());
  
  return () => {
    // Очистка
  };
}, []);
```

### 2. Обновление
```typescript
useEffect(() => {
  // Реакция на изменения
}, [dependency]);
```

### 3. Размонтирование
```typescript
useEffect(() => {
  return () => {
    // Очистка ресурсов
  };
}, []);
```

## 📊 Тестирование

### Структура тестов
```
src/
├── __tests__/
│   ├── components/
│   │   ├── WelcomePage.test.tsx
│   │   └── AuthPage.test.tsx
│   ├── store/
│   │   └── slices/
│   └── utils/
└── setupTests.ts
```

### Пример теста
```typescript
import { render, screen } from '@testing-library/react';
import WelcomePage from '../components/pages/WelcomePage';

test('renders welcome page', () => {
  render(<WelcomePage />);
  expect(screen.getByText(/Farm Market Israel/i)).toBeInTheDocument();
});
```

## 🚀 Развертывание

### Сборка
```bash
npm run build
```

### Деплой
```bash
# Firebase Hosting
firebase deploy

# Vercel
vercel

# Netlify
netlify deploy
```

---

**Архитектура обеспечивает масштабируемость, производительность и удобство разработки!** 🏗️✨ 