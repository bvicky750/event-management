import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  Ticket,
  Award,
  Bell,
  User,
  LogOut,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const StudentSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { odRequests, notifications } = useData();

  const pendingODCount = odRequests.filter(
    r => r.studentId === user?.id && r.status === 'PENDING'
  ).length;

  const unreadNotifs = notifications.filter(
    n => (n.recipientRole === 'student' || n.recipientId === user?.id) && !n.read
  ).length;

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Discover Events', path: '/events', icon: Compass },
    {
      name: 'My OD Requests',
      path: '/student/od',
      icon: FileCheck2,
      badge: pendingODCount > 0 ? pendingODCount : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { name: 'My Registrations', path: '/student/registrations', icon: Ticket },
    { name: 'Participation Record', path: '/student/participation', icon: Award },
    {
      name: 'Notifications',
      path: '/student/notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    { name: 'Student Profile', path: '/student/profile', icon: User },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 w-64">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white leading-tight">Student Portal</h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Event Hub</p>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Student Badge Summary */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={user?.name}
          className="w-10 h-10 rounded-lg object-cover border border-slate-700"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{user?.name}</p>
          <p className="text-[11px] text-blue-400 font-mono font-medium">{user?.registerNumber}</p>
          <p className="text-[10px] text-slate-400 truncate">{user?.department?.split(' ')[0]} • {user?.year}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Public Link & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <Compass className="w-4 h-4" />
          <span>Public Homepage</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
