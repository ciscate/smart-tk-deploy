import React, { useState, useEffect } from 'react';
import { getStaffUsers } from '../../api/users_api/usersapi'; // Importa las funciones de la API
import { getUser } from '../../api/users_api/usersapi';
import { toast } from 'react-hot-toast';
import consolidatedIcon from "../../assets/consolidated.png";


export function TicketConsolidatedEdit({ 
    id, 
    onSubmit, 
    register, 
    errors, 
    selectedFiles, 
    setSelectedFiles, 
    existingFiles, 
    assigned_to, 
    setValue, 
    creatorId,
}) {
    const [staffUsers, setStaffUsers] = useState([]); // Almacena los usuarios tipo staff
    const [selectedStaff, setSelectedStaff] = useState(assigned_to?.id || ""); // Usuario seleccionado
    const [isAdmin, setIsAdmin] = useState(false); // Verifica si el usuario es admin
    const [canEdit, setCanEdit] = useState(false); // Permiso de edición


    
    

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const hasPermission = user.is_superuser || user.is_staff || user.user_id === creatorId;
            setIsAdmin(user.is_superuser);
            setCanEdit(hasPermission);
        } else {
            console.warn("No se encontró la clave 'user' en localStorage o está vacía.");
        }

        async function loadStaffUsers() {
            try {
                const response = await getStaffUsers();
                setStaffUsers(response || []);
            } catch (error) {
                console.error("Error loading staff users:", error);
            }
        }

        loadStaffUsers();
    }, [creatorId]);

    

    // Manejar el cambio de archivos
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...selectedFiles, ...files].filter(
            (file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
        );
        setSelectedFiles(newFiles);
    };

    const removeFile = (index, e) => {
        e.preventDefault(); // Previene la ejecución del submit
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleStaffChange = async (e) => {
        const staffId = e.target.value;
        setSelectedStaff(staffId);

        try {
            const response = await getUser(staffId);
            const staffUser = response.data;
            setValue("assigned_to", staffUser.id); 
            setValue("assigned_staff", JSON.stringify(staffUser)); 
        } catch (error) {
            console.error("Error fetching staff user:", error);
        }
    };

    

    return (
        <div className="flex items-center justify-center bg-green-200 rounded-lg p-2 border border-gray-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-2 border border-gray-300">
            <div className="flex flex-col items-center">
                                <img
                                    src={consolidatedIcon}
                                    alt="Consolidated"
                                    className="w-36 h-36 hover:scale-105 transition-transform"
                                />
                            </div>
                <h1 className="text-3xl font-semibold mb-14 text-center text-gray-700">
                    {id ? "EDITAR CONSOLIDADO" : "CREAR NUEVO TICKET"}
                </h1>
                <form onSubmit={onSubmit} className="space-y-9">
                    <div>
                        <label className="block text-gray-700 text-2xl">Titulo</label>
                        <input
                            type="text"
                            placeholder="Title"
                            {...register("title", { required: true })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-xl"
                        />
                        {errors.title && <span className="text-red-500 text-sm">Titulo es requerido</span>}
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-2xl">Descripcion</label>
                        <textarea
                            rows="3"
                            placeholder="Description"
                            {...register("description", { required: true })}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 text-xl"
                            disabled={!canEdit}
                        ></textarea>
                        {errors.description && <span className="text-red-500 text-sm">Descripcion es requirido</span>}
                    </div>

                    {/* Mostrar el select solo si el usuario es admin */}
                    {isAdmin && (
                        <div>
                            <label className="block text-gray-700 text-2xl">Asignar operador</label>
                            <select
                                value={selectedStaff}
                                onChange={handleStaffChange}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-xl"
                                disabled={!canEdit}
                            >
                                <option value="">Seleccionar operador</option>
                                {staffUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} {user.surname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <input
                        type="hidden"
                        {...register("assigned_to")}
                        value={selectedStaff || ""}
                    />

                    

                    {canEdit && (
                        <>
                            <div>
                                <label className="block text-gray-700 text-2xl">Adjuntar nuevos archivos</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    multiple
                                    className="w-full p-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>

                            <div className="mt-4">
                                <h2 className="text-gray-700 font-semibold text-2xl">Archivos a adjuntar:</h2>
                                {selectedFiles.length > 0 ? (
                                    <ul className="list-none">
                                        {selectedFiles.map((file, index) => (
                                            <li key={index} className="flex justify-between text-gray-600 text-lg mt-1">
                                                {file.name}
                                                <button 
                                                    onClick={(e) => removeFile(index,e)} 
                                                    className="bg-red-500 text-white  rounded hover:bg-red-600 px-3 ml-6"
                                                >
                                                    X
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 text-2xl">No hay archivos para agregar</p>
                                )}
                            </div>
                        </>
                    )}

                    {canEdit && (
                        <button className="w-full border border-yellow-500 text-yellow-500 py-3 rounded-lg hover:bg-yellow-500 hover:text-white transition duration-300">
                            {id ? "ACTUALIZAR" : "CREAR"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
