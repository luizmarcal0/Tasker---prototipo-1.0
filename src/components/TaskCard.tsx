
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Clock, Calendar, MoreVertical } from 'lucide-react';
import { Task, useTaskContext } from '../context/TaskContext';
import { formatDate, getCategoryLabel, getPriorityLabel, getCategoryColorClass } from '../lib/tasks';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskCompletion } = useTaskContext();
  const navigate = useNavigate();
  
  const isPastDue = task.dueDate && new Date() > task.dueDate && !task.completed;
  
  const handleCardClick = () => {
    navigate(`/tarefas/${task.id}`);
  };
  
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toggleTaskCompletion(task.id);
  };

  return (
    <div 
      className={`glass-card rounded-lg overflow-hidden mb-4 cursor-pointer ${task.priority}-priority`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Task completion checkbox */}
          <button
            className={`mt-1 mr-3 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
              task.completed 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300 hover:border-primary/70'
            }`}
            onClick={handleCheckboxClick}
            aria-label={task.completed ? "Marcar como não concluída" : "Marcar como concluída"}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>
          
          {/* Task content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className={`font-medium text-base ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            {/* Category badge */}
            <div className="mb-2">
              <span className={`category-pill ${getCategoryColorClass(task.category)}`}>
                {getCategoryLabel(task.category)}
              </span>
            </div>
            
            {/* Description (truncated) */}
            {task.description && (
              <p className={`text-sm mb-3 text-gray-600 line-clamp-2 ${task.completed ? 'text-gray-400' : ''}`}>
                {task.description}
              </p>
            )}
            
            {/* Task metadata */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {/* Due date */}
              {task.dueDate && (
                <div className={`flex items-center ${isPastDue ? 'text-red-500' : ''}`}>
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              
              {/* Priority */}
              <div className="flex items-center">
                <div 
                  className={`w-2 h-2 rounded-full mr-1 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                />
                <span>{getPriorityLabel(task.priority)}</span>
              </div>
              
              {/* Created date */}
              <div className="flex items-center ml-auto">
                <Clock className="w-3 h-3 mr-1" />
                <span>{format(task.createdAt, 'dd MMM', { locale: ptBR })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
