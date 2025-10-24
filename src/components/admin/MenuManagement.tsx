import { useState, useEffect } from 'react';
import {
  getMenuItemsByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  type MenuItem,
} from '../../services/menuService';

interface MenuManagementProps {
  restaurantId: string;
}

const MenuManagement = ({ restaurantId }: MenuManagementProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load menu items
  useEffect(() => {
    loadMenuItems();
  }, [restaurantId]);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      setError(''); // Clear previous errors
      const items = await getMenuItemsByRestaurant(restaurantId);
      setMenuItems(items);
    } catch (err: any) {
      console.error('Error loading menu items:', err);
      setError(`Failed to load menu items: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      available: true,
    });
    setEditingItem(null);
    setShowAddForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid price');
        return;
      }

      if (editingItem) {
        // Update existing item
        await updateMenuItem(editingItem.id!, {
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
          imageUrl: formData.imageUrl || undefined,
          available: formData.available,
        });
        setSuccess('Menu item updated successfully!');
      } else {
        // Add new item
        await addMenuItem({
          restaurantId,
          name: formData.name,
          description: formData.description,
          price,
          category: formData.category,
          imageUrl: formData.imageUrl || undefined,
          available: formData.available,
        });
        setSuccess('Menu item added successfully!');
      }

      resetForm();
      loadMenuItems();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
      available: item.available,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      setSuccess('Menu item deleted successfully!');
      loadMenuItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      await toggleMenuItemAvailability(itemId, !currentAvailability);
      loadMenuItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update availability');
    }
  };

  // Group items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="relative px-6 py-3 bg-gradient-to-r from-primary to-[#a01822] text-white rounded-lg font-bold overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:animate-shine"></span>
            <span className="relative">+ Add Menu Item</span>
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm font-medium">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price (£) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="9.99"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder="Describe your item..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Pizza, Appetizers, Desserts"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="available" className="text-sm font-medium">
                Available for ordering
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-input rounded-lg font-medium hover:bg-muted/30 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading menu items...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold mb-2">No Menu Items Yet</h3>
          <p className="text-muted-foreground mb-6">Start by adding your first menu item</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="relative px-8 py-4 bg-gradient-to-r from-primary to-[#a01822] text-white rounded-lg font-bold overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:animate-shine"></span>
            <span className="relative">+ Add Menu Item</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">{category}</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{item.name}</h4>
                          {!item.available && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-sm font-bold text-primary mt-1">£{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAvailability(item.id!, item.available)}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          item.available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
