import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Menu, X, Plus, LogOut, ChevronDown, Briefcase, Calendar } from 'lucide-react';

export const PublicNavbar = () => {
  const { user, isStaff, logout } = useAuth();
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

  const isHomePage = location.pathname === '/';

  const getHeaderClass = () => {
    if (isScrolled) {
      return 'fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-sky-200/60 shadow-xs transition-all duration-300';
    }
    if (!isHomePage) {
      return 'fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-blur-md border-b border-sky-200/40 shadow-xs transition-all duration-300';
    }
    return 'fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/20 transition-all duration-300';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Opportunities', path: '/opportunities' },
    ...(isStaff ? [{ name: 'Manage Events', path: '/staff/events' }] : []),
    { name: 'About', path: '/about' }
    
  ];

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/staff/login');
  };

  return (
    <header className={getHeaderClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
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
                (link.path === '/staff/events' && location.pathname.startsWith('/staff') && location.pathname !== '/staff/login');

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

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isStaff ? (
              <>
                {/* Add Event Button - Staff */}
                <Link
                  to="/staff/events/create"
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition shadow-md shadow-blue-500/25 flex items-center gap-1.5 group"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </Link>

                {/* Staff Account Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-sky-200/80 transition shadow-xs cursor-pointer"
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#0F172A] leading-none">{user?.name}</p>
                      <span className="text-[10px] text-[#2563EB] font-semibold uppercase tracking-wider">
                        Staff
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-sky-100 shadow-2xl z-50 p-3 space-y-3 animate-scale-in">
                      {/* Active Account Info */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#EAF6FF] to-[#D9EEFF] border border-[#C1E5FF]">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#0F2238] truncate">{user?.name}</p>
                          <p className="text-[10px] text-[#5B7B9C] truncate font-medium">{user?.email}</p>
                          <span className="inline-block px-2 py-0.5 mt-1 rounded-md bg-[#6AB0E3] text-white text-[9px] font-bold uppercase tracking-wider">
                            Staff Account
                          </span>
                        </div>
                      </div>

                      {/* Quick Navigation Links */}
                      <div className="pt-1 space-y-1">
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
                      </div>

                      {/* Logout Button */}
                      <div className="pt-2 border-t border-[#EAF6FF]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 bg-rose-50/50 hover:bg-rose-100/80 border border-rose-200/60 flex items-center justify-between font-bold transition cursor-pointer shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <span>Sign Out</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Public Visitor Right Buttons */
              <div className="flex items-center gap-2.5">
                <Link
                  to="/staff/login"
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#0F172A] hover:text-[#2563EB] bg-white/80 hover:bg-white border border-sky-200/80 transition shadow-xs flex items-center gap-1.5"
                >
                  <Briefcase className="w-4 h-4 text-[#6AB0E3]" />
                  <span>Staff Portal</span>
                </Link>
                <Link
                  to="/staff/login"
                  className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add Event</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isStaff && (
              <Link
                to="/staff/login"
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-xs flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Staff</span>
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
              (link.path === '/opportunities' && (location.pathname === '/opportunities' || location.pathname === '/events')) ||
              (link.path === '/staff/events' && location.pathname.startsWith('/staff') && location.pathname !== '/staff/login');
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
            {isStaff ? (
              <>
                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-100">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{user?.name}</p>
                    <p className="text-[10px] text-[#2563EB] font-bold uppercase">Staff Account</p>
                  </div>
                </div>

                <Link
                  to="/staff/events/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-blue-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/staff/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center py-2.5 px-4 rounded-full bg-sky-50 border border-sky-200 text-[#0F172A] font-bold text-xs"
              >
                <Briefcase className="w-4 h-4 text-[#2563EB]" />
                <span>Staff Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
