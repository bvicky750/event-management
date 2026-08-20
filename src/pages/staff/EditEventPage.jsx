import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Tag,
  Link2
} from 'lucide-react';

export const EditEventPage = () => {
  const { id } = useParams();
  const { events, updateEvent } = useData();
  const navigate = useNavigate();

  const existingEvent = events.find(e => String(e.id) === String(id));

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    poster: '',
    type: 'club_event',
    category: 'Career',
    startDate: '',
    endDate: '',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    venue: '',
    institution: '',
    city: '',
    registrationFee: 0,
    registrationDeadline: '',
    registrationUrl: '',
    eligibility: '',
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPhone: '',
    topics: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title || '',
        subtitle: existingEvent.subtitle || '',
        description: existingEvent.description || '',
        poster: existingEvent.poster || '',
        type: existingEvent.type || 'club_event',
        category: existingEvent.category || 'Career',
        startDate: existingEvent.startDate || '',
        endDate: existingEvent.endDate || '',
        startTime: existingEvent.startTime || '09:30 AM',
        endTime: existingEvent.endTime || '04:30 PM',
        venue: existingEvent.venue || '',
        institution: existingEvent.institution || '',
        city: existingEvent.city || '',
        registrationFee: existingEvent.registrationFee || 0,
        registrationDeadline: existingEvent.registrationDeadline || '',
        registrationUrl: existingEvent.registrationUrl || '',
        eligibility: existingEvent.eligibility || '',
        coordinatorName: existingEvent.coordinator?.name || '',
        coordinatorEmail: existingEvent.coordinator?.email || '',
        coordinatorPhone: existingEvent.coordinator?.phone || '',
        topics: existingEvent.topics ? existingEvent.topics.join('\n') : ''
      });
    }
  }, [existingEvent]);

  if (!existingEvent) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0F2238]">Opportunity not found</h2>
        <Link to="/staff/dashboard" className="text-xs text-[#6AB0E3] hover:underline font-bold">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const topicsArray = formData.topics
      ? formData.topics.split('\n').map(t => t.trim()).filter(Boolean)
      : [];

    const updatedData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      poster: formData.poster,
      type: formData.type,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue,
      institution: formData.institution,
      city: formData.city,
      registrationFee: Number(formData.registrationFee) || 0,
      registrationDeadline: formData.registrationDeadline,
      registrationUrl: formData.registrationUrl,
      eligibility: formData.eligibility,
      coordinator: {
        name: formData.coordinatorName,
        email: formData.coordinatorEmail,
        phone: formData.coordinatorPhone
      },
      topics: topicsArray
    };

    setTimeout(() => {
      updateEvent(existingEvent.id, updatedData);
      setIsSubmitting(false);
      navigate('/staff/dashboard');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/staff/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7B9C] hover:text-[#0F2238] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#6AB0E3]" />
          <span>Back to Organizer Dashboard</span>
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-[#C1E5FF] p-6 sm:p-10 shadow-sky-card space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#6AB0E3] text-xs font-mono font-bold uppercase border border-[#C1E5FF]">
            Edit Opportunity
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display tracking-tight mt-2">
            Modify Opportunity Details
          </h1>
          <p className="text-xs sm:text-sm text-[#5B7B9C] mt-1 font-medium">
            Update deadlines, external registration links, or venue details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          {/* Section 1: Type */}
          <div className="space-y-3 p-5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF]">
            <label className="block text-xs font-bold text-[#0F2238] uppercase tracking-wider font-mono">
              1. Opportunity Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.type === 'club_event'
                    ? 'bg-white border-[#6AB0E3] text-[#0F2238] shadow-sm'
                    : 'bg-white/60 border-[#C1E5FF] text-[#1E3A5F]'
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
                  <span className="text-xs text-[#5B7B9C] block mt-0.5 font-medium">
                    Organized directly by our Training & Placement Club.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  formData.type === 'external_opportunity'
                    ? 'bg-white border-[#9CD5FF] text-[#0F2238] shadow-sm'
                    : 'bg-white/60 border-[#C1E5FF] text-[#1E3A5F]'
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
                  <span className="text-xs text-[#5B7B9C] block mt-0.5 font-medium">
                    Discovered from other engineering colleges or organizations.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#EAF6FF] pb-2">
              2. Opportunity Info
            </h3>

            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">Opportunity Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
              />
            </div>

            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">Tagline / Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-medium focus:outline-none focus:border-[#6AB0E3]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Domain / Category *</label>
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
                </select>
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Poster URL *</label>
                <input
                  type="url"
                  name="poster"
                  required
                  value={formData.poster}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#0F2238] font-bold mb-1.5">Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs leading-relaxed font-medium focus:outline-none focus:border-[#6AB0E3]"
              />
            </div>
          </div>

          {/* Section 3: Date & Venue */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#EAF6FF] pb-2">
              3. Date & Venue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <label className="block text-[#0F2238] font-bold mb-1.5">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Registration Link */}
          <div className="space-y-4 p-5 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF]">
            <h3 className="text-sm font-bold text-[#0F2238] uppercase tracking-wider font-mono border-b border-[#C1E5FF] pb-2">
              4. Registration Link & Fee
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Registration Fee (₹)</label>
                <input
                  type="number"
                  name="registrationFee"
                  min="0"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C1E5FF] text-[#0F2238] font-mono text-xs focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>

              <div>
                <label className="block text-[#0F2238] font-bold mb-1.5">Deadline *</label>
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
                <label className="block text-[#0F2238] font-bold mb-1.5">Official Registration URL *</label>
                <input
                  type="url"
                  name="registrationUrl"
                  required
                  value={formData.registrationUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C1E5FF] text-[#0F2238] text-xs font-semibold focus:outline-none focus:border-[#6AB0E3]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#EAF6FF]">
            <Link
              to="/staff/dashboard"
              className="px-5 py-3 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] font-bold text-xs transition border border-[#C1E5FF]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#6AB0E3] hover:bg-[#559FD4] text-white font-bold text-xs transition shadow-md shadow-[#6AB0E3]/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
