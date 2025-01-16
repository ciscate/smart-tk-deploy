import { useEffect, useState } from "react";
import { getCurrentUserData } from "../api/users_api/usersapi";
import { getStaffTicketsTechnical } from "../api/tickets_api/ticketstechnical.api"; 
import { getStaffTicketsFacilities } from "../api/tickets_api/ticketsfacilities.api"; 
import { getStaffTicketsConsolidated } from "../api/tickets_api/ticketsconsolidated.api";
import { getStaffTicketsVoucher } from "../api/tickets_api/ticketsvoucher.api";
import { TicketTechnicalCard } from "../components/tickets_components/TicketTechnicalCard";
import { TicketFacilitiesCard } from "../components/tickets_components/TicketFacilitiesCard";
import { TicketConsolidatedCard } from "../components/tickets_components/TicketConsolidatedCard";
import { TicketVoucherCard } from "../components/tickets_components/TicketVoucherCard";

export function ProfileStaffPage() {
    const [userData, setUserData] = useState(null);
    const [technicalTickets, setTechnicalTickets] = useState([]);
    const [facilitiesTickets, setFacilitiesTickets] = useState([]);
    const [consolidatedTickets, setConsolidatedTickets] = useState([]);
    const [voucherTickets, setVoucherTickets] = useState([]);
    const [sentTickets, setSentTickets] = useState([]);
    const [receivedTickets, setReceivedTickets] = useState([]);
    const [inProcessTickets, setInProcessTickets] = useState([]);
    const [completedTickets, setCompletedTickets] = useState([]);
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getCurrentUserData();
                const user = response.data;
                setUserData(user);
                setIsStaff(user.is_staff && !user.is_superuser); // Verifica si el usuario es staff, pero no admin.

                const technicalResponse = await getStaffTicketsTechnical();
                const facilitiesResponse = await getStaffTicketsFacilities();
                const consolidatedResponse = await getStaffTicketsConsolidated();
                const voucherResponse = await getStaffTicketsVoucher();

                const allTickets = [
                    ...technicalResponse.data,
                    ...facilitiesResponse.data,
                    ...consolidatedResponse.data,
                    ...voucherResponse.data,
                ];

                setTechnicalTickets(technicalResponse.data);
                setFacilitiesTickets(facilitiesResponse.data);
                setConsolidatedTickets(consolidatedResponse.data);
                setVoucherTickets(voucherResponse.data);

                setSentTickets(allTickets.filter(ticket => ticket.status === "Recibido"));
                setReceivedTickets(allTickets.filter(ticket => ticket.status === "Leido"));
                setInProcessTickets(allTickets.filter(ticket => ticket.status === "En Proceso"));
                setCompletedTickets(allTickets.filter(ticket => ticket.status === "Finalizado"));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);

    if (!userData) {
        return <p className="text-center mt-10 text-gray-600">Cargando info del usuario</p>;
    }

    // Renderizar el componente de tarjeta adecuado según el prefijo del custom_id
    const renderTicketCard = (ticket) => {
        if (ticket.custom_id.startsWith("TEC-")) {
            return <TicketTechnicalCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />;
        } else if (ticket.custom_id.startsWith("FAC-")) {
            return <TicketFacilitiesCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />;
        } else if (ticket.custom_id.startsWith("CON-")) {
            return <TicketConsolidatedCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />;
        } else if (ticket.custom_id.startsWith("VOU-")) {
            return <TicketVoucherCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />;
        } else {
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl border border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-8 my-20">
                
                {/* User Data Column */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold my-6 text-center text-gray-700">Perfil</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">Nombre</label>
                            <p className="p-3 border rounded-lg bg-gray-50 text-2xl">{userData.name}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">Apellido</label>
                            <p className="p-3 border rounded-lg bg-gray-50 text-2xl">{userData.surname}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">Estado</label>
                            <p className={`p-3 border rounded-lg text-2xl ${userData.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {userData.is_active ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Rol</label>
                            <p className={`p-3 border rounded-lg text-2xl ${userData.is_superuser ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>
                                {userData.is_superuser ? "Admin" : "Staff"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold text-3xl">Email</label>
                        <p className="p-3 border rounded-lg bg-gray-50 text-2xl">{userData.username}</p>
                    </div>
                </div>

                {/* Tickets by Type Section */}
                
                <div className="overflow-y-auto h-[400px] border rounded-lg p-4 bg-gray-50 shadow-inner space-y-8 ">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">Nuevos Tickets</h2>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Tecnicos</h3>
                        {technicalTickets.filter(ticket => ticket.status === "Enviado").length > 0 ? (
                            <div className="grid gap-4">
                                {technicalTickets
                                    .filter(ticket => ticket.status === "Enviado")
                                    .map(ticket => (
                                        <TicketTechnicalCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets tecnicos no encontrados </p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Facilidades</h3>
                        {facilitiesTickets.filter(ticket => ticket.status === "Enviado").length > 0 ? (
                            <div className="grid gap-4">
                                {facilitiesTickets
                                    .filter(ticket => ticket.status === "Enviado")
                                    .map(ticket => (
                                        <TicketFacilitiesCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets facilidades no encontrados</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Consolidados</h3>
                        {consolidatedTickets.filter(ticket => ticket.status === "Enviado").length > 0 ? (
                            <div className="grid gap-4">
                                {consolidatedTickets
                                    .filter(ticket => ticket.status === "Enviado")
                                    .map(ticket => (
                                        <TicketConsolidatedCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets consolidados no encontrados</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Comprobantes</h3>
                        {voucherTickets.filter(ticket => ticket.status === "Enviado").length > 0 ? (
                            <div className="grid gap-4">
                                {voucherTickets
                                    .filter(ticket => ticket.status === "Enviado")
                                    .map(ticket => (
                                        <TicketVoucherCard key={ticket.custom_id} ticket={ticket} isStaff={isStaff} />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets consolidados no encontrados</p>
                        )}
                    </div>
                </div>
                

            </div>
            <details className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-gray-300 my-4">
                <summary className="py-4 px-6 cursor-pointer font-semibold text-lg bg-gray-600 text-white hover:bg-gray-500 rounded-t-lg">
                    Area de Trabajo
                </summary>
                <div className="p-6 overflow-y-auto max-h-[800px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Received Tickets */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">Tickets Leidos</h3>
                            {receivedTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {receivedTickets.map(ticket => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">Tickets leidos no encontrados</p>
                            )}
                        </div>

                        {/* In Process Tickets */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">Tickets en Proceso</h3>
                            {inProcessTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {inProcessTickets.map(ticket => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">Tickets en proceso no encontrados</p>
                            )}
                        </div>

                        {/* Completed Tickets */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">Tickets Finalizados</h3>
                            {completedTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {completedTickets.map(ticket => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">Tickets finalizados no encontrados</p>
                            )}
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
}
