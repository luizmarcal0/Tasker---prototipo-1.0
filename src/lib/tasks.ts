
import { Task, TaskPriority, TaskCategory } from '../context/TaskContext';

// Utility function to generate sample tasks for testing/demo purposes
export const generateSampleTasks = (): Task[] => {
  return [
    {
      id: '1',
      title: 'Finalizar relatório de vendas',
      description: 'Completar análise do Q4 para a reunião de amanhã',
      completed: false,
      priority: 'high' as TaskPriority,
      category: 'work' as TaskCategory,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Agendar consulta médica',
      description: 'Check-up anual com Dr. Silva',
      completed: false,
      priority: 'medium' as TaskPriority,
      category: 'health' as TaskCategory,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Comprar presentes de aniversário',
      description: 'Para a festa de sábado',
      completed: false,
      priority: 'low' as TaskPriority,
      category: 'personal' as TaskCategory,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdAt: new Date(),
    },
    {
      id: '4',
      title: 'Pagar conta de luz',
      description: 'Vence dia 15',
      completed: true,
      priority: 'high' as TaskPriority,
      category: 'errands' as TaskCategory,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Created a week ago
    },
  ];
};

// Function to format date in a friendly way
export const formatDate = (date: Date | null): string => {
  if (!date) return 'Sem data';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (taskDate.getTime() === today.getTime()) {
    return 'Hoje';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Amanhã';
  } else {
    // Format as dd/mm/yyyy
    return date.toLocaleDateString('pt-BR');
  }
};

// Helper to get priority label
export const getPriorityLabel = (priority: TaskPriority): string => {
  const labels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };
  return labels[priority];
};

// Helper to get category label
export const getCategoryLabel = (category: TaskCategory): string => {
  const labels = {
    work: 'Trabalho',
    personal: 'Pessoal', 
    health: 'Saúde',
    errands: 'Tarefas'
  };
  return labels[category];
};

// Get color class based on priority
export const getPriorityColorClass = (priority: TaskPriority): string => {
  const colors = {
    low: 'bg-blue-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500'
  };
  return colors[priority];
};

// Get color class based on category
export const getCategoryColorClass = (category: TaskCategory): string => {
  const colors = {
    work: 'category-work',
    personal: 'category-personal',
    health: 'category-health',
    errands: 'category-errands'
  };
  return colors[category];
};

// Sort tasks by various criteria
export const sortTasks = (tasks: Task[], sortBy: 'dueDate' | 'priority' | 'createdAt'): Task[] => {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      // Handle null dates (put them at the end)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    } 
    
    if (sortBy === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    
    // Default sort by createdAt (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

// Filter tasks by category
export const filterTasksByCategory = (tasks: Task[], category: TaskCategory | 'all'): Task[] => {
  if (category === 'all') return tasks;
  return tasks.filter(task => task.category === category);
};

// Filter tasks by completion status
export const filterTasksByCompletion = (tasks: Task[], showCompleted: boolean): Task[] => {
  return tasks.filter(task => showCompleted || !task.completed);
};
