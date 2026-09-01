import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CalendarPlus,
  Edit,
  Trash2,
  Ticket,
  CheckCircle2,
  Eye,
  Building2,
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
  X,
  Save,
  UserCheck,
  Tag,
  Clock,
  Layers,
  ArrowUpRight,
  Upload
} from 'lucide-react';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SearchBar } from '../../components/common/SearchBar';

export const StaffEventsPage = () => {
  const { events, deleteEvent, updateEvent } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('my_events');
  const [query, setQuery] = useState('');
  const [deleteEventId, setDeleteEventId] = useState(null);

  // Quick Edit Modal State
  const [quickEditEvent, setQuickEditEvent] = useState(null);
  const [quickFormData, setQuickFormData] = useState({
    title: '',
    category: 'Career',
    startDate: '',
    venue: '',
    capacity: 100,
    registrationFee: 0,
    poster: '',
    registrationUrl: ''
  });
  const [isSavingQuick, setIsSavingQuick] = useState(false);

  // Filter events posted by staff or department
  const myEvents = events.filter(e => 
    e.organizer?.staffId === user?.id || 
    e.organizer?.staffId === "staff_001" || 
    e.coordinator?.name?.includes(user?.name?.split(' ')[0] || "Ramanathan") ||
    e.organizer?.institution?.includes(user?.department || "CSE") ||
    e.institution === "Training & Placement Club"
  );
  
  const publishedEvents = events.filter(e => e.status === 'published');
  const draftEvents = events.filter(e => e.status === 'draft');

  const totalMyRegistrations = myEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  const tabs = [
    { id: 'my_events', label: '★ My Posted Events', count: myEvents.length },
    { id: 'all', label: 'All Campus Events', count: events.length },
    { id: 'published', label: 'Published Drives', count: publishedEvents.length },
    { id: 'draft', label: 'Drafts', count: draftEvents.length },
  ];

  let currentList = activeTab === 'published'
    ? publishedEvents
    : activeTab === 'draft'
    ? draftEvents
    : activeTab === 'my_events'
    ? myEvents
    : events;

  if (query.trim()) {
    const q = query.toLowerCase();
    currentList = currentList.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      (e.institution && e.institution.toLowerCase().includes(q)) ||
      (e.city && e.city.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q))
    );
  }

  const handleDeleteConfirm = () => {
    if (deleteEventId) {
      deleteEvent(deleteEventId);
      setDeleteEventId(null);
    }
  };

  const handleOpenQuickEdit = (ev) => {
    setQuickEditEvent(ev);
    setQuickFormData({
      title: ev.title || '',
      category: ev.category || 'Career',
      startDate: ev.startDate || '',
      venue: ev.venue || '',
      capacity: ev.capacity || 100,
      registrationFee: ev.registrationFee || 0,
      poster: ev.poster || '',
      registrationUrl: ev.registrationUrl || ''
    });
  };

  const handleQuickEditSubmit = (e) => {
    e.preventDefault();
    if (!quickEditEvent) return;
    setIsSavingQuick(true);

    setTimeout(() => {
      updateEvent(quickEditEvent.id, {
        ...quickFormData,
        capacity: Number(quickFormData.capacity) || 100,
        registrationFee: Number(quickFormData.registrationFee) || 0
      });
      setIsSavingQuick(false);
      setQuickEditEvent(null);
    }, 350);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Claymorphic Staff Welcome & Stats Header */}
      <div className="clay-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6FF] text-[#6AB0E3] text-xs font-bold uppercase tracking-wider border border-[#C1E5FF]">
              <UserCheck className="w-3.5 h-3.5 text-[#6AB0E3]" />
              <span>Staff Event Control Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display tracking-tight">
              Welcome Back, {user?.name || 'Dr. K. Ramanathan'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#5B7B9C] font-medium leading-relaxed max-w-2xl">
              Manage all opportunities posted by you, make quick schedule adjustments, review registered students, and track event engagement metrics.
            </p>
          </div>

          <Link to="/staff/events/create">
            <button className="clay-btn-primary px-5 py-3 font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform cursor-pointer">
              <CalendarPlus className="w-4 h-4" />
              <span>Post New Event</span>
            </button>
          </Link>
        </div>

        {/* Quick Claymorphic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div className="clay-inset p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5B7B9C] uppercase tracking-wider">Posted By Me</span>
              <Layers className="w-4 h-4 text-[#6AB0E3]" />
            </div>
            <p className="text-2xl font-black text-[#0F2238] font-display">{myEvents.length}</p>
            <p className="text-[10px] text-[#539FD8] font-semibold">Active Opportunities</p>
          </div>

          <div className="clay-inset p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5B7B9C] uppercase tracking-wider">Total Registrations</span>
              <Ticket className="w-4 h-4 text-[#6AB0E3]" />
            </div>
            <p className="text-2xl font-black text-[#0F2238] font-display">{totalMyRegistrations}</p>
            <p className="text-[10px] text-[#539FD8] font-semibold">Student Signups</p>
          </div>

          <div className="clay-inset p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5B7B9C] uppercase tracking-wider">Published Drives</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-[#0F2238] font-display">{publishedEvents.length}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">Live in Discovery</p>
          </div>

          <div className="clay-inset p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5B7B9C] uppercase tracking-wider">Draft Schedules</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-[#0F2238] font-display">{draftEvents.length}</p>
            <p className="text-[10px] text-amber-600 font-semibold">In Preparation</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="clay-card p-3.5">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Filter posted events by title, domain (e.g. Symposium, DSA, Workshop), or venue..."
          />
        </div>
      </div>

      {/* Events List */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No posted events found"
          description={query ? "No events match your search parameters." : "You haven't posted any events in this view yet."}
          actionLabel="Post New Event Now"
          onAction={() => window.location.href = '/staff/events/create'}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map((ev) => (
            <div
              key={ev.id}
              className="clay-card p-5 hover:border-[#6AB0E3] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
            >
              {/* Event Info Left */}
              <div className="flex items-start gap-4">
                <img
                  src={ev.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"}
                  alt={ev.title}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#C1E5FF] shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F2238] font-display">{ev.title}</h3>
                    <span className="clay-badge text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ev.status === 'published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ev.status || 'published'}
                    </span>
                  </div>

                  <p className="text-xs text-[#5B7B9C] line-clamp-1 font-medium">
                    {ev.subtitle || ev.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5B7B9C] pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#6AB0E3]" />
                      <span>{ev.venue || 'Main Seminar Hall'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6AB0E3]" />
                      <span>{ev.startDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#0F2238]">
                      <Users className="w-3.5 h-3.5 text-[#6AB0E3]" />
                      <span>{ev.registeredCount || 0} / {ev.capacity || 100} Registered</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Right */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EAF6FF]">
                {/* Preview Link */}
                <Link
                  to={`/events/${ev.id}`}
                  className="clay-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="View Event Details Page"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6AB0E3]" />
                  <span>Preview</span>
                </Link>

                {/* Quick Edit Clay Modal Button */}
                <button
                  onClick={() => handleOpenQuickEdit(ev)}
                  className="clay-btn-primary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quick Edit</span>
                </button>

                {/* Full Edit Page Button */}
                <Link to={`/staff/events/${ev.id}/edit`}>
                  <button className="clay-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <Edit className="w-3.5 h-3.5 text-[#5B7B9C]" />
                    <span>Full Edit</span>
                  </button>
                </Link>

                {/* Registrations */}
                <Link to={`/staff/events/${ev.id}/registrations`}>
                  <button className="px-3.5 py-2 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] font-bold text-xs transition border border-[#C1E5FF] flex items-center gap-1.5 cursor-pointer">
                    <Ticket className="w-3.5 h-3.5 text-[#6AB0E3]" />
                    <span>Registrations ({ev.registeredCount || 0})</span>
                  </button>
                </Link>

                {/* Delete */}
                <button
                  onClick={() => setDeleteEventId(ev.id)}
                  className="p-2 rounded-xl text-[#5B7B9C] hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CLAYMORPHIC QUICK EDIT MODAL */}
      {quickEditEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2238]/50 backdrop-blur-xs animate-fade-in">
          <div className="clay-card max-w-xl w-full p-6 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EAF6FF] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EAF6FF] text-[#6AB0E3]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F2238]">Quick Edit Posted Event</h2>
                  <p className="text-[11px] text-[#5B7B9C]">Instant live updates to schedule and links</p>
                </div>
              </div>
              <button
                onClick={() => setQuickEditEvent(null)}
                className="p-1.5 rounded-xl text-[#5B7B9C] hover:bg-[#EAF6FF] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Edit Form */}
            <form onSubmit={handleQuickEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={quickFormData.title}
                  onChange={(e) => setQuickFormData({ ...quickFormData, title: e.target.value })}
                  className="clay-input w-full px-3.5 py-2.5 text-[#0F2238] text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Category / Domain *</label>
                  <select
                    value={quickFormData.category}
                    onChange={(e) => setQuickFormData({ ...quickFormData, category: e.target.value })}
                    className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs font-bold focus:outline-none"
                  >
                    <option value="Career">Career & Placement</option>
                    <option value="Placement">Mock Interview / Drive</option>
                    <option value="Aptitude">Aptitude & Reasoning</option>
                    <option value="Technical">Coding & DSA</option>
                    <option value="Workshop">Technical Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Inter-College Symposium</option>
                    <option value="Soft Skills">Soft Skills & GD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={quickFormData.startDate}
                    onChange={(e) => setQuickFormData({ ...quickFormData, startDate: e.target.value })}
                    className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={quickFormData.venue}
                    onChange={(e) => setQuickFormData({ ...quickFormData, venue: e.target.value })}
                    className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Student Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quickFormData.capacity}
                    onChange={(e) => setQuickFormData({ ...quickFormData, capacity: e.target.value })}
                    className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Registration Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={quickFormData.registrationFee}
                    onChange={(e) => setQuickFormData({ ...quickFormData, registrationFee: e.target.value })}
                    className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#0F2238] font-bold mb-1">Poster Image File / URL</label>
                  <div className="space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setQuickFormData(prev => ({ ...prev, poster: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="clay-input w-full px-2 py-1.5 text-[#0F2238] text-xs file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#6AB0E3] file:text-white cursor-pointer"
                    />
                    <input
                      type="url"
                      value={quickFormData.poster}
                      onChange={(e) => setQuickFormData({ ...quickFormData, poster: e.target.value })}
                      placeholder="Or paste image URL..."
                      className="clay-input w-full px-3 py-2 text-[#0F2238] text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1">Registration Form Link (URL)</label>
                <input
                  type="url"
                  value={quickFormData.registrationUrl}
                  onChange={(e) => setQuickFormData({ ...quickFormData, registrationUrl: e.target.value })}
                  placeholder="https://forms.google.com/..."
                  className="clay-input w-full px-3 py-2.5 text-[#0F2238] text-xs focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAF6FF]">
                <button
                  type="button"
                  onClick={() => setQuickEditEvent(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#EAF6FF] text-[#0F2238] font-bold text-xs hover:bg-[#C1E5FF] transition border border-[#C1E5FF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuick}
                  className="clay-btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingQuick ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to remove this event? This action will remove it from student discovery and active registration listings."
        confirmLabel="Delete Event"
        variant="danger"
      />
    </div>
  );
};
