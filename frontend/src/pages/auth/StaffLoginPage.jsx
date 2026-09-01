import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { mockStaffList } from '../../data/users';

export const StaffLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('staff@college.edu');
  const [password, setPassword] = useState('staff123');
  const [isLoading, setIsLoading] = useState(false);

  const handleStaffLogin = (staffEmail, staffPassword) => {
    setIsLoading(true);
    setTimeout(() => {
      login(staffEmail, staffPassword || 'staff123');
      setIsLoading(false);
      navigate('/staff/events');
    }, 450);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleStaffLogin(email, password);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-xl w-full space-y-8 animate-scale-in">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white clay-card group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-[#0F2238] font-display tracking-tight block">
                T&P <span className="text-[#6AB0E3]">STAFF PORTAL</span>
              </span>
              <p className="text-[11px] text-[#5B7B9C] font-bold tracking-wider uppercase -mt-0.5">
                Faculty & Event Management Console
              </p>
            </div>
          </Link>

          <div className="clay-inset p-4 max-w-md mx-auto text-left flex items-start gap-3 mt-4">
            <div className="p-2 rounded-xl bg-white text-[#6AB0E3] shadow-xs flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0F2238]">Official Faculty Access</h3>
              <p className="text-[11px] text-[#5B7B9C] leading-relaxed mt-0.5 font-medium">
                Welcome back! Use this portal to create new opportunities, manage student turnout, and quickly edit your posted events in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Quick Faculty Login Presets */}
        <div className="clay-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6AB0E3] text-xs font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4 text-[#6AB0E3]" />
              <span>1-Click Faculty & Staff Login</span>
            </div>
            <span className="text-[10px] bg-[#EAF6FF] text-[#6AB0E3] px-2.5 py-1 rounded-full font-bold border border-[#C1E5FF]">
              Staff Dedicated
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mockStaffList.map((staff) => (
              <button
                key={staff.id}
                onClick={() => handleStaffLogin(staff.email, 'staff123')}
                className="clay-card-interactive p-4 text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EAF6FF] to-[#C1E5FF] text-[#0F2238] flex items-center justify-center font-bold text-xs border border-[#C1E5FF] flex-shrink-0 shadow-xs">
                    {staff.name.split(' ')[1]?.[0] || 'P'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#0F2238] truncate">{staff.name}</p>
                      <span className="text-[9px] bg-[#EAF6FF] text-[#5B7B9C] px-2 py-0.5 rounded-full font-bold border border-[#C1E5FF]">
                        {staff.activeEventsCount} Events
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5B7B9C] font-medium truncate">
                      {staff.designation} • {staff.department}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5B7B9C] group-hover:text-[#6AB0E3] group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Standard Email & Password Form */}
        <div className="clay-card p-6 space-y-5">
          <div className="border-b border-[#EAF6FF] pb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0F2238] uppercase tracking-wider font-mono">
              Sign In with Staff Credentials
            </h3>
            <span className="text-[10px] text-[#5B7B9C]">Paavai Staff Account</span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">Staff Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5B7B9C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@college.edu"
                  className="clay-input w-full pl-10 pr-4 py-3 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#5B7B9C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="clay-input w-full pl-10 pr-4 py-3 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="clay-btn-primary w-full py-3.5 px-4 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating Staff...' : 'Sign In to Event Console'}</span>
            </button>
          </form>

          {/* Alternative Navigation */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#EAF6FF]">
            <Link to="/login" className="text-[#5B7B9C] hover:text-[#6AB0E3] font-bold transition">
              ← Student Discovery Login
            </Link>
            <Link to="/" className="text-[#6AB0E3] hover:underline font-bold transition">
              Explore Opportunities →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
