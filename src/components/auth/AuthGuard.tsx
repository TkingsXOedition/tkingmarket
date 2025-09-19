import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Check for session storage to handle hardcoded login
  const isHardcodedUser = sessionStorage.getItem('tkingbeast_auth') === 'true';

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <div className="text-lg font-medium gradient-text">Loading TKINGBEAST...</div>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!user && !isHardcodedUser) {
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};