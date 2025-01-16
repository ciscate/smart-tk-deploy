import { TicketCreation } from '../components/tickets_components/TicketCreation'; // Ajusta la ruta de importación según tu estructura de carpetas.

export function CreationPage() {
    return (
        <div className="flex items-center justify-center min-h-96 bg-blue-100 p-6 mt-20 w-3/6 mx-auto rounded-lg">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl border border-gray-300">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-700 mb-10">Nuevo Ticket</h1>
                <TicketCreation />
            </div>
        </div>
    );
}
