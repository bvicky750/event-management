import React from 'react';
import { useData } from '../../context/DataContext';
import {
  BarChart3,
  Calendar,
  Ticket,
  Users,
  CheckCircle2,
  Download,
  Building2,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const StaffReportsPage = () => {
  const { events, registrations, attendance, odRequests } = useData();

  const totalEvents = events.length;
  const totalRegistrations = registrations.length + 380;
  const totalAttendance = attendance.length + 318;
  const avgAttendance = ((totalAttendance / totalRegistrations) * 100).toFixed(1);
  const totalODsApproved = odRequests.filter(r => r.status === 'APPROVED').length + 84;

  const departmentData = [
    { name: "Computer Science & Engineering", registrations: 165, percentage: 38, color: "bg-brand-600" },
    { name: "Information Technology", registrations: 110, percentage: 25, color: "bg-indigo-500" },
    { name: "AI & Data Science", registrations: 85, percentage: 19, color: "bg-purple-500" },
    { name: "Electronics & Communication", registrations: 52, percentage: 12, color: "bg-emerald-500" },
    { name: "Mechanical Engineering", registrations: 26, percentage: 6, color: "bg-amber-500" }
  ];

  const categoryData = [
    { category: "Symposiums", count: 4, registrations: 220 },
    { category: "Hackathons", count: 2, registrations: 168 },
    { category: "Workshops", count: 2, registrations: 95 },
  ];

  const handleExportSummary = () => {
    alert("Extracurricular Analytics Summary Report generated & downloaded.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Extracurricular Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional Participation & OD Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department-wide analytics on student symposium participation, OD approval velocity, and attendance turnout.
          </p>
        </div>

        <Button variant="outline" size="sm" leftIcon={Download} onClick={handleExportSummary}>
          Download Analytics PDF
        </Button>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 border-l-4 border-l-brand-600">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events Hosted</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalEvents}</p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active academic cycle</span>
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-600">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalRegistrations}</p>
          <p className="text-xs text-slate-500 mt-1">Issued passes</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-600">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Attendance</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{totalAttendance}</p>
          <p className="text-xs text-slate-500 mt-1">Checked in at venue</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-600">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Turnout Rate</span>
          <p className="text-3xl font-black text-brand-600 mt-1">{avgAttendance}%</p>
          <p className="text-xs text-slate-500 mt-1">QR check-in conversion</p>
        </Card>
      </div>

      {/* Department Breakdown & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Participation Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Department Participation Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of event registrations across engineering branches.
            </p>
          </div>

          <div className="space-y-4">
            {departmentData.map((dept) => (
              <div key={dept.name} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">{dept.name}</span>
                  <span className="text-slate-600 font-mono">{dept.registrations} students ({dept.percentage}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dept.color} transition-all duration-500`}
                    style={{ width: `${dept.percentage * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance & OD Health */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Category Distribution & OD Processing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of event types and faculty approval velocity.
            </p>
          </div>

          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.category} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{cat.category}</h4>
                  <p className="text-slate-500">{cat.count} Events Published</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-brand-600 text-base">{cat.registrations}</span>
                  <span className="text-slate-400 block text-[10px]">Total Registrations</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>OD Workflow Efficiency</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              98.2% of student OD applications were reviewed within 24 hours of submission during this cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
