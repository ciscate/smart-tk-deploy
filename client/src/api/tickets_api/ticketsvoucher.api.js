import axios from 'axios';

// Crea una instancia de axios
const ticketVoucherApi = axios.create({
    baseURL: 'http://localhost:8000/tickets/api/v1/ticketsvoucher',
    //withCredentials: true // Añade esta línea si es necesario
});

ticketVoucherApi.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
});

// Funciones de la API
export const getAllTicketsVoucher = () => ticketVoucherApi.get('/');
export const createTicketVoucher = (data) => ticketVoucherApi.post('/', data);
export const getTicketVoucher = (id) => ticketVoucherApi.get(`/${id}/`);
export const updateTicketVoucher = (id, data) => ticketVoucherApi.put(`/${id}/`, data);
export const deleteTicketVoucher = (id) => ticketVoucherApi.delete(`/${id}/`);

// Nueva función para obtener los tickets de un usuario específico
export const getUserTicketsVoucher = () => ticketVoucherApi.get('/user_tickets/');

export const assignStaffToTicket = (ticketId, staffData) => {
    return axios.put(`/api/tickets/${ticketId}/`, { assigned_to: staffData });
};

// Funcion para traer todos los tickets asignados al staff
export const getStaffTicketsVoucher = () => ticketVoucherApi.get('/assigned_tasks/');







