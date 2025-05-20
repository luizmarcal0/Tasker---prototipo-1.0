
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Define the form schema with validation rules
const formSchema = z.object({
  familyName: z.string().min(2, 'O nome da família deve ter pelo menos 2 caracteres'),
  adminName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyName: '',
      adminName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      // Check if email is already registered (using our mock database)
      const emailExists = ['user@example.com', 'admin@example.com'].includes(values.email);
      
      if (emailExists) {
        setError('Este email já está cadastrado.');
        setIsLoading(false);
        return;
      }
      
      // Simulate successful registration
      console.log('Family registration data:', values);
      
      // Store the family data in localStorage (in a real app, this would be sent to a server)
      const families = JSON.parse(localStorage.getItem('families') || '[]');
      const familyId = Date.now().toString();
      
      const newFamily = {
        id: familyId,
        name: values.familyName,
        createdAt: new Date().toISOString(),
      };
      
      families.push(newFamily);
      localStorage.setItem('families', JSON.stringify(families));
      
      // Store the admin user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({
        id: Date.now().toString(),
        name: values.adminName,
        email: values.email,
        password: values.password,
        role: 'admin',
        familyId: familyId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set the current user as logged in
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        email: values.email,
        role: 'admin',
        familyId: familyId,
      }));
      
      // Show success message
      toast({
        title: "Família criada com sucesso!",
        description: "Você será redirecionado para o painel administrativo.",
      });
      
      // Redirect to admin page after a short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      
      setIsLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crie sua Família</CardTitle>
          <CardDescription className="text-center">
            Registre sua família para começar a gerenciar tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Família</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="Família Silva" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adminName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Administrador (Pai/Mãe)</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="Luiz Inacio Lula da Silva" 
                          className="pl-10" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Administrador</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Sormany@gmail.com" 
                          className="pl-10" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-10 pr-10" 
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <button 
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5" /> : 
                          <Eye className="h-5 w-5" />
                        }
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-4 w-4" /> Criar Família
                  </span>
                )}
              </Button>
            </form>
          </Form>
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
