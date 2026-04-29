import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'worker' | 'admin';
  adminOnly?: boolean; // New prop for admin-only routes
}

// ============================================================================
// PROTECTED ROUTE COMPONENT
// Updated to support admin role checks and hardcoded admin
// ============================================================================
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  adminOnly = false
}) => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading skeleton while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Pass current location so we can redirect back after login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ============================================================================
  // ADMIN ACCESS CHECK
  // Ensures normal users cannot access admin portal directly
  // ============================================================================
  if (adminOnly && !isAdmin) {
    console.log('[ProtectedRoute] Admin access required, user is not admin');
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access if required
  // Admin users can access any role-specific route
  if (requiredRole && user?.role !== requiredRole && !isAdmin) {
    console.log('[ProtectedRoute] Role mismatch, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
