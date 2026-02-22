import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const AdminAuth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signIn, isAdmin, userRole } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        // If logged in but not admin, show error and sign out
        setError('Access denied. This portal is for administrators only.');
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const result = loginSchema.safeParse(formData);

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

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        if (error.message.includes('Invalid email or password')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(error.message);
        }
      }
      // Role check happens in useEffect after successful login
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
    <div className="min-h-screen bg-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-warm">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-background">
              Momo<span className="text-primary">Go</span>
            </span>
            <p className="text-sm text-muted-foreground">Admin Portal</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-2xl shadow-elevated p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Access the management dashboard
          </p>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Admin Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {validationErrors.email && (
                <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

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

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                'Authenticating...'
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Customer Link */}
          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Customer Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          This is a secure area. Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
