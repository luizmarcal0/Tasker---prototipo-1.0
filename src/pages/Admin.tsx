
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3,
  Check
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import FamilyMemberManagement from "../components/admin/FamilyMemberManagement";
import TaskManagement from "../components/admin/TaskManagement";
import DashboardStats from "../components/admin/DashboardStats";

// Empty family members initially - clean for new families
const MOCK_FAMILY_MEMBERS = [
  { 
    id: '1', 
    name: 'Luiz Inacio Lula da Silva', 
    email: 'admin@tasker.com', 
    role: 'admin', 
    points: 500,
    completedTasks: 15,
    pendingTasks: 3,
    weeklyPoints: 120
  }
];

const Admin = () => {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState(MOCK_FAMILY_MEMBERS);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tasker</h1>
          <Badge className="bg-indigo-600">Administrador</Badge>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="family">
              <Users className="mr-2 h-4 w-4" />
              Membros
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <Check className="mr-2 h-4 w-4" />
              Tarefas
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <DashboardStats 
              familyMembers={familyMembers}
              getLeaderboard={getLeaderboard}
              getWeeklyLeaderboard={getWeeklyLeaderboard}
            />
          </TabsContent>

          {/* Family Members Tab */}
          <TabsContent value="family">
            <FamilyMemberManagement 
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
            />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <TaskManagement familyMembers={familyMembers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
