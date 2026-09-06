import { api } from './apiClient';

export const eventService = {
  async fetchAllEvents(params = {}) {
    const res = await api.get('/events', params);
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  getAllEvents() {
    return [];
  },

  async fetchEventById(id) {
    const res = await api.get(`/events/${id}`);
    return res?.data || null;
  },

  isEventPast(event) {
    if (!event) return false;
    if (event.isPast !== undefined) return Boolean(event.isPast);
    const deadline = event.registrationDeadline || event.startDate;
    if (!deadline) return false;
    try {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
      return String(deadline).slice(0, 10) < today;
    } catch {
      return String(deadline).slice(0, 10) < new Date().toISOString().split('T')[0];
    }
  },

  getClubEvents(customList = [], includePast = false) {
    if (!Array.isArray(customList)) return [];
    return customList.filter(e => e && e.type === "club_event" && e.status !== "draft" && (includePast || !this.isEventPast(e)));
  },

  getExternalOpportunities(customList = [], includePast = false) {
    if (!Array.isArray(customList)) return [];
    return customList.filter(e => e && e.type === "external_opportunity" && e.status !== "draft" && (includePast || !this.isEventPast(e)));
  },

  async trackRegistrationClick(id) {
    try {
      await api.post(`/events/${id}/track-click`);
    } catch {
      // Non-blocking telemetry
    }
  },

  async trackEventView(id) {
    try {
      await api.post(`/events/${id}/track-view`);
    } catch {
      // Non-blocking telemetry
    }
  },

  async createEvent(eventData) {
    const res = await api.post('/events', eventData);
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to create event on server');
  },

  async updateEvent(id, updatedData) {
    const res = await api.put(`/events/${id}`, updatedData);
    if (res && res.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to update event on server');
  },

  async deleteEvent(id) {
    const res = await api.delete(`/events/${id}`);
    if (res && res.success !== false) {
      return true;
    }
    throw new Error(res?.message || 'Failed to delete event from server');
  },

  searchAndFilterEvents({ query = '', type = 'all', category = '', city = '', fee = 'all', sort = 'upcoming', timeline = 'active' }, customList = []) {
    let list = Array.isArray(customList) ? [...customList] : [];
    list = list.filter(e => e && e.status !== "draft");

    // Filter by Timeline (Active vs. Past)
    if (timeline === 'active') {
      list = list.filter(e => !this.isEventPast(e));
    } else if (timeline === 'past') {
      list = list.filter(e => this.isEventPast(e));
    }

    // Filter by Type
    if (type && type !== 'all') {
      list = list.filter(e => e.type === type);
    }

    // Filter by Category
    if (category && category !== 'all') {
      list = list.filter(e => e.category?.toLowerCase() === category.toLowerCase());
    }

    // Filter by Fee
    if (fee === 'free') {
      list = list.filter(e => !e.registrationFee || Number(e.registrationFee) === 0);
    } else if (fee === 'paid') {
      list = list.filter(e => Number(e.registrationFee) > 0);
    }

    // Filter by Query
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.institution && e.institution.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.tags && Array.isArray(e.tags) && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter by City
    if (city && city !== 'all') {
      list = list.filter(e => e.city?.toLowerCase() === city.toLowerCase());
    }

    // Sorting
    if (timeline === 'past' && sort === 'upcoming') {
      list.sort((a, b) => new Date(b.registrationDeadline || b.startDate) - new Date(a.registrationDeadline || a.startDate));
    } else if (sort === 'upcoming') {
      list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sort === 'popular' || sort === 'clicks') {
      list.sort((a, b) => (b.registrationClicks || 0) - (a.registrationClicks || 0));
    } else if (sort === 'views') {
      list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (sort === 'recently_added') {
      list.sort((a, b) => (String(b.id) > String(a.id) ? 1 : -1));
    }

    return list;
  }
};

export default eventService;
