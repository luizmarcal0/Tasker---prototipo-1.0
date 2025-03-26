
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import NewTaskButton from '../components/NewTaskButton';
import { useTaskContext } from '../context/TaskContext';
import { generateSampleTasks } from '../lib/tasks';
import { CheckSquare, Plus, Calendar, Clock } from 'lucide-react';

const Index = () => {
  const { tasks, addTask } = useTaskContext();

  // Add sample tasks if none exist
  useEffect(() => {
    if (tasks.length === 0) {
      generateSampleTasks().forEach(task => {
        addTask({
          title: task.title,
          description: task.description,
          completed: task.completed,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate,
        });
      });
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {/* Hero section */}
        <section className="mb-12 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Organize suas tarefas com o Tasker
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gerencie suas tarefas diárias, defina prioridades e nunca mais perca um prazo.
            </p>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
                title: 'Organize Tarefas',
                description: 'Crie e organize suas tarefas por categoria e prioridade'
              },
              {
                icon: <Calendar className="h-8 w-8 text-green-500" />,
                title: 'Gerencie Prazos',
                description: 'Defina datas de vencimento e receba lembretes'
              },
              {
                icon: <Clock className="h-8 w-8 text-purple-500" />,
                title: 'Acompanhe Progresso',
                description: 'Visualize seu progresso e mantenha-se produtivo'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-lg flex flex-col items-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 animate-float">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Tasks section */}
        <section className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Minhas Tarefas</h2>
            <button 
              onClick={() => window.location.href = '/nova-tarefa'}
              className="flex items-center text-sm px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Tarefa
            </button>
          </div>
          
          <TaskList />
        </section>
      </main>
      
      <NewTaskButton />
    </div>
  );
};

export default Index;
