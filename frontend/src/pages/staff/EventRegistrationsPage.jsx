import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { registrationService } from '../../services/registrationService';
import {
  Ticket,
  Download,
  Search,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';

export const EventRegistrationsPage = () => {
  const { id } = useParams();
  const { events } = useData();

  const [eventRegs, setEventRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const event = events.find(e => String(e.id) === String(id) || String(e.id) === `evt_${id}`) || {
    id,
    title: 'Opportunity Registrations',
    capacity: 150
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const list = await registrationService.fetchRegistrationsByEvent(id);
        if (isMounted) {
          setEventRegs(list);
        }
      } catch (e) {
        console.warn('Failed to load event registrations:', e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRegistrations();
    return () => { isMounted = false; };
  }, [id]);

  const filtered = eventRegs.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.studentName?.toLowerCase().includes(q) ||
      r.registerNumber?.toLowerCase().includes(q) ||
      r.registrationNumber?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Registration ID", "Student Name", "Register Number", "Department", "Year", "College", "Email", "Phone", "Registration Date", "Status"];
    const rows = eventRegs.map(r => [
      `"${r.registrationNumber}"`,
      `"${r.studentName}"`,
      `"${r.registerNumber}"`,
      `"${r.department || ''}"`,
      `"${r.year || ''}"`,
      `"${r.college || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.registrationDate}"`,
      `"${r.status || 'CONFIRMED'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${(event.title || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const capacity = event.capacity || 150;
  const registeredCount = eventRegs.length;
  const fillPercentage = Math.min(100, ((registeredCount / capacity) * 100)).toFixed(1);

  const columns = [
    { header: "Registration ID & Date" },
    { header: "Student Name" },
    { header: "Register No" },
    { header: "Department & Year" },
    { header: "Contact (Email / Phone)" },
    { header: "Status" }
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/staff/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B7B9C] hover:text-[#2563EB] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Management</span>
      </Link>

      {/* Event Header & Capacity Banner */}
      <div className="bg-white rounded-3xl border border-sky-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] font-mono">
              Staff Registration Roster
            </span>
            <h1 className="text-2xl font-black text-[#0F2238] font-display tracking-tight mt-1">
              {event.title}
            </h1>
            <p className="text-xs text-[#5B7B9C] mt-0.5">
              {event.startDate ? `${event.startDate} • ${event.venue || 'On-Campus'}, ${event.city || 'T&P'}` : 'Live Registered Candidates'}
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={eventRegs.length === 0}
            className="px-4 py-2.5 rounded-xl border border-sky-200 text-[#0F2238] bg-sky-50 hover:bg-sky-100 text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Capacity Bar */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#0F2238]">Event Capacity</span>
            <span className="text-[#0F2238] font-bold">{registeredCount} of {capacity} Seats Filled ({fillPercentage}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-sky-200 overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student name, register number, department, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-sky-200 p-12 text-center text-xs font-bold text-[#5B7B9C]">
          Loading registered candidates from MySQL...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No registrations found"
          description={query ? "No registered students matching your search criteria." : "No students have registered for this opportunity yet."}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={filtered}
            renderRow={(r) => (
              <tr key={r.id} className="hover:bg-sky-50/50 transition text-xs border-b border-sky-100 last:border-0">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-bold text-[#2563EB] font-mono">{r.registrationNumber}</span>
                  <span className="text-[#5B7B9C] block text-[11px] mt-0.5">{r.registrationDate}</span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-[#0F2238]">
                  {r.studentName}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-[#0F2238] font-bold">
                  {r.registerNumber}
                </td>
                <td className="px-4 py-3.5 text-[#0F2238]">
                  <p className="font-semibold">{r.department || 'General'}</p>
                  <span className="text-[11px] text-[#5B7B9C]">{r.year || 'Student'}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-[#5B7B9C]">
                  <p className="flex items-center gap-1 font-medium text-[#0F2238]">
                    <Mail className="w-3 h-3 text-[#2563EB]" />
                    <span>{r.email}</span>
                  </p>
                  {r.phone && (
                    <p className="flex items-center gap-1 text-[11px] text-[#5B7B9C] mt-0.5">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{r.phone}</span>
                    </p>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>CONFIRMED</span>
                  </span>
                </td>
              </tr>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default EventRegistrationsPage;
