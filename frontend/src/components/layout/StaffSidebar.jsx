import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Compass,
  FileCheck2,
  QrCode,
  GraduationCap,
  Users,
  BarChart3,
  LogOut,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const StaffSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { events } = useData();

  const navItems = [
    { name: 'Dashboard Overview', path: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'My Posted Events', path: '/staff/events', icon: Calendar, badge: `${events.length}`, badgeColor: 'bg-[#EAF6FF] text-[#6AB0E3] border border-[#C1E5FF] font-mono' },
    { name: 'Post New Event', path: '/staff/events/create', icon: CalendarPlus },
    { name: 'Student Directory', path: '/staff/students', icon: GraduationCap },
    { name: 'Reports & Traffic', path: '/staff/reports', icon: BarChart3 },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg text-[#1E3A5F] border-r border-[#C1E5FF] w-64 shadow-xs">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#C1E5FF] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white shadow-md shadow-[#6AB0E3]/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-sm text-[#0F2238] leading-tight font-display">
              T&P <span className="text-[#6AB0E3]">CLUB</span>
            </h2>
            <p className="text-[10px] text-[#539FD8] font-bold tracking-wider uppercase font-mono">
              Organizer Portal
            </p>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[#5B7B9C] hover:text-[#0F2238] p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Staff Identity Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] flex items-center gap-3">
        <img
          src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
          alt={user?.name}
          className="w-10 h-10 rounded-xl object-cover border border-[#C1E5FF] flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#0F2238] truncate">{user?.name || 'T&P Organizer'}</p>
          <p className="text-[11px] text-[#6AB0E3] font-bold truncate">T&P Placement Cell</p>
          <p className="text-[10px] text-[#5B7B9C] truncate">{user?.employeeId || 'Organizer'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-[#6AB0E3] text-white shadow-sm shadow-[#6AB0E3]/25'
                  : 'text-[#1E3A5F] hover:bg-[#EAF6FF] hover:text-[#0F2238]'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Public Homepage & Logout */}
      <div className="p-4 border-t border-[#C1E5FF] space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#5B7B9C] hover:bg-[#EAF6FF] hover:text-[#0F2238] transition"
        >
          <Compass className="w-4 h-4 text-[#6AB0E3]" />
          <span>Public Opportunity Hub</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-[#0F2238]/40 backdrop-blur-xs" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
