import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, RotateCcw, Sparkles } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { user, role, switchRole } = useAuth();
  const { resetAllData } = useData();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'student') navigate('/');
    else navigate('/staff/dashboard');
  };

  return (
    <div className="bg-[#FFFFFF] text-[#1E3A5F] text-xs py-1.5 px-4 border-b border-[#C1E5FF] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6AB0E3] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6AB0E3]"></span>
        </span>
        <span className="text-[11px] font-bold text-[#5B7B9C] hidden sm:inline">Active Mode:</span>
        <div className="flex items-center gap-1.5 bg-[#EAF6FF] px-2.5 py-0.5 rounded-lg border border-[#C1E5FF]">
          {role === 'student' ? (
            <GraduationCap className="w-3.5 h-3.5 text-[#6AB0E3]" />
          ) : (
            <Briefcase className="w-3.5 h-3.5 text-[#3F88BF]" />
          )}
          <span className="font-bold text-[#0F2238] text-[11px] uppercase tracking-wider">
            {role === 'student' ? 'Student Discovery' : 'T&P Organizer Portal'}
          </span>
          <span className="text-[#5B7B9C] text-[10px]">({user?.name?.split(' ')[0] || 'User'})</span>
        </div>
      </div>

      {/* Switcher Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => handleRoleChange('student')}
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
            role === 'student'
              ? 'bg-[#6AB0E3] text-white shadow-xs'
              : 'bg-[#EAF6FF] text-[#1E3A5F] hover:bg-[#C1E5FF]'
          }`}
        >
          <GraduationCap className="w-3 h-3" />
          <span>Student View</span>
        </button>

        <button
          onClick={() => handleRoleChange('staff')}
          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
            role === 'staff'
              ? 'bg-[#0F2238] text-white shadow-xs'
              : 'bg-[#EAF6FF] text-[#1E3A5F] hover:bg-[#C1E5FF]'
          }`}
        >
          <Briefcase className="w-3 h-3" />
          <span>Organizer View</span>
        </button>

        <button
          onClick={resetAllData}
          title="Reset demo data back to clean initial state"
          className="ml-1 px-2 py-0.5 bg-[#EAF6FF] hover:bg-rose-50 hover:text-rose-600 text-[#5B7B9C] rounded-md transition flex items-center gap-1 text-[10px] border border-[#C1E5FF]"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
