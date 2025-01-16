// authservice.js
import axios from 'axios';

const authApi = axios.create({
    baseURL: "http://localhost:8000/users/api/v1/"
});

export const register = async (name, surname, username, password, department) => {
    return authApi.post('register/', { name, surname, username, password, department });
};

export const login = async (username, password) => {
    const response = await authApi.post('login/', { username, password });
    const { token, user_id, username: userUsername, is_superuser, is_staff, department } = response.data; // Añadir is_staff

    if (token) {
        localStorage.setItem('user', JSON.stringify({ user_id, username: userUsername, token, is_superuser, is_staff, department }));
    }

    return response.data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

authApi.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
});
