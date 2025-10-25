import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { login, logout } from '../../services/authService';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { Restaurant } from '../../types/restaurant';
import MenuManagement from '../../components/admin/MenuManagement';
import { getMenuItemsByRestaurant } from '../../services/menuService';

const AdminDashboard = () => {
  const { restaurant } = useOutletContext<{ restaurant: Restaurant }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [showMenuManagement, setShowMenuManagement] = useState(false);

  // Check authentication state on mount and listen for changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check if they own this restaurant
        try {
          const storedRestaurantId = localStorage.getItem('restaurantId');
          if (storedRestaurantId === restaurant.id) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [restaurant.id]);

  // Load menu item count when authenticated
  useEffect(() => {
    const loadStats = async () => {
      if (isAuthenticated && restaurant.id) {
        try {
          const menuItems = await getMenuItemsByRestaurant(restaurant.id);
          setMenuItemCount(menuItems.length);
        } catch (err) {
          console.error('Failed to load menu items:', err);
        }
      }
    };

    loadStats();
  }, [isAuthenticated, restaurant.id]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      // Check if user owns this restaurant
      if (result.userProfile.restaurantId !== restaurant.id) {
        setError('You do not have access to this restaurant');
        setIsLoading(false);
        return;
      }

      // Store restaurant ID in localStorage for persistence
      localStorage.setItem('restaurantId', restaurant.id!);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('restaurantId');
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Login Form
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground">Restaurant Dashboard Login</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href={`/${restaurant.subdomain}`}
                className="text-sm text-primary hover:underline"
              >
                ← Back to Storefront
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard (After Login)
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">{restaurant.name} - Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {!showMenuManagement ? (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Today's Orders</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Revenue Today</h3>
                <p className="text-3xl font-bold">£0</p>
              </div>
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Menu Items</h3>
                <p className="text-3xl font-bold">{menuItemCount}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowMenuManagement(true)}
                  className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl">📋</span>
                    </div>
                    <h3 className="text-lg font-bold">Manage Menu</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, and organize your menu items and categories
                  </p>
                </button>

                <button
                  disabled
                  className="p-6 border-2 border-border rounded-lg opacity-50 cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="text-lg font-bold">View Orders</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage incoming orders and order history (Coming Soon)
                  </p>
                </button>

                <button
                  disabled
                  className="p-6 border-2 border-border rounded-lg opacity-50 cursor-not-allowed text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-lg font-bold">Settings</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure restaurant details and preferences (Coming Soon)
                  </p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setShowMenuManagement(false)}
              className="mb-6 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>

            {/* Menu Management */}
            <MenuManagement
              restaurantId={restaurant.id!}
              onMenuItemsChange={(count) => setMenuItemCount(count)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
