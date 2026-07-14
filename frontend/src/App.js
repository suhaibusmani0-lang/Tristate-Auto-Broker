import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import InventoryPage from './pages/InventoryPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import VehicleFinderPage from './pages/VehicleFinderPage';
import FinancingPage from './pages/FinancingPage';
import MakeDepositPage from './pages/MakeDepositPage';
import DirectionsPage from './pages/DirectionsPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const BACKEND_URL = "https://tristate-auto-broker.onrender.com";
const API = `${BACKEND_URL}/api`;

function App() {
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/:id" element={<VehicleDetailPage />} />
              <Route path="/vehicle-finder" element={<VehicleFinderPage />} />
              <Route path="/financing" element={<FinancingPage />} />
              <Route path="/make-a-deposit" element={<MakeDepositPage />} />
              <Route path="/directions" element={<DirectionsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
