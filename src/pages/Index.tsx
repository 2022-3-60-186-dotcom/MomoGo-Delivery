import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import CheckoutModal from '@/components/CheckoutModal';

const Index: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderNow = () => {
    scrollToSection('menu');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        onNavigate={scrollToSection}
      />
      
      <main>
        <HeroSection onOrderNow={handleOrderNow} />
        <MenuSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default Index;
