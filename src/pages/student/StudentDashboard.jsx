import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileCheck2,
  Ticket,
  Award,
  ArrowRight,
  Compass,
  Bell,
  Sparkles,
  Building2,
  MapPin,
  QrCode
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { events, odRequests, registrations, attendance, notifications } = useData();

  // Student specific data
  const myRegistrations = registrations.filter(r => r.studentId === user?.id && r.status !== 'CANCELLED');
  const myODRequests = odRequests.filter(r => r.studentId === user?.id);
  const pendingOD = myODRequests.filter(r => r.status === 'PENDING');
  const approvedOD = myODRequests.filter(r => r.status === 'APPROVED');
  const attendedCount = myRegistrations.filter(r => r.attendanceStatus === 'PRESENT' || r.status === 'ATTENDED').length + 2; // + past events

  const upcomingRegistrations = myRegistrations.slice(0, 3);
  const recentODs = myODRequests.slice(0, 3);
  const studentNotifs = notifications.filter(n => n.recipientRole === 'student' || n.recipientId === user?.id).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-300 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-brand-800/80 border border-brand-700">
              {user?.department || "CSE"} • {user?.year || "2nd Year"}
            </span>
            <span>Register No: {user?.registerNumber || "23CSE001"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || "Vignesh"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Welcome to your student hub. Discover upcoming symposiums, track your On-Duty requests, and manage your event passes.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link to="/events">
            <Button variant="primary" size="md" leftIcon={Compass} className="shadow-md">
              Discover Events
            </Button>
          </Link>
          <Link to="/student/od">
            <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20" leftIcon={FileCheck2}>
              Track OD ({pendingOD.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Registered */}
        <Link to="/student/registrations" className="block group">
          <Card hover className="p-5 border-l-4 border-l-brand-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered</span>
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{myRegistrations.length}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>View confirmed passes</span>
              <ArrowRight className="w-3 h-3 text-brand-600 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Card>
        </Link>

        {/* Metric 2: Pending OD */}
        <Link to="/student/od?tab=pending" className="block group">
          <Card hover className="p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending OD</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingOD.length}</p>
            <p className="text-xs text-slate-500 mt-1">Awaiting staff review</p>
          </Card>
        </Link>

        {/* Metric 3: Approved OD */}
        <Link to="/student/od?tab=approved" className="block group">
          <Card hover className="p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved OD</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{approvedOD.length}</p>
            <p className="text-xs text-slate-500 mt-1">Ready for registration</p>
          </Card>
        </Link>

        {/* Metric 4: Attended */}
        <Link to="/student/participation" className="block group">
          <Card hover className="p-5 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attended</span>
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{attendedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Participation records</p>
          </Card>
        </Link>
      </div>

      {/* Main 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Events & Pending OD Requests */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Registered Events */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Registered Events</h3>
                <p className="text-xs text-slate-500">Events you have confirmed entry passes for.</p>
              </div>
              <Link to="/student/registrations" className="text-xs font-semibold text-brand-600 hover:underline">
                View All ({myRegistrations.length})
              </Link>
            </div>

            {upcomingRegistrations.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                You haven't registered for any events yet.
                <Link to="/events" className="block mt-2 font-bold text-brand-600">
                  Explore Upcoming Events →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{reg.eventTitle}</h4>
                        <Badge variant="registered" size="sm">
                          {reg.registrationNumber}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {reg.eventDates}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {reg.college}
                        </span>
                      </div>
                    </div>

                    <Link to={`/student/registrations/${reg.id}`}>
                      <Button variant="primary" size="sm" leftIcon={QrCode} className="w-full sm:w-auto">
                        View QR Pass
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending OD Requests Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">On-Duty (OD) Applications</h3>
                <p className="text-xs text-slate-500">Track your OD approval status with department faculty.</p>
              </div>
              <Link to="/student/od" className="text-xs font-semibold text-brand-600 hover:underline">
                Manage ODs
              </Link>
            </div>

            {recentODs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                No OD applications submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentODs.map((od) => (
                  <div
                    key={od.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{od.eventTitle}</h4>
                        <Badge
                          variant={od.status === 'APPROVED' ? 'od-approved' : od.status === 'PENDING' ? 'od-pending' : 'od-rejected'}
                          size="sm"
                        >
                          {od.status}
                        </Badge>
                      </div>
                      <p className="text-slate-500">
                        {od.college} • {od.odDuration} • Applied: {od.appliedAt}
                      </p>
                    </div>

                    <Link to="/student/od">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications Center */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Notifications</h3>
              </div>
              <Link to="/student/notifications" className="text-xs font-semibold text-brand-600 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {studentNotifs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No notifications</p>
              ) : (
                studentNotifs.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs transition ${
                      !n.read ? 'bg-brand-50/50 border-brand-200' : 'bg-slate-50/50 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.timestamp.split(' ')[0]}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Quick Shortcuts
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/events?odAvailable=true"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 block transition font-medium"
              >
                🔍 Browse Events with OD Available
              </Link>
              <Link
                to="/student/participation"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 block transition font-medium"
              >
                📜 Download Participation Transcript
              </Link>
              <Link
                to="/student/profile"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 block transition font-medium"
              >
                👤 Update Academic Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
