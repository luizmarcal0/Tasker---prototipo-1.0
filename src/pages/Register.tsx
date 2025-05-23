
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  Users,
  Shield,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const generateFamilyCode = () => {
    return 'FMLY' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!familyName || !adminName || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Check if email is already registered
      const emailExists = ['user@example.com', 'admin@example.com'].includes(email);
      
      if (emailExists) {
        setError('Este email já está cadastrado.');
        setIsLoading(false);
        return;
      }
      
      // Generate family code
      const familyCode = generateFamilyCode();
      
      // Store the family data in localStorage
      const families = JSON.parse(localStorage.getItem('families') || '[]');
      const familyId = Date.now().toString();
      
      const newFamily = {
        id: familyId,
        name: familyName,
        code: familyCode,
        createdAt: new Date().toISOString(),
      };
      
      families.push(newFamily);
      localStorage.setItem('families', JSON.stringify(families));
      
      // Store the admin user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        id: Date.now().toString(),
        name: adminName,
        email: email,
        password: password,
        role: 'admin',
        familyId: familyId,
        familyCode: familyCode,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set the current user as logged in
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        email: email,
        name: adminName,
        role: 'admin',
        familyId: familyId,
        familyCode: familyCode,
        familyName: familyName,
      }));
      
      // Show success message
      toast({
        title: "Família criada com sucesso!",
        description: `Código da família: ${familyCode}. Você será redirecionado para o painel administrativo.`,
        duration: 5000,
      });
      
      // Redirect to admin page after a short delay
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Nova Família</CardTitle>
          <CardDescription className="text-center">
            Registre sua família e torne-se o administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Administrador da Família</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Key className="w-4 h-4" />
              <span>Você receberá um código único para adicionar membros</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Nome da Família</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="familyName"
                  placeholder="Família Silva" 
                  className="pl-10" 
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminName">Nome do Administrador</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="adminName"
                  placeholder="João Silva" 
                  className="pl-10" 
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email do Administrador</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="joao@familia.com" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
              <p className="text-xs text-gray-500">Mínimo de 8 caracteres</p>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando Família...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4" /> Criar Família
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-500">
            Já tem uma família?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
