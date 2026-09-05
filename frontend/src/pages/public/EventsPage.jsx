import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useData } from '../../context/DataContext';
import { EventCard } from '../../components/events/EventCard';
import {
  Compass,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const CATEGORIES = [
  'Career',
  'Placement',
  'Aptitude',
  'Technical',
  'Workshop',
  'Hackathon',
  'Symposium',
  'Soft Skills',
  'Competition'
];

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events } = useData();

  const [currentPage, setCurrentPage] = useState(1);

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || searchParams.get('query') || '',
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    city: searchParams.get('city') || 'all',
    fee: searchParams.get('fee') || 'all',
    sort: searchParams.get('sort') || 'upcoming'
  });

  const [searchInput, setSearchInput] = useState(filters.query);

  // Keep state synced when search params in URL change
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category') || 'all';
    const city = searchParams.get('city') || 'all';
    const fee = searchParams.get('fee') || 'all';
    const sort = searchParams.get('sort') || 'upcoming';

    setFilters({ query: q, type, category, city, fee, sort });
    setSearchInput(q);
    setCurrentPage(1);
  }, [searchParams]);

  // Sync URL search params
  const updateParams = (nextFilters) => {
    const newParams = new URLSearchParams();
    if (nextFilters.query) newParams.set('q', nextFilters.query);
    if (nextFilters.type && nextFilters.type !== 'all') newParams.set('type', nextFilters.type);
    if (nextFilters.category && nextFilters.category !== 'all') newParams.set('category', nextFilters.category);
    if (nextFilters.city && nextFilters.city !== 'all') newParams.set('city', nextFilters.city);
    if (nextFilters.fee && nextFilters.fee !== 'all') newParams.set('fee', nextFilters.fee);
    if (nextFilters.sort && nextFilters.sort !== 'upcoming') newParams.set('sort', nextFilters.sort);
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const nextFilters = { ...filters, query: searchInput.trim() };
    setFilters(nextFilters);
    updateParams(nextFilters);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    setCurrentPage(1);
    const nextFilters = { ...filters, query: value };
    setFilters(nextFilters);
    updateParams(nextFilters);
  };

  const handleTypeChange = (type) => {
    setCurrentPage(1);
    const nextFilters = { ...filters, type };
    setFilters(nextFilters);
    updateParams(nextFilters);
  };

  const handleCategoryToggle = (category) => {
    setCurrentPage(1);
    const newCat = filters.category === category ? 'all' : category;
    const nextFilters = { ...filters, category: newCat };
    setFilters(nextFilters);
    updateParams(nextFilters);
  };

  const handleReset = () => {
    setCurrentPage(1);
    setSearchInput('');
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
    return eventService.searchAndFilterEvents(filters, events);
  }, [filters, events]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredEvents.length);
  const paginatedEvents = useMemo(() => {
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, startIndex]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const catalogElement = document.getElementById('events-catalog-container');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const publishedEvents = useMemo(() => events.filter(e => e.status !== 'draft'), [events]);
  const clubCount = useMemo(() => publishedEvents.filter(e => e.type === 'club_event').length, [publishedEvents]);
  const extCount = useMemo(() => publishedEvents.filter(e => e.type === 'external_opportunity').length, [publishedEvents]);

  const hasActiveFilters = Boolean(filters.query || filters.type !== 'all' || filters.category !== 'all');

  return (
    <div id="events-catalog-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      
      {/* 1. Grand & Bold Sky Search Bar */}
      <div className="w-full rounded-3xl bg-white/80 backdrop-blur-md border border-sky-200/80 p-4 sm:p-6 shadow-sky-card">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full group">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Search events"
              className="w-full pl-13 sm:pl-16 pr-32 sm:pr-40 py-4 sm:py-5 rounded-full bg-white border-2 sm:border-3 border-[#6AB0E3] focus:border-[#2563EB] text-[#0F172A] placeholder-[#5B7B9C] text-sm sm:text-base font-bold focus:outline-none transition-all shadow-md focus:shadow-xl font-display"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Subtle Separator 1 (Between Search Bar & Opportunity Types) */}
      <div className="w-full flex items-center justify-center py-1 sm:py-2">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent" />
      </div>

      {/* 2. Opportunity Filter Bubbles (Covering the exact same size as search bar with even spacing) */}
      <div className="w-full space-y-6 sm:space-y-7">
        
        {/* Main Opportunity Type Bubbles (Grid with equal size & even spacing) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('all')}
            className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl sm:rounded-full text-sm sm:text-base font-black transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer ${
              filters.type === 'all'
                ? 'bg-[#0F172A] text-white shadow-md ring-2 ring-[#0F172A]/20 scale-[1.02]'
                : 'bg-white/90 hover:bg-white text-[#1E3A5F] hover:text-[#0F172A] border-2 border-sky-200/80 hover:border-sky-300'
            }`}
          >
            <span>All Opportunities</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
              filters.type === 'all' ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#0F172A]'
            }`}>
              {publishedEvents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('club_event')}
            className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl sm:rounded-full text-sm sm:text-base font-black transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer ${
              filters.type === 'club_event'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30 scale-[1.02]'
                : 'bg-white/90 hover:bg-white text-[#1E3A5F] hover:text-[#2563EB] border-2 border-sky-200/80 hover:border-sky-300'
            }`}
          >
            <span>★ T&P Club Events</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
              filters.type === 'club_event' ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#2563EB]'
            }`}>
              {clubCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('external_opportunity')}
            className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl sm:rounded-full text-sm sm:text-base font-black transition-all shadow-sm flex items-center justify-center gap-2.5 cursor-pointer ${
              filters.type === 'external_opportunity'
                ? 'bg-[#0284C7] text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-400/30 scale-[1.02]'
                : 'bg-white/90 hover:bg-white text-[#1E3A5F] hover:text-[#0284C7] border-2 border-sky-200/80 hover:border-sky-300'
            }`}
          >
            <span>🌐 External Opportunities</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
              filters.type === 'external_opportunity' ? 'bg-white/20 text-white' : 'bg-sky-100 text-[#0284C7]'
            }`}>
              {extCount}
            </span>
          </button>
        </div>

        {/* Subtle Separator 2 (Between Opportunity Types & Category Bubbles) */}
        <div className="w-full flex items-center justify-center py-1 sm:py-2">
          <div className="w-3/4 sm:w-1/2 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />
        </div>

        {/* Opportunity Category Bubbles (Larger & Bold) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryToggle(cat)}
              className={`px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer shadow-xs ${
                filters.category === cat
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 border-2 border-[#2563EB] scale-105'
                  : 'bg-white/90 hover:bg-white text-[#1E3A5F] hover:text-[#2563EB] border-2 border-sky-200/80 hover:border-sky-300'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Reset Filters Bubble (when any filter is active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtle Separator 3 (Between Category Bubbles & Event Cards) */}
      <div className="w-full flex items-center justify-center pt-4 pb-2 sm:pt-6 sm:pb-3">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
      </div>

      {/* 3. Events Grid (Listing 5 events directly) */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#C1E5FF] shadow-sky-card space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] text-[#2563EB] flex items-center justify-center mx-auto border border-[#C1E5FF]">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2238] font-display">
            No matching opportunities found
          </h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            We couldn't find any opportunities matching your current search criteria. Try clearing some filters or searching for broader terms.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-md shadow-blue-500/25 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5 pt-2">
          {paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} variant="horizontal" />
          ))}
        </div>
      )}

      {/* 4. Full Bottom Pagination Controls */}
      {filteredEvents.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#C1E5FF]/60">
          <p className="text-xs text-[#5B7B9C] font-semibold text-center sm:text-left">
            Showing <span className="text-[#0F2238] font-bold">{startIndex + 1} to {endIndex}</span> of <span className="text-[#0F2238] font-bold">{filteredEvents.length}</span> opportunities (5 per page)
          </p>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                currentPage <= 1
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-sky-50 text-[#0F2238] border border-[#C1E5FF] shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous 5</span>
            </button>

            {/* Numbered Page Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25'
                      : 'bg-white text-[#475569] hover:bg-sky-50 border border-[#C1E5FF]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer ${
                currentPage >= totalPages
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25'
              }`}
            >
              <span>Next 5 Events</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
