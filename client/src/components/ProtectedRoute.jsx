// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { currentUser } = useAuth(); // Asegúrate de tener acceso a currentUser

    // Si el usuario no está autenticado, redirige a la página de login
    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Si el usuario está autenticado, renderiza el componente pasado
    return element;
};

export default ProtectedRoute;
