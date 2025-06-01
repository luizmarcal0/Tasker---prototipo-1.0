
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import EditTaskDialog from './EditTaskDialog';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';

interface TaskManagementProps {
  familyMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    points: number;
    completedTasks: number;
    pendingTasks: number;
    weeklyPoints: number;
  }>;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ familyMembers }) => {
  // State for editing tasks
  const [editingTask, setEditingTask] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Tarefas</CardTitle>
            <CardDescription>Atribua e gerencie tarefas para membros da família</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable 
              familyMembers={familyMembers}
              onEditTask={setEditingTask}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Tarefa</CardTitle>
            <CardDescription>Crie uma tarefa para um membro específico ou para todos</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm familyMembers={familyMembers} />
          </CardContent>
        </Card>
      </div>
      
      {editingTask && (
        <EditTaskDialog
          taskId={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          familyMembers={familyMembers}
        />
      )}
    </div>
  );
};

export default TaskManagement;
