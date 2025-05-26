
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NewTaskButton: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.role === 'admin';

  // Only render for admins (leaders)
  if (!isAdmin) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/nova-tarefa')}
            className="fixed right-6 bottom-6 md:right-10 md:bottom-10 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center group z-20 transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-lg"
            aria-label="Criar nova tarefa"
            size="icon"
          >
            <Plus className="w-7 h-7 transition-transform group-hover:rotate-90 duration-300" />
            
            {/* Button pulse effect */}
            <span className="absolute w-full h-full rounded-full animate-pulse-subtle opacity-80 bg-blue-400/30"></span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10} className="font-medium">
          <p>Criar nova tarefa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewTaskButton;
