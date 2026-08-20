import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Compass,
  Clock,
  Tag
} from 'lucide-react';

export const EventCard = ({ event, variant = 'standard' }) => {
  if (!event) return null;

  const isClubEvent = event.type === 'club_event';
  const isFree = !event.registrationFee || event.registrationFee === 0;

  // Format date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Large Featured Variant (Editorial Split)
  if (variant === 'featured_large') {
    return (
      <div className="group relative rounded-3xl bg-white border border-[#C1E5FF] hover:border-[#6AB0E3] transition-all duration-300 shadow-sky-card hover:shadow-sky-hover overflow-hidden flex flex-col lg:flex-row">
        {/* Poster Media */}
        <div className="lg:w-7/12 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#EAF6FF]">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/60 via-transparent to-transparent lg:hidden" />
          
          {/* Badges on Poster */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isClubEvent
                ? 'bg-[#6AB0E3] text-white shadow-md shadow-[#6AB0E3]/30'
                : 'bg-[#9CD5FF] text-[#0F2238] font-black'
            }`}>
              {isClubEvent ? '★ T&P Club Event' : '🌐 External Opportunity'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#0F2238] border border-[#C1E5FF]">
              {event.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 hidden lg:block">
            <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#C1E5FF] text-[#0F2238] font-mono text-xs font-bold shadow-xs">
              {event.startDate}
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5B7B9C]">
              <Building2 className="w-3.5 h-3.5 text-[#6AB0E3]" />
              <span className="truncate">{event.institution}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0F2238] group-hover:text-[#6AB0E3] transition-colors leading-tight">
              {event.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#5B7B9C] line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#EAF6FF]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#5B7B9C] block text-[10px] uppercase tracking-wider font-bold">Location</span>
                <span className="text-[#0F2238] font-bold truncate block">{event.city}</span>
              </div>
              <div>
                <span className="text-[#5B7B9C] block text-[10px] uppercase tracking-wider font-bold">Entry Fee</span>
                <span className={`font-black block text-sm ${isFree ? 'text-emerald-600' : 'text-[#2D6B9C]'}`}>
                  {isFree ? 'FREE' : `₹${event.registrationFee}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/events/${event.id}`}
                className="flex-1 text-center py-3 px-4 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white text-xs font-bold transition shadow-md shadow-[#6AB0E3]/25 flex items-center justify-center gap-2"
              >
                <span>View Details & Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Editorial Card
  return (
    <div className="group rounded-2xl bg-white border border-[#C1E5FF] hover:border-[#6AB0E3] hover:bg-[#FFFFFF] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sky-card hover:shadow-sky-hover">
      <div>
        {/* Poster Frame */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF6FF]">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/60 via-transparent to-transparent opacity-70" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs ${
              isClubEvent
                ? 'bg-[#6AB0E3] text-white'
                : 'bg-[#9CD5FF] text-[#0F2238] font-black'
            }`}>
              {isClubEvent ? '★ T&P Club' : 'External'}
            </span>
          </div>

          {/* Fee & Date overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-[#0F2238] font-mono text-[11px] border border-[#C1E5FF] font-bold shadow-xs">
              {formatDate(event.startDate)}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold backdrop-blur-md shadow-xs ${
              isFree ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-white/95 text-[#2D6B9C] border border-[#C1E5FF]'
            }`}>
              {isFree ? 'FREE' : `₹${event.registrationFee}`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#5B7B9C]">
            <span className="px-2 py-0.5 rounded bg-[#EAF6FF] text-[#1E3A5F] font-bold border border-[#C1E5FF]/60">
              {event.category}
            </span>
            <span className="flex items-center gap-1 truncate text-[#5B7B9C] font-semibold">
              <MapPin className="w-3 h-3 text-[#6AB0E3] flex-shrink-0" />
              {event.city}
            </span>
          </div>

          <h3 className="font-bold text-base text-[#0F2238] group-hover:text-[#6AB0E3] transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-[#5B7B9C] line-clamp-2 leading-relaxed">
            {event.subtitle || event.description}
          </p>

          <p className="text-[11px] text-[#5B7B9C] truncate flex items-center gap-1.5 pt-1">
            <Building2 className="w-3 h-3 text-[#6AB0E3] flex-shrink-0" />
            <span className="truncate">{event.institution}</span>
          </p>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="p-5 pt-0 mt-2 border-t border-[#EAF6FF] flex items-center justify-between">
        <span className="text-[11px] text-[#5B7B9C] font-medium">
          Closes {formatDate(event.registrationDeadline)}
        </span>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#6AB0E3] hover:text-[#3F88BF] transition group-hover:translate-x-0.5"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
