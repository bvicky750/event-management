import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
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
  Award
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const { events, trackRegistrationClick, trackEventView } = useData();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const event = events.find(e => String(e.id) === String(id) || String(e.id) === `evt_${id}` || String(e.id) === `tp_evt_${id}` || String(e.id) === `ext_evt_${id}`);

  // Track view when opening event
  useEffect(() => {
    if (event?.id) {
      trackEventView(event.id);
    }
  }, [event?.id, trackEventView]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F2238] font-display">Opportunity Not Found</h2>
        <p className="text-[#5B7B9C] text-sm">The event you are looking for might have been moved or removed.</p>
        <Link to="/#explore-section" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6AB0E3] text-white text-xs font-bold shadow-md shadow-[#6AB0E3]/25">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunity Catalog</span>
        </Link>
      </div>
    );
  }

  const isClubEvent = event.type === 'club_event';
  const isFree = !event.registrationFee || event.registrationFee === 0;
  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date('2026-08-18');

  // Related events
  const relatedEvents = events
    .filter(e => e.id !== event.id && (e.category === event.category || e.type === event.type) && e.status !== 'draft')
    .slice(0, 3);

  const handleRegisterClick = () => {
    trackRegistrationClick(event.id);
    if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("Registration link will be opened shortly.");
    }
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Breadcrumbs & Share */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <Link
          to="/#explore-section"
          className="inline-flex items-center gap-2 text-[#5B7B9C] hover:text-[#0F2238] font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#6AB0E3]" />
          <span>Back to Opportunities</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareClick}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#1E3A5F] border border-[#C1E5FF] transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#6AB0E3]" />
            <span>{copied ? 'Link Copied!' : 'Share Opportunity'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Hero / Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Poster Display (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-3 shadow-sky-card overflow-hidden group">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EAF6FF]">
              <img
                src={event.poster}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/60 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isClubEvent
                    ? 'bg-[#6AB0E3] text-white shadow-md shadow-[#6AB0E3]/30'
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
              <p className="text-lg font-black text-[#0F2238] font-mono mt-0.5">
                {event.viewsCount || 1}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#C1E5FF] shadow-xs">
              <span className="text-[10px] text-[#5B7B9C] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <MousePointerClick className="w-3 h-3 text-[#6AB0E3]" />
                <span>Registration Clicks</span>
              </span>
              <p className="text-lg font-black text-[#6AB0E3] font-mono mt-0.5">
                {event.registrationClicks || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & Direct Action (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#0F2238] text-xs font-bold border border-[#C1E5FF]">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#5B7B9C] text-xs font-semibold border border-[#C1E5FF]">
                {event.city}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#0F2238] font-display leading-tight">
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
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#6AB0E3] border border-[#C1E5FF]">
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
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#539FD8] border border-[#C1E5FF]">
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
                <div className="p-2.5 rounded-xl bg-[#EAF6FF] text-[#3F88BF] border border-[#C1E5FF]">
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
                  <p className={`font-black text-base mt-0.5 ${isFree ? 'text-emerald-600' : 'text-[#2D6B9C]'}`}>
                    {isFree ? 'FREE (No Fee)' : `₹${event.registrationFee} per head`}
                  </p>
                  <p className="text-[#5B7B9C] font-medium">Deadline: {event.registrationDeadline}</p>
                </div>
              </div>
            </div>

            {/* Direct Action / Register CTA */}
            <div className="pt-4 border-t border-[#EAF6FF] space-y-3">
              <button
                type="button"
                onClick={handleRegisterClick}
                disabled={isDeadlinePassed}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-md ${
                  isDeadlinePassed
                    ? 'bg-[#EAF6FF] text-[#5B7B9C] cursor-not-allowed border border-[#C1E5FF]'
                    : 'bg-[#6AB0E3] hover:bg-[#559FD4] text-white shadow-[#6AB0E3]/25 hover:scale-[1.01]'
                }`}
              >
                <span>{isDeadlinePassed ? 'Registration Deadline Passed' : 'Register Now (Opens Official Link)'}</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#5B7B9C] px-1 font-semibold">
                <span>Direct redirection to Google Form / Official Portal</span>
                <span className="text-[#6AB0E3] font-bold font-mono">Verified Opportunity</span>
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
                    <span className="w-5 h-5 rounded-full bg-[#6AB0E3] text-white flex items-center justify-center font-mono font-bold flex-shrink-0 text-[10px] shadow-xs">
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
            <div className="p-4 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] text-xs text-[#1E3A5F] space-y-2">
              <p className="font-bold text-[#0F2238]">
                {event.eligibility || "Open to all engineering students"}
              </p>
              <p className="text-[#5B7B9C] font-medium leading-relaxed">
                • Please ensure you have your college ID card handy for registration verification.<br />
                • Registration receipts and confirmation emails are sent directly by the organizing body upon submission.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Coordinators & Help (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coordinator Contact Card */}
          <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 space-y-4 shadow-sky-card">
            <h4 className="font-bold text-[#0F2238] uppercase tracking-wider text-xs font-display">
              Coordinator & Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#5B7B9C]">Point of Contact</p>
                <p className="font-bold text-[#0F2238] text-sm">{event.coordinator?.name || "T&P Student Head"}</p>
                <p className="text-[#5B7B9C] text-[11px] font-medium">{event.department}</p>
              </div>

              {event.coordinator?.email && (
                <a
                  href={`mailto:${event.coordinator.email}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#1E3A5F] hover:text-[#0F2238] transition border border-[#C1E5FF] font-semibold"
                >
                  <Mail className="w-4 h-4 text-[#6AB0E3]" />
                  <span className="truncate">{event.coordinator.email}</span>
                </a>
              )}

              {event.coordinator?.phone && (
                <a
                  href={`tel:${event.coordinator.phone}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#1E3A5F] hover:text-[#0F2238] transition border border-[#C1E5FF] font-semibold"
                >
                  <Phone className="w-4 h-4 text-[#539FD8]" />
                  <span>{event.coordinator.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Registration Reminder Box */}
          <div className="rounded-3xl bg-gradient-to-br from-[#EAF6FF] to-white border border-[#C1E5FF] p-6 space-y-3 shadow-sky-subtle">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6AB0E3] font-mono">
              Ready to participate?
            </span>
            <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
              Clicking register will open the organizer's official registration form or portal in a new tab.
            </p>
            <button
              onClick={handleRegisterClick}
              disabled={isDeadlinePassed}
              className="w-full py-3 px-4 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/20 flex items-center justify-center gap-2"
            >
              <span>Go to Registration Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Opportunities Section */}
      {relatedEvents.length > 0 && (
        <div className="pt-12 border-t border-[#C1E5FF] space-y-6">
          <h3 className="text-2xl font-bold text-[#0F2238] font-display">
            Similar Opportunities You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} variant="standard" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
