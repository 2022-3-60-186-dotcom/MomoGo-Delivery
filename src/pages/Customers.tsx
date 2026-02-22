import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  orderCount: number;
  createdAt: string;
}

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'customer'>('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchCustomers();
  }, [isAdmin, navigate]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<Customer[]>('/api/users');
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = filter === 'all' 
    ? customers 
    : customers.filter(c => c.role === filter);

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
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'customer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('customer')}
            >
              Customers
            </Button>
            <Button
              variant={filter === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('admin')}
            >
              Admins
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer._id} className="bg-card rounded-xl p-6 shadow-card hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    customer.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-3">{customer.name}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{customer.orderCount} orders</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Customers</p>
            <p className="text-2xl font-bold">{customers.filter(c => c.role === 'customer').length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">Admins</p>
            <p className="text-2xl font-bold">{customers.filter(c => c.role === 'admin').length}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Customers;
