import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const CustomerAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signIn, signUp, userRole } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) {
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, authLoading, userRole, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    try {
      if (isLogin) {
        const result = loginSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setValidationErrors(errors);
          return;
        }

        setIsLoading(true);
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          if (error.message.includes('Invalid email or password')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(error.message);
          }
        }
      } else {
        const result = signupSchema.safeParse(formData);

        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0] as string] = err.message;
            }
          });
          setValidationErrors(errors);
          return;
        }

        setIsLoading(true);
        const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone);
        
        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(error.message);
          }
        } else {
          setSuccess('Account created! Please check your email to verify your account.');
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
          });
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            Momo<span className="text-primary">Go</span>
          </span>
        </Link>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            {isLogin
              ? 'Sign in to order your favorite momos'
              : 'Join us for delicious momos delivered to your door'}
          </p>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="bg-primary/10 border border-primary/20 text-primary rounded-lg p-3 mb-4">
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-destructive text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {validationErrors.email && (
                <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {validationErrors.password && (
                <p className="text-destructive text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                'Please wait...'
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setSuccess(null);
                  setValidationErrors({});
                }}
                className="text-primary font-medium ml-1 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Admin Link */}
          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
