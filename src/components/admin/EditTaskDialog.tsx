
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTaskContext, TaskCategory, TaskPriority } from "../../context/TaskContext";
import { toast } from 'sonner';

interface EditTaskDialogProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
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

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  taskId,
  isOpen,
  onClose,
  familyMembers
}) => {
  const { tasks, updateTask, categories } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const task = tasks.find(t => t.id === taskId);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category);
      setAssignedTo(task.assignedTo || '');
      setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    const assignedMember = familyMembers.find(m => m.id === assignedTo);
    
    updateTask(taskId, {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      assignedTo: assignedTo || undefined,
      assignedToName: assignedMember ? assignedMember.name : undefined,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    toast.success('Tarefa atualizada com sucesso');
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias na tarefa.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da tarefa"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-priority">Prioridade</Label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-category">Categoria</Label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {!task.isGeneralTask && (
            <div className="grid gap-2">
              <Label htmlFor="edit-assignee">Responsável</Label>
              <select
                id="edit-assignee"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Não atribuída</option>
                {familyMembers.filter(m => m.role !== 'admin').map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="edit-due-date">Data de Vencimento</Label>
            <Input
              id="edit-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
