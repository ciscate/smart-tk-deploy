import { Link } from 'react-router-dom';
import facilitiesIcon from '../../assets/facilities.png';
import technicalIcon from '../../assets/technical.png';
import consolidatedIcon from '../../assets/consolidated.png';
import voucherIcon from '../../assets/voucher.png';

export function TicketCreation() {
    return (
        <div className="flex flex-wrap justify-center gap-8 mt-4 mb-8">
            <Link to="/create-ticketfacilities" title="Facilities">
                <div className="flex flex-col items-center">
                    <img 
                        src={facilitiesIcon} 
                        alt="Facilities"
                        className="w-36 h-36 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <span className="text-xl text-gray-700 text-center">Facilidades</span>
                </div>
            </Link>

            <Link to="/create-tickettechnical" title="Technical">
                <div className="flex flex-col items-center">
                    <img 
                        src={technicalIcon} 
                        alt="Technical"
                        className="w-36 h-36 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <span className="text-xl text-gray-700 text-center">Tecnico</span>
                </div>
            </Link>

            <Link to="/create-ticketconsolidated" title="Consolidated">
                <div className="flex flex-col items-center">
                    <img 
                        src={consolidatedIcon} 
                        alt="Consolidated"
                        className="w-36 h-36 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <span className="text-xl text-gray-700 text-center">Consolidado</span>
                </div>
            </Link>

            <Link to="/create-ticketvoucher" title="Voucher">
                <div className="flex flex-col items-center">
                    <img 
                        src={voucherIcon} 
                        alt="Voucher"
                        className="w-36 h-36 cursor-pointer hover:scale-105 transition-transform"
                    />
                    <span className="text-xl text-gray-700 text-center">Comprobantes</span>
                </div>
            </Link>
        </div>

    );
}
