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
  const isStorePage = location.pathname.startsWith('/store/');

  return (
    <>
      <ScrollToHash />
      <div className="flex flex-col min-h-screen">
        {/* Show Header/Footer only on main site, not on store pages */}
        {!isStorePage && <Header />}
        <main className="flex-1">
          <Routes>
            {/* Main Site Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signup" element={<Signup />} />

            {/* Store Routes (Restaurant Subdomains) */}
            <Route path="/store/:subdomain" element={<StorefrontLayout />}>
              <Route index element={<Storefront />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        {!isStorePage && <Footer />}
      </div>
    </>
  );
}

// Wrap App with Router
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
