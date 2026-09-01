import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Sparkles,
  ArrowLeft,
  Upload,
  Link2,
  Building2,
  MapPin,
  Clock,
  Tag,
  Phone,
  Mail,
  User,
  CheckCircle2
} from 'lucide-react';

export const CreateEventPage = () => {
  const { createEvent } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    type: 'club_event', // 'club_event' | 'external_opportunity'
    category: 'Career',
    startDate: '',
    endDate: '',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    venue: '',
    institution: 'Training & Placement Club',
    city: 'On-Campus',
    registrationFee: 0,
    registrationDeadline: '',
    registrationUrl: '',
    eligibility: 'Open to 2nd, 3rd & Final Year engineering students',
    coordinatorName: 'Harish Kumar (T&P Student Head)',
    coordinatorEmail: 'tnpclub@college.edu',
    coordinatorPhone: '+91 94432 10987',
    topics: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, poster: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e, status = 'published') => {
    e.preventDefault();
    setIsSubmitting(true);

    const topicsArray = formData.topics
      ? formData.topics.split('\n').map(t => t.trim()).filter(Boolean)
      : [];

    const newOpportunity = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      poster: formData.poster,
      type: formData.type,
      category: formData.category,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || formData.startDate || new Date().toISOString().split('T')[0],
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue || (formData.type === 'club_event' ? 'Main Seminar Hall' : 'Campus Auditorium'),
      institution: formData.institution,
      city: formData.city,
      registrationFee: Number(formData.registrationFee) || 0,
      registrationDeadline: formData.registrationDeadline || formData.startDate,
      registrationUrl: formData.registrationUrl || 'https://forms.google.com',
      eligibility: formData.eligibility,
      status: status,
      coordinator: {
        name: formData.coordinatorName,
        email: formData.coordinatorEmail,
        phone: formData.coordinatorPhone
      },
      topics: topicsArray,
      viewsCount: 1,
      registrationClicks: 0
    };

    setTimeout(() => {
      createEvent(newOpportunity);
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  const samplePosters = [
    { label: 'Tech & Code', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Resume / Career', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Interview Prep', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80' },
    { label: 'Hardware / AI', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7B9C] hover:text-[#0F2238] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#6AB0E3]" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-10 shadow-sky-card space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#6AB0E3] text-xs font-mono font-bold uppercase border border-[#C1E5FF]">
            T&P Opportunity Publishing Form
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display tracking-tight mt-2">
            Post a New Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-[#5B7B9C] mt-1 font-medium">
            Create an on-campus T&P Club workshop or curate a verified external symposium / hackathon for students.
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-8">
          {/* Section 1: Event Type Selection */}
          <div className="space-y-3 p-5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF]">
            <label className="block text-xs font-bold text-[#0F2238] uppercase tracking-wider font-mono">
              1. Select Opportunity Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.type === 'club_event'
                    ? 'bg-white border-[#6AB0E3] text-[#0F2238] shadow-sm'
                    : 'bg-white/60 border-[#C1E5FF] text-[#1E3A5F] hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="club_event"
                  checked={formData.type === 'club_event'}
                  onChange={handleChange}
                  className="mt-1 text-[#6AB0E3] focus:ring-[#6AB0E3]"
                />
                <div>
                  <span className="font-bold text-sm block text-[#0F2238]">★ T&P Club Event</span>
                  <span className="text-xs text-[#5B7B9C] leading-relaxed block mt-0.5 font-medium">
                    Organized directly by our Training & Placement Club on-campus or online.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.type === 'external_opportunity'
                    ? 'bg-white border-[#9CD5FF] text-[#0F2238] shadow-sm'
                    : 'bg-white/60 border-[#C1E5FF] text-[#1E3A5F] hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value="external_opportunity"
                  checked={formData.type === 'external_opportunity'}
                  onChange={handleChange}
                  className="mt-1 text-[#6AB0E3] focus:ring-[#6AB0E3]"
                />
                <div>
                  <span className="font-bold text-sm block text-[#0F2238]">🌐 External Opportunity</span>
                  <span className="text-xs text-[#5B7B9C] leading-relaxed block mt-0.5 font-medium">
                    Discovered from other engineering colleges, universities, or tech organizations.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Event Core Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#EAF6FF] pb-2">
              2. Opportunity Information
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Resume Building & ATS Optimization Masterclass"
                  className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] focus:outline-none focus:border-[#6AB0E3] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. 3-Hour hands-on workshop on ATS formats & interview techniques"
                  className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] focus:outline-none focus:border-[#6AB0E3] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0F2238] font-bold mb-1.5">
                    Domain / Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-bold focus:outline-none focus:border-[#6AB0E3]"
                  >
                    <option value="Career">Career & Placement</option>
                    <option value="Placement">Mock Interview / Drive</option>
                    <option value="Aptitude">Aptitude & Reasoning</option>
                    <option value="Technical">Coding & DSA</option>
                    <option value="Workshop">Technical Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Symposium">Inter-College Symposium</option>
                    <option value="Soft Skills">Soft Skills & GD</option>
                    <option value="Competition">Competition / CTF</option>
                    <option value="Other">Other Opportunity</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[#0F2238] font-bold">
                      Poster Image *
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setUploadMode('file')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          uploadMode === 'file'
                            ? 'bg-[#6AB0E3] text-white shadow-xs'
                            : 'bg-[#EAF6FF] text-[#5B7B9C] border border-[#C1E5FF]'
                        }`}
                      >
                        📁 Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode('url')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition cursor-pointer ${
                          uploadMode === 'url'
                            ? 'bg-[#6AB0E3] text-white shadow-xs'
                            : 'bg-[#EAF6FF] text-[#5B7B9C] border border-[#C1E5FF]'
                        }`}
                      >
                        🔗 Web URL
                      </button>
                    </div>
                  </div>

                  {uploadMode === 'file' ? (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-[#C1E5FF] hover:border-[#6AB0E3] rounded-2xl p-4 text-center bg-[#EAF6FF]/60 hover:bg-[#EAF6FF] transition relative group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Upload className="w-6 h-6 text-[#6AB0E3] group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-[#0F2238]">
                            Click or Drag & Drop Image File
                          </p>
                          <p className="text-[10px] text-[#5B7B9C]">
                            PNG, JPG, WEBP or SVG (Max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="url"
                      name="poster"
                      required={!formData.poster}
                      value={formData.poster}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs focus:outline-none focus:border-[#6AB0E3]"
                    />
                  )}
                </div>
              </div>

              {/* Poster Presets & Live Image Preview */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#5B7B9C] font-semibold">Quick Poster Presets:</span>
                  {samplePosters.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, poster: p.url }));
                        setUploadMode('url');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[11px] text-[#0F2238] transition font-bold border border-[#C1E5FF] cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {formData.poster && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF] animate-fade-in">
                    <img
                      src={formData.poster}
                      alt="Poster Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#C1E5FF] shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0F2238]">Poster Ready for Upload</p>
                      <p className="text-[10px] text-[#5B7B9C] truncate">
                        {formData.poster.startsWith('data:') ? 'Local Image File Selected ✓' : formData.poster}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, poster: '' }))}
                      className="text-[11px] text-rose-600 font-bold hover:underline px-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain what students will learn, agenda, benefits, and why they should attend..."
                  className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] focus:outline-none focus:border-[#6AB0E3] text-xs leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Key Topics / Event Tracks (One per line)
                </label>
                <textarea
                  name="topics"
                  rows={3}
                  value={formData.topics}
                  onChange={handleChange}
                  placeholder="ATS Scoring Mechanics&#10;Google XYZ Bullet Point Formula&#10;Live 1-on-1 Resume Roasting"
                  className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] placeholder-[#5B7B9C] focus:outline-none focus:border-[#6AB0E3] text-xs leading-relaxed font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Date & Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#EAF6FF] pb-2">
              3. Date, Time & Venue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Start Time</label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  placeholder="09:30 AM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">End Time</label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  placeholder="04:30 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Venue / Hall *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Main Seminar Hall / Lab 4"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Organizing College / Club *</label>
                <input
                  type="text"
                  name="institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. Training & Placement Club / Paavai Engg"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">City / Mode *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="On-Campus / Online / Namakkal"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Registration Details & External Link */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF]">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#C1E5FF] pb-2">
              4. Registration & Direct Redirection Link
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Registration Fee (₹) — Set 0 for Free *
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  min="0"
                  required
                  value={formData.registrationFee}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C1E5FF] text-[#0F2238] font-mono font-bold text-xs focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Registration Deadline Date *
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  required
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">
                  Official Registration Link (Google Form / Portal) *
                </label>
                <input
                  type="url"
                  name="registrationUrl"
                  required
                  value={formData.registrationUrl}
                  onChange={handleChange}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Coordinator Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#EAF6FF] pb-2">
              5. Coordinator Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Coordinator Name</label>
                <input
                  type="text"
                  name="coordinatorName"
                  value={formData.coordinatorName}
                  onChange={handleChange}
                  placeholder="Harish Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Official Email</label>
                <input
                  type="email"
                  name="coordinatorEmail"
                  value={formData.coordinatorEmail}
                  onChange={handleChange}
                  placeholder="tnpclub@college.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="coordinatorPhone"
                  value={formData.coordinatorPhone}
                  onChange={handleChange}
                  placeholder="+91 94432 10987"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#EAF6FF]">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              className="px-5 py-3 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] text-xs font-bold transition border border-[#C1E5FF]"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white text-xs font-bold transition shadow-md shadow-[#6AB0E3]/25 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Opportunity to Hub'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
