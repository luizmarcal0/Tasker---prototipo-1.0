
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users,
  Shield,
  UserPlus,
  Mail,
  Lock,
  User
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
  const [responsibleName, setResponsibleName] = useState('');
  const [responsibleEmail, setResponsibleEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!familyName || !responsibleName || !responsibleEmail || !password) {
      setError('Todos os campos são obrigatórios.');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(responsibleEmail)) {
      setError('Por favor, insira um e-mail válido.');
      setIsLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Store family data
      const familyData = {
        name: familyName,
        responsible: responsibleName,
        email: responsibleEmail,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('family', JSON.stringify(familyData));
      
      // Show success message
      toast({
        title: "Casa criada com sucesso!",
        description: "Você pode agora fazer login como líder da casa.",
        duration: 5000,
      });
      
      setIsLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Nova Casa</CardTitle>
          <CardDescription className="text-center">
            Registre sua casa e comece a organizar as tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Criação de Casa</span>
            </div>
            <p className="text-blue-700 text-sm">
              Após criar a casa, você será o líder responsável por gerenciar membros e tarefas
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Nome da Casa</Label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="familyName"
                  placeholder="Casa Silva" 
                  className="pl-10" 
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleName">Responsável pela Casa</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="responsibleName"
                  placeholder="João Silva" 
                  className="pl-10" 
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleEmail">Email do Responsável</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="responsibleEmail"
                  type="email"
                  placeholder="joao@email.com" 
                  className="pl-10" 
                  value={responsibleEmail}
                  onChange={(e) => setResponsibleEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••" 
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
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
                  Criando Casa...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="mr-2 h-4 w-4" /> Criar Casa
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-gray-500">
            Já tem uma casa?{" "}
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
