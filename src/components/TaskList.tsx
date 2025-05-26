
import React, { useState, useEffect } from 'react';
import { Task, useTaskContext } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { FilterIcon, SortDescIcon, CheckSquare, Plus, TagIcon } from 'lucide-react';
import { sortTasks, filterTasksByCategory, filterTasksByCompletion } from '../lib/tasks';
import { TaskCategory } from '../context/TaskContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CategoryDialog from './CategoryDialog';

const TaskList: React.FC = () => {
  const { tasks, categories } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  useEffect(() => {
    // Filtra as tarefas ativas
    let activeTasks = tasks.filter(task => !task.completed);
    
    // Filtra as tarefas concluídas
    let finishedTasks = tasks.filter(task => task.completed);
    
    // Aplica o filtro de categoria a ambas as listas
    if (selectedCategory !== 'all') {
      activeTasks = filterTasksByCategory(activeTasks, selectedCategory);
      finishedTasks = filterTasksByCategory(finishedTasks, selectedCategory);
    }
    
    // Ordena as tarefas
    activeTasks = sortTasks(activeTasks, sortBy);
    finishedTasks = sortTasks(finishedTasks, sortBy);
    
    setFilteredTasks(activeTasks);
    setCompletedTasks(finishedTasks);
  }, [tasks, selectedCategory, sortBy]);

  // Obter categorias para o filtro
  const categoryOptions = [
    { value: 'all', label: 'Todas' },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  // Sort options
  const sortOptions = [
    { value: 'dueDate', label: 'Data de vencimento' },
    { value: 'priority', label: 'Prioridade' },
    { value: 'createdAt', label: 'Data de criação' },
  ];

  return (
    <div className="space-y-4">
      {/* Abas */}
      <Tabs defaultValue="active" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-6">
          <TabsList className="mb-2">
            <TabsTrigger value="active" className="px-6">Tarefas Pendentes</TabsTrigger>
            <TabsTrigger value="completed" className="px-6">Concluídas</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            {/* Menu de ordenação */}
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
            
            {/* Botão de filtros */}
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white hover:bg-gray-50"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <FilterIcon className="h-4 w-4 mr-1" />
              Filtros
            </button>
            
            {/* Botão de gerenciar categorias */}
            <button 
              className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white hover:bg-gray-50"
              onClick={() => setIsCategoryDialogOpen(true)}
            >
              <TagIcon className="h-4 w-4 mr-1" />
              Categorias
            </button>
          </div>
        </div>
        
        {/* Menu suspenso de filtros */}
        {isFilterMenuOpen && (
          <div className="bg-white rounded-md shadow-sm border p-4 mb-4 animate-scale-in">
            <div className="grid gap-4 sm:grid-cols-1">
              {/* Filtro de categoria */}
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(category => (
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
            </div>
          </div>
        )}
        
        {/* Aba de Tarefas Pendentes */}
        <TabsContent value="active" className="mt-2">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CheckSquare className="mr-2 h-5 w-5" />
            {selectedCategory === 'all' ? 'Tarefas Pendentes' : `Tarefas Pendentes: ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
          </h2>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <CheckSquare className="h-12 w-12 mx-auto opacity-30" />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Nenhuma tarefa pendente encontrada</h3>
              <p className="text-gray-500 mt-1">
                {tasks.filter(t => !t.completed).length === 0 
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
        </TabsContent>
        
        {/* Aba de Tarefas Concluídas */}
        <TabsContent value="completed" className="mt-2">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <CheckSquare className="mr-2 h-5 w-5" />
            {selectedCategory === 'all' ? 'Tarefas Concluídas' : `Tarefas Concluídas: ${categoryOptions.find(c => c.value === selectedCategory)?.label}`}
          </h2>
          
          {completedTasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <CheckSquare className="h-12 w-12 mx-auto opacity-30" />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Nenhuma tarefa concluída encontrada</h3>
              <p className="text-gray-500 mt-1">
                {tasks.filter(t => t.completed).length === 0 
                  ? 'Nenhuma tarefa foi concluída ainda' 
                  : 'Tente ajustar os filtros para ver mais resultados'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 animate-fade-in">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de Gerenciamento de Categorias */}
      <CategoryDialog 
        open={isCategoryDialogOpen} 
        onOpenChange={setIsCategoryDialogOpen} 
      />
    </div>
  );
};

export default TaskList;
