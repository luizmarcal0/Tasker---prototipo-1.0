
import React from 'react';
import Navbar from '../components/Navbar';
import { useTaskContext } from '../context/TaskContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Moon, Sun, BellRing, Trash2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const { clearCompletedTasks } = useTaskContext();

  const handleClearCompletedTasks = () => {
    clearCompletedTasks();
    toast({
      title: "Tarefas concluídas removidas",
      description: "Todas as tarefas concluídas foram removidas com sucesso.",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Aparência</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Tema Escuro</span>
                </div>
                <Switch id="dark-mode" />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Sun className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Brilho da interface</span>
                </div>
                <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Lembretes de tarefas</span>
                </div>
                <Switch id="task-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Notificações de prazo</span>
                </div>
                <Switch id="deadline-notifications" defaultChecked />
              </div>
            </div>
          </section>

          {/* Data Management Section */}
          <section className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Dados</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Sincronização automática</span>
                </div>
                <Switch id="auto-sync" defaultChecked />
              </div>
              
              <div>
                <Button 
                  variant="destructive" 
                  className="flex items-center"
                  onClick={handleClearCompletedTasks}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover tarefas concluídas
                </Button>
              </div>
            </div>
          </section>

          {/* Version Info */}
          <div className="text-center text-gray-500 text-sm mt-8">
            Tasker v1.0.0
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
