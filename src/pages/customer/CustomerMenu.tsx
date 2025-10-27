import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, User, LogOut, Search } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { getAvailableMenuItems } from '../../services/menuService';
import type { MenuItem } from '../../services/menuService';
import { getRestaurantBySubdomain } from '../../services/restaurantService';

interface Restaurant {
  id: string;
  name: string;
  subdomain: string;
}

const getCategoryColor = (categoryName: string, allCategories: string[]) => {
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
  const index = allCategories.findIndex((cat) => cat === categoryName);
  return colors[index % colors.length];
};

export const CustomerMenu: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const navigate = useNavigate();
  const { cart, addItem, updateQuantity, getItemCount, getTotal } = useCart();
  const { customer, signOut } = useCustomerAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!subdomain) {
        setError('Restaurant not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch restaurant info
        const restaurantData = await getRestaurantBySubdomain(subdomain);
        if (!restaurantData) {
          setError('Restaurant not found');
          return;
        }

        setRestaurant({
          id: restaurantData.id,
          name: (restaurantData as any).name,
          subdomain: (restaurantData as any).subdomain,
        });

        // Fetch available menu items
        const items = await getAvailableMenuItems(restaurantData.id);
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categories = Object.keys(groupedItems).sort();

  // Filter items based on search and selected category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Regroup filtered items
  const filteredGroupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const getItemQuantityInCart = (menuItemId: string): number => {
    const cartItem = cart.items.find((item) => item.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    if (!restaurant) return;
    addItem(menuItem, restaurant.id, restaurant.name);
  };

  const handleUpdateQuantity = (menuItemId: string, newQuantity: number) => {
    updateQuantity(menuItemId, newQuantity);
  };

  const handleGoToCart = () => {
    navigate(`/${subdomain}/cart`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name}</h1>
              <p className="text-sm text-gray-500">Browse our menu</p>
            </div>

            <div className="flex items-center gap-4">
              {customer ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/${subdomain}/login`)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={handleGoToCart}
                className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="pb-4 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(filteredGroupedItems).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredGroupedItems).map(([category, items]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`${getCategoryColor(
                      category,
                      categories
                    )} text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md`}
                  >
                    {category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const quantityInCart = getItemQuantityInCart(item.id!);
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Item Image */}
                        {item.imageUrl && (
                          <div className="h-48 bg-gray-200">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Item Details */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-blue-600">
                              ${item.price.toFixed(2)}
                            </span>

                            {/* Add to Cart / Quantity Controls */}
                            {quantityInCart === 0 ? (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id!, quantityInCart - 1)
                                  }
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-900">
                                  {quantityInCart}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(item.id!, quantityInCart + 1)
                                  }
                                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Summary (Mobile) */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-lg">
          <button
            onClick={handleGoToCart}
            className="w-full flex items-center justify-between px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">{getItemCount()} items</span>
            </div>
            <span className="font-bold">${getTotal().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
