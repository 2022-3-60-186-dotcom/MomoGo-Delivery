import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or special requests? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Call Us</h3>
            <p className="text-muted-foreground">+880 1234 567890</p>
          </div>

          {/* Email */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">hello@momogo.com</p>
          </div>

          {/* Location */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Location</h3>
            <p className="text-muted-foreground">Dhaka, Bangladesh</p>
          </div>

          {/* Hours */}
          <div className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Hours</h3>
            <p className="text-muted-foreground">10AM - 10PM Daily</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Follow us on social media</p>
          <div className="flex justify-center gap-4">
            <a 
              href="#" 
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-card hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
