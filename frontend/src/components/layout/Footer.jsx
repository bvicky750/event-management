import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Send,
  Heart
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-[#C1E5FF] text-[#5B7B9C] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white shadow-md shadow-[#6AB0E3]/20">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#0F2238] font-display">
                  T&P <span className="text-[#6AB0E3]">CLUB</span>
                </span>
                <p className="text-[10px] uppercase font-bold text-[#5B7B9C] -mt-0.5">
                  Opportunity Hub
                </p>
              </div>
            </Link>

            <p className="text-[#5B7B9C] text-xs leading-relaxed max-w-sm font-medium">
              The centralized digital noticeboard for our college's Training & Placement Club. Discover workshops, aptitude training, hackathons, and external symposiums without hunting through WhatsApp messages.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#0F2238] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#6AB0E3] animate-pulse"></span>
              <span>Updated daily for 2026–2027 Academic Year</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F2238] uppercase tracking-wider text-[11px] font-display">
              Discover
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/?type=club_event#explore-section" className="hover:text-[#6AB0E3] transition flex items-center gap-1">
                  <span>T&P Club Events</span>
                </Link>
              </li>
              <li>
                <Link to="/?type=external_opportunity#explore-section" className="hover:text-[#6AB0E3] transition flex items-center gap-1">
                  <span>External Opportunities</span>
                </Link>
              </li>
              <li>
                <Link to="/?category=Career#explore-section" className="hover:text-[#0F2238] transition">
                  Placement Prep
                </Link>
              </li>
              <li>
                <Link to="/?category=Aptitude#explore-section" className="hover:text-[#0F2238] transition">
                  Aptitude Challenges
                </Link>
              </li>
              <li>
                <Link to="/?category=Hackathon#explore-section" className="hover:text-[#0F2238] transition">
                  Hackathons
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F2238] uppercase tracking-wider text-[11px] font-display">
              Explore
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/categories" className="hover:text-[#0F2238] transition">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0F2238] transition">
                  About T&P Club
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0F2238] transition">
                  Organizer Login
                </Link>
              </li>
              <li>
                <a
                  href="https://forms.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#6AB0E3] transition inline-flex items-center gap-1"
                >
                  <span>Submit Opportunity</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#0F2238] uppercase tracking-wider text-[11px] font-display">
              Club Office
            </h4>
            <div className="space-y-2.5 text-[#5B7B9C] text-xs font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6AB0E3] flex-shrink-0 mt-0.5" />
                <span>Training & Placement Cell, 3rd Floor, Central Block</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#539FD8] flex-shrink-0" />
                <span>tnpclub@college.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>+91 94432 10987</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAF6FF] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#5B7B9C] font-semibold">
          <p>
            © {new Date().getFullYear()} T&P Club — Training & Placement Opportunity Hub. Built for students.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#0F2238] transition">Mission</Link>
            <span>•</span>
            <Link to="/categories" className="hover:text-[#0F2238] transition">Domains</Link>
            <span>•</span>
            <Link to="/#explore-section" className="hover:text-[#0F2238] transition">All Events</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
