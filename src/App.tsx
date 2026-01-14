import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import PersonalDashboard from "./pages/dashboard/PersonalDashboard";
import AlunoDashboard from "./pages/dashboard/AlunoDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import WorkoutsList from "./pages/dashboard/WorkoutsList";
import CreateWorkout from "./pages/dashboard/CreateWorkout";
import NotFound from "./pages/NotFound";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardTrainer from "./pages/DashboardTrainer";
import ChatAI from "./pages/ChatAI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route 
              path="/dashboard/personal" 
              element={
                <ProtectedRoute allowedRoles={['professional', 'admin']}>
                  <PersonalDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/personal/treinos" 
              element={
                <ProtectedRoute allowedRoles={['professional', 'admin']}>
                  <WorkoutsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/personal/treinos/novo" 
              element={
                <ProtectedRoute allowedRoles={['professional', 'admin']}>
                  <CreateWorkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/aluno" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <AlunoDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meu-painel" 
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <DashboardStudent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/coach-ai" 
              element={
                <ProtectedRoute allowedRoles={['student', 'professional', 'admin']}>
                  <ChatAI />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/trainer" 
              element={
                <ProtectedRoute allowedRoles={['professional', 'admin']}>
                  <DashboardTrainer />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
