import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  ExternalLink,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Users,
  Sparkles,
  Phone,
  Mail,
  Tag,
  Eye,
  MousePointerClick,
  Layers,
  Award,
  Ticket,
  X,
  Edit,
  Check
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';
import { eventService } from '../../services/eventService';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Artificial Intelligence and Data Science',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Mechatronics Engineering'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', 'Final Year'];

export const EventDetailsPage = () => {
  const { id } = useParams();
  const { events, trackRegistrationClick, trackEventView, registerForEvent } = useData();
  const { isStaff } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [event, setEvent] = useState(() => {
    return events.find(e => e && (String(e.id) === String(id) || String(e.id) === `evt_${id}` || String(e.id) === `tp_evt_${id}` || String(e.id) === `ext_evt_${id}`)) || null;
  });
  const [isLoading, setIsLoading] = useState(!event);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationResult, setRegistrationResult] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    registerNumber: '',
    email: '',
    phone: '',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    college: 'Paavai Engineering College'
  });

  useEffect(() => {
    let isMounted = true;
    const found = events.find(e => e && (String(e.id) === String(id) || String(e.id) === `evt_${id}` || String(e.id) === `tp_evt_${id}` || String(e.id) === `ext_evt_${id}`));
    if (found) {
      setEvent(found);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      eventService.fetchEventById(id).then(res => {
        if (isMounted) {
          setEvent(res);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [id, events]);

  // Track view when opening event
  useEffect(() => {
    if (event?.id) {
      trackEventView(event.id);
    }
  }, [event?.id, trackEventView]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#C1E5FF] flex items-center justify-center mx-auto text-[#6AB0E3] animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm text-[#5B7B9C] font-semibold">Loading opportunity details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-3xl bg-white border border-[#C1E5FF] space-y-3 shadow-sky-card">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F2238] font-display">Opportunity Not Found</h2>
          <p className="text-xs text-[#5B7B9C] leading-relaxed">
            This opportunity listing may have expired or been removed by the organizers.
          </p>
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6AB0E3] text-white text-xs font-bold shadow-xs hover:bg-[#559FD4] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All Opportunities</span>
          </Link>
        </div>
      </div>
    );
  }

  const isClubEvent = event.type === 'club_event';
  const isFree = !event.registrationFee || Number(event.registrationFee) === 0;
  const isDeadlinePassed = Boolean(event.isPast || event.timeline === 'past' || eventService.isEventPast(event));

  // Related events - show only active upcoming opportunities
  const relatedEvents = events
    .filter(e => e.id !== event.id && (e.category === event.category || e.type === event.type) && e.status !== 'draft' && !eventService.isEventPast(e))
    .slice(0, 3);

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenRegistrationModal = () => {
    if (isDeadlinePassed) {
      return;
    }
    setRegistrationError(null);
    setRegistrationResult(null);
    setIsRegisterModalOpen(true);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (isDeadlinePassed) {
      setRegistrationError('Registration for this opportunity has closed.');
      return;
    }
    setRegistrationError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        eventId: event.id,
        studentName: formData.studentName.trim(),
        registerNumber: formData.registerNumber.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        department: formData.department,
        year: formData.year,
        college: formData.college.trim()
      };

      const result = await registerForEvent(payload);
      setRegistrationResult(result);
      trackRegistrationClick(event.id);
    } catch (err) {
      setRegistrationError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-2 text-[#5B7B9C] hover:text-[#0F2238] font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#6AB0E3]" />
          <span>Back to Opportunities</span>
        </Link>

        <div className="flex items-center gap-3">
          {isStaff && (
            <Link
              to={`/staff/events/${event.id}/edit`}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#0F2238] border border-[#C1E5FF] transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Edit Opportunity</span>
            </Link>
          )}

          <button
            onClick={handleShareClick}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#1E3A5F] border border-[#C1E5FF] transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#6AB0E3]" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Prominent Past Opportunity / Registration Closed Banner */}
      {isDeadlinePassed && (
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex items-start sm:items-center gap-3.5 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 font-display">
                Past Opportunity — Registration Closed
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                Archived
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The registration deadline for this opportunity was <span className="font-semibold text-slate-800">{event.registrationDeadline || 'passed'}</span>. Direct registration is no longer accepted.
            </p>
          </div>
        </div>
      )}

      {/* Main Two-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Poster Display (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-3 shadow-sky-card overflow-hidden group">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EAF6FF]">
              <img
                src={event.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/60 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isClubEvent
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30'
                    : 'bg-[#9CD5FF] text-[#0F2238] font-black'
                }`}>
                  {isClubEvent ? '★ T&P Club Event' : '🌐 External Opportunity'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-[#C1E5FF] shadow-xs">
              <span className="text-[10px] text-[#5B7B9C] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-[#539FD8]" />
                <span>Page Views</span>
              </span>
              <p className="text-xl font-black text-[#0F2238] font-display mt-0.5">{event.viewsCount || 1}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#C1E5FF] shadow-xs">
              <span className="text-[10px] text-[#5B7B9C] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-emerald-600" />
                <span>Registered</span>
              </span>
              <p className="text-xl font-black text-[#0F2238] font-display mt-0.5">{event.registeredCount || 0}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Metadata & Registration Action (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-[#C1E5FF]">
                {event.category}
              </span>
              {isDeadlinePassed && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Past Opportunity
                </span>
              )}
              {event.status === 'draft' && (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider border border-amber-200">
                  Draft (Staff Only)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F2238] font-display tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-sm sm:text-base text-[#5B7B9C] leading-relaxed font-medium">
              {event.subtitle || event.description}
            </p>
          </div>

          {/* Essential Info Grid Card */}
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-8 space-y-6 shadow-sky-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#2563EB] border border-[#C1E5FF]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#5B7B9C] block text-[10px] font-bold uppercase tracking-wider">Date & Time</span>
                  <p className="font-bold text-[#0F2238] text-sm mt-0.5">{event.startDate} {event.endDate && event.endDate !== event.startDate ? `to ${event.endDate}` : ''}</p>
                  <p className="text-[#5B7B9C] font-medium">{event.startTime} - {event.endTime}</p>
                </div>
              </div>

              {/* Venue / Location */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#2563EB] border border-[#C1E5FF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#5B7B9C] block text-[10px] font-bold uppercase tracking-wider">Venue</span>
                  <p className="font-bold text-[#0F2238] text-sm mt-0.5">{event.venue}</p>
                  <p className="text-[#5B7B9C] font-medium">{event.city}</p>
                </div>
              </div>

              {/* Organizing Body */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#2563EB] border border-[#C1E5FF]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#5B7B9C] block text-[10px] font-bold uppercase tracking-wider">Organized By</span>
                  <p className="font-bold text-[#0F2238] text-sm mt-0.5">{event.institution}</p>
                  <p className="text-[#5B7B9C] font-medium">{event.department}</p>
                </div>
              </div>

              {/* Registration Fee */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-emerald-600 border border-[#C1E5FF]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[#5B7B9C] block text-[10px] font-bold uppercase tracking-wider">Registration Fee</span>
                  <p className={`font-black text-base mt-0.5 ${isFree ? 'text-emerald-600' : 'text-[#2563EB]'}`}>
                    {isFree ? 'FREE (No Fee)' : `₹${event.registrationFee} per head`}
                  </p>
                  <p className="text-[#5B7B9C] font-medium">
                    {isDeadlinePassed ? (
                      <span className="text-amber-700 font-bold">Registration Closed ({event.registrationDeadline})</span>
                    ) : (
                      `Deadline: ${event.registrationDeadline || 'Until seats fill'}`
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action / Registration CTA Buttons */}
            <div className="pt-4 border-t border-[#EAF6FF] space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleOpenRegistrationModal}
                  disabled={isDeadlinePassed}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-xs ${
                    isDeadlinePassed
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-300/80 shadow-none'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25 hover:scale-[1.01] cursor-pointer'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isDeadlinePassed ? 'Registration Closed' : 'Register for Event (Direct)'}</span>
                </button>

                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackRegistrationClick(event.id)}
                    className="py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-[#0F2238] bg-[#EAF6FF] hover:bg-[#D9EEFF] border border-[#C1E5FF] transition flex items-center justify-center gap-1.5"
                  >
                    <span>External Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
                  </a>
                )}
              </div>

              {isStaff && (
                <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#5B7B9C]">Staff Management:</span>
                  <Link
                    to={`/staff/events/${event.id}/registrations`}
                    className="text-[#2563EB] hover:underline font-bold flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Registered Students ({event.registeredCount || 0})</span>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#5B7B9C] px-1 font-semibold">
                <span>No student account required • Open to all eligible candidates</span>
                <span className="text-[#2563EB] font-bold font-mono">Verified Opportunity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-[#C1E5FF]">
        {/* Left Column: Full Description & Topics (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Section */}
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-8 space-y-4 shadow-sky-card">
            <h3 className="text-lg font-bold text-[#0F2238] font-display">
              About this Opportunity
            </h3>
            <p className="text-[#5B7B9C] text-sm leading-relaxed whitespace-pre-line font-medium">
              {event.fullDescription || event.description}
            </p>
          </div>

          {/* Topics / Activity Rounds */}
          {event.topics && event.topics.length > 0 && (
            <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-8 space-y-4 shadow-sky-card">
              <h3 className="text-lg font-bold text-[#0F2238] font-display">
                Key Topics & Event Tracks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.topics.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] flex items-start gap-2.5 text-xs text-[#0F2238] font-semibold">
                    <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px] shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility & Guidelines */}
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-8 space-y-4 shadow-sky-card">
            <h3 className="text-lg font-bold text-[#0F2238] font-display">
              Eligibility & Guidelines
            </h3>
            <p className="text-[#5B7B9C] text-sm leading-relaxed font-medium">
              {event.eligibility || "Open to all interested students across engineering, science, and management departments."}
            </p>
          </div>
        </div>

        {/* Right Column: Coordinator & Related Events (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coordinator Card */}
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 space-y-4 shadow-sky-card">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#EAF6FF] text-[#2563EB]">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[#0F2238] font-display">Event Coordinator</h4>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-[#0F2238] text-sm">{event.coordinator?.name || "T&P Club Faculty Convener"}</p>
              {event.coordinator?.email && (
                <p className="text-[#5B7B9C] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{event.coordinator.email}</span>
                </p>
              )}
              {event.coordinator?.phone && (
                <p className="text-[#5B7B9C] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{event.coordinator.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Related Opportunities */}
          {relatedEvents.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#0F2238] font-display px-1">
                More Opportunities
              </h4>
              <div className="space-y-4">
                {relatedEvents.map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          PUBLIC REGISTRATION MODAL
          Allows students to register directly without user accounts
          ========================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-sky-200 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-wider">
                  Public Student Registration
                </span>
                <h3 className="text-xl font-black text-[#0F2238] font-display mt-0.5">
                  Register for {event.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-sky-50 text-[#5B7B9C] hover:text-[#0F2238] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {registrationError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Registration Alert</p>
                  <p className="leading-relaxed">{registrationError}</p>
                </div>
              </div>
            )}

            {/* Confirmation Screen */}
            {registrationResult ? (
              <div className="space-y-6 text-center py-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-[#0F2238] font-display">
                    Registration Confirmed! 🎉
                  </h4>
                  <p className="text-xs text-[#5B7B9C] max-w-sm mx-auto">
                    Your seat has been reserved. Please take note of your registration ID for future reference.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                    <span className="text-[#5B7B9C] font-semibold">Registration ID:</span>
                    <span className="font-mono font-black text-sm text-[#2563EB]">{registrationResult.registrationNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B7B9C]">Student Name:</span>
                    <span className="font-bold text-[#0F2238]">{registrationResult.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B7B9C]">Register Number:</span>
                    <span className="font-mono font-bold text-[#0F2238]">{registrationResult.registerNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B7B9C]">Department:</span>
                    <span className="font-bold text-[#0F2238]">{registrationResult.department || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B7B9C]">Event Date & Venue:</span>
                    <span className="font-bold text-[#0F2238]">{event.startDate} • {event.venue}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-emerald-600 font-bold">
                    <span>Status:</span>
                    <span>CONFIRMED ✓</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Public Registration Form */
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#0F2238] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Vignesh B"
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-semibold text-[#0F2238]"
                  />
                </div>

                {/* Register Number & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      Register Number / Roll No <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.registerNumber}
                      onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. 23CSE001"
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-mono font-bold text-[#0F2238]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      College Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@college.edu"
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-semibold text-[#0F2238]"
                    />
                  </div>
                </div>

                {/* Department & Year Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-medium text-[#0F2238] bg-white"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      Year of Study <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-medium text-[#0F2238] bg-white"
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone Number & College Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-semibold text-[#0F2238]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F2238] mb-1">
                      College Name
                    </label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="Paavai Engineering College"
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-200 focus:border-[#2563EB] focus:outline-none text-xs sm:text-sm font-semibold text-[#0F2238]"
                    />
                  </div>
                </div>

                {/* Fee Summary */}
                <div className="p-3.5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0F2238] block">Registration Fee</span>
                    <span className="text-[#5B7B9C]">Includes participation entry</span>
                  </div>
                  <span className={`text-base font-black ${isFree ? 'text-emerald-600' : 'text-[#2563EB]'}`}>
                    {isFree ? 'FREE' : `₹${event.registrationFee}`}
                  </span>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl border border-sky-200 text-[#5B7B9C] hover:text-[#0F2238] text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Confirming...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetailsPage;
