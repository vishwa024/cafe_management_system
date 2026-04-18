import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { ProtectedRoute, RoleRoute, PublicRoute, CustomerPublicRoute, CustomerProtectedRoute } from './components/shared/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OTPVerify from './pages/auth/OTPVerify';
import ForgotPassword from './pages/auth/ForgotPassword';
import OAuthRedirect from './pages/auth/OAuthRedirect';
import ResetPassword from './pages/auth/ResetPassword';

import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutExperience from './pages/customer/CheckoutExperience';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import ProfilePage from './pages/customer/ProfilePage';
import CustomerSettingsPage from './pages/customer/CustomerSettingsPage';
import MenuDetails from './pages/customer/MenuDetails';
import SavedAddressesPage from './pages/customer/SavedAddressesPage';
import FavouritesPage from './pages/customer/FavouritesPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import OffersPage from './pages/customer/OffersPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import DineInBookingPage from './pages/customer/DineInBookingPage';
import DeliveryTrackingPage from './pages/customer/DeliveryTrackingPage';
import InvoicePage from './pages/customer/InvoicePage';
import PreOrderSchedulePage from './pages/customer/PreOrderSchedulePage';
import SupplierOrderResponsePage from './pages/supplier/SupplierOrderResponsePage';




// Tracking pages for different order types
import TakeawayTrackingPage from './pages/customer/TakeawayTrackingPage';
import DineInTrackingPage from './pages/customer/DineInTrackingPage';
import PreOrderTrackingPage from './pages/customer/PreOrderTrackingPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminKitchenPage from './pages/admin/AdminKitchenPage';
import AdminDeliveryPage from './pages/admin/AdminDeliveryPage';

// Manager
import ManagerLayout from './components/manager/ManagerLayout';

// Staff
import OrderQueue from './pages/staff/OrderQueue';
import POSMode from './pages/staff/POSMode';
import PreOrders from './pages/staff/PreOrders';
import StaffProfilePage from './pages/staff/StaffProfilePage';
import StaffSettingsPage from './pages/staff/StaffSettingsPage';
import StaffDashboard from './pages/staff/StaffDashboard';

// Kitchen
import KitchenDisplay from './pages/kitchen/KitchenDisplay';
import InventoryPage from './pages/kitchen/InventoryPage';

// Delivery
import DeliveryApp from './pages/delivery/DeliveryApp';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 2, retry: 1 } },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster position="top-right" toastOptions={{ className: 'font-body text-sm' }} />
          <Routes>

            {/* Auth Routes - Public with redirect if already logged in */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/otp-verify" element={
              <PublicRoute>
                <OTPVerify />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />

            {/* Public Routes - Accessible without login (No authentication required) */}
            <Route path="/" element={<CustomerPublicRoute><HomePage /></CustomerPublicRoute>} />
            <Route path="/home" element={<CustomerPublicRoute><HomePage /></CustomerPublicRoute>} />
            <Route path="/guest-dashboard" element={<CustomerPublicRoute><HomePage /></CustomerPublicRoute>} />
            <Route path="/menu" element={<CustomerPublicRoute><MenuPage /></CustomerPublicRoute>} />
            <Route path="/menu/item/:id" element={<CustomerPublicRoute><MenuDetails /></CustomerPublicRoute>} />
            <Route path="/offers" element={<CustomerPublicRoute><OffersPage /></CustomerPublicRoute>} />
            <Route path="/dine-in" element={<CustomerPublicRoute><DineInBookingPage /></CustomerPublicRoute>} />
            <Route path="/pre-order/schedule" element={<PreOrderSchedulePage />} />
            <Route path="/supplier/orders/:orderId/respond" element={<SupplierOrderResponsePage />} />

            {/* Protected Routes - Require Login (Authentication required) */}
            <Route path="/cart" element={
              <CustomerProtectedRoute>
                <CartPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/checkout" element={
              <CustomerProtectedRoute>
                <CheckoutExperience />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/favourites" element={
              <CustomerProtectedRoute>
                <FavouritesPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/reviews" element={
              <CustomerProtectedRoute>
                <ReviewsPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <CustomerProtectedRoute>
                <NotificationsPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/invoice/:orderId" element={
              <CustomerPublicRoute>
                <InvoicePage />
              </CustomerPublicRoute>
            } />
            
            <Route path="/addresses" element={
              <CustomerProtectedRoute>
                <SavedAddressesPage />
              </CustomerProtectedRoute>
            } />
            
            {/* Tracking Routes - Require Login */}
            <Route path="/track-delivery/:orderId" element={
              <CustomerProtectedRoute>
                <DeliveryTrackingPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/track-takeaway/:orderId" element={
              <CustomerProtectedRoute>
                <TakeawayTrackingPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/track-dinein/:orderId" element={
              <CustomerProtectedRoute>
                <DineInTrackingPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/track-preorder/:orderId" element={
              <CustomerProtectedRoute>
                <PreOrderTrackingPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/track/:orderId" element={
              <CustomerProtectedRoute>
                <OrderTrackingPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <CustomerProtectedRoute>
                <HomePage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <CustomerProtectedRoute>
                <OrderHistoryPage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <CustomerProtectedRoute>
                <ProfilePage />
              </CustomerProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <CustomerProtectedRoute>
                <CustomerSettingsPage />
              </CustomerProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <AdminProfilePage />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <UserManagement />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <CustomerManagement />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/menu" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin', 'manager']}>
                  <MenuManagement />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin', 'manager']}>
                  <OrderManagement />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin', 'manager']}>
                  <Reports />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <Settings />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/kitchen" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <AdminKitchenPage />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/delivery" element={
              <ProtectedRoute>
                <RoleRoute roles={['admin']}>
                  <AdminDeliveryPage />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* Manager Routes */}
            <Route path="/manager/*" element={
              <ProtectedRoute>
                <RoleRoute roles={['manager']}>
                  <ManagerLayout />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <StaffDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/dashboard" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <StaffDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/queue" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <OrderQueue />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/pos" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <POSMode />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/preorders" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <PreOrders />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/profile" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <StaffProfilePage />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/staff/settings" element={
              <ProtectedRoute>
                <RoleRoute roles={['staff']}>
                  <StaffSettingsPage />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* Kitchen Routes */}
            <Route path="/kitchen" element={
              <ProtectedRoute>
                <RoleRoute roles={['kitchen']}>
                  <KitchenDisplay />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/kitchen/kds" element={
              <ProtectedRoute>
                <RoleRoute roles={['kitchen']}>
                  <KitchenDisplay />
                </RoleRoute>
              </ProtectedRoute>
            } />
            <Route path="/kitchen/inventory" element={
              <ProtectedRoute>
                <RoleRoute roles={['kitchen']}>
                  <InventoryPage />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* Delivery Routes */}
            <Route path="/delivery" element={
              <ProtectedRoute>
                <RoleRoute roles={['delivery']}>
                  <DeliveryApp />
                </RoleRoute>
              </ProtectedRoute>
            } />

            {/* Fallback - Redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}
