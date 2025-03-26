
import React, { useState, useEffect } from 'react';
import { Task, useTaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { FilterIcon, SortDescIcon, CheckSquare } from 'lucide-react';
import { sortTasks, filterTasksByCategory, filterTasksByCompletion } from '../lib/tasks';
import { TaskCategory } from '../context/TaskContext';

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...tasks];
    
    // Filter by category
    result = filterTasksByCategory(result, selectedCategory);
    
    // Filter by completion status
    result = filterTasksByCompletion(result, showCompleted);
    
    // Sort tasks
    result = sortTasks(result, sortBy);
    
    setFilteredTasks(result);
  }, [tasks, selectedCategory, showCompleted, sortBy]);

  // Category filter options
  const categories: {value: TaskCategory | 'all', label: string}[] = [
    { value: 'all', label: 'Todas' },
    { value: 'work', label: 'Trabalho' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'health', label: 'Saúde' },
    { value: 'errands', label: 'Tarefas' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'dueDate', label: 'Data de vencimento' },
    { value: 'priority', label: 'Prioridade' },
    { value: 'createdAt', label: 'Data de criação' },
  ];

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <CheckSquare className="mr-2 h-5 w-5" />
          {selectedCategory === 'all' ? 'Todas as tarefas' : `Tarefas: ${categories.find(c => c.value === selectedCategory)?.label}`}
          {!showCompleted && ' (Ativas)'}
        </h2>
        
        <div className="flex space-x-2">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortDescIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          
          {/* Filter button */}
          <button 
            className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white hover:bg-gray-50"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          >
            <FilterIcon className="h-4 w-4 mr-1" />
            Filtros
          </button>
        </div>
      </div>
      
      {/* Filter dropdown */}
      {isFilterMenuOpen && (
        <div className="bg-white rounded-md shadow-sm border p-4 mb-4 animate-scale-in">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Show completed toggle */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <button
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  showCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Mostrar todas' : 'Ocultar concluídas'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <CheckSquare className="h-12 w-12 mx-auto opacity-30" />
          </div>
          <h3 className="text-lg font-medium text-gray-600">Nenhuma tarefa encontrada</h3>
          <p className="text-gray-500 mt-1">
            {tasks.length === 0 
              ? 'Crie uma nova tarefa para começar' 
              : 'Tente ajustar os filtros para ver mais resultados'}
          </p>
        </div>
      ) : (
        <div className="space-y-1 animate-fade-in">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
