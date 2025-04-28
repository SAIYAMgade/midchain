
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Moon, Sun, LogIn, UserCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page they were trying to access (if any)
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!');
        
        // Find where to redirect based on user role
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const redirect = user.role === 'patient' ? '/patient' : '/doctor';
        
        navigate(redirect);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4" 
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient">MedChain</h1>
          <p className="mt-3 text-muted-foreground">Secure, Transparent Health Records</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-card/70 border">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Create one now
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="bg-muted/50 rounded-lg p-4 backdrop-blur-sm border">
          <p className="text-sm font-medium mb-2">Demo Accounts</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="font-medium">Patient:</span> alice@example.com / password
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-background/50">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Doctor:</span> sara@example.com / password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
