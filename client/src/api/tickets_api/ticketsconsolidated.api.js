import axios from 'axios';

const ticketConsolidatedApi = axios.create({
    baseURL: 'http://localhost:8000/tickets/api/v1/ticketsconsolidated',
});

// Agrega un interceptor para añadir el token a todas las solicitudes
ticketConsolidatedApi.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtén el objeto completo de 'user'
    if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
});

export const getAllTicketsConsolidated = () => ticketConsolidatedApi.get('/');
export const getTicketConsolidated = (id) => ticketConsolidatedApi.get(`/${id}/`);
export const createTicketConsolidated = (data) => ticketConsolidatedApi.post('/', data);
export const updateTicketConsolidated = (id, data) => ticketConsolidatedApi.put(`/${id}/`, data);
export const deleteTicketConsolidated = (id) => ticketConsolidatedApi.delete(`/${id}/`);
// Nueva función para obtener los tickets de TicketConsolidated de un usuario
export const getUserTicketsConsolidated = () => ticketConsolidatedApi.get('/user_tickets/');

export const assignStaffToTicket = (ticketId, staffData) => {
    return axios.put(`/api/tickets/${ticketId}/`, { assigned_to: staffData });
};

// Funcion para traer todos los tickets asignados al staff
export const getStaffTicketsConsolidated = () => ticketConsolidatedApi.get('/assigned_tasks/');