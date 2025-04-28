
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppNavbar from './AppNavbar';
import PatientSidebar from './PatientSidebar';
import DoctorSidebar from './DoctorSidebar';
import { useTheme } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'patient' | 'doctor';
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Handle authentication check
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Handle role-based access
  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === 'patient' ? '/patient' : '/doctor';
    return <Navigate to={redirectPath} replace />;
  }

  // Determine which sidebar to show based on user role
  const Sidebar = user?.role === 'doctor' ? DoctorSidebar : PatientSidebar;
  
  // For public pages (no auth required)
  if (!requireAuth) {
    return <div className={theme}>{children}</div>;
  }
  
  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <AppNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
