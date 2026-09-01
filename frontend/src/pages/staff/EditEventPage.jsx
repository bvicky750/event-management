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
  Link2,
  Upload
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
      navigate('/staff/events');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/staff/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5B7B9C] hover:text-[#0F2238] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#6AB0E3]" />
          <span>Back to My Posted Events</span>
        </Link>
      </div>

      <div className="clay-card p-6 sm:p-10 space-y-8">
        <div>
          <span className="clay-badge px-3 py-1 text-xs font-mono font-bold uppercase">
            Faculty Event Editor
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2238] font-display tracking-tight mt-2">
            Edit Posted Event Details
          </h1>
          <p className="text-xs sm:text-sm text-[#5B7B9C] mt-1 font-medium">
            Update deadlines, venue allocations, external forms, or coordinator details for your event.
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[#0F2238] font-bold">Poster Image *</label>
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
                ) : (
                  <input
                    type="url"
                    name="poster"
                    required={!formData.poster}
                    value={formData.poster}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#EAF6FF] border border-[#C1E5FF] text-[#0F2238] text-xs focus:outline-none focus:border-[#6AB0E3]"
                  />
                )}

                {formData.poster && (
                  <div className="flex items-center gap-3 p-3 mt-2 rounded-2xl bg-[#EAF6FF] border border-[#C1E5FF]">
                    <img
                      src={formData.poster}
                      alt="Poster Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-[#C1E5FF] shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0F2238]">Poster Image Ready</p>
                      <p className="text-[10px] text-[#5B7B9C] truncate">
                        {formData.poster.startsWith('data:') ? 'Local Image File Uploaded ✓' : formData.poster}
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
              to="/staff/events"
              className="px-5 py-3 rounded-xl bg-[#EAF6FF] hover:bg-[#C1E5FF] text-[#0F2238] font-bold text-xs transition border border-[#C1E5FF]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn-primary px-6 py-3 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
