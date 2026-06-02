import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { AdminShell } from '@/shared/components/AdminShell';
import { LoadingState } from '@/shared/components/LoadingState';

export default function ProtectedRoute() {
  const { isAuthenticated, isAuthReady } = useAuthStore();

  if (!isAuthReady) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminShell />;
}
