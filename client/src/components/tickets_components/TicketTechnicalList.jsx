import { useEffect, useState } from "react";
import { getAllTicketsTechnical } from "../../api/tickets_api/ticketstechnical.api"; 
import { TicketTechnicalCard } from "./TicketTechnicalCard";

export function TicketTechnicalList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadlTicketsTechnical() {
            try {
                const response = await getAllTicketsTechnical();
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching technical tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadlTicketsTechnical();
    }, []);
    if (loading) {
        return <p>Cargando tickets</p>;
    }
    if (tickets.length === 0) {
                
        return <p>tickets tecnicos no encontrados</p>; 
    }
    return <div className="grid grid-cols-3 gap-3 my-5 w-9/12 mx-auto">
        {tickets.map(ticket =>(
            <TicketTechnicalCard key={ticket.id} ticket={ticket} />
    ))}
    </div>;
}