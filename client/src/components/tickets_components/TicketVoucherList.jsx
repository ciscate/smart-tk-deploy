import { useEffect, useState } from "react";
import { getAllTicketsVoucher } from "../../api/tickets_api/ticketsvoucher.api"; 
import { TicketVoucherCard } from "./TicketVoucherCard";

export function TicketVoucherList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadlTicketsVoucher() {
            try {
                const response = await getAllTicketsVoucher();
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching voucher tickets:", error);
            } finally {
                setLoading(false);
            }
        }
        loadlTicketsVoucher();
    }, []);
    if (loading) {
        return <p>Cargando tickets...</p>;
    }
    if (tickets.length === 0) {
                
        return <p>Tickets comprobantes no encontrados</p>; 
    }
    return <div className="grid grid-cols-3 gap-3 my-5 w-9/12 mx-auto">
        {tickets.map(ticket =>(
            <TicketVoucherCard key={ticket.id} ticket={ticket} />
    ))}
    </div>;
}