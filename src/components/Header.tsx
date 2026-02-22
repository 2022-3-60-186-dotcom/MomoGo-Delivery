import React, { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onNavigate }) => {
  const { totalItems } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'Menu', section: 'menu' },
    { label: 'About', section: 'about' },
    { label: 'Contact', section: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Momo<span className="text-primary">Go</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth & Cart Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="hidden sm:flex"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="hidden sm:flex"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button
              variant="cart"
              size="default"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border mt-3 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    onNavigate(item.section);
                    setIsMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-primary font-medium py-2 text-left transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="text-primary font-medium py-2 text-left transition-colors"
                >
                  Sign In
                </button>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-muted-foreground hover:text-destructive font-medium py-2 text-left transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
