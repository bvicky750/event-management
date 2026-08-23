import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Target,
  Users,
  ShieldCheck,
  ArrowRight,
  Mail,
  Building2,
  CheckCircle2,
  Heart,
  Share2
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C1E5FF] text-xs font-bold text-[#6AB0E3] font-mono shadow-xs">
          <Compass className="w-3.5 h-3.5" />
          <span>About T&P Club Opportunity Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2238] font-display tracking-tight leading-tight">
          Everything the T&P Club wants you to know — in one place.
        </h1>

        <p className="text-sm sm:text-base text-[#5B7B9C] leading-relaxed font-medium">
          We built this platform to replace the everyday chaos of WhatsApp forwards, lost PDFs, expired registration links, and blurry posters with a clean, searchable opportunity hub.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] space-y-3 shadow-sky-card">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#6AB0E3] flex items-center justify-center border border-[#C1E5FF]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2238] font-display">On-Campus Club Training</h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            Free resume building sessions, mock interview sprints, weekly aptitude challenges, and group discussion bootcamps organized directly by our student and faculty leads.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] space-y-3 shadow-sky-card">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#539FD8] flex items-center justify-center border border-[#C1E5FF]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2238] font-display">Curated External Fests</h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            We actively track and verify state and national level hackathons, symposiums, robotics challenges, and workshops from across institutions so you never miss a registration deadline.
          </p>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] space-y-3 shadow-sky-card">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#3F88BF] flex items-center justify-center border border-[#C1E5FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2238] font-display">Direct Registration Links</h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            Zero complicated paywalls or forced multi-step internal forms. You click register, and we send you directly to the organizer's official Google Form or registration portal.
          </p>
        </div>
      </div>

      {/* The WhatsApp Problem vs Solution */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] p-8 sm:p-10 space-y-6 shadow-sky-card">
        <h2 className="text-2xl font-bold text-[#0F2238] font-display">
          Why we moved away from WhatsApp broadcasts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-[#FFF5F5] border border-rose-200 space-y-2">
            <span className="font-bold text-rose-700 text-sm">❌ The Old WhatsApp Way</span>
            <ul className="space-y-1.5 text-rose-900/80 pt-1 leading-relaxed font-medium">
              <li>• Zooming in on low-res JPEG posters to find registration links.</li>
              <li>• Scrolling through 200 unread messages to find that one hackathon date.</li>
              <li>• Not knowing whether an event requires a fee or has passed its deadline.</li>
              <li>• Dead WhatsApp invite links and scattered Google Forms.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] space-y-2">
            <span className="font-bold text-[#0F2238] text-sm">✓ The T&P Opportunity Hub</span>
            <ul className="space-y-1.5 text-[#1E3A5F] pt-1 leading-relaxed font-medium">
              <li>• Clean, searchable catalog by domain, fee, date, and keyword.</li>
              <li>• Explicit separation of Club Events vs. External Opportunities.</li>
              <li>• Verified coordinator contacts and transparent fees.</li>
              <li>• One-click direct link to official registration forms.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Submit Opportunity CTA */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-[#C1E5FF] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sky-card">
        <div className="space-y-2 max-w-lg">
          <h3 className="text-xl font-bold text-[#0F2238] font-display">
            Want to list your department or college event?
          </h3>
          <p className="text-xs text-[#5B7B9C] leading-relaxed font-medium">
            If you are a student convener or faculty coordinator hosting a symposium or hackathon, share your event poster and details with our T&P committee.
          </p>
        </div>

        <a
          href="mailto:tnpclub@college.edu?subject=Opportunity%20Listing%20Request"
          className="px-6 py-3.5 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/25 whitespace-nowrap flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          <span>Email Event Details</span>
        </a>
      </div>
    </div>
  );
};
