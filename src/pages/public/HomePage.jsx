import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Search,
  Building2,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  Target,
  Code2,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  Users,
  Award,
  Zap,
  Globe,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import { EventCard } from '../../components/events/EventCard';

export const HomePage = () => {
  const { events } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter club events vs external opportunities
  const clubEvents = events.filter(e => e.type === 'club_event' && e.status !== 'draft');
  const externalEvents = events.filter(e => e.type === 'external_opportunity' && e.status !== 'draft');

  // Featured section: 1 large + 2 smaller
  const featuredLarge = events.find(e => e.featured) || events[0];
  const featuredSmaller = events.filter(e => e.id !== featuredLarge?.id && e.status !== 'draft').slice(0, 2);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleFilterClick = (filterKey) => {
    if (filterKey === 'club') {
      navigate('/events?type=club_event');
    } else if (filterKey === 'external') {
      navigate('/events?type=external_opportunity');
    } else if (filterKey !== 'all') {
      navigate(`/events?category=${encodeURIComponent(filterKey)}`);
    } else {
      navigate('/events');
    }
  };

  const categories = [
    {
      id: 'Career',
      name: 'Career & Placement',
      desc: 'Resume optimization, mock interviews & company prep',
      icon: Briefcase,
      count: events.filter(e => e.category === 'Career' || e.category === 'Placement').length,
      color: 'from-[#6AB0E3] to-[#3F88BF]'
    },
    {
      id: 'Technical',
      name: 'Coding & Hackathons',
      desc: '24H sprints, DSA marathons & model hacking',
      icon: Code2,
      count: events.filter(e => e.category === 'Technical' || e.category === 'Hackathon').length,
      color: 'from-[#559FD4] to-[#2D6B9C]'
    },
    {
      id: 'Workshop',
      name: 'Hands-on Workshops',
      desc: 'Edge AI, embedded systems & CAD masterclasses',
      icon: BookOpen,
      count: events.filter(e => e.category === 'Workshop').length,
      color: 'from-[#9CD5FF] to-[#6AB0E3]'
    },
    {
      id: 'Aptitude',
      name: 'Aptitude & Reasoning',
      desc: 'Speed battles & diagnostic tests for NQT / AMCAT',
      icon: Target,
      count: events.filter(e => e.category === 'Aptitude').length,
      color: 'from-[#6AB0E3] to-[#539FD8]'
    },
    {
      id: 'Soft Skills',
      name: 'Soft Skills & GD',
      desc: 'Group discussion entry, corporate etiquette & STAR',
      icon: Users,
      count: events.filter(e => e.category === 'Soft Skills').length,
      color: 'from-[#7EC2F3] to-[#3F88BF]'
    },
    {
      id: 'Symposium',
      name: 'Inter-College Fests',
      desc: 'National symposiums, fests & CTF tournaments',
      icon: Globe,
      count: events.filter(e => e.category === 'Symposium' || e.category === 'Competition').length,
      color: 'from-[#6AB0E3] to-[#1E4E75]'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* =========================================
          1. HERO SECTION (Editorial Asymmetric Layout)
          ========================================= */}
      <section className="relative pt-8 sm:pt-14 pb-8 lg:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C1E5FF] text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#6AB0E3] animate-pulse"></span>
              <span className="text-[#1E3A5F] font-mono tracking-wide text-[11px]">
                TRAINING & PLACEMENT CLUB
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F2238] leading-[1.08] tracking-tight font-display">
              FIND YOUR NEXT <br />
              <span className="bg-gradient-to-r from-[#6AB0E3] via-[#539FD8] to-[#2D6B9C] bg-clip-text text-transparent">
                OPPORTUNITY.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5B7B9C] max-w-xl leading-relaxed font-medium">
              Discover workshops, placement training, hackathons, symposiums, competitions and career opportunities — all in one clean digital noticeboard.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/events"
                className="px-6 py-3.5 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-sm transition shadow-md shadow-[#6AB0E3]/30 flex items-center justify-center gap-2 group"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/events?type=club_event"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#0F2238] font-bold text-sm border border-[#C1E5FF] transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>View Club Events</span>
                <span className="px-1.5 py-0.5 rounded bg-[#C1E5FF] text-[#0F2238] text-xs font-mono font-bold">
                  {clubEvents.length}
                </span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#5B7B9C] font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6AB0E3] flex-shrink-0" />
                <span>Zero WhatsApp clutter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#539FD8] flex-shrink-0" />
                <span>Direct registration links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3F88BF] flex-shrink-0" />
                <span>Curated for students</span>
              </div>
            </div>
          </div>

          {/* Right Column: Poster Collage Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Subtle Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#6AB0E3]/30 via-[#9CD5FF]/30 to-[#C1E5FF]/40 blur-2xl rounded-3xl pointer-events-none opacity-80" />

              {/* Overlapping Posters Collage */}
              <div className="relative space-y-4">
                {/* Top Poster Card */}
                <div className="relative z-20 rounded-2xl bg-white border border-[#C1E5FF] p-3 shadow-sky-card transition-transform hover:-translate-y-1">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#EAF6FF]">
                    <img
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                      alt="Techfinix Poster"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2238]/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#9CD5FF] text-[#0F2238] shadow-xs">
                        External Opportunity
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                      <p className="font-bold text-white text-xs truncate">TECHFINIX'26 National Symposium</p>
                      <span className="text-[#C1E5FF] font-mono text-[11px] font-bold">10–11 SEP</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Two Mini Cards Grid */}
                <div className="grid grid-cols-2 gap-3 relative z-10 -mt-2">
                  {/* Mini Card 1: Resume Workshop */}
                  <div className="rounded-2xl bg-white border border-[#C1E5FF] p-2.5 shadow-sky-subtle hover:-translate-y-1 transition-transform">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EAF6FF] mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&auto=format&fit=crop&q=80"
                        alt="Resume Workshop"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-[#6AB0E3] text-white text-[9px] font-bold uppercase shadow-xs">
                        T&P Club
                      </span>
                    </div>
                    <p className="font-bold text-[#0F2238] text-xs truncate">Resume ATS Workshop</p>
                    <p className="text-[10px] text-[#5B7B9C]">25 Aug • Seminar Hall</p>
                  </div>

                  {/* Mini Card 2: CodeFest Hackathon */}
                  <div className="rounded-2xl bg-white border border-[#C1E5FF] p-2.5 shadow-sky-subtle hover:-translate-y-1 transition-transform">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#EAF6FF] mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80"
                        alt="Hackathon"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-[#9CD5FF] text-[#0F2238] text-[9px] font-black uppercase shadow-xs">
                        Hackathon
                      </span>
                    </div>
                    <p className="font-bold text-[#0F2238] text-xs truncate">CodeCraze 24H Sprint</p>
                    <p className="text-[10px] text-[#5B7B9C]">15 Sep • ₹1L Prizes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. OPPORTUNITY FINDER (Search & Quick Pills)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#C1E5FF] p-4 sm:p-6 shadow-sky-card space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5B7B9C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aptitude, resume workshops, hackathons, symposiums, colleges..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] text-sm focus:outline-none focus:border-[#6AB0E3] focus:ring-1 focus:ring-[#6AB0E3] transition font-medium"
              />
            </div>
            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-sm transition shadow-md shadow-[#6AB0E3]/25 flex items-center justify-center gap-2"
            >
              <span>Search Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[#5B7B9C] text-[11px] uppercase font-bold tracking-wider mr-1 hidden sm:inline flex-shrink-0">
              Quick Filter:
            </span>
            <button
              onClick={() => handleFilterClick('all')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] font-bold whitespace-nowrap transition border border-[#C1E5FF]"
            >
              All ({events.length})
            </button>
            <button
              onClick={() => handleFilterClick('club')}
              className="px-3.5 py-1.5 rounded-xl bg-[#6AB0E3] text-white font-bold whitespace-nowrap transition flex items-center gap-1.5 shadow-xs"
            >
              <span>★ T&P Club Events</span>
              <span className="text-[10px] bg-white text-[#0F2238] px-1.5 py-0.2 rounded-full font-bold">
                {clubEvents.length}
              </span>
            </button>
            <button
              onClick={() => handleFilterClick('external')}
              className="px-3.5 py-1.5 rounded-xl bg-[#9CD5FF] hover:bg-[#7EC2F3] text-[#0F2238] font-bold whitespace-nowrap transition flex items-center gap-1.5 shadow-xs"
            >
              <span>🌐 External Opportunities</span>
              <span className="text-[10px] bg-white text-[#0F2238] px-1.5 py-0.2 rounded-full font-black">
                {externalEvents.length}
              </span>
            </button>
            <button
              onClick={() => handleFilterClick('Career')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#1E3A5F] font-semibold whitespace-nowrap transition border border-[#C1E5FF]"
            >
              Placement Prep
            </button>
            <button
              onClick={() => handleFilterClick('Aptitude')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#1E3A5F] font-semibold whitespace-nowrap transition border border-[#C1E5FF]"
            >
              Aptitude
            </button>
            <button
              onClick={() => handleFilterClick('Hackathon')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#1E3A5F] font-semibold whitespace-nowrap transition border border-[#C1E5FF]"
            >
              Hackathons
            </button>
            <button
              onClick={() => handleFilterClick('Workshop')}
              className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#1E3A5F] font-semibold whitespace-nowrap transition border border-[#C1E5FF]"
            >
              Workshops
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          3. OPPORTUNITIES WORTH CHECKING (Curated Editorial)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6AB0E3] mb-1 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Curated Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display">
              Opportunities Worth Checking
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7B9C] mt-0.5 font-medium">
              Hand-picked events and challenges recommended by the T&P student committee this week.
            </p>
          </div>

          <Link
            to="/events"
            className="text-xs font-bold text-[#6AB0E3] hover:text-[#3F88BF] transition flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Editorial Layout: 1 Large + 2 Smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1 Large Featured Card (8 cols) */}
          <div className="lg:col-span-8 flex">
            {featuredLarge && (
              <EventCard event={featuredLarge} variant="featured_large" />
            )}
          </div>

          {/* 2 Stacked Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {featuredSmaller.map((ev) => (
              <EventCard key={ev.id} event={ev} variant="standard" />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. FROM YOUR T&P CLUB (Dedicated Club Events)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C1E5FF] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6AB0E3] mb-1 font-mono">
              <Flame className="w-4 h-4 text-[#6AB0E3]" />
              <span>On-Campus Training</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display">
              From Your T&P Club
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7B9C] mt-0.5 font-medium">
              Workshops, mock interviews, and placement prep organized directly by our campus team.
            </p>
          </div>

          <Link
            to="/events?type=club_event"
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#EAF6FF] text-xs font-bold text-[#0F2238] border border-[#C1E5FF] transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <span>All Club Events ({clubEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#6AB0E3]" />
          </Link>
        </div>

        {/* Club Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} variant="standard" />
          ))}
        </div>
      </section>

      {/* =========================================
          5. BEYOND CAMPUS (External Opportunities)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#C1E5FF] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2D6B9C] mb-1 font-mono">
              <Globe className="w-4 h-4 text-[#6AB0E3]" />
              <span>External Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display">
              Beyond Campus
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7B9C] mt-0.5 font-medium">
              Symposiums, hackathons, and certified workshops from colleges, communities, and tech organizations.
            </p>
          </div>

          <Link
            to="/events?type=external_opportunity"
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#EAF6FF] text-xs font-bold text-[#0F2238] border border-[#C1E5FF] transition flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <span>All External ({externalEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#6AB0E3]" />
          </Link>
        </div>

        {/* External Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalEvents.map((ev) => (
            <EventCard key={ev.id} event={ev} variant="standard" />
          ))}
        </div>
      </section>

      {/* =========================================
          6. BROWSE BY DOMAIN (Visual Categories)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6AB0E3] font-mono">
            Domains & Focus Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display">
            Browse by Opportunity Type
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7B9C] font-medium">
            Find technical events and training sessions tailored to your branch, skill level, and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${encodeURIComponent(cat.id)}`}
              className="group p-6 rounded-2xl bg-white border border-[#C1E5FF] hover:border-[#6AB0E3] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sky-card hover:shadow-sky-hover"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E3A5F] bg-[#EAF6FF] px-2.5 py-1 rounded-lg border border-[#C1E5FF]">
                    {cat.count} Opportunities
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0F2238] group-hover:text-[#6AB0E3] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#5B7B9C] mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EAF6FF] flex items-center justify-between text-xs font-bold text-[#6AB0E3]">
                <span>Explore category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================
          7. THE DIGITAL NOTICEBOARD ETHOS (Why We Built This)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-white via-[#EAF6FF] to-white border border-[#C1E5FF] p-8 sm:p-12 shadow-sky-card relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#C1E5FF] text-[#0F2238] text-xs font-bold uppercase font-mono">
              Designed by Students • Built for Students
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2238] font-display tracking-tight">
              No more searching through 500 unread WhatsApp messages.
            </h2>
            <p className="text-[#5B7B9C] text-xs sm:text-sm leading-relaxed font-medium">
              Every week, great hackathons, placement preparation workshops, and symposiums get buried in group chats, compressed posters, and dead Google Form links. T&P Club Opportunity Hub brings all campus workshops and verified external fests into one structured, searchable catalog with direct registration links.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/events"
                className="px-6 py-3 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/25 inline-flex items-center gap-2"
              >
                <span>Browse All Active Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#EAF6FF] text-[#0F2238] font-bold text-xs border border-[#C1E5FF] transition"
              >
                Learn About T&P Club
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
