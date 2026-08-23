import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Briefcase,
  Code2,
  BookOpen,
  Target,
  Users,
  Globe,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const CategoriesPage = () => {
  const { events } = useData();

  const categories = [
    {
      id: 'Career',
      name: 'Career & Placement',
      tagline: 'Placement preparation, resume building & mock interviews',
      desc: 'Workshops and diagnostic drives organized by the T&P Club to make you day-1 ready for corporate hiring and technical assessments.',
      icon: Briefcase,
      count: events.filter(e => e.category === 'Career' || e.category === 'Placement').length,
      gradient: 'from-[#6AB0E3] to-[#3F88BF]',
      popularTopics: ['ATS Resume Format', 'HR Behavioral STAR Method', 'Technical Interview Prep']
    },
    {
      id: 'Technical',
      name: 'Coding & Hackathons',
      tagline: '24-Hour sprints, DSA marathons & competitive coding',
      desc: 'High-intensity coding competitions, state-level hackathons, and algorithm masterclasses to sharpen your problem solving under time limits.',
      icon: Code2,
      count: events.filter(e => e.category === 'Technical' || e.category === 'Hackathon').length,
      gradient: 'from-[#559FD4] to-[#2D6B9C]',
      popularTopics: ['LeetCode Medium/Hard DSA', '24H Prototype Sprint', 'Web3 & AI Hacks']
    },
    {
      id: 'Workshop',
      name: 'Hands-on Workshops',
      tagline: 'Edge AI, embedded systems, TinyML & CAD modeling',
      desc: 'Deep-dive technical sessions with real hardware kits, simulation software, and industrial tools taught by expert faculty and practitioners.',
      icon: BookOpen,
      count: events.filter(e => e.category === 'Workshop').length,
      gradient: 'from-[#9CD5FF] to-[#6AB0E3]',
      popularTopics: ['ESP32 Edge AI Vision', 'SolidWorks CAD & FEA', 'Microcontroller Flashing']
    },
    {
      id: 'Aptitude',
      name: 'Aptitude & Reasoning',
      tagline: 'Speed challenges & diagnostic tests for TCS NQT / AMCAT',
      desc: 'Weekly speed tests covering quantitative ability, logical reasoning, and verbal aptitude with immediate performance scorecards.',
      icon: Target,
      count: events.filter(e => e.category === 'Aptitude').length,
      gradient: 'from-[#6AB0E3] to-[#539FD8]',
      popularTopics: ['Speed Math & Permutations', 'Blood Relations & Puzzles', 'Verbal Error Spotting']
    },
    {
      id: 'Soft Skills',
      name: 'Soft Skills & GD',
      tagline: 'Group discussion initiation, debate & corporate etiquette',
      desc: 'Interactive simulated rounds to master group discussion entry, respectful arguments, body language, and articulation.',
      icon: Users,
      count: events.filter(e => e.category === 'Soft Skills').length,
      gradient: 'from-[#7EC2F3] to-[#3F88BF]',
      popularTopics: ['GD Initiating & Summarizing', 'STAR Framework Delivery', 'Active Non-verbal Signals']
    },
    {
      id: 'Symposium',
      name: 'Inter-College Fests',
      tagline: 'National technical symposiums, CTF tournaments & robotics',
      desc: 'Flagship fests hosted across regional engineering colleges featuring multi-track competitions and cash prize pools.',
      icon: Globe,
      count: events.filter(e => e.category === 'Symposium' || e.category === 'Competition').length,
      gradient: 'from-[#6AB0E3] to-[#1E4E75]',
      popularTopics: ['National Paper Presentation', '24H CTF Cyber Battle', 'Hardware Circuit Sleuths']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C1E5FF] text-xs font-bold text-[#6AB0E3] font-mono shadow-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>Opportunity Domains</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F2238] font-display tracking-tight">
          Explore by Category
        </h1>
        <p className="text-xs sm:text-sm text-[#5B7B9C] font-medium">
          Find career training, technical challenges, and symposiums tailored to your development pathway.
        </p>
      </div>

      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] p-6 sm:p-7 shadow-sky-card flex flex-col justify-between space-y-6 hover:border-[#6AB0E3] transition"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-md`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-xs font-mono font-bold text-[#0F2238] border border-[#C1E5FF]">
                  {cat.count} Events
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#0F2238] font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6AB0E3] font-bold mt-0.5">
                  {cat.tagline}
                </p>
                <p className="text-xs text-[#5B7B9C] mt-2 leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </div>

              {/* Popular topics */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-[#5B7B9C] tracking-wider">
                  Popular Tracks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.popularTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#EAF6FF] text-[11px] text-[#1E3A5F] font-semibold border border-[#C1E5FF]/60"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to={`/events?category=${encodeURIComponent(cat.id)}`}
              className="w-full py-3 px-4 rounded-xl bg-[#EAF6FF] hover:bg-[#6AB0E3] text-[#0F2238] hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-[#C1E5FF] group shadow-xs"
            >
              <span>Explore {cat.name}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
