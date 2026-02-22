import React from 'react';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-momo.jpg';

interface HeroSectionProps {
  onOrderNow: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOrderNow }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Delicious steaming momos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Homemade with Love</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up">
            Fresh, Hot & 
            <span className="block text-primary">Delicious Momos</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience the authentic taste of handcrafted momos, made fresh daily and delivered straight to your doorstep.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onOrderNow}
              className="group"
            >
              Order Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl">
              View Menu
            </Button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">30 min delivery</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm">City-wide delivery</span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-sm">4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
