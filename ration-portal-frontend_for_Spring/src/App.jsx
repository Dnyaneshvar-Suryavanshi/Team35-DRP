import { Route, Routes } from 'react-router-dom';
import './App.css';
import { LandingPage } from './Pages/LandingPage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectedRoute from './utils/ProtectedRoute';
import ToastProvider from './components/ToastProvider';

// Admin Components
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './Pages/Admin/Dashboard';
import PendingShopkeepers from './Pages/Admin/PendingShopkeepers';
import ManageShops from './Pages/Admin/ManageShops';
import AllocateStock from './Pages/Admin/AllocateStock';
import MonthlyEntitlement from './Pages/Admin/MonthlyEntitlement';
import ViewFamilies from './Pages/Admin/ViewFamilies';
import DistributionLogs from './Pages/Admin/DistributionLogs';
import AdminPaymentLogs from './Pages/Admin/PaymentLogs';

// Shopkeeper Components
import ShopkeeperLayout from './components/Layout/ShopkeeperLayout';
import ShopkeeperDashboard from './Pages/Shopkeeper/Dashboard';
import StockManagement from './Pages/Shopkeeper/StockManagement';
import ManageCitizens from './Pages/Shopkeeper/ManageCitizens';
import DistributeRation from './Pages/Shopkeeper/DistributeRation';
import ShopkeeperDistributionHistory from './Pages/Shopkeeper/DistributionHistory';
import ShopkeeperPaymentHistory from './Pages/Shopkeeper/PaymentHistory';

// Citizen Components
import CitizenLayout from './components/Layout/CitizenLayout';
import CitizenDashboard from './Pages/Citizen/Dashboard';
import RationCard from './Pages/Citizen/RationCard';
import CitizenDistributionHistory from './Pages/Citizen/DistributionHistory';
import About from './components/About';
import Contact from './components/Contact';
import HowItWorks from './Pages/HowItWorks';
import DistributionSummary from './Pages/Admin/DistributionSummary';
import { DistributionDeails } from './Pages/Admin/DistributionDeails';

function App() {
  return (
    <>
      <ToastProvider />
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />


        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pending-shopkeepers" element={<PendingShopkeepers />} />
          <Route path="manage-shops" element={<ManageShops />} />
          <Route path="allocate-stock" element={<AllocateStock />} />
          <Route path="monthly-entitlement" element={<MonthlyEntitlement />} />
          <Route path="view-families" element={<ViewFamilies />} />
          <Route path="distribution-logs" element={<DistributionLogs />} />
          <Route path="distribution-logs/distribution-details/:id" element={<DistributionDeails />} />
          <Route path="distribution-logs-summary" element={<DistributionSummary />} />
          <Route path="payment-logs" element={<AdminPaymentLogs />} />

        </Route>


        <Route
          path="/shopkeeper"
          element={
            <ProtectedRoute allowedRoles={['SHOPKEEPER']}>
              <ShopkeeperLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ShopkeeperDashboard />} />
          <Route path="stock-management" element={<StockManagement />} />
          <Route path="manage-citizens" element={<ManageCitizens />} />
          <Route path="distribute-ration" element={<DistributeRation />} />
          <Route path="distribution-history" element={<ShopkeeperDistributionHistory />} />
          <Route path="payment-history" element={<ShopkeeperPaymentHistory />} />
        </Route>


        <Route
          path="/citizen"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN']}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CitizenDashboard />} />
          <Route path="ration-card" element={<RationCard />} />
          <Route path="distribution-history" element={<CitizenDistributionHistory />} />
        </Route>


        <Route
          path=""
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The page you're looking for doesn't exist.
                </p>
                <a
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
