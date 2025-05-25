
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Home, User, Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-indigo-600">Tasker</h1>
            {isAdmin && (
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                Admin
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            
            {isAdmin && (
              <Button
                variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {currentUser?.name || 'Usuário'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair da Conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
