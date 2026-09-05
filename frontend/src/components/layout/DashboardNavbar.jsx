import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Bell,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  LogOut,
  ExternalLink,
  ChevronDown,
  User,
  CheckCheck,
  Compass
} from 'lucide-react';

export const DashboardNavbar = ({ onMobileSidebarToggle, pageTitle = "Dashboard" }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const userNotifs = notifications.filter(
    n => n.recipientRole === role || n.recipientId === user?.id
  );
  const unreadCount = userNotifs.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setProfileOpen(false);
    if (newRole === 'student') navigate('/');
    else navigate('/staff/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between ${
      isScrolled
        ? 'bg-white/25 backdrop-blur-xl border-b border-white/30 shadow-xs'
        : 'bg-transparent border-b border-white/10'
    }`}>
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {onMobileSidebarToggle && (
          <button
            onClick={onMobileSidebarToggle}
            className="lg:hidden p-2 rounded-xl text-[#5B7B9C] hover:text-[#0F2238] hover:bg-[#EAF6FF] transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#0F2238] font-display leading-none">{pageTitle}</h1>
          <p className="text-[11px] text-[#5B7B9C] mt-1 hidden sm:block font-mono">
            T&P Opportunity Discovery & Placement Console
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Public Discovery Link */}
        <Link
          to="/#explore-section"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1E3A5F] hover:text-[#0F2238] bg-[#EAF6FF] hover:bg-[#C1E5FF] border border-[#C1E5FF] transition"
        >
          <Compass className="w-3.5 h-3.5 text-[#6AB0E3]" />
          <span>Public Opportunity Hub</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl text-[#5B7B9C] hover:text-[#0F2238] hover:bg-[#EAF6FF] transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#6AB0E3] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#C1E5FF] shadow-sky-card z-50 overflow-hidden animate-scale-in">
              <div className="p-4 border-b border-[#C1E5FF] flex items-center justify-between bg-[#EAF6FF]">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#0F2238] font-display">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="bg-[#C1E5FF] text-[#0F2238] text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {userNotifs.length > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(role, user?.id)}
                    className="text-xs text-[#6AB0E3] hover:underline font-bold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#EAF6FF]">
                {userNotifs.length === 0 ? (
                  <div className="p-8 text-center text-[#5B7B9C] text-xs font-medium">
                    No new notifications.
                  </div>
                ) : (
                  userNotifs.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifOpen(false);
                      }}
                      className={`p-3.5 text-xs transition cursor-pointer hover:bg-[#EAF6FF] ${
                        !n.read ? 'bg-[#EAF6FF]/60 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-[#0F2238]">{n.title}</p>
                        <span className="text-[10px] text-[#5B7B9C] whitespace-nowrap">{n.timestamp.split(' ')[1] || n.timestamp}</span>
                      </div>
                      <p className="text-[#5B7B9C] mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-[#EAF6FF] transition border border-[#C1E5FF] bg-white shadow-xs"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "User"}
              className="w-8 h-8 rounded-lg object-cover border border-[#C1E5FF]"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#0F2238] leading-tight">{user?.name || "Organizer"}</p>
              <p className="text-[10px] text-[#6AB0E3] uppercase tracking-wider font-bold">
                {role === 'staff' ? 'T&P Organizer' : 'Student'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#5B7B9C] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#C1E5FF] shadow-sky-card z-50 p-2 animate-scale-in">
              <div className="p-3 border-b border-[#EAF6FF] mb-1">
                <p className="text-xs font-bold text-[#0F2238]">{user?.name}</p>
                <p className="text-xs text-[#5B7B9C] truncate">{user?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#EAF6FF] text-[#0F2238] text-[10px] font-bold uppercase tracking-wider border border-[#C1E5FF]">
                  Mode: {role === 'staff' ? 'Organizer' : 'Student'}
                </span>
              </div>

              {/* Quick Swaps */}
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#5B7B9C] font-mono">
                Switch Mode
              </div>
              <button
                onClick={() => handleRoleChange('student')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                  role === 'student' ? 'bg-[#EAF6FF] text-[#0F2238] font-bold' : 'text-[#1E3A5F] hover:bg-[#EAF6FF]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#6AB0E3]" />
                <span>Student View</span>
              </button>

              <button
                onClick={() => handleRoleChange('staff')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                  role === 'staff' ? 'bg-[#EAF6FF] text-[#0F2238] font-bold' : 'text-[#1E3A5F] hover:bg-[#EAF6FF]'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#3F88BF]" />
                <span>T&P Organizer View</span>
              </button>

              <div className="my-1 border-t border-[#EAF6FF]" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
