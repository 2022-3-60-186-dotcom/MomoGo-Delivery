import React, { useState } from 'react';
import { Plus, Flame, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addItem(item);
      toast({
        title: 'Added to cart',
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover-lift group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isPopular && (
            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </span>
          )}
          {item.isSpicy && (
            <span className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
              <Flame className="w-3 h-3" />
              Spicy
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-card-foreground">{item.name}</h3>
          <span className="text-primary font-bold text-lg">৳{item.price}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <Button 
          variant="warm" 
          className="w-full"
          onClick={handleAddToCart}
          disabled={adding}
        >
          <Plus className="w-4 h-4" />
          {adding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default MenuCard;
