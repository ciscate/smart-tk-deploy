import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout as authLogout } from "../api/auth_api/authservice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    const login = () => {
        const user = getCurrentUser();
        setCurrentUser(user); // Actualiza el usuario al iniciar sesión
    };

    const logout = () => {
        authLogout();
        setCurrentUser(null); // Actualiza el estado al cerrar sesión
    };

    // Verifica el usuario actual al cargar la aplicación
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
