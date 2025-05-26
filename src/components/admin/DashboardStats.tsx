
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy,
  Crown,
  Medal,
  Target,
  Award
} from 'lucide-react';

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

interface DashboardStatsProps {
  familyMembers: FamilyMember[];
  getLeaderboard: () => FamilyMember[];
  getWeeklyLeaderboard: () => FamilyMember[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  familyMembers, 
  getLeaderboard, 
  getWeeklyLeaderboard 
}) => {
  const totalMembers = familyMembers.filter(m => m.role !== 'admin').length;
  const totalTasks = familyMembers.reduce((sum, member) => sum + member.completedTasks + member.pendingTasks, 0);
  const completedTasks = familyMembers.reduce((sum, member) => sum + member.completedTasks, 0);
  const leaderboard = getLeaderboard();
  const weeklyLeaderboard = getWeeklyLeaderboard();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Crown className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-gray-500">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-amber-500" />
              Ranking Geral
            </CardTitle>
            <CardDescription>Pontuação total de todos os tempos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-amber-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <Badge variant="outline">{member.points} pts</Badge>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nenhum membro com pontos ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="mr-2 h-5 w-5 text-blue-500" />
              Ranking Semanal
            </CardTitle>
            <CardDescription>Pontos ganhos esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyLeaderboard.slice(0, 5).map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-blue-500 text-white' :
                      index === 1 ? 'bg-blue-400 text-white' :
                      index === 2 ? 'bg-blue-300 text-white' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <Badge variant="outline">{member.weeklyPoints} pts</Badge>
                </div>
              ))}
              {weeklyLeaderboard.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Nenhum ponto ganho esta semana
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
