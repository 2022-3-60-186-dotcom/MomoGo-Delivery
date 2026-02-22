import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Menu, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { Order } from '@/types/order';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return;
      
      try {
        setLoadingOrders(true);
        const data = await apiRequest<Order[]>('/api/orders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const uniqueCustomers = new Set(orders.map(order => order.userId)).size;

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Menu Items', value: '8', icon: Menu, color: 'bg-accent/10 text-accent' },
    { label: 'Customers', value: uniqueCustomers.toString(), icon: Users, color: 'bg-secondary text-secondary-foreground' },
    { label: 'Revenue', value: `৳${totalRevenue}`, icon: BarChart3, color: 'bg-primary/10 text-primary' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">MomoGo Admin</h1>
            <p className="text-sm text-muted-foreground">Management Dashboard</p>
          </div>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="text-background hover:bg-background/10">
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Dashboard Overview</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 shadow-card hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Package className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View Orders</p>
                <p className="text-xs text-muted-foreground">Manage all customer orders</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/admin/menu')}
            >
              <Menu className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Menu Management</p>
                <p className="text-xs text-muted-foreground">Add or edit menu items</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => navigate('/admin/customers')}
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Customers</p>
                <p className="text-xs text-muted-foreground">View customer list</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div id="orders-section" className="mt-8 bg-card rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
          
          {loadingOrders ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
              <p className="text-sm">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4 text-sm font-mono">#{order._id.slice(-6)}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <p className="font-medium">{order.customerInfo.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customerInfo.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{order.items.length} items</td>
                      <td className="py-3 px-4 text-sm font-semibold">৳{order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
