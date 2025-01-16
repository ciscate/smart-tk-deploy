import React, { useState, useEffect } from "react";
import { createTicketFacilities } from "../../api/tickets_api/ticketsfacilities.api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import facilitiesIcon from '../../assets/facilities.png';
import customerIcon from "../../assets/customer.png";
import clientesData from "../../../../clientes.json";



export function TicketFacilitiesFormPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm();
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);  // Para manejar los archivos seleccionados
    const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
    const [filteredClients, setFilteredClients] = useState([]); // Estado de resultados filtrados
    const [selectedClients, setSelectedClients] = useState([]); // Clientes seleccionados
    const [allClientsSelected, setAllClientsSelected] = useState(false); // Estado para rastrear si se seleccionaron todos



    // Cargar los datos de clientes
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        // Verificar si el JSON tiene datos antes de procesarlos
        if (clientesData) {
            const clientesDelJSON = Object.values(clientesData).flatMap((lote) =>
                lote.clientes ? Object.values(lote.clientes) : []
            );
            setClientes(clientesDelJSON);
        } else {
            console.error(
                "El archivo JSON está vacío o no tiene el formato correcto."
            );
            setClientes([]); // Asegurarse de que no sea undefined
        }
    }, []);

    // Manejar búsqueda por razón social
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const resultados = clientes.filter((cliente) =>
            cliente.razon_social.toLowerCase().includes(term)
        );
        setFilteredClients(resultados);
    };

    const handleAddAllClients = () => {
        setSelectedClients(clientes); // Agregar todos los clientes directamente
        setAllClientsSelected(true); // Marcar que todos los clientes han sido seleccionados
        console.log("Todos los clientes seleccionados:", clientes);
        toast.success("Todos los clientes han sido agregados.");
    };

    const removeAllClients = () => {
        setSelectedClients([]); // Limpia la lista de clientes seleccionados
        setAllClientsSelected(false); // Resetea el estado de "todos los clientes seleccionados"
        toast.success("Se han removido todos los clientes.");
        console.log("Todos los clientes han sido removidos.");
    };




    const onSubmit = handleSubmit(async (data) => {

        if (selectedClients.length === 0) {
            toast.error("Debe seleccionar al menos un cliente.");
            return; // Detener el envío del formulario
        }

        if (new Date(data.period_start) > new Date(data.period_end)) {
            setError("period_end", {
                type: "manual",
                message: "Fecha final debe ser menor a fecha inicio",
            });
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("delivery_date", data.delivery_date);
        formData.append("period_start", data.period_start);
        formData.append("period_end", data.period_end);

        // Adjuntar archivos seleccionados
        selectedFiles.forEach((file, index) => {
            formData.append(`file_uploads[${index}]`, file);
        });

        if (selectedClients.length > 0) {
            formData.append("client_data", JSON.stringify(selectedClients)); // Enviar el JSON completo
        }


        try {
            await createTicketFacilities(formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Ticket creado con exito");
            navigate("/profile");
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Error al crear el ticket");
        }
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = [...selectedFiles, ...files].filter(
            (file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
        );
        setSelectedFiles(newFiles);
    };

    const removeFile = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handleAddClient = (cliente) => {
        // Evitar duplicados
        if (!selectedClients.some((c) => c.cuit_acceso === cliente.cuit_acceso)) {
            const updatedClients = [...selectedClients, cliente]; // Actualizamos el array
            setSelectedClients(updatedClients);
            toast.success(`Cliente ${cliente.razon_social} agregado/a`);
        } else {
            toast.error(`El cliente ${cliente.razon_social} ya está agregado/a`);
        }
    };

    const removeClient = (index) => {
        setSelectedClients((prevClients) => prevClients.filter((_, i) => i !== index));
    };

    return (
        <div className="flex items-start mx-auto w-3/5 justify-between min-h-screen bg-blue-100 p-6 rounded-lg mt-12">
            {/* Sección de búsqueda */}
            <div className="w-2/4 bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300 space-y-5 mr-6">
                <div className="flex flex-col items-center mt-4">
                    <img
                        src={customerIcon}
                        alt="Facilities"
                        className="w-36 h-36 hover:scale-105 transition-transform"
                    />
                    <h1 className="text-3xl font-semibold mb-3 text-center text-gray-700">
                        Buscar Cliente
                    </h1>
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleAddAllClients}
                        className="text-blue-500 text-lg hover:text-blue-700 mt-6"
                    >
                        Agregar todos los clientes
                    </button>
                </div>
    
                <input
                    type="text"
                    placeholder="Buscar por razón social"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                />
                <ul className="mt-4 max-h-svh overflow-y-auto grid grid-cols-1 gap-4">
                    {searchTerm &&
                        filteredClients.map((cliente, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300"
                            >
                                {/* Razón Social */}
                                <span className="text-gray-800 font-medium text-lg">
                                    {cliente.razon_social}
                                </span>
    
                                {/* Botón "+" */}
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-xl hover:bg-blue-600 transition duration-300"
                                    onClick={() => handleAddClient(cliente)}
                                >
                                    +
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
    
            {/* Sección de formulario */}
            <div className="w-2/3 bg-white p-10 rounded-lg shadow-lg border-2 border-gray-300">
                <div className="flex flex-col items-center">
                    <img
                        src={facilitiesIcon}
                        alt="Technical"
                        className="w-36 h-36 hover:scale-105 transition-transform"
                    />
                    <h1 className="text-3xl font-semibold mb-16 text-center text-gray-700">
                        Nuevo Facilidades
                    </h1>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-2xl">
                            Título
                        </label>
                        <input
                            type="text"
                            placeholder="Ingrese el título"
                            {...register("title", { required: "Título es requerido" })}
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                        />
                        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>
    
                    {/* Descripción */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-2xl">
                            Descripción (Opcional)
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Ingrese la descripción"
                            {...register("description")}
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                        ></textarea>
                    </div>
    
                    {/* Fecha de entrega */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-2xl">
                            Fecha de entrega
                        </label>
                        <input
                            type="date"
                            {...register("delivery_date", { required: "Fecha de entrega es requerida" })}
                            className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.delivery_date && (
                            <span className="text-red-500 text-sm">{errors.delivery_date.message}</span>
                        )}
                    </div>
    
                    {/* Periodo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-2xl">
                                Fecha inicio periodo
                            </label>
                            <input
                                type="date"
                                {...register("period_start", { required: "Fecha inicio es requerida" })}
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {errors.period_start && (
                                <span className="text-red-500 text-sm">{errors.period_start.message}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-2xl">
                                Fecha final periodo
                            </label>
                            <input
                                type="date"
                                {...register("period_end", { required: "Fecha final es requerida" })}
                                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={() => clearErrors("period_end")}
                            />
                            {errors.period_end && (
                                <span className="text-red-500 text-sm">{errors.period_end.message}</span>
                            )}
                        </div>
                    </div>
    
                    {/* Subir archivos */}
                    <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-2xl">Subir archivos (Opcional)</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange}  
                                multiple
                                className="w-full p-3 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                            />
                        </div>
                        <div className="mt-4">
                                <h2 className="text-gray-700 font-semibold text-2xl">Archivos a adjuntar:</h2>
                                {selectedFiles.length > 0 ? (
                                    <ul className="list-none">
                                        {selectedFiles.map((file, index) => (
                                            <li key={index} className="text-gray-600 flex justify-between items-center text-lg my-2">
                                                {file.name}
                                                <button 
                                                    type="button" // Cambiar el tipo del botón
                                                    onClick={() => removeFile(index)} 
                                                    className="ml-4 bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
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
                
                            <div className="mt-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-blue-500 font-semibold text-2xl flex items-center mx-auto mb-2">
                                {allClientsSelected ? (
                                    <>
                                        Todos los clientes seleccionados
                                        <button
                                            type="button"
                                            onClick={removeAllClients}
                                            className="ml-4 bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                            title="Remover todos"
                                        >
                                            X
                                        </button>
                                    </>
                                ) : (
                                    "Clientes Seleccionados:"
                                )}
                            </h2>
                        </div>
                        {!allClientsSelected && selectedClients.length > 0 ? (
                            <ul className="list-none max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                {selectedClients.map((client, index) => (
                                    <li key={index} className="text-gray-600 flex justify-between items-center text-lg my-2">
                                        <span>{client.razon_social}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeClient(index)}
                                            className="bg-red-500 text-white rounded hover:bg-red-600 px-3 ml-6"
                                        >
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : !allClientsSelected && (
                            <p className="text-red-500 text-2xl">Debe seleccionar al menos un cliente.</p>
                        )}
                    </div>
    
                    {/* Botón de guardar */}
                    <button className="border border-blue-500 text-blue-500 p-3 rounded-lg w-full hover:bg-blue-500 hover:text-white transition duration-300">
                        GUARDAR
                    </button>
                </form>
            </div>
        </div>
    );
    
}
