
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  useTaskContext, 
  Task, 
  TaskPriority, 
  TaskCategory 
} from '../context/TaskContext';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash, 
  Check, 
  ArrowLeft, 
  Flag,
  Tag, 
  AlarmClock
} from 'lucide-react';
import { formatDate, getCategoryLabel, getPriorityLabel } from '../lib/tasks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTaskContext();
  const navigate = useNavigate();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Find the task with the matching ID
  const task = tasks.find((t) => t.id === id);
  
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-24 px-4 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Tarefa não encontrada</h1>
          <p className="mb-6">A tarefa que você está procurando não existe ou foi removida.</p>
          <button
            onClick={() => navigate('/tarefas')}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para tarefas
          </button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteTask(task.id);
    toast.success('Tarefa excluída com sucesso');
    navigate('/tarefas');
  };
  
  const handleEdit = () => {
    navigate(`/tarefas/${task.id}/editar`);
  };
  
  const handleBack = () => {
    navigate('/tarefas');
  };
  
  // Get the priority color class
  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      low: 'bg-blue-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500'
    };
    return colors[priority];
  };
  
  // Get the category color class
  const getCategoryColor = (category: TaskCategory) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800',
      personal: 'bg-purple-100 text-purple-800',
      health: 'bg-green-100 text-green-800',
      errands: 'bg-amber-100 text-amber-800'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Voltar para tarefas</span>
        </button>
        
        {/* Task detail card */}
        <div className="glass-panel rounded-lg overflow-hidden mb-6">
          <div className={`h-2 ${getPriorityColor(task.priority)}`}></div>
          
          <div className="p-6">
            {/* Header with title and actions */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-2xl font-bold mb-2 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {getCategoryLabel(task.category)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`p-2 rounded-full transition-colors ${
                    task.completed 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-label={task.completed ? 'Marcar como não concluída' : 'Marcar como concluída'}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label="Editar tarefa"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 transition-colors"
                  aria-label="Excluir tarefa"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Task details */}
            <div className="space-y-6">
              {/* Description */}
              {task.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="font-medium mb-2 text-gray-700">Descrição</h2>
                  <p className={`whitespace-pre-line ${task.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                    {task.description}
                  </p>
                </div>
              )}
              
              {/* Timeline */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium mb-3 text-gray-700">Cronograma</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Criada em</p>
                      <p className="font-medium">
                        {format(task.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  
                  {task.dueDate && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Vence em</p>
                        <p className={`font-medium ${
                          task.dueDate < new Date() && !task.completed 
                            ? 'text-red-500' 
                            : ''
                        }`}>
                          {format(task.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          {task.dueDate < new Date() && !task.completed && ' (Atrasada)'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <AlarmClock className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">
                        {task.completed 
                          ? 'Concluída' 
                          : task.dueDate && task.dueDate < new Date() 
                            ? 'Atrasada'
                            : 'Pendente'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold mb-2">Excluir tarefa</h3>
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
