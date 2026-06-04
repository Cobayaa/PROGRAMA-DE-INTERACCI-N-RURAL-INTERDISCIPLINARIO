import { create } from 'zustand';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const useAuthApi = create((set, get) => ({
    isAuthenticated: false,
    user: null,
    isCheckingAuth: true,
    token: null,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({ isAuthenticated: false, user: null, isCheckingAuth: false, token: null });
                return;
            }

            const response = await api.get("/auth/verify", {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ 
                isAuthenticated: true, 
                user: response.data.user, 
                isCheckingAuth: false,
                token: token
            });
        } catch (error) {
            localStorage.removeItem("token");
            set({ isAuthenticated: false, user: null, isCheckingAuth: false, token: null });
        }
    },

    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data;
            
            localStorage.setItem("token", token);
            set({ 
                isAuthenticated: true, 
                user,
                token: token
            });
            
            return { success: true, user };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Error al iniciar sesión" 
            };
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            localStorage.removeItem("token");
            set({ isAuthenticated: false, user: null, token: null });
        }
    },
}));

const { checkAuth } = useAuthApi.getState();
checkAuth();

export default api;