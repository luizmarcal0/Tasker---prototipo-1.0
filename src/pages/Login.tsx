
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

// Mock users for demo purposes - in a real app this would be in a secure database
const MOCK_USERS = [
  { email: 'user@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' }
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(() => {
    // Check if there are saved login attempts in localStorage
    const saved = localStorage.getItem('loginAttempts');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isLocked, setIsLocked] = useState(() => {
    // Check if account is locked
    const lockTime = localStorage.getItem('loginLockTime');
    if (!lockTime) return false;
    
    const lockTimeExpiry = parseInt(lockTime, 10);
    return Date.now() < lockTimeExpiry;
  });
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Check and update login lock status
  useEffect(() => {
    const lockTime = localStorage.getItem('loginLockTime');
    
    if (lockTime) {
      const lockTimeExpiry = parseInt(lockTime, 10);
      const currentTime = Date.now();
      
      if (currentTime < lockTimeExpiry) {
        setIsLocked(true);
        setLockTimeRemaining(Math.ceil((lockTimeExpiry - currentTime) / 1000));
        
        // Set up interval to update countdown
        const interval = setInterval(() => {
          const now = Date.now();
          const remaining = Math.ceil((lockTimeExpiry - now) / 1000);
          
          if (remaining <= 0) {
            setIsLocked(false);
            clearInterval(interval);
            localStorage.removeItem('loginLockTime');
            localStorage.removeItem('loginAttempts');
          } else {
            setLockTimeRemaining(remaining);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        // Lock expired
        setIsLocked(false);
        localStorage.removeItem('loginLockTime');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow login attempts if locked
    if (isLocked) return;
    
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);

      if (user) {
        // Successful login
        localStorage.removeItem('loginAttempts');
        localStorage.setItem('isLoggedIn', 'true');
        toast({
          title: "Login bem-sucedido!",
          description: "Você será redirecionado para a página inicial.",
        });
        navigate('/');
      } else {
        // Failed login
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        localStorage.setItem('loginAttempts', newAttemptCount.toString());
        
        // Check if we need to lock the account
        if (newAttemptCount >= 5) {
          // Lock for 30 seconds (in a real app, you might want to lock for longer)
          const lockExpiry = Date.now() + 30000; // 30 seconds
          localStorage.setItem('loginLockTime', lockExpiry.toString());
          setIsLocked(true);
          setLockTimeRemaining(30);
          setError('Conta bloqueada por muitas tentativas. Tente novamente em 30 segundos.');
        } else {
          setError(`Credenciais inválidas. Tentativa ${newAttemptCount} de 5.`);
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Show a toast message informing the user about password reset
    toast({
      title: "Redefinição de senha",
      description: "Instruções de redefinição foram enviadas para o seu e-mail.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre com seu e-mail e senha para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLocked ? (
            <div className="text-center p-4">
              <h3 className="font-semibold text-red-500 mb-2">Conta temporariamente bloqueada</h3>
              <p className="mb-2">Muitas tentativas de login fracassadas.</p>
              <p className="text-lg font-bold">
                Tente novamente em: {lockTimeRemaining} segundos
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Sormany@gmail.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={handleForgotPassword}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </span>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
