import React from "react"; // Asegúrate de que React esté importado
import { Link } from 'react-router-dom'; // Importar Link desde react-router-dom



export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-16">
            <div className="max-w-full mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-8">

                    {/* Sección de redes sociales 
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
                        <div className="flex justify-center md:justify-start space-x-6">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>*/}

                    {/* Sección de contacto */}
                    <div className="text-left ml-20 md:text-left">
                        <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
                        <p className="text-sm">Email: <a href="mailto:francisco@smartbpo.ar" className="hover:text-blue-400">francisco@smartbpo.ar</a></p>
                    </div>
                    <div className="mt-8 text-right mr-20 ">
                    <p className="text-sm">&copy; 2024 Smart TK. Todos los derechos reservados.</p>
                </div>
                </div>
            </div>
        </footer>
    );
}

