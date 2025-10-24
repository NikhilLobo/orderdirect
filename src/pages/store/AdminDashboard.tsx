import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { login } from '../../services/authService';
import type { Restaurant } from '../../types/restaurant';
import MenuManagement from '../../components/admin/MenuManagement';

const AdminDashboard = () => {
  const { restaurant } = useOutletContext<{ restaurant: Restaurant }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

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
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
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
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Menu Management */}
        <MenuManagement restaurantId={restaurant.id!} />
      </div>
    </div>
  );
};

export default AdminDashboard;
