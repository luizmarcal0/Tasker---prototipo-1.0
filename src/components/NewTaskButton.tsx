
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NewTaskButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate('/nova-tarefa')}
            className="fixed right-6 bottom-6 md:right-10 md:bottom-10 bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center group z-20 transition-all duration-300 hover:scale-105 active:scale-95 active:shadow-md"
            aria-label="Criar nova tarefa"
            size="icon"
          >
            <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
            
            {/* Button pulse effect */}
            <span className="absolute w-full h-full rounded-full animate-pulse-subtle opacity-75 bg-primary/20"></span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={10}>
          <p>Criar nova tarefa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NewTaskButton;
