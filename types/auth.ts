export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Stored securely in client storage
  createdAt: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

