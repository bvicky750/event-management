import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useData } from '../../context/DataContext';
import { EventCard } from '../../components/events/EventCard';
import { EventFilters } from '../../components/events/EventFilters';
import { Compass, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events } = useData();

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || searchParams.get('query') || '',
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || 'all',
    fee: searchParams.get('fee') || 'all',
    sort: searchParams.get('sort') || 'upcoming'
  });

  // Keep state synced when search params in URL change
  useEffect(() => {
    setFilters({
      query: searchParams.get('q') || searchParams.get('query') || '',
      type: searchParams.get('type') || 'all',
      category: searchParams.get('category') || 'all',
      city: searchParams.get('city') || 'all',
      fee: searchParams.get('fee') || 'all',
      sort: searchParams.get('sort') || 'upcoming'
    });
  }, [searchParams]);

  // Sync URL search params when filters change
  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);

    const newParams = new URLSearchParams();
    if (nextFilters.query) newParams.set('q', nextFilters.query);
    if (nextFilters.type && nextFilters.type !== 'all') newParams.set('type', nextFilters.type);
    if (nextFilters.category && nextFilters.category !== 'all') newParams.set('category', nextFilters.category);
    if (nextFilters.city && nextFilters.city !== 'all') newParams.set('city', nextFilters.city);
    if (nextFilters.fee && nextFilters.fee !== 'all') newParams.set('fee', nextFilters.fee);
    if (nextFilters.sort && nextFilters.sort !== 'upcoming') newParams.set('sort', nextFilters.sort);

    setSearchParams(newParams, { replace: true });
  };

  const handleReset = () => {
    const emptyFilters = {
      query: '',
      type: 'all',
      category: 'all',
      city: 'all',
      fee: 'all',
      sort: 'upcoming'
    };
    setFilters(emptyFilters);
    setSearchParams({}, { replace: true });
  };

  // Filter & sort
  const filteredEvents = useMemo(() => {
    return eventService.searchAndFilterEvents(filters);
  }, [filters, events]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C1E5FF] text-xs font-bold text-[#6AB0E3] mb-2 font-mono shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunity Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2238] font-display tracking-tight">
            {filters.type === 'club_event'
              ? 'T&P Club Events & Workshops'
              : filters.type === 'external_opportunity'
              ? 'External College Opportunities'
              : 'Discover All Opportunities'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B7B9C] mt-1 max-w-xl font-medium">
            Explore verified technical fests, hackathons, aptitude challenges, and placement preparation sessions.
          </p>
        </div>

        <div className="text-right self-start md:self-auto bg-white px-4 py-2 rounded-2xl border border-[#C1E5FF] shadow-xs">
          <span className="text-[10px] text-[#5B7B9C] font-bold uppercase tracking-wider block">
            Opportunities Listed
          </span>
          <p className="text-lg font-black text-[#6AB0E3] font-mono">
            {filteredEvents.length} Active
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <EventFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#C1E5FF] shadow-sky-card space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] text-[#6AB0E3] flex items-center justify-center mx-auto border border-[#C1E5FF]">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2238] font-display">
            No matching opportunities found
          </h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            We couldn't find any opportunities matching your current search criteria. Try clearing some filters or searching for broader terms like "workshop" or "coding".
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white text-xs font-bold transition shadow-md shadow-[#6AB0E3]/25"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
