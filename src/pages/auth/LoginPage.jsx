import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@college.edu');
  const [password, setPassword] = useState('student123');
  const [isLoading, setIsLoading] = useState(false);

  const handleDirectLogin = (userEmail, userPassword, targetRole) => {
    setIsLoading(true);
    setTimeout(() => {
      const loggedIn = login(userEmail, userPassword);
      setIsLoading(false);

      if (targetRole === 'student' || loggedIn.role === 'student') {
        navigate('/');
      } else {
        navigate('/staff/dashboard');
      }
    }, 400);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleDirectLogin(email, password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full space-y-8 animate-scale-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white shadow-md shadow-[#6AB0E3]/30">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black text-[#0F2238] font-display tracking-tight">
                T&P <span className="text-[#6AB0E3]">CLUB</span>
              </span>
              <p className="text-[10px] text-[#5B7B9C] font-bold tracking-wider uppercase -mt-1">
                Opportunity Hub
              </p>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-[#0F2238] font-display pt-2">Sign In to Your Account</h2>
          <p className="text-xs text-[#5B7B9C] font-medium">
            Select a quick 1-click role login or enter your college credentials.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="bg-white rounded-3xl p-6 shadow-sky-card border border-[#C1E5FF] space-y-4">
          <div className="flex items-center gap-1.5 text-[#6AB0E3] text-xs font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4" />
            <span>1-Click Fast Demo Logins</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Student Card */}
            <button
              onClick={() => handleDirectLogin('student@college.edu', 'student123', 'student')}
              className="p-4 rounded-2xl bg-[#EAF6FF] hover:bg-[#C1E5FF] border border-[#C1E5FF] text-left transition flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-[#6AB0E3] shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F2238]">Student Discovery View</p>
                  <p className="text-[11px] text-[#5B7B9C] font-medium">Vignesh B (Paavai CSE)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B7B9C] group-hover:text-[#6AB0E3] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Organizer Card */}
            <button
              onClick={() => handleDirectLogin('staff@college.edu', 'staff123', 'staff')}
              className="p-4 rounded-2xl bg-[#EAF6FF] hover:bg-[#C1E5FF] border border-[#C1E5FF] text-left transition flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-[#3F88BF] shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F2238]">T&P Organizer Portal</p>
                  <p className="text-[11px] text-[#5B7B9C] font-medium">Dr. K. Ramanathan (T&P Convenor)</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B7B9C] group-hover:text-[#6AB0E3] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Standard Form Fallback */}
        <div className="bg-white rounded-3xl p-6 border border-[#C1E5FF] shadow-sky-card space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#5B7B9C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/25"
            >
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-[#5B7B9C] hover:text-[#6AB0E3] font-bold transition">
              ← Return to Opportunity Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
