import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { login, logout } from '../../services/authService';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { Restaurant } from '../../types/restaurant';
import MenuManagement from '../../components/admin/MenuManagement';
import { getMenuItemsByRestaurant, type MenuItem } from '../../services/menuService';
import { getCategoriesByRestaurant, type Category } from '../../services/categoryService';

const AdminDashboard = () => {
  const { restaurant } = useOutletContext<{ restaurant: Restaurant }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [activeView, setActiveView] = useState<'pos' | 'manage'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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

  // Load categories and menu items when authenticated
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && restaurant.id) {
        try {
          const [categoriesData, menuItemsData] = await Promise.all([
            getCategoriesByRestaurant(restaurant.id),
            getMenuItemsByRestaurant(restaurant.id),
          ]);
          setCategories(categoriesData);
          setMenuItems(menuItemsData);
          setMenuItemCount(menuItemsData.length);
        } catch (err) {
          console.error('Failed to load data:', err);
        }
      }
    };

    loadData();
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

  // Helper function to get category color
  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-red-400 to-red-600',
    ];
    return colors[index % colors.length];
  };

  // Filter menu items by selected category
  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  // Dashboard (After Login)
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">{restaurant.name}</h1>

            {/* Navigation - Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveView('pos');
                  setSelectedCategory(null);
                }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeView === 'pos'
                    ? 'bg-[#cb202d] text-white shadow-md'
                    : 'border-2 border-[#cb202d] text-[#cb202d] hover:bg-[#cb202d] hover:text-white'
                }`}
              >
                📋 Menu View
              </button>
              <button
                onClick={() => setActiveView('manage')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeView === 'manage'
                    ? 'bg-[#cb202d] text-white shadow-md'
                    : 'border-2 border-[#cb202d] text-[#cb202d] hover:bg-[#cb202d] hover:text-white'
                }`}
              >
                ⚙️ Manage
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {activeView === 'pos' ? (
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

            {!selectedCategory ? (
              <>
                {/* Category View - Big Colorful Tiles */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Menu Categories</h2>
                  {categories.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                      <p className="text-muted-foreground mb-4">No categories yet. Create categories in Manage view.</p>
                      <button
                        onClick={() => setActiveView('manage')}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90"
                      >
                        Go to Manage
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categories.map((category, index) => {
                        const itemCount = menuItems.filter(
                          (item) => item.category === category.name
                        ).length;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`${getCategoryColor(
                              index
                            )} text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 active:translate-y-0 transition-all duration-200 group relative overflow-hidden`}
                          >
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                            <div className="relative z-10">
                              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                              {category.description && (
                                <p className="text-sm opacity-90 mb-3">{category.description}</p>
                              )}
                              <div className="inline-block px-3 py-1 bg-white/30 rounded-full text-sm font-medium">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Menu Items View - Product Tiles */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      ← Back to Categories
                    </button>
                    <h2 className="text-2xl font-bold">{selectedCategory}</h2>
                  </div>
                  <p className="text-muted-foreground">
                    {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                {filteredMenuItems.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No items in this category yet. Add items in Manage view.
                    </p>
                    <button
                      onClick={() => setActiveView('manage')}
                      className="px-6 py-3 bg-[#cb202d] text-white rounded-lg font-bold hover:opacity-90"
                    >
                      Add Items
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* POS-Style List for Quick Ordering */}
                    <div className="divide-y divide-gray-200">
                      {filteredMenuItems.map((item) => (
                        <button
                          key={item.id}
                          className={`w-full p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left flex items-center gap-4 ${
                            !item.available ? 'opacity-50' : ''
                          }`}
                          disabled={!item.available}
                        >
                          {/* Item Icon/Image */}
                          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">🍽️</span>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {!item.available && (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium whitespace-nowrap">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-2xl font-bold text-[#cb202d]">
                              £{item.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
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
