import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  ArrowDown,
  ArrowRight,
  Search,
  Sparkles,
  Flame,
  Globe,
  Briefcase,
  Code2,
  BookOpen,
  Target,
  Users
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';

export const HomePage = () => {
  const { events } = useData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from query params
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('q') || searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state if searchParams changes (e.g. from nav clicks)
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('query') || '';
    const type = searchParams.get('type') || 'all';
    const category = searchParams.get('category') || 'all';
    
    setSearchQuery(q);
    setActiveSearch(q);
    setSelectedType(type);
    setSelectedCategory(category);

    if (q || type !== 'all' || category !== 'all') {
      setTimeout(() => {
        document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const updateFiltersInUrl = (type, category, search) => {
    const newParams = new URLSearchParams();
    if (search) newParams.set('q', search);
    if (type && type !== 'all') newParams.set('type', type);
    if (category && category !== 'all') newParams.set('category', category);
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setActiveSearch(query);
    setSelectedCategory('all');
    setSelectedType('all');
    updateFiltersInUrl('all', 'all', query);
  };

  const handleFilterClick = (filterKey) => {
    setActiveSearch('');
    setSearchQuery('');
    
    let type = 'all';
    let category = 'all';

    if (filterKey === 'club') {
      type = 'club_event';
    } else if (filterKey === 'external') {
      type = 'external_opportunity';
    } else if (filterKey !== 'all') {
      category = filterKey;
    }

    setSelectedType(type);
    setSelectedCategory(category);
    updateFiltersInUrl(type, category, '');
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (event.status === 'draft') return false;

      if (selectedType !== 'all' && event.type !== selectedType) return false;

      if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;

      if (activeSearch) {
        const query = activeSearch.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(query);
        const matchesDesc = event.description?.toLowerCase().includes(query);
        const matchesCategory = event.category?.toLowerCase().includes(query);
        const matchesCity = event.city?.toLowerCase().includes(query);
        const matchesOrganizer = event.organizerName?.toLowerCase().includes(query);
        const matchesTags = event.tags?.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesCity && !matchesOrganizer && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedType, selectedCategory, activeSearch]);

  const hasActiveFilters = activeSearch !== '' || selectedType !== 'all' || selectedCategory !== 'all';

  // Filter club events vs external opportunities
  const clubEvents = events.filter(e => e.type === 'club_event' && e.status !== 'draft');
  const externalEvents = events.filter(e => e.type === 'external_opportunity' && e.status !== 'draft');

  // Featured section: 1 large + 2 smaller
  const featuredLarge = events.find(e => e.featured) || events[0];
  const featuredSmaller = events.filter(e => e.id !== featuredLarge?.id && e.status !== 'draft').slice(0, 2);

  const categories = [
    {
      id: 'Career',
      name: 'Career & Placement',
      desc: 'Resume optimization, mock interviews & company prep',
      icon: Briefcase,
      count: events.filter(e => e.category === 'Career' || e.category === 'Placement').length,
      color: 'from-[#3B82F6] to-[#1D4ED8]'
    },
    {
      id: 'Technical',
      name: 'Coding & Hackathons',
      desc: '24H sprints, DSA marathons & model hacking',
      icon: Code2,
      count: events.filter(e => e.category === 'Technical' || e.category === 'Hackathon').length,
      color: 'from-[#2563EB] to-[#1E40AF]'
    },
    {
      id: 'Workshop',
      name: 'Hands-on Workshops',
      desc: 'Edge AI, embedded systems & CAD masterclasses',
      icon: BookOpen,
      count: events.filter(e => e.category === 'Workshop').length,
      color: 'from-[#60A5FA] to-[#2563EB]'
    },
    {
      id: 'Aptitude',
      name: 'Aptitude & Reasoning',
      desc: 'Speed battles & diagnostic tests for NQT / AMCAT',
      icon: Target,
      count: events.filter(e => e.category === 'Aptitude').length,
      color: 'from-[#3B82F6] to-[#1E3A8A]'
    },
    {
      id: 'Soft Skills',
      name: 'Soft Skills & GD',
      desc: 'Group discussion entry, corporate etiquette & STAR',
      icon: Users,
      count: events.filter(e => e.category === 'Soft Skills').length,
      color: 'from-[#93C5FD] to-[#2563EB]'
    },
    {
      id: 'Symposium',
      name: 'Inter-College Fests',
      desc: 'National symposiums, fests & CTF tournaments',
      icon: Globe,
      count: events.filter(e => e.category === 'Symposium' || e.category === 'Competition').length,
      color: 'from-[#2563EB] to-[#0F172A]'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden bg-transparent">
      
      {/* =========================================
          1. SKY HERO SECTION (Exact Reference Recreation)
          ========================================= */}
      <section className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-10 sm:pt-36 sm:pb-16 overflow-hidden">
        
        {/* Birds Silhouette (Upper Right Sky area - matching reference image) */}
        <div className="absolute top-[18%] right-[15%] sm:right-[22%] z-10 pointer-events-none opacity-75">
          <svg width="120" height="70" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bird 1 */}
            <path d="M70 12C73 8 77 7 81 10C85 13 87 19 89 21C92 19 96 14 100 12C104 10 108 12 110 15C107 17 101 22 96 25C91 28 89 31 88 32C87 31 84 27 79 23C74 19 71 14 70 12Z" fill="#2563EB" opacity="0.65"/>
            {/* Bird 2 */}
            <path d="M15 35C18 31 22 30 26 33C30 36 32 41 33 43C36 41 40 37 44 35C48 33 51 35 53 37C50 39 45 43 41 46C37 48 35 51 34 52C33 51 30 47 26 44C21 41 17 37 15 35Z" fill="#3B82F6" opacity="0.55"/>
          </svg>
        </div>

        {/* Spacer top */}
        <div className="h-4 sm:h-8" />

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 my-auto">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center justify-center gap-3 text-xs sm:text-sm font-bold tracking-widest text-[#2563EB] uppercase font-mono animate-fade-in">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#93C5FD]" />
            <span>T&P CLUB OPPORTUNITY HUB</span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#93C5FD]" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#0F172A] tracking-tight leading-[1.06] font-serif">
            Opportunities <br />
            Take You Higher.<span className="text-[#2563EB] font-serif"></span>
          </h1>

          {/* Short Supporting Paragraph */}
          <p className="text-base sm:text-lg lg:text-xl text-[#334155] max-w-xl mx-auto leading-relaxed font-medium pt-2">
            Discover workshops, placement training, hackathons <br className="hidden sm:inline" />
            and external opportunities — all in one place.
          </p>

          {/* Single Primary Action Button (Desktop & Tablet option) */}
          <div className="pt-4 hidden sm:block">
            <a
              href="#explore-section"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm transition shadow-lg shadow-blue-500/25 hover:scale-105"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator (Circular Downward Arrow Button) */}
        <div className="relative z-10 pt-8 pb-4">
          <a
            href="#explore-section"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-sky-300 bg-white/60 backdrop-blur-xs text-[#2563EB] flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md group animate-gentle-bounce cursor-pointer mx-auto"
            aria-label="Scroll to opportunities"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

      </section>

      {/* =========================================
          2. OPPORTUNITY SEARCH & EXPLORE SECTION
          ========================================= */}
      <div id="explore-section" className="scroll-mt-24 space-y-16">
        
        {/* Grand & Bold Sky Search Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/75 backdrop-blur-md border border-sky-200/80 p-5 sm:p-8 shadow-sky-card">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-4xl mx-auto group">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 text-[#2563EB]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search aptitude, resume workshops, hackathons, symposiums..."
                  className="w-full pl-16 sm:pl-18 pr-36 sm:pr-44 py-5 sm:py-6 rounded-full bg-white/90 border-3 border-[#6AB0E3] focus:border-[#2563EB] text-[#0F172A] placeholder-[#5B7B9C] text-base sm:text-lg font-black focus:outline-none transition-all shadow-md focus:shadow-xl font-display"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {hasActiveFilters ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between border-b border-sky-200 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-display">
                  Search Results
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
                  Showing {filteredEvents.length} opportunities matching your criteria.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSearch('');
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedCategory('all');
                  updateFiltersInUrl('all', 'all', '');
                }}
                className="px-4 py-2 rounded-xl bg-[#EAF6FF] text-[#2563EB] hover:bg-[#C1E5FF] hover:text-[#1D4ED8] text-xs font-bold transition border border-[#C1E5FF] shadow-xs"
              >
                Clear Filters
              </button>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} variant="standard" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-sky-200 p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAF6FF] text-[#2563EB] flex items-center justify-center mx-auto border border-[#C1E5FF]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">No opportunities found</h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto">
                  We couldn't find any opportunities matching your criteria. Try adjusting your search query or filters.
                </p>
                <button
                  onClick={() => {
                    setActiveSearch('');
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedCategory('all');
                    updateFiltersInUrl('all', 'all', '');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-md shadow-blue-500/20"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Curated Highlights */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1 font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>Curated Highlights</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-display">
                    Opportunities Worth Checking
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
                    Hand-picked events and challenges recommended by the T&P committee this week.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setActiveSearch('');
                    setSearchQuery('');
                    updateFiltersInUrl('all', 'all', '');
                    setTimeout(() => {
                      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 flex">
                  {featuredLarge && (
                    <EventCard event={featuredLarge} variant="featured_large" />
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                  {featuredSmaller.map((ev) => (
                    <EventCard key={ev.id} event={ev} variant="standard" />
                  ))}
                </div>
              </div>
            </section>

            {/* From Your T&P Club (On-Campus Training) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sky-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1 font-mono">
                    <Flame className="w-4 h-4 text-[#2563EB]" />
                    <span>On-Campus Training</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-display">
                    From Your T&P Club
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
                    Workshops, mock interviews, and placement prep organized directly by our campus team.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedType('club_event');
                    setSelectedCategory('all');
                    setActiveSearch('');
                    setSearchQuery('');
                    updateFiltersInUrl('club_event', 'all', '');
                    setTimeout(() => {
                      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 text-xs font-bold text-[#0F172A] border border-sky-200 transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <span>All Club Events ({clubEvents.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} variant="standard" />
                ))}
              </div>
            </section>

            {/* Beyond Campus (External Opportunities) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sky-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E40AF] mb-1 font-mono">
                    <Globe className="w-4 h-4 text-[#2563EB]" />
                    <span>External Opportunities</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-display">
                    Beyond Campus
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
                    Symposiums, hackathons, and certified workshops from colleges, communities, and tech organizations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedType('external_opportunity');
                    setSelectedCategory('all');
                    setActiveSearch('');
                    setSearchQuery('');
                    updateFiltersInUrl('external_opportunity', 'all', '');
                    setTimeout(() => {
                      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 text-xs font-bold text-[#0F172A] border border-sky-200 transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <span>All External ({externalEvents.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {externalEvents.map((ev) => (
                  <EventCard key={ev.id} event={ev} variant="standard" />
                ))}
              </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] font-mono">
                  Domains & Focus Areas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-display">
                  Browse by Opportunity Type
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                  Find technical events and training sessions tailored to your branch, skill level, and career goals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedType('all');
                      setActiveSearch('');
                      setSearchQuery('');
                      updateFiltersInUrl('all', cat.id, '');
                      setTimeout(() => {
                        document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="group text-left p-6 rounded-2xl bg-white border border-sky-200 hover:border-[#2563EB] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sky-card hover:shadow-sky-hover w-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                          <cat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-bold text-[#1E3A5F] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                          {cat.count} Opportunities
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-sky-100 flex items-center justify-between text-xs font-bold text-[#2563EB] w-full">
                      <span>Explore category</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Digital Noticeboard ethos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-white via-sky-50 to-white border border-sky-200 p-8 sm:p-12 shadow-sky-card relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-sky-200 text-[#0F172A] text-xs font-bold uppercase font-mono">
                Designed by Students • Built for Students
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] font-display tracking-tight">
                No more searching through 500 unread WhatsApp messages.
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed font-medium">
                Every week, great hackathons, placement preparation workshops, and symposiums get buried in group chats, compressed posters, and dead Google Form links. T&P Club Opportunity Hub brings all campus workshops and verified external fests into one structured, searchable catalog with direct registration links.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setActiveSearch('');
                    setSearchQuery('');
                    updateFiltersInUrl('all', 'all', '');
                    setTimeout(() => {
                      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition shadow-md shadow-blue-500/25 inline-flex items-center gap-2"
                >
                  <span>Browse All Active Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/about"
                  className="px-6 py-3 rounded-full bg-white hover:bg-sky-50 text-[#0F172A] font-bold text-xs border border-sky-200 transition"
                >
                  Learn About T&P Club
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
