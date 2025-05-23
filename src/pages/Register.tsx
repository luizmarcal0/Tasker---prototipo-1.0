
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users,
  Shield,
  UserPlus
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const generateFamilyCode = () => {
    return 'FMLY' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!familyName) {
      setError('O nome da família é obrigatório.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Clear all previous data
      localStorage.clear();
      
      // Generate family code
      const newFamilyCode = generateFamilyCode();
      setFamilyCode(newFamilyCode);
      setShowSuccess(true);
      
      // Store minimal family data
      const familyData = {
        name: familyName,
        code: newFamilyCode,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('family', JSON.stringify(familyData));
      
      // Show success message
      toast({
        title: "Família criada com sucesso!",
        description: `Código da família: ${newFamilyCode}`,
        duration: 5000,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Família Criada!</CardTitle>
            <CardDescription>
              Sua família foi criada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Código da Família:</p>
              <p className="text-2xl font-bold text-blue-600 tracking-wider">{familyCode}</p>
              <p className="text-xs text-gray-500 mt-2">
                Compartilhe este código com os membros da família
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Ir para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Criar Nova Família</CardTitle>
          <CardDescription className="text-center">
            Registre sua família e receba o código para compartilhar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Criação de Família</span>
            </div>
            <p className="text-blue-700 text-sm">
              Após criar a família, você receberá um código único para compartilhar com os membros
            </p>
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
