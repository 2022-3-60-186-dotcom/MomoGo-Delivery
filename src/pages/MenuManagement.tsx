import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { MenuItem } from '@/types/menu';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'steam' as 'steam' | 'fried' | 'special',
    isPopular: false,
    isSpicy: false,
    isAvailable: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchMenuItems();
  }, [isAdmin, navigate]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<MenuItem[]>('/api/menu');
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      if (!formData.name || !formData.description || !formData.price || !formData.image) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      await apiRequest('/api/menu', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      toast({
        title: 'Success',
        description: 'Menu item added successfully',
      });

      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'steam',
        isPopular: false,
        isSpicy: false,
        isAvailable: true,
      });
      fetchMenuItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add menu item',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      await apiRequest(`/api/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
      });

      setEditingId(null);
      fetchMenuItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update menu item',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await apiRequest(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      });

      fetchMenuItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      });
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Add Form */}
        {showAddForm && (
          <div className="bg-card rounded-xl p-6 shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Menu Item</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Input
                placeholder="Image URL (e.g., /src/assets/image.jpg)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="md:col-span-2"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="md:col-span-2 w-full px-3 py-2 border border-input rounded-md bg-background"
                rows={3}
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'steam' | 'fried' | 'special' })}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="steam">Steamed</option>
                <option value="fried">Fried</option>
                <option value="special">Special</option>
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                  Popular
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isSpicy}
                    onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                  />
                  Spicy
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  Available
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-card rounded-xl p-4 shadow-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingId(item._id || null)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteItem(item._id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">৳{item.price}</span>
                    <span className="text-sm capitalize px-2 py-1 bg-accent rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {item.isPopular && (
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">Popular</span>
                    )}
                    {item.isSpicy && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Spicy</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuManagement;
