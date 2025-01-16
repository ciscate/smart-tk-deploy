import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function TicketConsolidatedCard({ ticket }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [showFullTitle, setShowFullTitle] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [titleChunks, setTitleChunks] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsAdmin(user.is_superuser);
            setIsStaff(user.is_staff && !user.is_superuser);
        }

        const splitIntoChunks = (text, maxLength) => {
            if (!text || text.length === 0) return [];

            const chunks = [];
            let currentPosition = 0;

            while (currentPosition < text.length) {
                let nextPosition = currentPosition + maxLength;

                if (nextPosition < text.length) {
                    const spaceIndex = text.lastIndexOf(' ', nextPosition);
                    if (spaceIndex > currentPosition) {
                        nextPosition = spaceIndex;
                    }
                }

                chunks.push(text.slice(currentPosition, nextPosition).trim());
                currentPosition = nextPosition;
            }

            return chunks;
        };

        setTitleChunks(splitIntoChunks(ticket.title, 10));
    }, [ticket.title]);

    return (
        <div
            className="p-6 rounded-lg shadow-lg border border-gray-300 bg-green-200 hover:bg-green-300 transition cursor-pointer"
            onClick={() => {
                navigate(`/edit-ticketconsolidated/${ticket.id}`);
            }}
        >
            <h1
                className="font-semibold text-gray-800 mb-2 text-2xl"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFullTitle(!showFullTitle);
                }}
            >
                {showFullTitle ? (
                    titleChunks.map((chunk, index) => (
                        <span key={index} className="block">
                            {chunk}
                        </span>
                    ))
                ) : (
                    <span>
                        {ticket.title.length > 10 ? `${ticket.title.slice(0, 10)}...` : ticket.title}
                    </span>
                )}
            </h1>

            <p
                className="text-gray-600 text-lg"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDescription(!showFullDescription);
                }}
            >
                {showFullDescription ? ticket.description : `${ticket.description.slice(0, 10)}...`}
            </p>

            {/* Mostrar información condicionalmente basado en rol */}
            {isAdmin ? (
                ticket.assigned_to ? (
                    <>
                        <p className="text-gray-600 text-lg">{ticket.user.name} {ticket.user.surname}</p>
                        <p className="text-gray-600 text-lg">{ticket.user.department}</p>
                    </>
                ) : (
                    <p className="text-gray-600 text-lg">Asignado a: Sin asignar</p>
                )
            ) : (
                <>
                    <p className="text-gray-600 text-lg">Creado: {ticket.created}</p>
                    <p className="text-gray-600 text-lg">Fecha entrega: {ticket.delivery_date || 'Sin especificar'}</p>
                    {ticket.user && (
                        <>

                            {/* Si el usuario tiene rol staff, omitir los campos de email y "Assigned to" */}
                            {!isStaff && (
                                <>                                
                                    {ticket.assigned_to ? (
                                        <>
                                            <p className="text-gray-600 text-lg">Asignado a:</p>
                                            <p className="text-gray-600 text-lg">
                                                {ticket.assigned_to.name} {ticket.assigned_to.surname}
                                            </p>
                                            
                                        </>
                                    ) : (
                                        <p className="text-gray-600 text-lg">Asignado a: Sin asignar</p>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
