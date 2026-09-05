import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Building2,
  ArrowRight,
  Sparkles,
  Clock,
  Tag
} from 'lucide-react';
import { eventService } from '../../services/eventService';

export const EventCard = ({ event, variant = 'horizontal' }) => {
  if (!event) return null;

  const isClubEvent = event.type === 'club_event';
  const isFree = !event.registrationFee || event.registrationFee === 0;
  const isPast = event.isPast !== undefined ? event.isPast : eventService.isEventPast(event);

  // Format date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Standard 3-column Grid Variant (for homepage grid)
  if (variant === 'standard' || variant === 'standard_grid') {
    return (
      <div className={`group rounded-3xl bg-white/90 backdrop-blur-md border-2 ${isPast ? 'border-slate-200/80' : 'border-sky-100 hover:border-[#2563EB]/60'} hover:bg-white transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sky-card hover:shadow-xl`}>
        <div>
          {/* Poster Frame */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF6FF]">
            <img
              src={event.poster}
              alt={event.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isPast ? 'grayscale-[25%] opacity-90' : ''}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/60 via-transparent to-transparent opacity-70" />

            {/* Badges on Image */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                isClubEvent
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#0284C7] text-white font-black'
              }`}>
                {isClubEvent ? '★ T&P Club' : 'External'}
              </span>

              {isPast && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                  Registration Closed
                </span>
              )}
            </div>

            {/* Fee & Date overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[#0F172A] font-mono text-[11px] border border-[#C1E5FF] font-bold shadow-xs">
                {formatDate(event.startDate)}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold backdrop-blur-md shadow-xs ${
                isFree ? 'bg-emerald-500 text-white' : 'bg-white/95 text-[#0F172A] border border-[#C1E5FF]'
              }`}>
                {isFree ? 'FREE' : `₹${event.registrationFee}`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#5B7B9C]">
              <span className="px-2 py-0.5 rounded bg-sky-50 text-[#2563EB] font-bold border border-sky-200/80">
                {event.category}
              </span>
              <span className="flex items-center gap-1 truncate text-[#5B7B9C] font-semibold">
                <MapPin className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                {event.city}
              </span>
            </div>

            <h3 className="font-bold text-base text-[#0F2238] group-hover:text-[#2563EB] transition-colors line-clamp-1 font-display">
              {event.title}
            </h3>

            <p className="text-xs text-[#5B7B9C] line-clamp-2 leading-relaxed font-medium">
              {event.subtitle || event.description}
            </p>

            <p className="text-[11px] text-[#5B7B9C] truncate flex items-center gap-1.5 pt-1 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
              <span className="truncate">{event.institution}</span>
            </p>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="p-5 pt-0 mt-2 border-t border-[#EAF6FF] flex items-center justify-between">
          <span className={`text-[11px] font-semibold ${isPast ? 'text-rose-600' : 'text-[#5B7B9C]'}`}>
            {isPast ? `Closed on ${formatDate(event.registrationDeadline)}` : `Closes ${formatDate(event.registrationDeadline)}`}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition group-hover:translate-x-0.5"
          >
            <span>{isPast ? 'View' : 'Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Horizontal Card Variant (Matching Image 2 Reference layout: Image | Headline + Description + Organiser | Venue + Time + Apply)
  return (
    <div className={`group rounded-3xl bg-white/90 backdrop-blur-md border-2 ${isPast ? 'border-slate-200/80' : 'border-sky-100 hover:border-[#2563EB]/50'} hover:bg-white transition-all duration-300 shadow-sky-card hover:shadow-xl p-5 sm:p-6 flex flex-col md:flex-row items-stretch justify-between gap-5 sm:gap-6`}>
      
      {/* 1. Left: Event Image Thumbnail with Badges */}
      <div className="md:w-44 lg:w-48 flex-shrink-0 relative rounded-2xl overflow-hidden aspect-[16/10] md:aspect-square bg-sky-50 shadow-xs border border-sky-100">
        <img
          src={event.poster}
          alt={event.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isPast ? 'grayscale-[20%] opacity-90' : ''}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-70" />
        
        {/* Type & Closed Badges on Image */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
            isClubEvent
              ? 'bg-[#2563EB] text-white'
              : 'bg-[#0284C7] text-white'
          }`}>
            {isClubEvent ? '★ T&P Club' : '🌐 External'}
          </span>

          {isPast && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              Closed
            </span>
          )}
        </div>

        {/* Fee Badge on Bottom of Image */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black shadow-xs ${
            isFree
              ? 'bg-emerald-500 text-white'
              : 'bg-white/95 text-[#0F172A] border border-sky-200'
          }`}>
            {isFree ? 'FREE' : `₹${event.registrationFee}`}
          </span>
        </div>
      </div>

      {/* 2. Middle: Headline, Category, Organiser & Description Bullet Points */}
      <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="space-y-2">
          {/* Headline and Category Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/events/${event.id}`}
              className="text-lg sm:text-xl font-black text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug font-display hover:underline"
            >
              {event.title}
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-50 text-[#2563EB] border border-sky-200">
              {event.category}
            </span>
          </div>

          {/* Organiser Information */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#334155]">
            <Building2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
            <span className="truncate">{event.institution}</span>
            {event.coordinator?.name && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-[#64748B] font-medium truncate">Lead: {event.coordinator.name}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 leading-relaxed pt-0.5 font-medium">
            {event.subtitle || event.description}
          </p>

          {/* Bullet Points (Topics / Highlights - Matching Reference Image) */}
          {event.topics && event.topics.length > 0 && (
            <ul className="space-y-1 pt-1 text-xs text-[#64748B]">
              {event.topics.slice(0, 2).map((topic, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#2563EB] font-bold mt-0.5">•</span>
                  <span className="line-clamp-1">{topic}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 3. Right: Time, Venue Details & Action Button */}
      <div className="md:w-56 lg:w-64 flex-shrink-0 flex flex-col justify-between md:items-end pt-3 md:pt-0 border-t md:border-t-0 md:border-l md:border-sky-100 md:pl-5 space-y-4">
        
        {/* Time & Venue Details (Top Right in reference image) */}
        <div className="space-y-2.5 text-xs md:text-right w-full">
          {/* Venue & Location */}
          <div className="flex items-start md:justify-end gap-1.5 text-[#334155] font-bold">
            <MapPin className="w-4 h-4 text-[#2563EB] flex-shrink-0 md:order-2 mt-0.5" />
            <div className="md:order-1 leading-tight">
              <p className="text-[#0F172A] font-extrabold">{event.venue}</p>
              <p className="text-[11px] text-[#64748B] font-semibold">{event.city}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start md:justify-end gap-1.5 text-[#334155] font-bold">
            <Calendar className="w-4 h-4 text-[#2563EB] flex-shrink-0 md:order-2 mt-0.5" />
            <div className="md:order-1 leading-tight">
              <p className="text-[#0F172A] font-extrabold">{formatDate(event.startDate)}</p>
              <p className="text-[11px] text-[#64748B] font-semibold">{event.startTime} - {event.endTime}</p>
            </div>
          </div>
        </div>

        {/* Action Button (Bottom Right - Apply Now style) */}
        <div className="w-full">
          <Link
            to={`/events/${event.id}`}
            className={`w-full py-3 px-5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group/btn hover:scale-[1.02] cursor-pointer ${
              isPast
                ? 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-800/20'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25'
            }`}
          >
            <span>{isPast ? 'View Past Opportunity' : 'View Details & Register'}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <p className="text-[10px] text-[#64748B] font-bold text-center md:text-right mt-1.5">
            {isPast ? `Closed on ${formatDate(event.registrationDeadline)}` : `Closes: ${formatDate(event.registrationDeadline)}`}
          </p>
        </div>

      </div>

    </div>
  );
};
