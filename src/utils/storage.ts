import { User } from '../types';

// Simulate user storage with localStorage
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
};

export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};