import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Asegúrate de importar tu contexto

export function IndexPage() {
    const { currentUser } = useAuth(); // Obtener el usuario actual
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir según el rol del usuario si ya está autenticado
        if (currentUser) {
            if (currentUser.is_superuser) {
                navigate("/profile-admin");
            } else if (currentUser.is_staff) {
                navigate("/profile-staff");
            } else {
                navigate("/profile");
            }
        }
    }, [currentUser, navigate]); // Dependencias del efecto

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-5xl border border-gray-300 my-20">
                <h1 className="text-3xl font-bold my-10 text-center text-gray-700">Bienvenido a Smart TK</h1>
                <p className="text-2xl text-gray-600 mb-10 text-center">
                Smart TK es su solucion integral para gestionar tickets de manera eficiente. Si necesita crear un nuevo ticket, 
                vea los existentes o administre su perfil de usuario, ¡lo tenemos cubierto!
                </p>

                <div className="text-center mt-16">
                <h2 className="text-2xl font-semibold mb-5 text-gray-700">Caracteristicas:</h2>
                <ul className="list-disc list-inside mb-10 text-justify mx-auto w-4/5 text-3xl">
                    <li className="text-gray-600">🔹 Crear Tickets Técnicos</li>
                    <li className="text-gray-600">🔹 Administrar Tickets de Facilidades</li>
                    <li className="text-gray-600">🔹 Seguir Tickets Consolidados</li>
                    <li className="text-gray-600">🔹 Solicitar Tickets de Comprobantes</li>
                    <li className="text-gray-600">🔹 Ver su perfil y administrar su cuenta</li>
                </ul>
                </div>



                <h2 className="text-2xl font-semibold mb-5 mt-16 text-gray-700">Empezar:</h2>
                <p className="text-gray-600 mb-10 text-center text-2xl">
                Inicie sesion o registrese para comenzar a utilizar nuestro sistema de gestion de tickets. 
                ¡Haga clic en el boton a continuación para comenzar su viaje con Smart TK!
                </p>

                <div className="flex justify-center">
                    <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 my-10">
                    Ir a Iniciar sesion
                    </Link>
                </div>
            </div>
        </div>
    );
}
