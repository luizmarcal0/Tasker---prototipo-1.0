
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckSquare, Home, Plus, Settings, Users, Family } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { path: '/nova-tarefa', label: 'Nova Tarefa', icon: <Plus className="w-5 h-5" /> },
    { path: '/tarefas', label: 'Tarefas da Família', icon: <CheckSquare className="w-5 h-5" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-md p-1.5">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FamíliaTasks</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Admin Link (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/admin"
              className={`flex items-center space-x-1 py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/admin' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Painel Familiar</span>
            </Link>
            <Link 
              to="/configuracoes"
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                location.pathname === '/configuracoes' ? 'bg-gray-100 text-primary' : ''
              }`}
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-md p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="bg-white border-t px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                location.pathname === '/admin'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Painel Familiar</span>
            </Link>
            <Link
              to="/configuracoes"
              className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                location.pathname === '/configuracoes'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
