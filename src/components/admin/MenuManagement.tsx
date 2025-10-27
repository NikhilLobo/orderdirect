import { useState, useEffect } from 'react';
import {
  getMenuItemsByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  type MenuItem,
} from '../../services/menuService';
import {
  getCategoriesByRestaurant,
  addCategory,
  updateCategory,
  updateCategoryWithItems,
  deleteCategory,
  type Category,
} from '../../services/categoryService';

interface MenuManagementProps {
  restaurantId: string;
  onMenuItemsChange?: (count: number) => void;
}

const MenuManagement = ({ restaurantId, onMenuItemsChange }: MenuManagementProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get category color (matching POS dashboard)
  const getCategoryColor = (categoryName: string) => {
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
    // Use category name to consistently get the same color
    const index = categories.findIndex((cat) => cat.name === categoryName);
    return colors[index % colors.length];
  };

  // Category management
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });

  // Menu item management
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuItemFormData, setMenuItemFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [categoriesData, itemsData] = await Promise.all([
        getCategoriesByRestaurant(restaurantId),
        getMenuItemsByRestaurant(restaurantId),
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);

      // Notify parent of menu item count change
      if (onMenuItemsChange) {
        onMenuItemsChange(itemsData.length);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(`Failed to load data: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Category Functions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        // Check if the category name changed
        const oldName = editingCategory.name;
        const newName = categoryFormData.name;

        console.log('[MenuManagement] Editing category:', { oldName, newName, nameChanged: oldName !== newName });

        if (oldName !== newName) {
          // Category name changed - update category and all menu items
          console.log('[MenuManagement] Category name changed - updating items...');
          await updateCategoryWithItems(
            editingCategory.id!,
            oldName,
            newName,
            restaurantId
          );
          setSuccess('Category and menu items updated successfully!');
        } else {
          // Only description changed
          await updateCategory(editingCategory.id!, {
            name: categoryFormData.name,
            description: categoryFormData.description,
          });
          setSuccess('Category updated successfully!');
        }
      } else {
        await addCategory({
          restaurantId,
          name: categoryFormData.name,
          description: categoryFormData.description,
          displayOrder: categories.length,
        });
        setSuccess('Category added successfully!');
      }

      setCategoryFormData({ name: '', description: '' });
      setEditingCategory(null);
      setShowCategoryForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure? This will not delete menu items in this category.')) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      setSuccess('Category deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  // Menu Item Functions
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const price = parseFloat(menuItemFormData.price);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid price');
        return;
      }

      if (!menuItemFormData.category) {
        setError('Please select a category');
        return;
      }

      if (editingItem) {
        await updateMenuItem(editingItem.id!, {
          name: menuItemFormData.name,
          description: menuItemFormData.description,
          price,
          category: menuItemFormData.category,
          imageUrl: menuItemFormData.imageUrl || undefined,
          available: menuItemFormData.available,
        });
        setSuccess('Menu item updated successfully!');
      } else {
        await addMenuItem({
          restaurantId,
          name: menuItemFormData.name,
          description: menuItemFormData.description,
          price,
          category: menuItemFormData.category,
          imageUrl: menuItemFormData.imageUrl || undefined,
          available: menuItemFormData.available,
        });
        setSuccess('Menu item added successfully!');
      }

      setMenuItemFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        available: true,
      });
      setEditingItem(null);
      setShowMenuItemForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save menu item');
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setMenuItemFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl || '',
      available: item.available,
    });
    setShowMenuItemForm(true);
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      setSuccess('Menu item deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      await toggleMenuItemAvailability(itemId, !currentAvailability);
      loadData();
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
      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Categories Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Menu Categories</h2>
          {!showCategoryForm && (
            <button
              onClick={() => setShowCategoryForm(true)}
              className="px-6 py-3 bg-[#cb202d] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              + Add Category
            </button>
          )}
        </div>

        {/* Category Form */}
        {showCategoryForm && (
          <div className="mb-6 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
            <h3 className="text-lg font-bold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Pizza, Appetizers, Desserts"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Brief description"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#cb202d] text-white rounded-lg font-medium hover:opacity-90"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setCategoryFormData({ name: '', description: '' });
                  }}
                  className="px-6 py-2 border border-input rounded-lg font-medium hover:bg-muted/30"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories yet. Add your first category to organize your menu.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {itemsByCategory[category.name]?.length || 0} items
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setCategoryFormData({
                          name: category.name,
                          description: category.description || '',
                        });
                        setShowCategoryForm(true);
                      }}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id!)}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Menu Items</h2>
          {!showMenuItemForm && categories.length > 0 && (
            <button
              onClick={() => setShowMenuItemForm(true)}
              className="px-6 py-3 bg-[#cb202d] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              + Add Menu Item
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Please create at least one category before adding menu items.</p>
          </div>
        ) : (
          <>
            {/* Menu Item Form */}
            {showMenuItemForm && (
              <div className="mb-6 p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                <h3 className="text-lg font-bold mb-4">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <form onSubmit={handleAddMenuItem} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Item Name *</label>
                      <input
                        type="text"
                        value={menuItemFormData.name}
                        onChange={(e) => setMenuItemFormData({ ...menuItemFormData, name: e.target.value })}
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
                        value={menuItemFormData.price}
                        onChange={(e) => setMenuItemFormData({ ...menuItemFormData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="9.99"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={menuItemFormData.description}
                      onChange={(e) => setMenuItemFormData({ ...menuItemFormData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                      placeholder="Describe your item..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={menuItemFormData.category}
                        onChange={(e) => setMenuItemFormData({ ...menuItemFormData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
                      <input
                        type="url"
                        value={menuItemFormData.imageUrl}
                        onChange={(e) => setMenuItemFormData({ ...menuItemFormData, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={menuItemFormData.available}
                      onChange={(e) => setMenuItemFormData({ ...menuItemFormData, available: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="available" className="text-sm font-medium">
                      Available for ordering
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#cb202d] text-white rounded-lg font-medium hover:opacity-90"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenuItemForm(false);
                        setEditingItem(null);
                        setMenuItemFormData({
                          name: '',
                          description: '',
                          price: '',
                          category: '',
                          imageUrl: '',
                          available: true,
                        });
                      }}
                      className="px-6 py-2 border border-input rounded-lg font-medium hover:bg-muted/30"
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
              <div className="text-center py-8">
                <p className="text-muted-foreground">No menu items yet. Add your first item!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(itemsByCategory).map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className={`${getCategoryColor(categoryName)} text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md`}>
                        {categoryName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
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
                              onClick={() => handleEditMenuItem(item)}
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id!)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
