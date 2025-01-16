import { useForm } from "react-hook-form";
import { login as authLogin } from "../api/auth_api/authservice";
import { useNavigate, Link } from "react-router-dom"; 
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data) => {
        try {
            const userData = await authLogin(data.username, data.password);
            login();

            if (userData.is_superuser) {
                navigate("/profile-admin");
            } else if (userData.is_staff) {
                navigate("/profile-staff");
            } else {
                navigate("/profile");
            }

            toast.success("Welcome", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
        } catch (error) {
            setErrorMessage("Invalid email or password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Entrar</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Campo de email */}
                    <div>
                        <label className="block text-gray-700 text-2xl">Email</label>
                        <input
                            type="email"
                            {...register("username", {
                                required: "Email es requerido",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>

                    {/* Campo de contraseña */}
                    <div>
                        <label className="block text-gray-700 text-2xl">Contraseña</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "Contraseña debe tener al menos 6 caracteres"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    {/* Botón de inicio de sesión */}
                    <button
                        type="submit"
                        className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Entrar
                    </button>

                    {/* Mensaje de error */}
                    {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                </form>

                {/* Link para registrarse 
                <p className="text-center mt-8 text-gray-500 text-2xl">
                    No tienes una cuenta?{" "}
                    <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold text-3xl">
                        Registrate aca
                    </Link>
                </p>*/}
            </div>
        </div>
    );
}
