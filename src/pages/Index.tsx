
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import NewTaskButton from '../components/NewTaskButton';
import { useTaskContext } from '../context/TaskContext';
import { generateSampleTasks } from '../lib/tasks';
import { CheckSquare, Plus, Calendar, Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { tasks, addTask } = useTaskContext();
  const navigate = useNavigate();

  // Get the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.role === 'admin';

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
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {/* Hero section */}
        <section className="mb-12 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Organize sua Casa com o Tasker
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Distribua tarefas, acompanhe o progresso e recompense membros da casa.
            </p>
          </div>
          
          {/* Features - Only show admin features to admins */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {(isAdmin ? [
              {
                icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
                title: 'Distribua Tarefas',
                description: 'Crie e atribua tarefas',
                onClick: () => navigate('/nova-tarefa')
              },
              {
                icon: <Star className="h-8 w-8 text-yellow-500" />,
                title: 'Recompense',
                description: 'Incentive com pontos',
                onClick: () => navigate('/admin')
              },
              {
                icon: <Users className="h-8 w-8 text-purple-500" />,
                title: 'Gerencie',
                description: 'Acompanhe o progresso',
                onClick: () => navigate('/admin')
              }
            ] : [
              {
                icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
                title: 'Suas Tarefas',
                description: 'Veja suas tarefas pendentes',
                onClick: () => navigate('/tarefas')
              },
              {
                icon: <Star className="h-8 w-8 text-yellow-500" />,
                title: 'Seus Pontos',
                description: 'Acompanhe sua pontuação',
                onClick: () => navigate('/')
              },
              {
                icon: <Clock className="h-8 w-8 text-purple-500" />,
                title: 'Histórico',
                description: 'Veja tarefas concluídas',
                onClick: () => navigate('/tarefas')
              }
            ]).map((feature, index) => (
              <Button 
                key={index}
                onClick={feature.onClick}
                variant="outline"
                className="feature-card p-6 rounded-lg flex flex-col items-center h-auto w-full hover:bg-white transition-colors border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 bg-gray-50 p-3 rounded-full shadow-inner">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center">{feature.description}</p>
              </Button>
            ))}
          </div>
        </section>
        
        {/* Tasks section */}
        <section className="glass-panel rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tarefas da Casa</h2>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/nova-tarefa')}
                className="flex items-center text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Tarefa
              </Button>
            )}
          </div>
          
          <TaskList />
        </section>
      </main>
      
      {/* Only show floating action button for admins */}
      {isAdmin && <NewTaskButton />}
    </div>
  );
};

export default Index;
