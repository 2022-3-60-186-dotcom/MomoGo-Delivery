import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-elevated animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  Add some delicious momos!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const itemId = item._id || item.id || '';
                  return (
                    <div 
                      key={itemId} 
                      className="flex gap-4 bg-card p-3 rounded-xl shadow-card"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                        <p className="text-primary font-bold">৳{item.price}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(itemId, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(itemId, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(itemId)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-bold text-foreground">৳{totalPrice}</span>
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
