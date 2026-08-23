import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Components
import { PublicNavbar } from './components/layout/PublicNavbar';
import { DashboardNavbar } from './components/layout/DashboardNavbar';
import { StudentSidebar } from './components/layout/StudentSidebar';
import { StaffSidebar } from './components/layout/StaffSidebar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { EventDetailsPage } from './pages/public/EventDetailsPage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ApplyODPage } from './pages/student/ApplyODPage';
import { MyODRequestsPage } from './pages/student/MyODRequestsPage';
import { MyRegistrationsPage } from './pages/student/MyRegistrationsPage';
import { RegistrationPassPage } from './pages/student/RegistrationPassPage';
import { ParticipationHistoryPage } from './pages/student/ParticipationHistoryPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Staff / Organizer Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffEventsPage } from './pages/staff/StaffEventsPage';
import { CreateEventPage } from './pages/staff/CreateEventPage';
import { EditEventPage } from './pages/staff/EditEventPage';
import { StaffODRequestsPage } from './pages/staff/StaffODRequestsPage';
import { ODRequestDetailsPage } from './pages/staff/ODRequestDetailsPage';
import { EventRegistrationsPage } from './pages/staff/EventRegistrationsPage';
import { QRScannerPage } from './pages/staff/QRScannerPage';
import { EventAttendancePage } from './pages/staff/EventAttendancePage';
import { StaffReportsPage } from './pages/staff/StaffReportsPage';
import { StaffStudentsPage } from './pages/staff/StaffStudentsPage';
import { StaffFacultyPage } from './pages/staff/StaffFacultyPage';

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#0F2238] selection:bg-[#6AB0E3] selection:text-white">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Portal Layout (Student / Organizer)
const PortalLayout = ({ roleRequired }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Organizer Console';
    if (path.includes('/events/create')) return 'Post New Opportunity';
    if (path.includes('/events') && path.includes('/edit')) return 'Edit Opportunity';
    if (path.includes('/events')) return 'Managed Opportunities & Audit';
    if (path.includes('/students') || path.includes('/users')) return 'Student Directory';
    if (path.includes('/reports')) return 'Opportunity Traffic & Clicks';
    if (path.includes('/od')) return roleRequired === 'staff' ? 'OD Applications Review' : 'My OD Requests';
    if (path.includes('/registrations')) return roleRequired === 'staff' ? 'Event Registrations' : 'My Registrations';
    return 'T&P Opportunity Hub Portal';
  };

  return (
    <ProtectedRoute allowedRoles={[roleRequired]}>
      <div className="min-h-screen flex flex-col bg-transparent text-[#0F2238]">
        <div className="flex-1 flex">
          {roleRequired === 'student' && (
            <StudentSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          )}
          {roleRequired === 'staff' && (
            <StaffSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          )}

          <div className="flex-1 flex flex-col min-w-0 bg-transparent">
            <DashboardNavbar
              onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              pageTitle={getPageTitle()}
            />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<Navigate to="/#explore-section" replace />} />
                <Route path="/opportunities" element={<Navigate to="/#explore-section" replace />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/opportunities/:id" element={<EventDetailsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Student Portal Routes */}
              <Route path="/student" element={<PortalLayout roleRequired="student" />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="od/apply/:eventId" element={<ApplyODPage />} />
                <Route path="od" element={<MyODRequestsPage />} />
                <Route path="registrations" element={<MyRegistrationsPage />} />
                <Route path="registrations/:id" element={<RegistrationPassPage />} />
                <Route path="participation" element={<ParticipationHistoryPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Staff / Organizer Portal Routes */}
              <Route path="/staff" element={<PortalLayout roleRequired="staff" />}>
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="events" element={<StaffEventsPage />} />
                <Route path="events/create" element={<CreateEventPage />} />
                <Route path="events/:id/edit" element={<EditEventPage />} />
                <Route path="od" element={<StaffODRequestsPage />} />
                <Route path="od/:id" element={<ODRequestDetailsPage />} />
                <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
                <Route path="scanner" element={<QRScannerPage />} />
                <Route path="events/:id/attendance" element={<EventAttendancePage />} />
                <Route path="students" element={<StaffStudentsPage />} />
                <Route path="users" element={<StaffStudentsPage />} />
                <Route path="faculty" element={<StaffFacultyPage />} />
                <Route path="reports" element={<StaffReportsPage />} />
              </Route>

              {/* Seamless redirect for organizer and legacy admin routes */}
              <Route path="/organizer/*" element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="/organizer" element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="/admin/*" element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/staff/dashboard" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
