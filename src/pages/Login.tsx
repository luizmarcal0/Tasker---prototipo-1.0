
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('member');

  const handleLogin = (e: React.FormEvent, loginType: 'member' | 'admin') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      setIsLoading(false);
      return;
    }

    if (loginType === 'member' && !familyCode) {
      setError('Código da família é obrigatório para membros.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Simple login logic - accept any valid email/password combination
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        email: email,
        role: loginType,
        familyId: loginType === 'member' ? familyCode : 'admin-family'
      }));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo${loginType === 'admin' ? ' ao painel administrativo' : ''}!`,
      });
      
      if (loginType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login - Tasker</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="member" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Membro
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Administrador
              </TabsTrigger>
            </TabsList>

            <TabsContent value="member">
              <form onSubmit={(e) => handleLogin(e, 'member')}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="member-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="family-code">Código da Família</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="family-code"
                        type="text"
                        placeholder="FMLY123"
                        className="pl-10"
                        value={familyCode}
                        onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="member-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="member-password"
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
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
                      <LogIn className="mr-2 h-4 w-4" /> Entrar como Membro
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Painel Administrativo</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Acesso exclusivo para pais/responsáveis da família
                </p>
              </div>
              
              <form onSubmit={(e) => handleLogin(e, 'admin')}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">E-mail do Administrador</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@familia.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha do Administrador</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-password"
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
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
                      <Shield className="mr-2 h-4 w-4" /> Entrar como Admin
                    </span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-500">
            Não tem uma família cadastrada?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Criar Família
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
