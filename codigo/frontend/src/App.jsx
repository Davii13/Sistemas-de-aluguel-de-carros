import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardLayout from './layouts/DashboardLayout';

import Catalog from './pages/Client/Catalog';
import ClientOrders from './pages/Client/Orders';
import Profile from './pages/Client/Profile';

import AdminRequests from './pages/Admin/Requests';
import AdminClients from './pages/Admin/Clients';
import AdminFleet from './pages/Admin/Fleet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="catalog" replace />} />
          
          {/* Client Routes */}
          <Route path="catalog" element={<Catalog />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="admin/requests" element={<AdminRequests />} />
          <Route path="admin/clients" element={<AdminClients />} />
          <Route path="admin/fleet" element={<AdminFleet />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
