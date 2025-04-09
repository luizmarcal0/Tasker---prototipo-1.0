
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTaskContext } from '../context/TaskContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Moon, Sun, BellRing, Trash2, Database, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const { clearCompletedTasks } = useTaskContext();
  
  // Estado para as configurações
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [brightness, setBrightness] = useState(() => {
    return parseInt(localStorage.getItem('brightness') || '75');
  });
  const [taskReminders, setTaskReminders] = useState(() => {
    return localStorage.getItem('taskReminders') !== 'false';
  });
  const [deadlineNotifications, setDeadlineNotifications] = useState(() => {
    return localStorage.getItem('deadlineNotifications') !== 'false';
  });
  const [autoSync, setAutoSync] = useState(() => {
    return localStorage.getItem('autoSync') !== 'false';
  });

  // Salvar configurações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('brightness', brightness.toString());
    localStorage.setItem('taskReminders', taskReminders.toString());
    localStorage.setItem('deadlineNotifications', deadlineNotifications.toString());
    localStorage.setItem('autoSync', autoSync.toString());
    
    // Aplicar tema escuro se ativado
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Aplicar brilho
    document.documentElement.style.filter = `brightness(${brightness / 100})`;
    
  }, [darkMode, brightness, taskReminders, deadlineNotifications, autoSync]);

  const handleClearCompletedTasks = () => {
    clearCompletedTasks();
    toast({
      title: "Tarefas concluídas removidas",
      description: "Todas as tarefas concluídas foram removidas com sucesso.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram salvas com sucesso.",
    });
  };

  const handleResetSettings = () => {
    // Resetar para valores padrão
    setDarkMode(false);
    setBrightness(75);
    setTaskReminders(true);
    setDeadlineNotifications(true);
    setAutoSync(true);
    
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <SettingsIcon className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <section className={`glass-panel rounded-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-lg font-semibold mb-4">Aparência</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Tema Escuro</span>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Sun className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Brilho da interface</span>
                </div>
                <Slider 
                  value={[brightness]} 
                  max={100} 
                  step={1} 
                  className="w-full"
                  onValueChange={(values) => setBrightness(values[0])}
                />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className={`glass-panel rounded-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Lembretes de tarefas</span>
                </div>
                <Switch 
                  id="task-reminders" 
                  checked={taskReminders}
                  onCheckedChange={setTaskReminders}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Notificações de prazo</span>
                </div>
                <Switch 
                  id="deadline-notifications" 
                  checked={deadlineNotifications}
                  onCheckedChange={setDeadlineNotifications}
                />
              </div>
            </div>
          </section>

          {/* Data Management Section */}
          <section className={`glass-panel rounded-lg p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h2 className="text-lg font-semibold mb-4">Dados</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Sincronização automática</span>
                </div>
                <Switch 
                  id="auto-sync" 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
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

          {/* Buttons Section */}
          <div className="flex justify-between gap-4 mt-8">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleResetSettings}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar configurações
            </Button>
            
            <Button 
              className="flex items-center"
              onClick={handleSaveSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>

          {/* Version Info */}
          <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mt-8`}>
            Tasker v1.0.0
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
