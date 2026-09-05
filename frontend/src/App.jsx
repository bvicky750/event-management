import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Components
import { PublicNavbar } from './components/layout/PublicNavbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailsPage } from './pages/public/EventDetailsPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages (Staff Only)
import { StaffLoginPage } from './pages/auth/StaffLoginPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';

// Staff Pages
import { StaffEventsPage } from './pages/staff/StaffEventsPage';
import { CreateEventPage } from './pages/staff/CreateEventPage';
import { EditEventPage } from './pages/staff/EditEventPage';
import { EventRegistrationsPage } from './pages/staff/EventRegistrationsPage';

// Public Layout Wrapper
const PublicLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#0F2238] selection:bg-[#6AB0E3] selection:text-white">
      <PublicNavbar />
      <main className={`flex-1 ${!isHome ? 'pt-24 sm:pt-28 pb-12' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Staff Portal Layout Wrapper
const StaffPublicLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['staff', 'admin']}>
      <div className="min-h-screen flex flex-col bg-transparent text-[#0F2238] selection:bg-[#6AB0E3] selection:text-white">
        <PublicNavbar />
        <main className="flex-1 pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {/* Subtle separator border under fixed header */}
          <div className="w-full mb-6 border-b border-sky-200/50" />
          <Outlet />
        </main>
        <Footer />
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
            <ScrollToTop />
            <Routes>
              {/* Public Discovery Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/opportunities" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/opportunities/:id" element={<EventDetailsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/staff/login" element={<StaffLoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Staff Management Routes (Protected) */}
              <Route path="/staff" element={<StaffPublicLayout />}>
                <Route index element={<Navigate to="/staff/events" replace />} />
                <Route path="dashboard" element={<StaffEventsPage />} />
                <Route path="events" element={<StaffEventsPage />} />
                <Route path="my-events" element={<StaffEventsPage />} />
                <Route path="events/create" element={<CreateEventPage />} />
                <Route path="events/:id/edit" element={<EditEventPage />} />
                <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
              </Route>

              {/* Redirects for legacy and student routes to keep UX seamless */}
              <Route path="/login" element={<Navigate to="/staff/login" replace />} />
              <Route path="/student/*" element={<Navigate to="/" replace />} />
              <Route path="/student" element={<Navigate to="/" replace />} />
              <Route path="/organizer/*" element={<Navigate to="/staff/events" replace />} />
              <Route path="/organizer" element={<Navigate to="/staff/events" replace />} />
              <Route path="/admin/*" element={<Navigate to="/staff/events" replace />} />
              <Route path="/admin" element={<Navigate to="/staff/events" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
