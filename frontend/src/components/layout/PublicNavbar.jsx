import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Menu, X } from 'lucide-react';

export const PublicNavbar = () => {
  const { user, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const isHome = location.pathname === '/';

  const getHeaderClass = () => {
    if (isHome) {
      return isScrolled
        ? 'fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-blur-xl border-b border-white/30 shadow-xs transition-all duration-300'
        : 'absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10 transition-all duration-300';
    }
    return 'sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-sky-100/50 shadow-xs transition-all';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Club Events', path: '/?type=club_event#explore-section' },
    { name: 'External Opportunities', path: '/?type=external_opportunity#explore-section' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className={getHeaderClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {/* Paper Airplane icon matching reference image */}
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
              const isActive = currentPath === link.path || (link.path === '/' && location.pathname === '/' && !location.search);

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
 
          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/#explore-section"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition shadow-md shadow-blue-500/25 flex items-center gap-2 group"
            >
              <span>Explore Opportunities</span>
            </Link>
 
            {role === 'staff' && (
              <Link
                to="/staff/dashboard"
                className="px-4 py-2 rounded-full text-xs font-bold text-[#1E3A5F] bg-white/80 hover:bg-white border border-sky-200 transition shadow-xs"
              >
                Organizer Portal
              </Link>
            )}
          </div>
 
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/#explore-section"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#2563EB] text-white shadow-xs"
            >
              Explore
            </Link>
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
            const isActive = currentPath === link.path || (link.path === '/' && location.pathname === '/' && !location.search);
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
            <Link
              to="/#explore-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 px-4 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-blue-500/25"
            >
              Explore Opportunities →
            </Link>
            {role === 'staff' ? (
              <Link
                to="/staff/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 px-4 rounded-xl bg-white border border-sky-200 text-[#0F172A] font-bold text-xs"
              >
                Organizer Portal
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 px-4 rounded-xl bg-sky-50 border border-sky-100 text-[#334155] font-bold text-xs"
              >
                Organizer / Club Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
