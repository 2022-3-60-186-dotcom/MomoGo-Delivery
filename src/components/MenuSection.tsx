import React, { useState, useEffect } from 'react';
import { categories } from '@/data/menu';
import MenuCard from './MenuCard';
import { MenuItem } from '@/types/menu';
import { apiRequest } from '@/lib/api';

const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('/api/menu');
        setMenuItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Menu
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Handcrafted with Passion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every momo is made fresh to order using traditional recipes and the finest ingredients. Choose your favorite style!
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading menu items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item._id || item.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
