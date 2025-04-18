
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import Index from "./pages/Index";
import TaskDetail from "./pages/TaskDetail";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

// Create a TaskPage component for listing all tasks
const TaskPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
        <TaskList />
      </main>
    </div>
  );
};

// Create a NewTaskPage component for creating a new task
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

// Create an EditTaskPage component for editing a task
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TaskProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tarefas" element={<TaskPage />} />
            <Route path="/nova-tarefa" element={<NewTaskPage />} />
            <Route path="/tarefas/:id" element={<TaskDetail />} />
            <Route path="/tarefas/:id/editar" element={<EditTaskPage />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TaskProvider>
  </QueryClientProvider>
);

// Import required components
import { useParams, useNavigate } from "react-router-dom";
import { useTaskContext } from "./context/TaskContext";
import TaskList from "./components/TaskList";

export default App;
