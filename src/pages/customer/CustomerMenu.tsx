import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, User, LogOut, Star, MapPin, Clock, Bike, Store } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useCustomerAuth } from '../../contexts/CustomerAuthContext';
import { getAvailableMenuItems } from '../../services/menuService';
import type { MenuItem } from '../../services/menuService';
import { getRestaurantBySubdomain } from '../../services/restaurantService';

interface Restaurant {
  id: string;
  name: string;
  subdomain: string;
  phone?: string;
  ownerEmail?: string;
}

export const CustomerMenu: React.FC = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const navigate = useNavigate();
  const { cart, addItem, updateQuantity, getItemCount, getSubtotal } = useCart();
  const { customer, signOut } = useCustomerAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'collection'>('delivery');
  const [activeCategory, setActiveCategory] = useState<string>('');

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!subdomain) {
        setError('Restaurant not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const restaurantData = await getRestaurantBySubdomain(subdomain);
        if (!restaurantData) {
          setError('Restaurant not found');
          return;
        }

        setRestaurant({
          id: restaurantData.id,
          name: (restaurantData as any).name,
          subdomain: (restaurantData as any).subdomain,
          phone: (restaurantData as any).phone,
          ownerEmail: (restaurantData as any).ownerEmail,
        });

        const items = await getAvailableMenuItems(restaurantData.id);
        setMenuItems(items);

        // Set first category as active
        if (items.length > 0) {
          const firstCategory = items[0].category;
          setActiveCategory(firstCategory);
        }
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

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = categoryRefs.current[category];
    if (element) {
      const offset = 180; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Restaurant Name */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{restaurant?.name}</h1>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {customer ? (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900 hidden md:inline">
                    {customer.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/${subdomain}/login`)}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info Card */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Restaurant Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant?.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">4.5</span>
                  <span className="text-gray-400">(200+ ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>25-35 mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>1.2 miles</span>
                </div>
              </div>
            </div>

            {/* Right: Delivery/Collection Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  orderType === 'delivery'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bike className="w-5 h-5" />
                <span>Delivery</span>
              </button>
              <button
                onClick={() => setOrderType('collection')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  orderType === 'collection'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Store className="w-5 h-5" />
                <span>Collection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Category Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Menu Categories</h3>
              </div>
              <nav className="py-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-xs text-gray-500">
                        {groupedItems[category].length}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Center - Menu Items */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {categories.map((category) => (
                <div
                  key={category}
                  ref={(el) => (categoryRefs.current[category] = el)}
                  className="scroll-mt-32"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
                  <div className="grid gap-4">
                    {groupedItems[category].map((item) => {
                      const quantityInCart = getItemQuantityInCart(item.id!);
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-4">
                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {item.description}
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                £{item.price.toFixed(2)}
                              </p>
                            </div>

                            {/* Item Image */}
                            {item.imageUrl && (
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            )}

                            {/* Add/Quantity Controls */}
                            <div className="flex items-center">
                              {quantityInCart === 0 ? (
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Add
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-1">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item.id!, quantityInCart - 1)
                                    }
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  >
                                    <Minus className="w-5 h-5" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-blue-600">
                                    {quantityInCart}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item.id!, quantityInCart + 1)
                                    }
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  >
                                    <Plus className="w-5 h-5" />
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
          </main>

          {/* Right Sidebar - Cart Summary */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Cart Header */}
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6" />
                      <h3 className="font-bold text-lg">Basket</h3>
                    </div>
                    {getItemCount() > 0 && (
                      <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                        {getItemCount()} items
                      </span>
                    )}
                  </div>
                </div>

                {/* Cart Content */}
                <div className="p-4">
                  {cart.items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">Your basket is empty</p>
                      <p className="text-sm mt-1">Add items to get started</p>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                        {cart.items.map((item) => (
                          <div
                            key={item.menuItem.id}
                            className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">
                                {item.quantity}x {item.menuItem.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                £{(item.menuItem.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.menuItem.id!,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.menuItem.id!,
                                    item.quantity + 1
                                  )
                                }
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">£{getSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total</span>
                          <span className="text-blue-600">£{getSubtotal().toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleGoToCart}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Basket
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {getItemCount() > 0 && (
        <div className="xl:hidden fixed bottom-4 left-4 right-4 z-50">
          <button
            onClick={handleGoToCart}
            className="w-full flex items-center justify-between px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                {getItemCount()}
              </div>
              <span className="font-bold">View Basket</span>
            </div>
            <span className="font-bold text-lg">£{getSubtotal().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
