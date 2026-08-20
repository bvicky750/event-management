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
  SlidersHorizontal
} from 'lucide-react';
import { Tabs } from '../../components/common/Tabs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SearchBar } from '../../components/common/SearchBar';

export const StaffEventsPage = () => {
  const { events, deleteEvent } = useData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [deleteEventId, setDeleteEventId] = useState(null);

  // Filter events
  const myEvents = events.filter(e => e.organizer?.staffId === user?.id || e.organizer?.staffId === "staff_001" || e.organizer?.institution?.includes(user?.department || "CSE"));
  const publishedEvents = events.filter(e => e.status === 'published');
  const draftEvents = events.filter(e => e.status === 'draft');

  const tabs = [
    { id: 'all', label: 'All College Events', count: events.length },
    { id: 'my_events', label: 'My Department Events', count: myEvents.length },
    { id: 'published', label: 'Published', count: publishedEvents.length },
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
      e.organizer?.institution?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q)
    );
  }

  const handleDeleteConfirm = () => {
    if (deleteEventId) {
      deleteEvent(deleteEventId);
      setDeleteEventId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Coordination & Oversight</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Events Management & System Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage, audit turnout, review registrations, and track attendance for all department & college events.
          </p>
        </div>

        <Link to="/staff/events/create">
          <Button variant="primary" size="sm" leftIcon={CalendarPlus}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search events by title, category (e.g. Symposium, Hackathon), institution, or city..."
          />
        </div>
      </div>

      {/* Events Table / Cards */}
      {currentList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description={query ? "No events match your current search query." : "No events registered in this section."}
          actionLabel="Create New Event"
          onAction={() => window.location.href = '/staff/events/create'}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {currentList.map((ev) => (
            <div
              key={ev.id}
              className="p-5 hover:bg-slate-50/70 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Event Info */}
              <div className="flex items-start gap-4">
                <img
                  src={ev.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"}
                  alt={ev.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>
                    <Badge variant={ev.category === 'Symposium' ? 'primary' : 'purple'} size="sm">
                      {ev.category}
                    </Badge>
                    <Badge variant={ev.od?.available ? 'od-available' : 'default'} size="sm">
                      {ev.od?.available ? 'OD Available' : 'No OD'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {ev.organizer?.institution || "Paavai Engineering College"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {ev.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ev.city}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-brand-700">
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      {ev.registeredCount || 0} / {ev.capacity || 100} Registered
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <Link to={`/events/${ev.id}`}>
                  <Button variant="ghost" size="sm" leftIcon={Eye} title="Preview Public Page">
                    Preview
                  </Button>
                </Link>

                <Link to={`/staff/events/${ev.id}/edit`}>
                  <Button variant="outline" size="sm" leftIcon={Edit}>
                    Edit
                  </Button>
                </Link>

                <Link to={`/staff/events/${ev.id}/registrations`}>
                  <Button variant="secondary" size="sm" leftIcon={Ticket}>
                    Registrations ({ev.registeredCount || 0})
                  </Button>
                </Link>

                <Link to={`/staff/events/${ev.id}/attendance`}>
                  <Button variant="primary" size="sm" leftIcon={CheckCircle2}>
                    Attendance
                  </Button>
                </Link>

                <button
                  onClick={() => setDeleteEventId(ev.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to remove this event? This action will remove it from discovery, registrations, and attendance rosters."
        confirmLabel="Delete Event"
        variant="danger"
      />
    </div>
  );
};
