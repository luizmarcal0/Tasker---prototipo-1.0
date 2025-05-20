
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskContext, Task, TaskCategory } from "@/context/TaskContext";
import { Check, Plus, Star, Trash, User, Users } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { toast } from 'sonner';

// Mock family members for the demo
const MOCK_FAMILY_MEMBERS = [
  { id: '1', name: 'Luiz Inacio Lula da Silva', email: 'Sormany@gmail.com', role: 'admin', points: 500 },
  { id: '2', name: 'Filho 1', email: 'filho1@gmail.com', role: 'child', points: 250 },
  { id: '3', name: 'Filho 2', email: 'filho2@gmail.com', role: 'child', points: 320 },
];

// Mock rewards data for the demo
const MOCK_REWARDS = [
  { id: '1', name: 'Sorvete', points: 50, description: 'Um sorvete da sua escolha' },
  { id: '2', name: 'Videogame (1h)', points: 100, description: 'Uma hora extra de videogame' },
  { id: '3', name: 'Cinema', points: 300, description: 'Passeio ao cinema com pipoca' },
  { id: '4', name: 'Escolha do jantar', points: 150, description: 'Escolher o cardápio do jantar' },
];

const Admin = () => {
  const navigate = useNavigate();
  const { tasks, addTask, deleteTask, toggleTaskCompletion, categories } = useTaskContext();
  const [familyMembers, setFamilyMembers] = useState(MOCK_FAMILY_MEMBERS);
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  
  // State for new family member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  // State for new reward form
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState('');
  const [newRewardDescription, setNewRewardDescription] = useState('');
  
  // State for new task assignment
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('personal');

  // Add new family member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberName || !newMemberEmail) {
      toast.error('Por favor preencha todos os campos');
      return;
    }
    
    const newMember = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      role: 'child',
      points: 0
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    toast.success('Membro da família adicionado');
  };
  
  // Add new reward
  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRewardName || !newRewardPoints) {
      toast.error('Por favor preencha todos os campos obrigatórios');
      return;
    }
    
    const newReward = {
      id: Date.now().toString(),
      name: newRewardName,
      points: parseInt(newRewardPoints),
      description: newRewardDescription
    };
    
    setRewards([...rewards, newReward]);
    setNewRewardName('');
    setNewRewardPoints('');
    setNewRewardDescription('');
    toast.success('Recompensa adicionada');
  };
  
  // Assign task to family member
  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle || !newTaskAssignee || !newTaskPoints) {
      toast.error('Por favor preencha todos os campos obrigatórios');
      return;
    }
    
    // In a real app, this task would be linked to the assigned family member
    addTask({
      title: `${newTaskTitle} (${familyMembers.find(m => m.id === newTaskAssignee)?.name})`,
      description: newTaskDescription,
      completed: false,
      priority: 'medium',
      category: newTaskCategory,
      dueDate: null
    });
    
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignee('');
    setNewTaskPoints('');
    toast.success('Tarefa atribuída com sucesso');
  };
  
  // Remove a family member
  const handleRemoveMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    toast.success('Membro removido');
  };
  
  // Remove a reward
  const handleRemoveReward = (id: string) => {
    setRewards(rewards.filter(reward => reward.id !== id));
    toast.success('Recompensa removida');
  };
  
  // Award points to a family member
  const handleAwardPoints = (memberId: string, points: number) => {
    setFamilyMembers(
      familyMembers.map(member => 
        member.id === memberId 
          ? { ...member, points: member.points + points } 
          : member
      )
    );
    toast.success(`${points} pontos adicionados`);
  };
  
  // Redeem a reward for a family member
  const handleRedeemReward = (memberId: string, rewardId: string, rewardPoints: number) => {
    const member = familyMembers.find(m => m.id === memberId);
    
    if (!member) {
      toast.error('Membro não encontrado');
      return;
    }
    
    if (member.points < rewardPoints) {
      toast.error('Pontos insuficientes para resgatar esta recompensa');
      return;
    }
    
    setFamilyMembers(
      familyMembers.map(m => 
        m.id === memberId 
          ? { ...m, points: m.points - rewardPoints } 
          : m
      )
    );
    
    toast.success('Recompensa resgatada com sucesso');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <Badge className="bg-indigo-600">Administrador</Badge>
        </div>
        
        <Tabs defaultValue="family" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="family">
              <Users className="mr-2 h-4 w-4" />
              Família
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <Check className="mr-2 h-4 w-4" />
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Star className="mr-2 h-4 w-4" />
              Recompensas
            </TabsTrigger>
          </TabsList>
          
          {/* Family Members Tab */}
          <TabsContent value="family">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Membros da Família</CardTitle>
                    <CardDescription>Gerencie todos os membros da família</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Pontos</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {familyMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              {member.role === 'admin' ? (
                                <Badge>Administrador</Badge>
                              ) : (
                                <Badge variant="outline">Membro</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {member.points}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleAwardPoints(member.id, 50)}
                                  disabled={member.role === 'admin'}
                                >
                                  +50 pontos
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={() => handleRemoveMember(member.id)}
                                  disabled={member.role === 'admin'}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Membro</CardTitle>
                    <CardDescription>Adicione um novo membro à família</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddMember}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input 
                            id="name" 
                            placeholder="Nome completo" 
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Membro
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks">
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
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
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
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recompensas Disponíveis</CardTitle>
                    <CardDescription>Gerencie as recompensas que os membros podem resgatar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Pontos</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rewards.map((reward) => (
                          <TableRow key={reward.id}>
                            <TableCell className="font-medium">{reward.name}</TableCell>
                            <TableCell>{reward.description}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {reward.points}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => handleRemoveReward(reward.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Resgatar Recompensa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="redeem-member">Membro</Label>
                          <select 
                            id="redeem-member"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Selecione um membro</option>
                            {familyMembers.filter(m => m.role !== 'admin').map((member) => (
                              <option key={member.id} value={member.id}>
                                {member.name} ({member.points} pontos)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="redeem-reward">Recompensa</Label>
                          <select 
                            id="redeem-reward"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Selecione uma recompensa</option>
                            {rewards.map((reward) => (
                              <option key={reward.id} value={reward.id}>
                                {reward.name} ({reward.points} pontos)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button className="mt-4">
                        Resgatar Recompensa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Recompensa</CardTitle>
                    <CardDescription>Crie uma nova recompensa para os membros resgatarem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddReward}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="reward-name">Nome da Recompensa</Label>
                          <Input 
                            id="reward-name" 
                            placeholder="Nome da recompensa" 
                            value={newRewardName}
                            onChange={(e) => setNewRewardName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reward-points">Pontos Necessários</Label>
                          <Input 
                            id="reward-points" 
                            type="number"
                            min="0"
                            placeholder="Pontos necessários" 
                            value={newRewardPoints}
                            onChange={(e) => setNewRewardPoints(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reward-description">Descrição</Label>
                          <Input 
                            id="reward-description" 
                            placeholder="Descrição da recompensa" 
                            value={newRewardDescription}
                            onChange={(e) => setNewRewardDescription(e.target.value)}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          <Plus className="mr-2 h-4 w-4" /> Adicionar Recompensa
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
