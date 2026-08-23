import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Compass,
  PlusCircle,
  Eye,
  MousePointerClick,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Edit,
  Trash2,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const StaffDashboard = () => {
  const { user } = useAuth();
  const { events, deleteEvent } = useData();

  const clubEvents = events.filter(e => e.type === 'club_event');
  const externalEvents = events.filter(e => e.type === 'external_opportunity');
  
  const totalViews = events.reduce((acc, e) => acc + (e.viewsCount || 0), 0);
  const totalClicks = events.reduce((acc, e) => acc + (e.registrationClicks || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-white via-[#EAF6FF] to-white border border-[#C1E5FF] p-6 sm:p-8 shadow-sky-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6FF] border border-[#C1E5FF] text-xs font-bold text-[#6AB0E3] font-mono">
            <span>T&P Club Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display tracking-tight">
            Opportunity Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#5B7B9C] leading-relaxed font-medium">
            Publish on-campus placement sessions, curate external hackathons & symposiums, and monitor student registration click-throughs in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/staff/events/create"
            className="px-5 py-3 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/25 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
          <Link
            to="/#explore-section"
            className="px-5 py-3 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#0F2238] font-bold text-xs border border-[#C1E5FF] transition flex items-center gap-2 shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#6AB0E3]" />
            <span>Public Catalog</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Honest Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Opportunities */}
        <div className="rounded-2xl bg-white border border-[#C1E5FF] p-5 space-y-1 shadow-sky-subtle">
          <div className="flex items-center justify-between text-[#5B7B9C]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Listed</span>
            <Layers className="w-4 h-4 text-[#539FD8]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display">{events.length}</p>
          <p className="text-[11px] text-[#5B7B9C] font-medium">
            {clubEvents.length} Club • {externalEvents.length} External
          </p>
        </div>

        {/* Metric 2: Upcoming Active */}
        <div className="rounded-2xl bg-white border border-[#C1E5FF] p-5 space-y-1 shadow-sky-subtle">
          <div className="flex items-center justify-between text-[#5B7B9C]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Active Events</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-display">
            {events.filter(e => e.status === 'published').length}
          </p>
          <p className="text-[11px] text-[#5B7B9C] font-medium">Open for student registration</p>
        </div>

        {/* Metric 3: Total Page Views */}
        <div className="rounded-2xl bg-white border border-[#C1E5FF] p-5 space-y-1 shadow-sky-subtle">
          <div className="flex items-center justify-between text-[#5B7B9C]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Catalog Views</span>
            <Eye className="w-4 h-4 text-[#3F88BF]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display font-mono">
            {totalViews}
          </p>
          <p className="text-[11px] text-[#5B7B9C] font-medium">Total student detail views</p>
        </div>

        {/* Metric 4: Registration Link Clicks */}
        <div className="rounded-2xl bg-white border border-[#C1E5FF] p-5 space-y-1 border-l-4 border-l-[#6AB0E3] shadow-sky-subtle">
          <div className="flex items-center justify-between text-[#5B7B9C]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#6AB0E3]">
              Registration Clicks
            </span>
            <MousePointerClick className="w-4 h-4 text-[#6AB0E3]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#6AB0E3] font-display font-mono">
            {totalClicks}
          </p>
          <p className="text-[11px] text-[#5B7B9C] font-medium">External form click-throughs</p>
        </div>
      </div>

      {/* Opportunities Management Table */}
      <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-8 space-y-6 shadow-sky-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F2238] font-display">
              Managed Opportunities & Analytics
            </h3>
            <p className="text-xs text-[#5B7B9C] mt-0.5 font-medium">
              Review published workshops, view student traffic, edit links, or archive expired fests.
            </p>
          </div>

          <Link
            to="/staff/events/create"
            className="px-4 py-2 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Opportunity</span>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EAF6FF] text-[#5B7B9C] text-[10px] font-mono uppercase tracking-wider">
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4 text-center">Views</th>
                <th className="py-3 px-4 text-center text-[#6AB0E3]">Reg Clicks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAF6FF]">
              {events.map((ev) => {
                const isClub = ev.type === 'club_event';
                return (
                  <tr key={ev.id} className="hover:bg-[#EAF6FF]/60 transition">
                    {/* Event & Poster */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ev.poster}
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover bg-[#EAF6FF] border border-[#C1E5FF] flex-shrink-0"
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <p className="font-bold text-[#0F2238] text-xs truncate">{ev.title}</p>
                          <p className="text-[11px] text-[#5B7B9C] truncate font-medium">{ev.institution}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isClub
                          ? 'bg-[#EAF6FF] text-[#0F2238] border border-[#C1E5FF]'
                          : 'bg-[#C1E5FF] text-[#0F2238] border border-[#9CD5FF]'
                      }`}>
                        {isClub ? '★ T&P Club' : 'External'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#1E3A5F] font-semibold">
                      {ev.category}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#5B7B9C]">
                      {ev.startDate}
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#0F2238]">
                      {ev.viewsCount || 0}
                    </td>

                    {/* Registration Clicks */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-[#6AB0E3]">
                      {ev.registrationClicks || 0}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                        {ev.status || 'Published'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/events/${ev.id}`}
                          title="Preview Public Page"
                          className="p-1.5 rounded-lg bg-[#EAF6FF] text-[#1E3A5F] hover:text-[#0F2238] hover:bg-[#C1E5FF] transition border border-[#C1E5FF]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/staff/events/${ev.id}/edit`}
                          title="Edit Opportunity"
                          className="p-1.5 rounded-lg bg-[#EAF6FF] text-[#1E3A5F] hover:text-[#0F2238] hover:bg-[#C1E5FF] transition border border-[#C1E5FF]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${ev.title}"?`)) {
                              deleteEvent(ev.id);
                            }
                          }}
                          title="Delete Opportunity"
                          className="p-1.5 rounded-lg bg-[#EAF6FF] text-[#5B7B9C] hover:text-rose-600 hover:bg-rose-50 transition border border-[#C1E5FF]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
