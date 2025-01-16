import axios from 'axios';

const ticketFacilitiesApi = axios.create({
    baseURL: 'http://localhost:8000/tickets/api/v1/ticketsfacilities'
});

// Agrega un interceptor para añadir el token a todas las solicitudes
ticketFacilitiesApi.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtén el objeto completo de 'user'
    if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
});

export const getAllTicketsFacilities = () => ticketFacilitiesApi.get('/');
export const getTicketFacilities = (id) => ticketFacilitiesApi.get(`/${id}/`);
export const createTicketFacilities = (data) => ticketFacilitiesApi.post('/', data);
export const deleteTicketFacilities = (id) => ticketFacilitiesApi.delete(`/${id}/`);
export const updateTicketFacilities = (id, data) => ticketFacilitiesApi.put(`/${id}/`,data);
// Nueva función para obtener los tickets de un usuario específico
export const getUserTicketsFacilities = () => ticketFacilitiesApi.get('/user_tickets/');

export const assignStaffToTicket = (ticketId, staffData) => {
    return axios.put(`/api/tickets/${ticketId}/`, { assigned_to: staffData });
};

// Funcion para traer todos los tickets asignados al staff
export const getStaffTicketsFacilities = () => ticketFacilitiesApi.get('/assigned_tasks/');