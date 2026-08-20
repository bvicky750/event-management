import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Ticket,
  Download,
  Search,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';

export const EventRegistrationsPage = () => {
  const { id } = useParams();
  const { events, registrations } = useData();
  const navigate = useNavigate();

  const event = events.find(e => String(e.id) === String(id) || String(e.id) === `evt_${id}`) || events[0];

  const eventRegs = registrations.filter(
    r => (String(r.eventId) === String(event?.id) || String(r.eventId) === `evt_${event?.id}`) && r.status !== 'CANCELLED'
  );

  const [query, setQuery] = useState('');

  const filtered = eventRegs.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.registerNumber.toLowerCase().includes(q) ||
      r.registrationNumber.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Registration Number", "Student Name", "Register Number", "Department", "Activities", "Registration Date", "Amount Paid", "Attendance Status"];
    const rows = eventRegs.map(r => [
      `"${r.registrationNumber}"`,
      `"${r.studentName}"`,
      `"${r.registerNumber}"`,
      `"${r.department}"`,
      `"${r.activities?.join('; ') || ''}"`,
      `"${r.registrationDate}"`,
      `"₹${r.amountPaid}"`,
      `"${r.attendanceStatus || 'NOT_CHECKED_IN'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_Registrations.csv`);
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
    { header: "Department" },
    { header: "Selected Activities" },
    { header: "Payment Status" },
    { header: "Attendance" }
  ];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/staff/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Management</span>
      </Link>

      {/* Event Header & Capacity Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Event Registration Roster
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {event.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {event.startDate} • {event.venue}, {event.city}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>

        {/* Capacity Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700">Capacity Utilization</span>
            <span className="text-slate-900 font-bold">{registeredCount} of {capacity} Seats Filled ({fillPercentage}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search attendee by name, register number, or pass ID..."
        />
      </div>

      {/* Registrations Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No registrations found"
          description="No registered students matching your search criteria."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            data={filtered}
            renderRow={(r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition text-xs">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-bold text-brand-600 font-mono">{r.registrationNumber}</span>
                  <span className="text-slate-400 block text-[11px] mt-0.5">{r.registrationDate}</span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                  {r.studentName}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-600 font-semibold">
                  {r.registerNumber}
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {r.department}
                </td>
                <td className="px-4 py-3.5 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {r.activities?.map((act, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                        {act}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-emerald-600">
                  {r.amountPaid === 0 ? 'FREE' : `₹${r.amountPaid}`} ({r.paymentStatus || 'PAID'})
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge
                    variant={r.attendanceStatus === 'PRESENT' ? 'attended' : 'default'}
                    size="sm"
                    dot={r.attendanceStatus === 'PRESENT'}
                  >
                    {r.attendanceStatus === 'PRESENT' ? 'Present' : 'Not Checked In'}
                  </Badge>
                </td>
              </tr>
            )}
          />
        </div>
      )}
    </div>
  );
};
