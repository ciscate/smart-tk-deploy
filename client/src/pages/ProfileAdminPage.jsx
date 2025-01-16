import { useEffect, useState } from "react";
import { getCurrentUserData } from "../api/users_api/usersapi";
import { getAllTicketsTechnical } from "../api/tickets_api/ticketstechnical.api";
import { getAllTicketsFacilities } from "../api/tickets_api/ticketsfacilities.api";
import { getAllTicketsConsolidated } from "../api/tickets_api/ticketsconsolidated.api";
import { getAllTicketsVoucher } from "../api/tickets_api/ticketsvoucher.api";
import { TicketTechnicalCard } from "../components/tickets_components/TicketTechnicalCard";
import { TicketFacilitiesCard } from "../components/tickets_components/TicketFacilitiesCard";
import { TicketConsolidatedCard } from "../components/tickets_components/TicketConsolidatedCard";
import { TicketVoucherCard } from "../components/tickets_components/TicketVoucherCard";

export function ProfileAdminPage() {
    const [userData, setUserData] = useState(null);
    const [technicalTickets, setTechnicalTickets] = useState([]);
    const [facilitiesTickets, setFacilitiesTickets] = useState([]);
    const [consolidatedTickets, setConsolidatedTickets] = useState([]);
    const [voucherTickets, setVoucherTickets] = useState([]);
    const [assignedTicketsByStaff, setAssignedTicketsByStaff] = useState({});

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getCurrentUserData();
                setUserData(response.data);

                const technicalResponse = await getAllTicketsTechnical();
                const facilitiesResponse = await getAllTicketsFacilities();
                const consolidatedResponse = await getAllTicketsConsolidated();
                const voucherResponse = await getAllTicketsVoucher();

                // Filtrar tickets no asignados
                setTechnicalTickets(technicalResponse.data.filter(ticket => ticket.assigned_to === null));
                setFacilitiesTickets(facilitiesResponse.data.filter(ticket => ticket.assigned_to === null));
                setConsolidatedTickets(consolidatedResponse.data.filter(ticket => ticket.assigned_to === null));
                setVoucherTickets(voucherResponse.data.filter(ticket => ticket.assigned_to === null));

                // Agrupar los tickets asignados por staff
                const allAssignedTickets = [
                    ...technicalResponse.data.filter(ticket => ticket.assigned_to !== null),
                    ...facilitiesResponse.data.filter(ticket => ticket.assigned_to !== null),
                    ...consolidatedResponse.data.filter(ticket => ticket.assigned_to !== null),
                    ...voucherResponse.data.filter(ticket => ticket.assigned_to !== null),
                ];

                const groupedByStaff = allAssignedTickets.reduce((acc, ticket) => {
                    const staffId = ticket.assigned_to.id;
                    if (!acc[staffId]) acc[staffId] = [];
                    acc[staffId].push(ticket);
                    return acc;
                }, {});

                setAssignedTicketsByStaff(groupedByStaff);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);

    if (!userData) {
        return <p className="text-center mt-10 text-gray-600">Cargando info del usuario</p>;
    }

    const renderTicketCard = (ticket) => {
        const uniqueKey = `${ticket.custom_id}-${ticket.id}`;
        if (ticket.custom_id.startsWith("TEC-")) {
            return <TicketTechnicalCard key={uniqueKey} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("FAC-")) {
            return <TicketFacilitiesCard key={uniqueKey} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("CON-")) {
            return <TicketConsolidatedCard key={uniqueKey} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("VOU-")) {
            return <TicketVoucherCard key={uniqueKey} ticket={ticket} />;
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
                            <p className={`p-3 border rounded-lg text-2xl ${userData.is_superuser ? 'bg-yellow-50 text-yellow-700' : ' bg-blue-50 text-blue-700'}`}>
                                {userData.is_superuser ? "Admin" : "User"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold text-3xl">Email</label>
                        <p className="p-3 border rounded-lg bg-gray-50 text-2xl">{userData.username}</p>
                    </div>
                </div>

                {/* All Tickets Section - Only Unassigned Tickets */}
                <div className="overflow-y-auto h-[400px] border rounded-lg p-4 bg-gray-50 shadow-inner space-y-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">Tickets sin asignar</h2>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Tecnicos</h3>
                        {technicalTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {technicalTickets.map(ticket => (
                                    <TicketTechnicalCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets Tecnicos sin asignar no encontrados.</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Facilidades</h3>
                        {facilitiesTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {facilitiesTickets.map(ticket => (
                                    <TicketFacilitiesCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets Facilidades sin asignar no encontrados.</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Consolidados</h3>
                        {consolidatedTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {consolidatedTickets.map(ticket => (
                                    <TicketConsolidatedCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets Consolidados sin asignar no encontrados.</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Tickets Comprobantes</h3>
                        {voucherTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {voucherTickets.map(ticket => (
                                    <TicketVoucherCard key={ticket.id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">Tickets Comprobantes sin asignar no encontrados.</p>
                        )}
                    </div>
                </div>
            </div>

            <details className="w-full max-w-9/12 bg-white rounded-lg shadow-lg border border-gray-300 my-4">
                <summary className="py-6 px-6 cursor-pointer font-semibold text-lg bg-gray-600 text-white hover:bg-gray-500 rounded-t-lg mb-6">
                    Área de Trabajo - Tickets Asignados por Staff
                </summary>
                <div className="p-6 overflow-y-auto max-h-[800px]">
                    {Object.entries(assignedTicketsByStaff).length === 0 ? (
                        <p className="text-gray-600 text-center text-xl">No hay tickets asignados aún</p>
                    ) : (
                        Object.entries(assignedTicketsByStaff).map(([staffId, tickets]) => (
                            <details key={staffId} className="mb-8">
                                <summary className="cursor-pointer text-2xl font-semibold text-gray-700 mb-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                                    Staff: {tickets[0]?.assigned_to.name} {tickets[0]?.assigned_to.surname}
                                </summary>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4 p-4 border border-gray-200 rounded">
                                    
                                    {/* Sent Tickets */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 text-center">Tickets Enviados</h4>
                                        {tickets.filter(ticket => ticket.status === "Enviado").length > 0 ? (
                                            <div className="grid gap-4">
                                                {tickets.filter(ticket => ticket.status === "Enviado").map(ticket => renderTicketCard(ticket))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center text-xl">Tickets no enviados no encontrados</p>
                                        )}
                                    </div>

                                    {/* Received Tickets */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 text-center">Tickets Leidos</h4>
                                        {tickets.filter(ticket => ticket.status === "Leido").length > 0 ? (
                                            <div className="grid gap-4">
                                                {tickets.filter(ticket => ticket.status === "Leido").map(ticket => renderTicketCard(ticket))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center text-xl">Tickets no leidos no encontrados</p>
                                        )}
                                    </div>

                                    {/* In Process Tickets */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 text-center">Tickets en proceso</h4>
                                        {tickets.filter(ticket => ticket.status === "En Proceso").length > 0 ? (
                                            <div className="grid gap-4">
                                                {tickets.filter(ticket => ticket.status === "En Proceso").map(ticket => renderTicketCard(ticket))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center text-xl">Tickets en proceso no encontrados</p>
                                        )}
                                    </div>

                                    {/* Completed Tickets */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 text-center">Tickets Finalizados</h4>
                                        {tickets.filter(ticket => ticket.status === "Finalizado").length > 0 ? (
                                            <div className="grid gap-4">
                                                {tickets.filter(ticket => ticket.status === "Finalizado").map(ticket => renderTicketCard(ticket))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center text-xl">Tickets finalizados no encontrados</p>
                                        )}
                                    </div>
                                </div>
                            </details>
                        ))
                    )}
                </div>
            </details>
        </div>
    );
}
