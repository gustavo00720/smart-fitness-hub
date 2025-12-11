import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('professional' | 'student' | 'admin')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'professional') {
      return <Navigate to="/dashboard/personal" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/dashboard/aluno" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
