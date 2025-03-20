// src/services/authService.ts
import { RegisterRequest, LoginRequest, AuthResponse, User } from '@/types/auth';

const API_URL = "http://localhost:8090/api";

export const authService = {
    register: async (userData: Omit<RegisterRequest, 'passwordHash'> & { password: string }): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                passwordHash: userData.password, // Backend expects passwordHash
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        // Store user data and token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        return data;
    },

    login: async (credentials: Omit<LoginRequest, 'passwordHash'> & { password: string }): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: credentials.email,
                passwordHash: credentials.password, // Backend expects passwordHash
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Store user data and token
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        return data;
    },

    logout: (): void => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("token");
    }
};
