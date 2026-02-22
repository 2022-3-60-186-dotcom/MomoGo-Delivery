import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold">
              Momo<span className="text-primary">Go</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Home</a>
            <a href="#" className="hover:text-primary transition-colors">Menu</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/70 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in Bangladesh
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} MoMoGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
