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

export function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [technicalTickets, setTechnicalTickets] = useState([]);
    const [facilitiesTickets, setFacilitiesTickets] = useState([]);
    const [consolidatedTickets, setConsolidatedTickets] = useState([]);
    const [voucherTickets, setVoucherTickets] = useState([]);
    const [receivedTickets, setReceivedTickets] = useState([]);
    const [inProcessTickets, setInProcessTickets] = useState([]);
    const [completedTickets, setCompletedTickets] = useState([]);
    const [departmentTickets, setDepartmentTickets] = useState([]); // Tickets filtrados por departamento

    useEffect(() => {
        async function fetchUserDataAndTickets() {
            try {
                const userResponse = await getCurrentUserData();
                const userDepartment = userResponse.data.department;
                const userId = userResponse.data.id;

                setUserData(userResponse.data);

                // Obtener todos los tickets
                const [allTechnical, allFacilities, allConsolidated, allVoucher] =
                    await Promise.all([
                        getAllTicketsTechnical(),
                        getAllTicketsFacilities(),
                        getAllTicketsConsolidated(),
                        getAllTicketsVoucher(),
                    ]);

                // Filtrar tickets en estado "Sent" solo para el usuario logueado para "Tickets by Type"
                setTechnicalTickets(
                    allTechnical.data.filter(
                        (ticket) => ticket.status === "Enviado" && ticket.user?.id === userId
                    )
                );
                setFacilitiesTickets(
                    allFacilities.data.filter(
                        (ticket) => ticket.status === "Enviado" && ticket.user?.id === userId
                    )
                );
                setConsolidatedTickets(
                    allConsolidated.data.filter(
                        (ticket) => ticket.status === "Enviado" && ticket.user?.id === userId
                    )
                );

                setVoucherTickets(
                    allVoucher.data.filter(
                        (ticket) => ticket.status === "Enviado" && ticket.user?.id === userId
                    )
                );

                // Combinar todos los tickets para las otras secciones
                const allTickets = [
                    ...allTechnical.data,
                    ...allFacilities.data,
                    ...allConsolidated.data,
                    ...allVoucher.data,
                ];

                // Filtrar tickets de otros usuarios en el mismo departamento
                const departmentFilteredTickets = allTickets.filter(
                    (ticket) =>
                        ticket.user?.department === userDepartment &&
                        ticket.user?.id !== userId
                );
                setDepartmentTickets(departmentFilteredTickets);

                // Filtrar tickets por estado solo del usuario logueado para la Work Area
                setReceivedTickets(
                    allTickets.filter(
                        (ticket) =>
                            ticket.status === "Leido" && ticket.user?.id === userId
                    )
                );
                setInProcessTickets(
                    allTickets.filter(
                        (ticket) =>
                            ticket.status === "En Proceso" && ticket.user?.id === userId
                    )
                );
                setCompletedTickets(
                    allTickets.filter(
                        (ticket) =>
                            ticket.status === "Finalizado" && ticket.user?.id === userId
                    )
                );
            } catch (error) {
                console.error("Error fetching user data and tickets:", error);
            }
        }

        fetchUserDataAndTickets();
    }, []);

    if (!userData) {
        return (
            <p className="text-center mt-10 text-gray-600">Cargando info del usuario</p>
        );
    }

    const renderTicketCard = (ticket) => {
        if (ticket.custom_id.startsWith("TEC-")) {
            return <TicketTechnicalCard key={ticket.custom_id} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("FAC-")) {
            return <TicketFacilitiesCard key={ticket.custom_id} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("CON-")) {
            return <TicketConsolidatedCard key={ticket.custom_id} ticket={ticket} />;
        } else if (ticket.custom_id.startsWith("VOU-")) {
            return <TicketVoucherCard key={ticket.custom_id} ticket={ticket} />;
        } else {
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl border border-gray-300 grid grid-cols-1 md:grid-cols-2 gap-8 my-20">
                {/* User Data Column */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold my-6 text-center text-gray-700">
                        Perfil
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">
                                Nombre
                            </label>
                            <p className="p-3 border rounded-lg bg-gray-50 text-2xl">
                                {userData.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">
                                Apellido
                            </label>
                            <p className="p-3 border rounded-lg bg-gray-50 text-2xl">
                                {userData.surname}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold text-3xl">
                                Estado
                            </label>
                            <p
                                className={`p-3 border rounded-lg text-2xl ${userData.is_active
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {userData.is_active ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Rol</label>
                            <p
                                className={`p-3 border rounded-lg text-2xl ${userData.is_superuser
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "bg-blue-50 text-blue-700"
                                    }`}
                            >
                                {userData.is_superuser ? "Admin" : "User"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold text-3xl">
                            Email
                        </label>
                        <p className="p-3 border rounded-lg bg-gray-50 text-2xl">
                            {userData.username}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold text-3xl">
                            Departamento
                        </label>
                        <p className="p-3 border rounded-lg bg-gray-50 text-2xl">
                            {userData.department}
                        </p>
                    </div>
                </div>

                {/* Tickets by Type Section */}
                <div className="overflow-y-auto h-[400px] border rounded-lg p-4 bg-gray-50 shadow-inner space-y-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">
                        Tus nuevos tickets
                    </h2>

                    {/* Technical Tickets */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                            Tickets Tecnicos
                        </h3>
                        {technicalTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {technicalTickets.map((ticket) => (
                                    <TicketTechnicalCard key={ticket.custom_id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">
                                Tickets tecnicos no encontrados
                            </p>
                        )}
                    </div>

                    {/* Facilities Tickets */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                            Tickets Facilidades
                        </h3>
                        {facilitiesTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {facilitiesTickets.map((ticket) => (
                                    <TicketFacilitiesCard
                                        key={ticket.custom_id}
                                        ticket={ticket}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">
                                Tickets facilidades no encontrados
                            </p>
                        )}
                    </div>

                    {/* Consolidated Tickets */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                            Tickets Consolidados
                        </h3>
                        {consolidatedTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {consolidatedTickets.map((ticket) => (
                                    <TicketConsolidatedCard
                                        key={ticket.custom_id}
                                        ticket={ticket}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">
                                Tickets consolidados no encontrados
                            </p>
                        )}
                    </div>

                    {/* Voucher Tickets */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">
                            Tickets Comprobantes
                        </h3>
                        {voucherTickets.length > 0 ? (
                            <div className="grid gap-4">
                                {voucherTickets.map((ticket) => (
                                    <TicketVoucherCard key= {ticket.custom_id} ticket={ticket} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-xl">
                                Tickets comprobantes no encontrados
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Work Area Section - Spoiler Style */}
            <details className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-gray-300 my-4">
                <summary className="py-4 px-6 cursor-pointer font-semibold text-lg bg-gray-600 text-white hover:bg-gray-500 rounded-t-lg">
                    Area de Trabajo
                </summary>
                <div className="p-6 overflow-y-auto max-h-[800px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">
                                Tickets Leidos
                            </h3>
                            {receivedTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {receivedTickets.map((ticket) => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">
                                    Tickets leidos no encontrados
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">
                                Tickets en proceso
                            </h3>
                            {inProcessTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {inProcessTickets.map((ticket) => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">
                                    Tickets en proceso no encontrados
                                </p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 text-center">
                                Tickets Finalizados
                            </h3>
                            {completedTickets.length > 0 ? (
                                <div className="grid gap-4">
                                    {completedTickets.map((ticket) => renderTicketCard(ticket))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center text-xl">
                                    Tickets finalizados no encontrados
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </details>

            {/* Department Tickets Section - Spoiler Style */}
            <details className="w-full max-w-5xl bg-white rounded-lg shadow-lg border border-gray-300 my-4">
                <summary className="py-4 px-6 cursor-pointer font-semibold text-lg bg-gray-600 text-white hover:bg-gray-500 rounded-t-lg">
                    Tickets en tu departamento
                </summary>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[800px] p-6">
                    {departmentTickets.length > 0 ? (
                        departmentTickets.map((ticket) => renderTicketCard(ticket))
                    ) : (
                        <p className="text-gray-600 text-center text-xl m-auto">
                            Tickets en tu departamento no encontrados
                        </p>
                    )}
                </div>
            </details>
        </div>
    );
}
