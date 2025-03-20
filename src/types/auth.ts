// src/types/auth.ts
export interface User {
    id?: number;
    name: string;
    email: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    passwordHash: string;
  }
  
  export interface LoginRequest {
    email: string;
    passwordHash: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    message?: string;
  }
  