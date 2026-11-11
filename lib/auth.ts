import { User, AuthResponse } from '@/types/auth';

const USERS_STORAGE_KEY = 'pencatat_keuangan_users_v1';
const ACTIVE_USER_KEY = 'pencatat_keuangan_active_user_v1';

// Initial demo user
export const DEMO_USER: User = {
  id: 'usr-demo',
  name: 'Pengguna Demo',
  email: 'demo@keuanganku.com',
  passwordHash: 'demo123',
  createdAt: 1762819200000,
};

export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [DEMO_USER];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEMO_USER]));
      return [DEMO_USER];
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to get users', error);
    return [DEMO_USER];
  }
}

export function saveStoredUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users', error);
  }
}

export function getActiveUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to get active user', error);
    return null;
  }
}

export function setActiveUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch (error) {
    console.error('Failed to set active user', error);
  }
}

export function registerUser(name: string, email: string, password: string): AuthResponse {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (!name.trim()) {
    return { success: false, message: 'Nama lengkap wajib diisi' };
  }

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, message: 'Format alamat email tidak valid' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Kata sandi minimal 6 karakter' };
  }

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, message: 'Email sudah terdaftar. Silakan masuk' };
  }

  const newUser: User = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    createdAt: Date.now(),
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setActiveUser(newUser);

  return { success: true, message: 'Pendaftaran berhasil!', user: newUser };
}

export function loginUser(email: string, password: string): AuthResponse {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return { success: false, message: 'Akun dengan email ini belum terdaftar' };
  }

  if (user.passwordHash !== password) {
    return { success: false, message: 'Kata sandi yang Anda masukkan salah' };
  }

  setActiveUser(user);
  return { success: true, message: 'Berhasil masuk ke akun!', user };
}

export function loginAsDemo(): AuthResponse {
  setActiveUser(DEMO_USER);
  return { success: true, message: 'Masuk sebagai akun demo', user: DEMO_USER };
}

export function logoutUser(): void {
  setActiveUser(null);
}
