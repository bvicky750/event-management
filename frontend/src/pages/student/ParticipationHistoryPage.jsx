import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  FileCheck2,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

export const ParticipationHistoryPage = () => {
  const { registrations, odRequests } = useData();
  const { user } = useAuth();

  // Combine student registrations and past participations into an extracurricular record
  const myRegistrations = registrations.filter(r => r.studentId === user?.id);

  const pastParticipations = [
    {
      id: "part_01",
      eventTitle: "KAIZEN '25 — National CAD Fest",
      organizerCollege: "Kongu Engineering College",
      date: "14 Feb 2025",
      odStatus: "Approved",
      registrationStatus: "Registered",
      attendanceStatus: "Attended",
      achievement: "Participant"
    },
    {
      id: "part_02",
      eventTitle: "INNOVENTURE '25 Prototype Expo",
      organizerCollege: "PSG College of Technology",
      date: "05 Nov 2024",
      odStatus: "Approved",
      registrationStatus: "Registered",
      attendanceStatus: "Attended",
      achievement: "2nd Runner Up (₹10,000 Prize)"
    }
  ];

  // Convert current registrations to record items
  const currentRecords = myRegistrations.map(r => {
    const matchingOD = odRequests.find(od => String(od.eventId) === String(r.eventId));
    return {
      id: r.id,
      eventTitle: r.eventTitle,
      organizerCollege: r.college,
      date: r.eventDates,
      odStatus: matchingOD ? matchingOD.status : "Approved",
      registrationStatus: r.status === 'CONFIRMED' ? "Registered" : r.status,
      attendanceStatus: r.attendanceStatus === 'PRESENT' ? "Attended" : "Registered (Upcoming)",
      achievement: r.attendanceStatus === 'PRESENT' ? "Verified Participant" : "Upcoming"
    };
  });

  const allRecords = [...currentRecords, ...pastParticipations];

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { header: "Event Title & College" },
    { header: "Date" },
    { header: "OD Status" },
    { header: "Registration" },
    { header: "Attendance Status" },
    { header: "Outcome / Award" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Extracurricular Participation History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official institutional transcript of technical symposiums, hackathons, and certified events.
          </p>
        </div>

        <Button variant="outline" size="sm" leftIcon={Printer} onClick={handlePrint} className="print:hidden">
          Print Transcript
        </Button>
      </div>

      {/* Student Academic Identity Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user?.name || "Vignesh B"}</h2>
              <span className="bg-brand-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                {user?.registerNumber || "23CSE001"}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {user?.department || "Computer Science and Engineering"} • {user?.year || "2nd Year"}
            </p>
            <p className="text-[11px] text-slate-400">Institutional ID: PEC/2023/CSE/001</p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs">
          <div>
            <p className="text-slate-400">Total Events</p>
            <p className="text-xl font-bold text-white mt-0.5">{allRecords.length}</p>
          </div>
          <div>
            <p className="text-slate-400">Verified ODs</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{allRecords.filter(r => r.odStatus.toLowerCase().includes('approved')).length}</p>
          </div>
          <div>
            <p className="text-slate-400">Awards Won</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">1</p>
          </div>
        </div>
      </div>

      {/* Participation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Participation & OD Log ({allRecords.length} entries)
          </span>
          <span className="text-xs text-slate-400">Accredited Academic Record</span>
        </div>

        <Table
          columns={columns}
          data={allRecords}
          renderRow={(item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/70 transition-colors text-xs">
              <td className="px-4 py-3.5">
                <p className="font-bold text-slate-900">{item.eventTitle}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 inline" />
                  <span>{item.organizerCollege}</span>
                </p>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                {item.date}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge
                  variant={
                    item.odStatus.toLowerCase().includes('approved')
                      ? 'od-approved'
                      : item.odStatus.toLowerCase().includes('pending')
                      ? 'od-pending'
                      : 'od-rejected'
                  }
                  size="sm"
                >
                  {item.odStatus}
                </Badge>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant="registered" size="sm">
                  {item.registrationStatus}
                </Badge>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge
                  variant={item.attendanceStatus === 'Attended' ? 'attended' : 'default'}
                  size="sm"
                  dot={item.attendanceStatus === 'Attended'}
                >
                  {item.attendanceStatus}
                </Badge>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className={`font-semibold ${item.achievement.includes('Prize') ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200' : 'text-slate-600'}`}>
                  {item.achievement}
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};
