import { useForm } from "react-hook-form";
import { register as registerUser } from "../api/auth_api/authservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await registerUser(data.name, data.surname, data.username, data.password, data.department);
            toast.success('Usuario creado exitosamente', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            });
            navigate("/login");
        } catch (error) {
            toast.error(error?.message || "El registro fallo, intentelo otra vez", {
                position: "bottom-right",
                style: {
                    background: "#ff4d4f",
                    color: "#fff"
                }
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-100 p-4">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Registro</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Nombre es requerido",
                                minLength: {
                                    value: 2,
                                    message: "Nombre debe tener al menos 2 caracteres"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-gray-700">Apellido</label>
                        <input
                            type="text"
                            {...register("surname", {
                                required: "Apellido es requerido",
                                minLength: {
                                    value: 2,
                                    message: "Apellido debe tener al menos 2 caracteres"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.surname && <span className="text-red-500 text-sm">{errors.surname.message}</span>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("username", {
                                required: "Email es requerido",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Direccion de email invalido"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "Contraseña debe tener al menos 6 caracteres"
                                },
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                                    message: "Contraseña debe contener letras y numeros"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>

                    {/* Departamento */}
                    <div>
                        <label className="block text-gray-700">Departmento</label>
                        <select
                            {...register("department", {
                                required: "Departamento es requerido"
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">Selecciona un Departamento</option>
                            <option value="Sueldos">Sueldos</option>
                            <option value="Impuestos">Impuestos</option>
                            <option value="Auditoria">Auditoria</option>
                            <option value="Ganancias">Ganancias</option>
                            <option value="BPO">BPO</option>
                        </select>
                        {errors.department && <span className="text-red-500 text-sm">{errors.department.message}</span>}
                    </div>

                    {/* Botón de Registro */}
                    <button
                        type="submit"
                        className="w-full border border-green-500 text-green-500 py-3 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
}
