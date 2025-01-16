import { useEffect, useState } from "react";
import {
    getTicketFacilities,
    updateTicketFacilities,
    deleteTicketFacilities,
} from "../../api/tickets_api/ticketsfacilities.api";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffUsers } from "../../api/users_api/usersapi";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { TicketFacilitiesEdit } from "../../components/tickets_components/TicketFacilitiesEdit";
import facilitiesIcon from "../../assets/facilities.png";
import { ConfirmModal } from "../../components/DeleteModalConfirm";
import { getCurrentUserData } from "../../api/users_api/usersapi";
import * as XLSX from 'xlsx';

export function TicketFacilitiesDetailPage() {
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const [ticket, setTicket] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [staffUsers, setStaffUsers] = useState([]);
    const [assignedStaff, setAssignedStaff] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [status, setStatus] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [userData, setUserData] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [allClientsShown, setAllClientsShown] = useState(false);
    const [clientLimit] = useState(350); // Variable para el limite de clientes


    const navigate = useNavigate();



    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getCurrentUserData();
                setUserData(response.data);
                // Verificar permisos de edición
                if (response.data && ticket) {
                    setCanEdit(
                        response.data.is_superuser ||
                        response.data.is_staff ||
                        response.data.id === ticket.user.id
                    );
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserData();
    }, [ticket]);

    useEffect(() => {
        if (id) {
            async function loadTicketFacilities() {
                try {
                    const response = await getTicketFacilities(id);
                    setTicket(response.data);
                    setValue("title", response.data.title);
                    setValue("description", response.data.description);
                    setExistingFiles(response.data.files || []);
                    setAssignedStaff(response.data.assigned_to || null);
                    setSelectedStaff(response.data.assigned_to ? response.data.assigned_to.id : "");
                    setStatus(response.data.status); // Inicializa el estado con el estado actual del ticket
                    setNewStatus(response.data.status); // Sincroniza newStatus con el estado real del ticket
                } catch (error) {
                    console.error("Error loading ticket:", error);
                }
            }
            loadTicketFacilities();
        }
    }, [id, setValue]);

    useEffect(() => {
        async function loadStaffUsers() {
            try {
                const response = await getStaffUsers();
                setStaffUsers(response || []);
            } catch (error) {
                console.error("Error loading staff users:", error);
            }
        }
        loadStaffUsers();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("observation", ticket?.observation || ""); // Incluye la observación en el FormData


        // Agregar el estado seleccionado al FormData
        data.append("status", newStatus); // Aquí agregamos el estado seleccionado

        // Agregar los archivos seleccionados
        selectedFiles.forEach((file, index) => {
            data.append(`file_uploads[${index}]`, file);
        });

        const assignedStaff = JSON.parse(formData.assigned_staff || "{}");
        if (assignedStaff.id) {
            data.append("assigned_to", JSON.stringify(assignedStaff));
        } else {
            console.warn("No assigned staff ID selected or invalid data.");
        }

        try {
            const response = await updateTicketFacilities(id, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast.success("Ticket actualizado con exito", {
                    position: "bottom-right",
                    style: {
                        background: "#101010",
                        color: "#fff",
                    },
                });
                // Redirigir según el rol del usuario
                const userData = JSON.parse(localStorage.getItem("user"));
                if (userData) {
                    if (userData.is_superuser) {
                        navigate("/profile-admin");
                    } else if (userData.is_staff) {
                        navigate("/profile-staff");
                    } else {
                        navigate("/profile");
                    }
                } else {
                    navigate("/profile");
                }
            }
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    });

    const handleDelete = async () => {
        setIsConfirmOpen(false);
        try {
            await deleteTicketFacilities(id);
            toast.success("Ticket borrado con exito", {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff",
                },
            });
            navigate("/profile");
        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast.error("El ticket no se pudo borrar", {
                position: "bottom-right",
                style: {
                    background: "#ff4d4f",
                    color: "#fff",
                },
            });
        }
    };

    const getFileNameAndExtension = (fileName) => {
        const parts = fileName.split(".");
        const extension = parts.length > 1 ? parts.pop() : "Desconocido";
        let name = parts.join(".");
        name = name.split("_")[0];
        return { name, extension };
    };


    const generateExcel = (clients) => {
        if (!clients || clients.length === 0) {
            alert("No hay clientes seleccionados para exportar.");
            return;
        }

        // Extraer period_start y period_end desde el ticket
        const periodStart = ticket.period_start || "";
        const periodEnd = ticket.period_end || "";

        // Crea un objeto con los datos que quieres exportar
        const data = clients.map((client) => ({
            "razon_social": client.razon_social,
            "cuit_acceso": client.cuit_acceso,
            "cuit_empresa": client.cuit_empresa,
            "clave_afip": client.clave_afip,
            "cuit_invalido": client.cuit_invalido,
            "clave_faltante": client.clave_faltante,
            "inicio_sesion": client.inicio_sesion,
            "lote": client.lote,
            "desde": periodStart, // Columna "Desde" usando period_start
            "hasta": periodEnd,   // Columna "Hasta" usando period_end
        }));

        // Verifica que existan datos a exportar
        if (data.length === 0) {
            alert("No hay datos disponibles para generar el Excel.");
            return;
        }

        // Crea una hoja de trabajo (worksheet)
        const ws = XLSX.utils.json_to_sheet(data);

        // Crea un libro de trabajo (workbook)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes Seleccionados");

        // Genera y descarga el archivo Excel
        XLSX.writeFile(wb, "clientes_seleccionados.xlsx");
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100 p-6">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl m-2 border-2 border-gray-300">
                {ticket ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center justify-center space-y-6">
                            
                            <div className="bg-blue-200 p-6 rounded-lg border border-gray-400 text-gray-800 w-full shadow">
                                <p className="font-bold text-2xl line-clamp-2">
                                    Titulo: {ticket.title}

                                </p>
                                <p className="text-2xl line-clamp-3">
                                    Descripcion: {ticket.description}
                                </p>
                                <p className="text-2xl">Creado: {ticket.created}</p>
                                <p className="text-2xl">
                                    Fecha entrega: {ticket.delivery_date || "Sin especificar"}
                                </p>
                                
                                <p className="text-2xl">Periodo: {ticket.period_start} a {ticket.period_end}</p>
                                <p className="text-2xl">
                                    Usuario: {ticket.user.name} {ticket.user.surname}
                                </p>
                                <p className="text-2xl">Departmento: {ticket.user.department}</p>
                                
                                <p className="text-2xl">
                                    Asignado a:{" "}
                                    {assignedStaff
                                        ? `${assignedStaff.name} ${assignedStaff.surname}`
                                        : "Sin asignar"}
                                </p>
                                <div className="mt-4">
                                    <h2 className="text-gray-700 font-semibold text-2xl">
                                        Archivos adjuntos:
                                    </h2>
                                    {existingFiles.length > 0 ? (
                                        <ul className="list-inside list-none">
                                            {existingFiles.map((file, index) => {
                                                const { name, extension } = getFileNameAndExtension(
                                                    file.fileupload.split("/").pop()
                                                );
                                                return (
                                                    <li key={index}>
                                                        {canEdit ? (
                                                            <a
                                                                href={file.fileupload}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-lg"
                                                            >
                                                                {`${name}.${extension}`}
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-600 text-lg">
                                                                {`${name}.${extension}`}
                                                            </span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-600">Sin archivos adjuntos</p>
                                    )}
                                </div>

                                {/* Mostrar JSON del cliente si existe */}
                                {ticket.client_data && (
                                    <div className="bg-gray-100 p-6 rounded-lg border border-gray-400 text-gray-800 w-full shadow mt-4">
                                        <h2 className="text-2xl font-semibold text-gray-700 my-3">
                                            {Object.keys(ticket.client_data).length > clientLimit ? "Todos los clientes seleccionados" : "Clientes Asociados"}
                                        </h2>
                                        {Object.keys(ticket.client_data).length <= clientLimit && (
                                            <ul className="space-y-4 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                                                {Object.entries(ticket.client_data).map(([key, cliente], index) => (
                                                    <li key={index} className="p-4 border rounded-lg bg-white shadow-md">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {cliente.razon_social}
                                                        </h3>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}



                            <div>
                                {userData && userData.is_staff && (
                                            <button
                                                type="button"
                                                onClick={() => generateExcel(Object.values(ticket.client_data))}
                                                className="mt-4 w-2/3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 text-xl"
                                            >
                                                Generar Excel
                                            </button>
                                        )}
                                    </div>
                            </div>

                            
                            {userData && (
                                <div className="flex flex-col space-y-4 w-full">
                                    {/* Campo de observación */}
                                    <div className="flex flex-col space-y-2 ">
                                        <label
                                            htmlFor="observation"
                                            className="text-gray-700 text-xl font-semibold"
                                        >
                                            Observacion
                                        </label>
                                        {userData.is_superuser || userData.is_staff ? (
                                            <textarea
                                                id="observation"
                                                value={ticket?.observation || ""} // Mostrar la observación actual
                                                onChange={(e) =>
                                                    setTicket({ ...ticket, observation: e.target.value })
                                                } // Actualizar el estado si es editable
                                                className="w-full p-4 border border-blue-300 rounded-lg bg-gray-50 text-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                rows="4"
                                                placeholder="Añade la observacion aqui"
                                            ></textarea>
                                        ) : (
                                            <div
                                                id="observation"
                                                className="w-full p-4 border border-blue-300 rounded-lg bg-gray-50 text-xl"
                                            >
                                                {ticket?.observation || "Sin observaciones"}{" "}
                                                {/* Mostrar mensaje predeterminado si está vacío */}
                                            </div>
                                        )}
                                    </div>
                                    {userData && (
                                        <div className="flex flex-col space-y-4 w-full">
                                            {/* Campo de estado */}
                                            <div className="flex flex-col space-y-2">
                                                <label
                                                    htmlFor="status"
                                                    className="text-gray-700 text-xl font-semibold"
                                                >
                                                    Estado
                                                </label>
                                                {userData.is_superuser || userData.is_staff ? (
                                                    <select
                                                        id="status"
                                                        value={newStatus}
                                                        onChange={(e) => setNewStatus(e.target.value)} // Actualizar el estado seleccionado
                                                        className="w-full p-4 border border-blue-300 rounded-lg bg-gray-50 text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    >
                                                        <option value="Enviado">Enviado</option>
                                                        <option value="Leido">Leido</option>
                                                        <option value="En Proceso">En proceso</option>
                                                        <option value="Finalizado">Finalizado</option>
                                                    </select>
                                                ) : (
                                                    <div
                                                        id="status"
                                                        className="w-full p-4 border border-blue-300 rounded-lg bg-gray-50 text-xl text-cente focus:outline-none focus:ring-2 focus:ring-blue-300r"
                                                    >
                                                        {newStatus}{" "}
                                                        {/* Mostrar el estado actual en modo solo lectura */}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                                                )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <TicketFacilitiesEdit
                                                            id={id}
                                                            onSubmit={onSubmit}
                                                            register={register}
                                                            errors={errors}
                                                            selectedFiles={selectedFiles}
                                                            setSelectedFiles={setSelectedFiles}
                                                            existingFiles={existingFiles}
                                                            assigned_to={ticket.assigned_to}
                                                            staffUsers={staffUsers}
                                                            setValue={setValue} // Asegúrate de pasar setValue
                                                            creatorId={ticket.user.id}
                                                        />
                                                    </div>
                                            ) : (
                                            <p>Cargando info del ticket...</p>
                                                )}
                                            <ConfirmModal
                                                isOpen={isConfirmOpen}
                                                onClose={() => setIsConfirmOpen(false)}
                                                onConfirm={handleDelete}
                                                message="Estas seguro de borrar el ticket?"
                                            />
                                        </div>
                                        </div >
                                    );
}