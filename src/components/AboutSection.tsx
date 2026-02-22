import React from 'react';
import { Heart, Award, Clock, Users } from 'lucide-react';

const stats = [
  { icon: Heart, label: 'Handmade Daily', value: '100%' },
  { icon: Award, label: 'Years Experience', value: '5+' },
  { icon: Clock, label: 'Avg Delivery', value: '30 min' },
  { icon: Users, label: 'Happy Customers', value: '2000+' },
];

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Made with Love, <br />
              <span className="text-primary">Served with Care</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                MoMoGo started from a simple passion – bringing authentic, homemade momos to 
                everyone's doorstep. Founded by Sanjida Rahman Shatabdi, our journey began in 
                a home kitchen with traditional family recipes passed down through generations.
              </p>
              <p>
                Every momo we make is handcrafted with love, using fresh ingredients and 
                time-honored techniques. We believe great food brings people together, and 
                that's exactly what we aim to do – one momo at a time.
              </p>
              <p>
                From our kitchen to your table, experience the authentic taste of homemade 
                momos without leaving your home. Order now and taste the difference!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-2xl shadow-card hover-lift text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
