import React, { useState } from 'react';
import { X, MapPin, Phone, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { OrderFormData } from '@/types/menu';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to place an order',
        variant: 'destructive',
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Please add items to your cart before placing an order',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerInfo: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            notes: formData.notes,
          },
        }),
      });

      setIsSuccess(true);
      
      // Clear cart and close modal after successful order
      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        onClose();
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          notes: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-background rounded-2xl z-50 shadow-elevated overflow-hidden animate-scale-in">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-background flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Complete Your Order</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground">
                Thank you for your order. We'll deliver your fresh momos soon!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              {/* Order Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">৳{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <h3 className="font-semibold text-foreground mb-4">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative md:col-span-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="address"
                    placeholder="Delivery Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
                <div>
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative md:col-span-2">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Textarea
                    name="notes"
                    placeholder="Special instructions (optional)"
                    value={formData.notes}
                    onChange={handleChange}
                    className="pl-10 min-h-[100px]"
                  />
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-6"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : `Place Order - ৳${totalPrice}`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
