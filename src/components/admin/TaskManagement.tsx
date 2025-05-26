
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskContext, TaskCategory } from "../../context/TaskContext";
import { Plus, Trash, User } from 'lucide-react';
import { toast } from 'sonner';

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
  const { tasks, addTask, deleteTask, toggleTaskCompletion, categories } = useTaskContext();
  
  // State for new task assignment
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('personal');

  // Assign task to family member
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle || !newTaskAssignee || !newTaskPoints) {
      toast.error('Por favor preencha todos os campos obrigatórios');
      return;
    }
    
    const assignedMember = familyMembers.find(m => m.id === newTaskAssignee);
    if (!assignedMember) {
      toast.error('Membro não encontrado');
      return;
    }
    
    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
      priority: 'medium',
      category: newTaskCategory,
      dueDate: null,
      assignedTo: assignedMember.id,
      assignedToName: assignedMember.name
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskPoints('');
    toast.success('Tarefa atribuída com sucesso');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Tarefas da Família</CardTitle>
            <CardDescription>Gerencie as tarefas atribuídas aos membros da família</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="font-medium">{task.title}</TableCell>
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
                      <Badge variant="outline">{task.category}</Badge>
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
                          variant="destructive" 
                          size="icon"
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
                      Nenhuma tarefa atribuída ainda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Atribuir Nova Tarefa</CardTitle>
            <CardDescription>Crie uma tarefa para um membro da família</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignTask}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Título da Tarefa</Label>
                  <Input 
                    id="task-title" 
                    placeholder="Título da tarefa" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-description">Descrição</Label>
                  <Input 
                    id="task-description" 
                    placeholder="Descrição da tarefa" 
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-assignee">Atribuir para</Label>
                  <select 
                    id="task-assignee"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="">Selecione um membro</option>
                    {familyMembers.filter(m => m.role !== 'admin').map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-points">Pontos</Label>
                  <Input 
                    id="task-points" 
                    type="number"
                    min="0"
                    placeholder="Pontos a ganhar" 
                    value={newTaskPoints}
                    onChange={(e) => setNewTaskPoints(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-category">Categoria</Label>
                  <select 
                    id="task-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Atribuir Tarefa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskManagement;
