
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import Index from "./pages/Index";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { useTaskContext } from "./context/TaskContext";
import TaskList from "./components/TaskList";

const queryClient = new QueryClient();

// Create a TaskPage component for listing all tasks
const TaskPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tarefas da Casa</h1>
        <TaskList />
      </main>
    </div>
  );
};

// Create a NewTaskPage component for creating a new task (ADMIN ONLY)
const NewTaskPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova Tarefa</h1>
        <TaskForm />
      </main>
    </div>
  );
};

// Create an EditTaskPage component for editing a task (ADMIN ONLY)
const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks } = useTaskContext();
  const navigate = useNavigate();
  
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return <NotFound />;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Tarefa</h1>
        <TaskForm initialData={task} isEditing={true} />
      </main>
    </div>
  );
};

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected route component to check if user is logged in
const MemberRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component to check if user is an admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser?.role === 'admin';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TaskProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/" element={
              <MemberRoute>
                <Index />
              </MemberRoute>
            } />
            <Route path="/tarefas" element={
              <MemberRoute>
                <TaskPage />
              </MemberRoute>
            } />
            <Route path="/nova-tarefa" element={
              <AdminRoute>
                <NewTaskPage />
              </AdminRoute>
            } />
            <Route path="/tarefas/:id" element={
              <MemberRoute>
                <TaskDetail />
              </MemberRoute>
            } />
            <Route path="/tarefas/:id/editar" element={
              <AdminRoute>
                <EditTaskPage />
              </AdminRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TaskProvider>
  </QueryClientProvider>
);

export default App;
