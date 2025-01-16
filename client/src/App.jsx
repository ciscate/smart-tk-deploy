// App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TicketsPage } from './pages/tickets_page/TicketsPage';
import { TicketFacilitiesFormPage } from './pages/tickets_page/TicketFacilitiesFormPage';
import { TicketVoucherFormPage } from './pages/tickets_page/TicketVoucherFormPage';
import { TicketConsolidatedFormPage } from './pages/tickets_page/TicketConsolidatedFormPage';
import { TicketTechnicalFormPage } from './pages/tickets_page/TicketTechnicalFormPage';
import { LoginPage } from './pages/LoginPage';
import { IndexPage } from './pages/IndexPage';
import { Navigation } from "./components/Navigation";
import { TicketFacilitiesDetailPage } from "./pages/tickets_page/TicketFacilitiesDetailPage";
import { TicketConsolidatedDetailPage } from "./pages/tickets_page/TicketConsolidatedDetailPage";
import { TicketTechnicalDetailPage } from "./pages/tickets_page/TicketTechnicalDetailPage";
import { TicketVoucherDetailPage } from "./pages/tickets_page/TicketVoucherDetailPage";
import { Toaster } from "react-hot-toast";
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfileAdminPage } from './pages/ProfileAdminPage';
import { ProfileStaffPage } from './pages/ProfileStaffPage';
import { AuthProvider } from './contexts/AuthContext'; // Importar AuthProvider
import { CreationPage } from './pages/CreationPage';
import ProtectedRoute from './components/ProtectedRoute' 
import { Footer } from './components/Footer'


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className='text-3xl font-bold text-center font-mono'>
                    <Navigation />
                    <Routes>
                        <Route path='/' element={<IndexPage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/profile' element={<ProtectedRoute element={<ProfilePage />} />} />
                        <Route path='/profile-admin' element={<ProtectedRoute element={<ProfileAdminPage />} />} />
                        <Route path='/profile-staff' element={<ProtectedRoute element={<ProfileStaffPage />} />} />
                        <Route path='/tickets' element={<ProtectedRoute element={<TicketsPage />} />} />
                        <Route path='/create' element={<ProtectedRoute element={<CreationPage />} />} />
                        <Route path='/create-ticketfacilities' element={<ProtectedRoute element={<TicketFacilitiesFormPage />} />} />
                        <Route path='/create-ticketconsolidated' element={<ProtectedRoute element={<TicketConsolidatedFormPage />} />} />
                        <Route path='/create-tickettechnical' element={<ProtectedRoute element={<TicketTechnicalFormPage />} />} />
                        <Route path='/create-ticketvoucher' element={<ProtectedRoute element={<TicketVoucherFormPage />} />} />
                        <Route path='/edit-ticketfacilities/:id' element={<ProtectedRoute element={<TicketFacilitiesDetailPage />} />} />
                        <Route path='/edit-ticketvoucher/:id' element={<ProtectedRoute element={<TicketVoucherDetailPage />} />} />
                        <Route path='/edit-ticketconsolidated/:id' element={<ProtectedRoute element={<TicketConsolidatedDetailPage />} />} />
                        <Route path='/edit-tickettechnical/:id' element={<ProtectedRoute element={<TicketTechnicalDetailPage />} />} />
                    </Routes>
                    <Footer />
                    <Toaster />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;