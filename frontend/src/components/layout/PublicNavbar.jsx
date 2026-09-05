import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Menu, X, LogIn, Plus, LogOut, ChevronDown, User, Check, UserPlus, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { mockStaffList, mockUsers } from '../../data/users';

export const PublicNavbar = () => {
  const { user, role, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHeaderClass = () => {
    return isScrolled
      ? 'fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-blur-xl border-b border-white/30 shadow-xs transition-all duration-300'
      : 'fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10 transition-all duration-300';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Opportunities', path: '/opportunities' },
    { name: 'About', path: '/about' },
    { name: 'Manage Events', path: user && role === 'staff' ? '/staff/events' : '/staff/login' },
  ];

  const handleAccountSwitch = (accountEmail, isStaffAccount) => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    login(accountEmail, 'staff123');
    if (isStaffAccount) {
      navigate('/staff/events');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    const previousLoginPage = role === 'staff' ? '/staff/login' : '/login';
    setProfileOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate(previousLoginPage);
  };

  return (
    <header className={getHeaderClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5 -rotate-45 translate-x-[-1px] translate-y-[1px] fill-white text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A] font-display block leading-none">
                T&P CLUB
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block mt-0.5">
                TRAINING & PLACEMENT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const currentPath = location.pathname + location.search;
              const isActive =
                currentPath === link.path ||
                (link.path === '/' && location.pathname === '/' && !location.search) ||
                (link.path === '/opportunities' && (location.pathname === '/opportunities' || location.pathname === '/events')) ||
                (link.path.includes('/staff') && location.pathname.includes('/staff'));

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition relative py-1 ${
                    isActive
                      ? 'text-[#2563EB]'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2563EB] rounded-full animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action Buttons & User Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                {/* My Events & Add Event Button - Staff Only */}
                {role === 'staff' && (
                  <div className="flex items-center gap-2">
                   
                    <Link
                      to="/staff/events/create"
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition shadow-md shadow-blue-500/25 flex items-center gap-1.5 group"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Event</span>
                    </Link>
                  </div>
                )}

                {/* Logged in User Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-sky-200/80 transition shadow-xs cursor-pointer"
                  >
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-sky-300"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-[#0F172A] leading-none">{user.name}</p>
                      <span className="text-[10px] text-[#2563EB] font-semibold uppercase tracking-wider">
                        {role === 'staff' ? 'Staff' : 'Student'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>

                  {/* Profile & Account Switcher Dropdown (Instagram Style) */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-sky-100 shadow-2xl z-50 p-3 space-y-3 animate-scale-in">
                      
                      {/* Active Account Banner */}
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#EAF6FF] to-[#D9EEFF] border border-[#C1E5FF] flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={user.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#6AB0E3] shadow-xs flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[#0F2238] truncate">{user.name}</p>
                            <p className="text-[10px] text-[#5B7B9C] truncate font-medium">{user.email}</p>
                            <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md bg-[#6AB0E3] text-white text-[9px] font-bold uppercase tracking-wider">
                              {role === 'staff' ? 'Staff Account' : 'Student Account'}
                            </span>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-[#6AB0E3] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>

                      {/* Instagram-Style Account Switcher Header */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between px-1 text-[10px] font-mono font-bold text-[#5B7B9C] uppercase tracking-wider">
                          <span>Switch Available ID</span>
                          <span className="text-[#6AB0E3]">Instagram Style</span>
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
                          {/* Staff Profiles */}
                          {mockStaffList.map((staff) => {
                            const isCurrent = user?.email === staff.email;
                            return (
                              <button
                                key={staff.id}
                                onClick={() => !isCurrent && handleAccountSwitch(staff.email, true)}
                                className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                                  isCurrent
                                    ? 'bg-sky-50/80 border border-sky-200 cursor-default'
                                    : 'hover:bg-[#EAF6FF] hover:border-[#C1E5FF] border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-[#EAF6FF] text-[#0F2238] font-bold text-xs flex items-center justify-center border border-[#C1E5FF] flex-shrink-0">
                                    {staff.name.split(' ')[1]?.[0] || 'P'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#0F2238] truncate">{staff.name}</p>
                                    <p className="text-[10px] text-[#5B7B9C] truncate">{staff.department}</p>
                                  </div>
                                </div>
                                {isCurrent ? (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-[#6AB0E3]">Switch</span>
                                )}
                              </button>
                            );
                          })}

                          {/* Student Profile Option */}
                          <button
                            onClick={() => user?.email !== 'student@college.edu' && handleAccountSwitch('student@college.edu', false)}
                            className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition cursor-pointer ${
                              user?.email === 'student@college.edu'
                                ? 'bg-sky-50/80 border border-sky-200 cursor-default'
                                : 'hover:bg-[#EAF6FF] hover:border-[#C1E5FF] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200 flex-shrink-0">
                                V
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#0F2238] truncate">Vignesh B</p>
                                <p className="text-[10px] text-[#5B7B9C] truncate">CSE Student Account</p>
                              </div>
                            </div>
                            {user?.email === 'student@college.edu' ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                            ) : (
                              <span className="text-[10px] font-bold text-[#6AB0E3]">Switch</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quick Navigation Links */}
                      <div className="pt-2 border-t border-[#EAF6FF] space-y-1">
                        {role === 'staff' && (
                          <>
                            <Link
                              to="/staff/events"
                              onClick={() => setProfileOpen(false)}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#0F2238] hover:bg-[#EAF6FF] flex items-center gap-2 font-bold transition"
                            >
                              <Calendar className="w-4 h-4 text-[#6AB0E3]" />
                              <span>My Posted Events</span>
                            </Link>
                            <Link
                              to="/staff/events/create"
                              onClick={() => setProfileOpen(false)}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#0F2238] hover:bg-[#EAF6FF] flex items-center gap-2 font-bold transition"
                            >
                              <Plus className="w-4 h-4 text-[#6AB0E3]" />
                              <span>Post New Event</span>
                            </Link>
                          </>
                        )}

                        <Link
                          to="/staff/login"
                          onClick={() => setProfileOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#5B7B9C] hover:bg-[#EAF6FF] flex items-center gap-2 font-bold transition"
                        >
                          <UserPlus className="w-4 h-4 text-[#6AB0E3]" />
                          <span>Add Staff Account / Login Portal</span>
                        </Link>
                      </div>

                      {/* Logout Button (Navigates directly to page before login) */}
                      <div className="pt-2 border-t border-[#EAF6FF]">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-rose-600 bg-rose-50/50 hover:bg-rose-100/80 border border-rose-200/60 flex items-center justify-between font-bold transition cursor-pointer shadow-xs"
                          title="Sign out and return to staff login"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <span>Sign Out</span>
                          </div>
                          <span className="text-[10px] text-rose-500 font-semibold">→ {role === 'staff' ? 'Staff Login' : 'Login'}</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged Out View */
              <div className="flex items-center gap-2">
                <Link
                  to="/staff/login"
                  className="px-4 py-2.5 rounded-full text-xs font-bold text-[#0F172A] hover:text-[#2563EB] bg-[#EAF6FF] hover:bg-[#C1E5FF] border border-[#C1E5FF] transition shadow-xs flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-[#6AB0E3]" />
                  <span>Staff Portal</span>
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <>
                {role === 'staff' && (
                  <Link
                    to="/staff/events/create"
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#0F172A] border border-sky-200 shadow-xs flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#0F172A] hover:bg-sky-100/50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sky-100 bg-white/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => {
            const currentPath = location.pathname + location.search;
            const isActive =
              currentPath === link.path ||
              (link.path === '/' && location.pathname === '/' && !location.search) ||
              (link.path === '/opportunities' && (location.pathname === '/opportunities' || location.pathname === '/events'));
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                  isActive
                    ? 'bg-sky-50 text-[#2563EB]'
                    : 'text-[#334155] hover:bg-sky-50/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-sky-100 space-y-2">
            {user ? (
              <>
                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{user.name}</p>
                      <p className="text-[10px] text-[#2563EB] font-bold uppercase">{role === 'staff' ? 'Staff Account' : 'Student Account'}</p>
                    </div>
                  </div>
                </div>

                {role === 'staff' && (
                  <Link
                    to="/staff/events/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-blue-500/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-sky-50 border border-sky-200 text-[#0F172A] font-bold text-xs"
              >
                <LogIn className="w-4 h-4 text-[#2563EB]" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
