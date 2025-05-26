
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus, Crown, User, Plus, Minus, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  completedTasks: number;
  pendingTasks: number;
  weeklyPoints: number;
}

interface FamilyMemberManagementProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

const FamilyMemberManagement: React.FC<FamilyMemberManagementProps> = ({ 
  familyMembers, 
  setFamilyMembers 
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [customPoints, setCustomPoints] = useState<{ [key: string]: string }>({});
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const addFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberName || !newMemberEmail || !newMemberPassword) {
      toast.error('Por favor preencha todos os campos');
      return;
    }

    if (newMemberPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      role: 'member',
      points: 0,
      completedTasks: 0,
      pendingTasks: 0,
      weeklyPoints: 0
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPassword('');
    toast.success('Membro adicionado com sucesso');
  };

  const toggleRole = (memberId: string) => {
    if (memberId === currentUser.id) {
      toast.error('Você não pode alterar seu próprio papel');
      return;
    }

    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, role: member.role === 'admin' ? 'member' : 'admin' }
        : member
    ));
    toast.success('Papel alterado com sucesso');
  };

  const adjustPoints = (memberId: string, amount: number) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, points: Math.max(0, member.points + amount) }
        : member
    ));
    toast.success(`${amount > 0 ? 'Adicionados' : 'Removidos'} ${Math.abs(amount)} pontos`);
  };

  const adjustCustomPoints = (memberId: string, isAdding: boolean) => {
    const points = parseInt(customPoints[memberId] || '0');
    if (isNaN(points) || points <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    adjustPoints(memberId, isAdding ? points : -points);
    setCustomPoints(prev => ({ ...prev, [memberId]: '' }));
  };

  const removeMember = (memberId: string) => {
    if (memberId === currentUser.id) {
      toast.error('Você não pode remover a si mesmo');
      return;
    }

    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    toast.success('Membro removido com sucesso');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Membros da Casa</CardTitle>
            <CardDescription>Gerencie os membros e suas permissões</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
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
                      <Badge variant={member.role === 'admin' ? 'default' : 'outline'}>
                        {member.role === 'admin' ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Líder
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 mr-1" />
                            Membro
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.points}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleRole(member.id)}
                          disabled={member.id === currentUser.id}
                        >
                          {member.role === 'admin' ? 'Tornar Membro' : 'Tornar Líder'}
                        </Button>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              Pontos
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => adjustPoints(member.id, 10)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  +10
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => adjustPoints(member.id, -10)}
                                  variant="destructive"
                                >
                                  <Minus className="w-3 h-3 mr-1" />
                                  -10
                                </Button>
                              </div>
                              
                              <div className="flex space-x-1">
                                <Input
                                  type="number"
                                  placeholder="Valor"
                                  value={customPoints[member.id] || ''}
                                  onChange={(e) => setCustomPoints(prev => ({ 
                                    ...prev, 
                                    [member.id]: e.target.value 
                                  }))}
                                  className="text-xs"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => adjustCustomPoints(member.id, true)}
                                  className="bg-green-500 hover:bg-green-600 px-2"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => adjustCustomPoints(member.id, false)}
                                  variant="destructive"
                                  className="px-2"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {member.id !== currentUser.id && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
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
            <CardDescription>Convide um novo membro para a casa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addFamilyMember}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="member-name">Nome</Label>
                  <Input 
                    id="member-name" 
                    placeholder="Nome do membro" 
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="member-email">Email</Label>
                  <Input 
                    id="member-email" 
                    type="email"
                    placeholder="email@exemplo.com" 
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="member-password">Senha</Label>
                  <Input 
                    id="member-password" 
                    type="password"
                    placeholder="••••••••" 
                    value={newMemberPassword}
                    onChange={(e) => setNewMemberPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> Adicionar Membro
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyMemberManagement;
