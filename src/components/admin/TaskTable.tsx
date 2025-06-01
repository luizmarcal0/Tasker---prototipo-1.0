import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTaskContext } from "../../context/TaskContext";
import { Trash, Edit, Users, User } from 'lucide-react';
import { toast } from 'sonner';

interface TaskTableProps {
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
  onEditTask: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ familyMembers, onEditTask }) => {
  const { tasks, deleteTask, toggleTaskCompletion, updateTask, categories } = useTaskContext();

  // Helper function to get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Remove task assignment (keep task but remove assignee)
  const removeTaskAssignment = (taskId: string) => {
    updateTask(taskId, { assignedTo: undefined, assignedToName: undefined });
    toast.success('Atribuição removida');
  };

  // Reassign task to different member
  const reassignTask = (taskId: string, newAssigneeId: string) => {
    const assignedMember = familyMembers.find(m => m.id === newAssigneeId);
    if (!assignedMember) {
      toast.error('Membro não encontrado');
      return;
    }
    
    updateTask(taskId, { 
      assignedTo: assignedMember.id, 
      assignedToName: assignedMember.name 
    });
    toast.success('Tarefa reatribuída');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                {task.title}
                {task.isGeneralTask && (
                  <Users className="h-4 w-4 ml-2 text-blue-500" />
                )}
              </div>
            </TableCell>
            <TableCell>
              {task.assignedToName ? (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-blue-500" />
                  {task.assignedToName}
                </div>
              ) : (
                <span className="text-gray-400">Não atribuída</span>
              )}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{getCategoryName(task.category)}</Badge>
            </TableCell>
            <TableCell>
              {task.completed ? (
                <Badge className="bg-green-500">Concluída</Badge>
              ) : (
                <Badge variant="outline">Pendente</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed ? 'Desfazer' : 'Concluir'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTask(task.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                {familyMembers.filter(m => m.role !== 'admin').length > 0 && !task.isGeneralTask && (
                  <select 
                    onChange={(e) => {
                      if (e.target.value === 'unassign') {
                        removeTaskAssignment(task.id);
                      } else if (e.target.value !== '') {
                        reassignTask(task.id, e.target.value);
                      }
                      e.target.value = '';
                    }}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="">Atribuir</option>
                    {familyMembers.filter(m => m.role !== 'admin').map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                    {task.assignedTo && (
                      <option value="unassign">❌ Remover atribuição</option>
                    )}
                  </select>
                )}
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {tasks.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
              Nenhuma tarefa criada ainda
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
