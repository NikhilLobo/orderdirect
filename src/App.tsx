import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import Signup from './pages/Signup';
import StorefrontLayout from './pages/store/StorefrontLayout';
import Storefront from './pages/store/Storefront';
import AdminDashboard from './pages/store/AdminDashboard';
import { CustomerMenu } from './pages/customer/CustomerMenu';
import { CustomerAuth } from './pages/customer/CustomerAuth';
import { CustomerCart } from './pages/customer/CustomerCart';
import { Checkout } from './pages/customer/Checkout';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
import { OrderTracking } from './pages/customer/OrderTracking';
import { CartProvider } from './contexts/CartContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Wait for the page to render
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return null;
}

function App() {
  const location = useLocation();

  // List of main site routes (to show Header/Footer)
  const mainSiteRoutes = ['/', '/restaurants', '/cart', '/signup'];
  const isMainSite = mainSiteRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToHash />
      <div className="flex flex-col min-h-screen">
        {/* Show Header/Footer only on main site pages */}
        {isMainSite && <Header />}
        <main className="flex-1">
          <Routes>
            {/* Main Site Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />

            {/* Restaurant Routes (Multi-tenant) - Catch-all for any subdomain */}
            <Route path="/:subdomain" element={<StorefrontLayout />}>
              <Route index element={<Storefront />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="menu" element={<CustomerMenu />} />
              <Route path="login" element={<CustomerAuth />} />
              <Route path="cart" element={<CustomerCart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="track-order/:orderId" element={<OrderTracking />} />
            </Route>
          </Routes>
        </main>
        {isMainSite && <Footer />}
      </div>
    </>
  );
}

// Wrap App with Router and Providers
function AppWithRouter() {
  return (
    <Router>
      <CustomerAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CustomerAuthProvider>
    </Router>
  );
}

export default AppWithRouter;
