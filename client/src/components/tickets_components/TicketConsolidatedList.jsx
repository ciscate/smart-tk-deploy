import { useEffect, useState } from "react";
import { getAllTicketsConsolidated } from "../../api/tickets_api/ticketsconsolidated.api"; 
import { TicketConsolidatedCard } from "./TicketConsolidatedCard";

export function TicketConsolidatedList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTicketsConsolidated() {
            try {
                const response = await getAllTicketsConsolidated();
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching consolidated tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadTicketsConsolidated();
    }, []);

    if (loading) {
        return <p>CArgando tickets...</p>;
    }

    if (tickets.length === 0) {
        return <p>Tickets consolidados no encontrados</p>;  
    }

    return (
        <div className="grid grid-cols-3 gap-3 my-5 w-9/12 mx-auto">
            {tickets.map(ticket => (
                <TicketConsolidatedCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
    );
}
