
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Task, 
  TaskPriority, 
  TaskCategory, 
  useTaskContext 
} from '../context/TaskContext';
import { Calendar, Clock, Flag, Tag, AlertTriangle } from 'lucide-react';

interface TaskFormProps {
  initialData?: Partial<Task>;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialData = {}, 
  isEditing = false 
}) => {
  const { addTask, updateTask, categories } = useTaskContext();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState<string>(
    initialData.dueDate 
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : ''
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData.priority || 'medium'
  );
  const [category, setCategory] = useState<TaskCategory>(
    initialData.category || 'personal'
  );
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const taskData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      category,
      completed: initialData.completed || false,
    };
    
    if (isEditing && initialData.id) {
      updateTask(initialData.id, taskData);
      navigate(`/tarefas/${initialData.id}`);
    } else {
      addTask(taskData as Omit<Task, 'id' | 'createdAt'>);
      navigate('/tarefas');
    }
  };

  const handleCancel = () => {
    navigate(isEditing && initialData.id ? `/tarefas/${initialData.id}` : '/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-lg p-6">
        {/* Title field */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`block w-full px-4 py-3 border rounded-lg focus:ring-primary focus:border-primary ${
              errors.title ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Nome da tarefa"
          />
          {errors.title && (
            <p className="mt-1 text-red-500 text-sm flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description field */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Detalhes da tarefa"
          />
        </div>

        {/* Due date field */}
        <div className="mb-6">
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Data de vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority selection */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Flag className="w-4 h-4 mr-1" />
              Prioridade
            </label>
            <div className="flex space-x-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                    priority === p
                      ? p === 'high' 
                        ? 'bg-red-500 text-white border-red-500'
                        : p === 'medium'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
                </button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="block w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-primary focus:border-primary"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-primary hover:bg-primary/90 text-white font-medium transition-colors hover-scale"
        >
          {isEditing ? 'Atualizar Tarefa' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
