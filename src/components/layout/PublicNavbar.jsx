import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Briefcase,
  Layers,
  Info,
  Calendar,
  Globe
} from 'lucide-react';

export const PublicNavbar = () => {
  const { user, role } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Club Events', path: '/events?type=club_event' },
    { name: 'External Opportunities', path: '/events?type=external_opportunity' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 sky-nav-glass transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white shadow-md shadow-[#6AB0E3]/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#0F2238] font-display">
                  T&P <span className="text-[#6AB0E3]">CLUB</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#C1E5FF] text-[10px] font-mono text-[#0F2238] font-bold uppercase">
                  HUB
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B7B9C] block -mt-0.5">
                Training & Placement
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#EAF6FF] p-1.5 rounded-2xl border border-[#C1E5FF]">
            {navLinks.map((link) => {
              const currentPath = location.pathname + location.search;
              const isActive = currentPath === link.path || (link.path === '/' && location.pathname === '/' && !location.search);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#6AB0E3] text-white shadow-sm shadow-[#6AB0E3]/30'
                      : 'text-[#1E3A5F] hover:text-[#0F2238] hover:bg-[#C1E5FF]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/events"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1E3A5F] hover:text-[#0F2238] bg-white hover:bg-[#EAF6FF] border border-[#C1E5FF] transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6AB0E3]" />
            </Link>

            <Link
              to={role === 'staff' ? '/staff/dashboard' : '/login'}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6AB0E3] hover:bg-[#559FD4] transition shadow-md shadow-[#6AB0E3]/25 flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{role === 'staff' ? 'Organizer Portal' : 'Club Login'}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/events"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6AB0E3] text-white"
            >
              Explore
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1E3A5F] hover:bg-[#EAF6FF]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C1E5FF] bg-white/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#1E3A5F] hover:bg-[#EAF6FF] hover:text-[#6AB0E3]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#C1E5FF] space-y-2">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 px-4 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] font-bold text-xs border border-[#C1E5FF]"
            >
              Browse All Opportunities →
            </Link>
            <Link
              to={role === 'staff' ? '/staff/dashboard' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 px-4 rounded-xl bg-[#6AB0E3] text-white font-bold text-xs shadow-md shadow-[#6AB0E3]/25"
            >
              {role === 'staff' ? 'Go to Organizer Portal' : 'Organizer / Club Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
