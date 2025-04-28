
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import ProfileRedirect from "@/components/ProfileRedirect";

// Main pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "./pages/NotFound";

// Patient pages
import PatientDashboard from "@/pages/patient/Dashboard";
import PatientRecords from "@/pages/patient/Records";
import PatientAppointments from "@/pages/patient/Appointments";
import PatientAccess from "@/pages/patient/Access";
import PatientShared from "@/pages/patient/Shared";
import PatientRequests from "@/pages/patient/Requests";
import PatientProfile from "@/pages/patient/Profile";

// Doctor pages
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorPatients from "@/pages/doctor/Patients";
import DoctorRecords from "@/pages/doctor/Records";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorReports from "@/pages/doctor/Reports";
import DoctorApprovals from "@/pages/doctor/Approvals";
import DoctorProfile from "@/pages/doctor/Profile";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AppLayout requireAuth={false}><LandingPage /></AppLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Patient Routes */}
              <Route path="/patient" element={<AppLayout requiredRole="patient"><PatientDashboard /></AppLayout>} />
              <Route path="/patient/records" element={<AppLayout requiredRole="patient"><PatientRecords /></AppLayout>} />
              <Route path="/patient/appointments" element={<AppLayout requiredRole="patient"><PatientAppointments /></AppLayout>} />
              <Route path="/patient/access" element={<AppLayout requiredRole="patient"><PatientAccess /></AppLayout>} />
              <Route path="/patient/shared" element={<AppLayout requiredRole="patient"><PatientShared /></AppLayout>} />
              <Route path="/patient/requests" element={<AppLayout requiredRole="patient"><PatientRequests /></AppLayout>} />
              <Route path="/patient/profile" element={<AppLayout requiredRole="patient"><PatientProfile /></AppLayout>} />
              
              {/* Doctor Routes */}
              <Route path="/doctor" element={<AppLayout requiredRole="doctor"><DoctorDashboard /></AppLayout>} />
              <Route path="/doctor/patients" element={<AppLayout requiredRole="doctor"><DoctorPatients /></AppLayout>} />
              <Route path="/doctor/records" element={<AppLayout requiredRole="doctor"><DoctorRecords /></AppLayout>} />
              <Route path="/doctor/appointments" element={<AppLayout requiredRole="doctor"><DoctorAppointments /></AppLayout>} />
              <Route path="/doctor/reports" element={<AppLayout requiredRole="doctor"><DoctorReports /></AppLayout>} />
              <Route path="/doctor/approvals" element={<AppLayout requiredRole="doctor"><DoctorApprovals /></AppLayout>} />
              <Route path="/doctor/profile" element={<AppLayout requiredRole="doctor"><DoctorProfile /></AppLayout>} />
              
              {/* Settings */}
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              
              {/* Profile Route - Generic profile route that redirects based on user role */}
              <Route path="/profile" element={<AppLayout><ProfileRedirect /></AppLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
