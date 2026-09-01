import React from 'react';
import { Filter, Search, RotateCcw, Sparkles, Building2 } from 'lucide-react';

export const EventFilters = ({
  filters,
  onFilterChange,
  onReset,
  categories = ['Career', 'Placement', 'Aptitude', 'Technical', 'Workshop', 'Hackathon', 'Symposium', 'Soft Skills', 'Competition'],
  cities = ['On-Campus', 'Online', 'Namakkal', 'Tiruchengode', 'Coimbatore', 'Sathyamangalam', 'Chennai', 'Salem', 'Tiruchirappalli']
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#C1E5FF] p-5 sm:p-6 shadow-sky-card space-y-4">
      {/* Type Toggle Tabs at Top */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAF6FF] pb-4">
        <div className="flex items-center gap-2 bg-[#EAF6FF] p-1 rounded-2xl border border-[#C1E5FF]">
          <button
            type="button"
            onClick={() => onFilterChange('type', 'all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filters.type === 'all'
                ? 'bg-[#0F2238] text-white shadow-xs'
                : 'text-[#1E3A5F] hover:text-[#0F2238]'
            }`}
          >
            All Opportunities
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('type', 'club_event')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filters.type === 'club_event'
                ? 'bg-[#6AB0E3] text-white shadow-sm shadow-[#6AB0E3]/30'
                : 'text-[#1E3A5F] hover:text-[#6AB0E3]'
            }`}
          >
            <span>★ T&P Club Events</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('type', 'external_opportunity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filters.type === 'external_opportunity'
                ? 'bg-[#9CD5FF] text-[#0F2238] font-black shadow-xs'
                : 'text-[#1E3A5F] hover:text-[#2D6B9C]'
            }`}
          >
            <span>🌐 External Opportunities</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#5B7B9C] hover:text-[#0F2238] flex items-center gap-1.5 font-bold hover:underline p-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Search Input and Sort selector */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B7B9C]" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
            placeholder="Search keywords, resume, hackathon, Python, company..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] text-xs focus:outline-none focus:border-[#6AB0E3] transition font-medium"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onFilterChange('query', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#5B7B9C] hover:text-[#0F2238]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="w-full md:w-52">
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            aria-label="Sort opportunities"
            className="w-full py-3 px-3.5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-bold focus:outline-none focus:border-[#6AB0E3]"
          >
            <option value="upcoming">📅 Upcoming First</option>
            <option value="popular">🔥 Most Clicked</option>
            <option value="recently_added">✨ Recently Added</option>
          </select>
        </div>
      </div>

      {/* Secondary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Category */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-[#5B7B9C] mb-1 tracking-wider">
            Domain / Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            aria-label="Filter by domain or category"
            className="w-full py-2.5 px-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
          >
            <option value="all">All Domains & Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Fee filter */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-[#5B7B9C] mb-1 tracking-wider">
            Fee
          </label>
          <select
            value={filters.fee}
            onChange={(e) => onFilterChange('fee', e.target.value)}
            aria-label="Filter by registration fee"
            className="w-full py-2.5 px-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
          >
            <option value="all">Any Fee (Free & Paid)</option>
            <option value="free">🟢 Free Opportunities Only</option>
            <option value="paid">Paid Events</option>
          </select>
        </div>

        {/* Location / City */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-[#5B7B9C] mb-1 tracking-wider">
            Location / Mode
          </label>
          <select
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            aria-label="Filter by location or mode"
            className="w-full py-2.5 px-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
          >
            <option value="all">All Locations (Campus & External)</option>
            {cities.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
