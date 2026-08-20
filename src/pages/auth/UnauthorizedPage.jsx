import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage = () => {
  const { user, role, switchRole } = useAuth();
  const location = useLocation();
  const allowedRoles = location.state?.allowedRoles || ['student', 'staff'];

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Access Restricted</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        You are currently logged in as <span className="font-bold text-slate-800 uppercase">{role}</span>.
        This portal section requires one of: {allowedRoles.map(r => r.toUpperCase()).join(', ')}.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {allowedRoles.includes('staff') && (
          <Button variant="primary" size="sm" onClick={() => switchRole('staff')} leftIcon={Briefcase}>
            Switch to Staff Demo
          </Button>
        )}
        {allowedRoles.includes('student') && (
          <Button variant="secondary" size="sm" onClick={() => switchRole('student')} leftIcon={GraduationCap}>
            Switch to Student Demo
          </Button>
        )}
        <Link to="/">
          <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
            Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};
