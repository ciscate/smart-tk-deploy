import { TicketTechnicalList } from "../../components/tickets_components/TicketTechnicalList";
import { TicketFacilitiesList } from "../../components/tickets_components/TicketFacilitiesList";
import { TicketConsolidatedList } from "../../components/tickets_components/TicketConsolidatedList";
import { TicketVoucherList } from "../../components/tickets_components/TicketVoucherList";

export function TicketsPage(){
    return <div>
        <div className="my-28 text-7xl"><h1>
                TICKETS
            </h1>
        </div>
            <TicketConsolidatedList/>
            <TicketFacilitiesList/>
            <TicketTechnicalList/>
            <TicketVoucherList/>
    </div>
}