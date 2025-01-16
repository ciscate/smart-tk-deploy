import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import logo from '../assets/logo1.png';
import { useLocation } from 'react-router-dom';

export function Navigation() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        toast.success("Bye Bye...!", {
            position: "bottom-right",
            style: { background: "#101010", color: "#fff" }
        });
        navigate("/");
    };

    const handleButtonClick = () => {
        if (currentUser) {
            setDropdownOpen(prev => !prev);
        } else {
            navigate("/login");
        }
    };

    // Maneja el clic en el menú para redirigir según el rol del usuario
    const handleProfileClick = () => {
        setDropdownOpen(false); // Cierra el menú al seleccionar una opción

        if (currentUser.is_superuser) {
            navigate("/profile-admin"); // Redirige a perfil de admin
            console.log("REDIRECCIONANDO A ADMIN");
        } else if (currentUser.is_staff) {
            navigate("/profile-staff"); // Redirige a perfil de staff
            console.log("REDIRECCIONANDO A STAFF");
        } else {
            navigate("/profile"); // Redirige a perfil de usuario normal
            console.log("REDIRECCIONANDO A PROFILE");
        }
    };

    return (
        <div className="flex justify-between items-center w-9/12 mx-auto py-3 ">
            <Link to="/">
                <img 
                    src={logo} 
                    alt="Smart TK Logo"
                    className="h-28 hover:scale-105 transition-transform" 
                />
            </Link>

            <div className="relative">
                <button 
                    onClick={handleButtonClick} 
                    className="border border-blue-500 text-blue-500 py-4 px-6 rounded-lg hover:bg-blue-500 hover:text-white transition"
                >
                    {currentUser ? "Menu" : "Login"}
                </button>

                {isDropdownOpen && currentUser && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        <div className="py-2">
                            {/* Mostrar "New Ticket" solo si el usuario no es admin ni staff */}
                            {!currentUser.is_superuser && !currentUser.is_staff && (
                                <Link 
                                    to="/create" 
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 text-2xl"
                                    onClick={() => handleMenuItemClick("/create")}
                                >
                                    Nuevo Ticket
                                </Link>
                            )}
                            
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-center px-2 py-2 text-red-500 hover:bg-red-200 text-2xl"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
