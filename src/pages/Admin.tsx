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
import { 
  Check, 
  Plus, 
  Star, 
  Trash, 
  User, 
  Users, 
  Trophy,
  Crown,
  Medal,
  Copy,
  RefreshCw,
  Key,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import { toast } from 'sonner';

// Mock family members with more detailed data
const MOCK_FAMILY_MEMBERS = [
  { 
    id: '1', 
    name: 'Luiz Inacio Lula da Silva', 
    email: 'admin@familia.com', 
    role: 'admin', 
    points: 500,
    completedTasks: 15,
    pendingTasks: 3,
    weeklyPoints: 120
  },
  { 
    id: '2', 
    name: 'Maria Silva', 
    email: 'maria@familia.com', 
    role: 'child', 
    points: 450,
    completedTasks: 18,
    pendingTasks: 2,
    weeklyPoints: 150
  },
  { 
    id: '3', 
    name: 'João Silva', 
    email: 'joao@familia.com', 
    role: 'child', 
    points: 320,
    completedTasks: 12,
    pendingTasks: 4,
    weeklyPoints: 80
  },
];

// Mock rewards data
const MOCK_REWARDS = [
  { id: '1', name: 'Sorvete', points: 50, description: 'Um sorvete da sua escolha' },
  { id: '2', name: 'Videogame (1h)', points: 100, description: 'Uma hora extra de videogame' },
  { id: '3', name: 'Cinema', points: 300, description: 'Passeio ao cinema com pipoca' },
  { id: '4', name: 'Escolha do jantar', points: 150, description: 'Escolher o cardápio do jantar' },
];

// Generate random family code
const generateFamilyCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const Admin = () => {
  const navigate = useNavigate();
  const { tasks, addTask, deleteTask, toggleTaskCompletion, categories } = useTaskContext();
  const [familyMembers, setFamilyMembers] = useState(MOCK_FAMILY_MEMBERS);
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [familyCode, setFamilyCode] = useState(generateFamilyCode());
  const [generatedPassword, setGeneratedPassword] = useState('');
  
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

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  // Generate new family code
  const handleGenerateNewCode = () => {
    const newCode = generateFamilyCode();
    setFamilyCode(newCode);
    toast.success('Novo código de família gerado');
  };

  // Generate new password
  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    toast.success('Nova senha gerada');
  };

  // Get sorted leaderboard
  const getLeaderboard = () => {
    return [...familyMembers]
      .filter(member => member.role !== 'admin')
      .sort((a, b) => b.points - a.points);
  };

  // Get weekly leaderboard
  const getWeeklyLeaderboard = () => {
    return [...familyMembers]
      .filter(member => member.role !== 'admin')
      .sort((a, b) => b.weeklyPoints - a.weeklyPoints);
  };

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
      points: 0,
      completedTasks: 0,
      pendingTasks: 0,
      weeklyPoints: 0
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
          ? { ...member, points: member.points + points, weeklyPoints: member.weeklyPoints + points } 
          : member
      )
    );
    toast.success(`${points} pontos adicionados`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo da Família</h1>
          <Badge className="bg-indigo-600">Administrador</Badge>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
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
            <TabsTrigger value="settings">
              <Key className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Family Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Estatísticas da Família
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Membros:</span>
                      <Badge>{familyMembers.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarefas Ativas:</span>
                      <Badge variant="outline">{tasks.filter(t => !t.completed).length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarefas Concluídas:</span>
                      <Badge className="bg-green-500">{tasks.filter(t => t.completed).length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Pontos:</span>
                      <Badge className="bg-yellow-500">
                        {familyMembers.reduce((total, member) => total + member.points, 0)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                    Destaque do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getLeaderboard().length > 0 && (
                    <div className="text-center">
                      <div className="mb-3">
                        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-lg">{getLeaderboard()[0].name}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-yellow-600">{getLeaderboard()[0].points}</div>
                          <div className="text-gray-500">Pontos</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{getLeaderboard()[0].completedTasks}</div>
                          <div className="text-gray-500">Tarefas</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/nova-tarefa')} 
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Tarefa
                  </Button>
                  <Button 
                    onClick={handleGenerateNewCode} 
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Gerar Código
                  </Button>
                  <Button 
                    onClick={handleGeneratePassword} 
                    className="w-full"
                    variant="outline"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Gerar Senha
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Ranking Geral
                  </CardTitle>
                  <CardDescription>Classificação por pontos totais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getLeaderboard().map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                            {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                            {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                            {index === 2 && <Medal className="h-4 w-4 text-orange-500" />}
                            {index > 2 && <span className="text-sm font-semibold">{index + 1}</span>}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">
                              {member.completedTasks} tarefas concluídas
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-yellow-600">{member.points}</div>
                          <div className="text-xs text-gray-500">pontos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-blue-500" />
                    Ranking Semanal
                  </CardTitle>
                  <CardDescription>Pontos ganhos esta semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getWeeklyLeaderboard().map((member, index) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                            {index === 0 && <Crown className="h-4 w-4 text-blue-500" />}
                            {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                            {index === 2 && <Medal className="h-4 w-4 text-orange-500" />}
                            {index > 2 && <span className="text-sm font-semibold">{index + 1}</span>}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500">
                              {member.pendingTasks} tarefas pendentes
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{member.weeklyPoints}</div>
                          <div className="text-xs text-gray-500">esta semana</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Family Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Código da Família
                  </CardTitle>
                  <CardDescription>
                    Use este código para que novos membros se juntem à família
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={familyCode} 
                        readOnly 
                        className="font-mono text-lg text-center bg-gray-50"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => copyToClipboard(familyCode, 'Código da família')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      onClick={handleGenerateNewCode} 
                      className="w-full"
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar Novo Código
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Password Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Gerador de Senhas
                  </CardTitle>
                  <CardDescription>
                    Gere senhas seguras para os membros da família
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input 
                        value={generatedPassword} 
                        readOnly 
                        placeholder="Clique em gerar para criar uma senha"
                        className="font-mono"
                      />
                      {generatedPassword && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => copyToClipboard(generatedPassword, 'Senha')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Button 
                      onClick={handleGeneratePassword} 
                      className="w-full"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Gerar Nova Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
