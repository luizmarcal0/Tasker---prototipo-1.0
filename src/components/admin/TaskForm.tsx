
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTaskContext, TaskCategory } from "../../context/TaskContext";
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TaskFormProps {
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

const TaskForm: React.FC<TaskFormProps> = ({ familyMembers }) => {
  const { addTask, categories } = useTaskContext();
  
  // State for new task assignment
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('personal');
  const [isGeneralTask, setIsGeneralTask] = useState(false);

  // Assign task to family member or create general task
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle || (!newTaskAssignee && !isGeneralTask) || !newTaskPoints) {
      toast.error('Por favor preencha todos os campos obrigatórios');
      return;
    }
    
    if (isGeneralTask) {
      // Create task for all non-admin members
      const nonAdminMembers = familyMembers.filter(m => m.role !== 'admin');
      
      nonAdminMembers.forEach(member => {
        addTask({
          title: newTaskTitle,
          description: newTaskDescription,
          completed: false,
          priority: 'medium',
          category: newTaskCategory,
          dueDate: null,
          assignedTo: member.id,
          assignedToName: member.name,
          isGeneralTask: true
        });
      });
      
      toast.success(`Tarefa geral criada para ${nonAdminMembers.length} membros`);
    } else {
      // Create task for specific member
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
      
      toast.success('Tarefa atribuída com sucesso');
    }
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskPoints('');
    setIsGeneralTask(false);
  };

  return (
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
        
        <div className="grid gap-3">
          <Label>Tipo de Tarefa</Label>
          <RadioGroup 
            value={isGeneralTask ? "general" : "individual"} 
            onValueChange={(value) => setIsGeneralTask(value === "general")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="general" id="general" />
              <Label htmlFor="general">Para todos os membros</Label>
            </div>
          </RadioGroup>
        </div>
        
        {!isGeneralTask && (
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
        )}
        
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
          <Plus className="mr-2 h-4 w-4" /> 
          {isGeneralTask ? 'Criar Tarefa Geral' : 'Atribuir Tarefa'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
