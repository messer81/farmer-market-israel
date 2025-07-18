type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

let mockUsers: MockUser[] = [
  { id: '1', name: 'Edel', email: 'edelisakson@gmail.com', password: '123456' }
];

export async function mockLogin(email: string, password: string) {
  await new Promise(res => setTimeout(res, 700));
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userData } = user;
    return { token: 'mock-jwt-token', user: { ...userData, phone: '', address: '', preferredLanguage: 'ru' as const } };
  }
  throw new Error('Неверный логин или пароль');
}

export async function mockRegister(name: string, email: string, password: string) {
  await new Promise(res => setTimeout(res, 900));
  if (mockUsers.find(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  const newUser = { id: Date.now().toString(), name, email, password };
  mockUsers.push(newUser);
  const { password: _, ...userData } = newUser;
  return { token: 'mock-jwt-token', user: { ...userData, phone: '', address: '', preferredLanguage: 'ru' as const } };
} 