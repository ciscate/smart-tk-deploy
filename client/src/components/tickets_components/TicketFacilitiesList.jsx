import { useEffect, useState } from "react";
import { getAllTicketsFacilities } from "../../api/tickets_api/ticketsfacilities.api"; 
import { TicketFacilitiesCard } from "./TicketFacilitiesCard";

export function TicketFacilitiesList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTicketsFacilities() {
            try {
                const response = await getAllTicketsFacilities();
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching facilities tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTicketsFacilities();
    }, []);

    if (loading) {
        return <p>Cargando tickets...</p>;
    }

    if (tickets.length === 0) {
        return <p>Tickets facilidades no encontrados</p>;  
    }

    return (
        <div className="grid grid-cols-3 gap-3 my-5 w-9/12 mx-auto">
            {tickets.map(ticket => (
                <TicketFacilitiesCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
    );
}
