import axios from 'axios';

const usersApi = axios.create({
    baseURL: 'http://localhost:8000/users/api/v1/users/'
});

// Añadir token en los encabezados de las solicitudes autenticadas
usersApi.interceptors.request.use((config) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.token) {
        config.headers.Authorization = `Token ${currentUser.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Obtener todos los usuarios
export const getAllUsers = () => usersApi.get('/');

// Obtener un usuario específico
export const getUser = (id) => usersApi.get(`/${id}/`);

// Crear un nuevo usuario
export const createUser = (user) => usersApi.post('/', user);

// Eliminar un usuario
export const deleteUser = (id) => usersApi.delete(`/${id}/`);

// Actualizar un usuario
export const updateUser = (id, user) => usersApi.put(`/${id}/`);

// Obtener datos del usuario actual
export const getCurrentUserData = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.user_id) {
        return await usersApi.get(`${currentUser.user_id}/`);
    } else {
        throw new Error("User ID not found in local storage");
    }
};

// Obtener usuarios con rol de staff
export const getStaffUsers = async () => {
    try {
        const response = await usersApi.get('staff_users/'); // Cambia a '/staff_users/'
        return response.data; // Retorna solo los usuarios con rol de staff
    } catch (error) {
        console.error("Error fetching staff users:", error);
        throw error;
    }
};




