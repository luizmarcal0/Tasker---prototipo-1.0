
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'health' | 'errands' | string;

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: Date | null;
  createdAt: Date;
  assignedTo?: string; // ID do usuário responsável
  assignedToName?: string; // Nome do usuário responsável
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  clearCompletedTasks: () => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Categorias padrão
const defaultCategories: Category[] = [
  { id: 'work', name: 'Trabalho', color: '#4f46e5' },
  { id: 'personal', name: 'Pessoal', color: '#0ea5e9' },
  { id: 'health', name: 'Saúde', color: '#10b981' },
  { id: 'errands', name: 'Tarefas', color: '#f59e0b' },
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Parse the dates from strings back to Date objects
        return JSON.parse(savedTasks, (key, value) => {
          if (key === 'dueDate' || key === 'createdAt') {
            return value ? new Date(value) : null;
          }
          return value;
        });
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (error) {
        console.error('Failed to parse saved categories:', error);
        return defaultCategories;
      }
    }
    return defaultCategories;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Tarefa criada com sucesso');
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      )
    );
    toast.success('Tarefa atualizada');
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.success('Tarefa removida');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    toast.success('Categoria criada com sucesso');
  };

  const deleteCategory = (id: string) => {
    // Não permitir excluir categorias padrão
    if (['work', 'personal', 'health', 'errands'].includes(id)) {
      toast.error('Não é possível excluir categorias padrão');
      return;
    }
    
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
    toast.success('Categoria removida');
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      toggleTaskCompletion,
      clearCompletedTasks,
      categories,
      addCategory,
      deleteCategory
    }}>
      {children}
    </TaskContext.Provider>
  );
};
