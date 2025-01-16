import axios from 'axios';

// Crea una instancia de axios
const ticketTechnicalApi = axios.create({
    baseURL: 'http://localhost:8000/tickets/api/v1/ticketstechnical',
    //withCredentials: true // Añade esta línea si es necesario
});

ticketTechnicalApi.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}`;
    }
    return config;
});

// Funciones de la API
export const getAllTicketsTechnical = () => ticketTechnicalApi.get('/');
export const createTicketTechnical = (data) => ticketTechnicalApi.post('/', data);
export const getTicketTechnical = (id) => ticketTechnicalApi.get(`/${id}/`);
export const updateTicketTechnical = (id, data) => ticketTechnicalApi.put(`/${id}/`, data);
export const deleteTicketTechnical = (id) => ticketTechnicalApi.delete(`/${id}/`);

// Nueva función para obtener los tickets de un usuario específico
export const getUserTicketsTechnical = () => ticketTechnicalApi.get('/user_tickets/');


export const assignStaffToTicket = (ticketId, staffData) => {
    return axios.put(`/api/tickets/${ticketId}/`, { assigned_to: staffData });
};

// Funcion para traer todos los tickets asignados al staff
export const getStaffTicketsTechnical = () => ticketTechnicalApi.get('/assigned_tasks/');







