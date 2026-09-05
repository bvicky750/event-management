import { api } from './apiClient';
import { storageService } from './storageService';

export const eventService = {
  async fetchAllEvents(params = {}) {
    try {
      const res = await api.get('/events', params);
      if (res && res.data && Array.isArray(res.data)) {
        storageService.setItem(storageService.KEYS.EVENTS, res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('[EventService] Fetch events API failed, using cached events:', err.message);
    }
    return this.getAllEvents();
  },

  getAllEvents() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.EVENTS, []);
  },

  async fetchEventById(id) {
    try {
      const res = await api.get(`/events/${id}`);
      if (res && res.data) {
        // Also update or insert in local cache
        const events = this.getAllEvents();
        const index = events.findIndex(e => String(e.id) === String(id));
        if (index !== -1) {
          events[index] = res.data;
        } else {
          events.push(res.data);
        }
        storageService.setItem(storageService.KEYS.EVENTS, events);
        return res.data;
      }
    } catch (err) {
      console.warn(`[EventService] Fetch event ${id} API failed, checking cache:`, err.message);
    }
    return this.getEventById(id);
  },

  getEventById(id) {
    const events = this.getAllEvents();
    return events.find(e => String(e.id) === String(id) || String(e.id) === `evt_${id}` || String(e.id) === `tp_evt_${id}` || String(e.id) === `ext_evt_${id}`) || null;
  },

  getClubEvents(customList = null) {
    const list = Array.isArray(customList) ? customList : this.getAllEvents();
    return list.filter(e => e.type === "club_event" && e.status !== "draft");
  },

  getExternalOpportunities(customList = null) {
    const list = Array.isArray(customList) ? customList : this.getAllEvents();
    return list.filter(e => e.type === "external_opportunity" && e.status !== "draft");
  },

  async trackRegistrationClick(id) {
    try {
      await api.post(`/events/${id}/track-click`);
    } catch (e) {
      // Local fallback
    }

    const events = this.getAllEvents();
    const index = events.findIndex(e => String(e.id) === String(id));
    if (index !== -1) {
      events[index] = {
        ...events[index],
        registrationClicks: (events[index].registrationClicks || 0) + 1
      };
      storageService.setItem(storageService.KEYS.EVENTS, events);
      return events[index].registrationClicks;
    }
    return 0;
  },

  async trackEventView(id) {
    try {
      await api.post(`/events/${id}/track-view`);
    } catch (e) {
      // Local fallback
    }

    const events = this.getAllEvents();
    const index = events.findIndex(e => String(e.id) === String(id));
    if (index !== -1) {
      events[index] = {
        ...events[index],
        viewsCount: (events[index].viewsCount || 0) + 1
      };
      storageService.setItem(storageService.KEYS.EVENTS, events);
      return events[index].viewsCount;
    }
    return 0;
  },

  async createEvent(eventData) {
    try {
      const res = await api.post('/events', eventData);
      if (res && res.data) {
        const events = this.getAllEvents();
        storageService.setItem(storageService.KEYS.EVENTS, [res.data, ...events]);
        return res.data;
      }
    } catch (err) {
      console.warn('[EventService] Create event API failed, saving locally:', err.message);
    }

    // Local fallback
    const events = this.getAllEvents();
    const newId = eventData.type === "club_event" ? `tp_evt_${Date.now()}` : `ext_evt_${Date.now()}`;
    const newEvent = {
      id: newId,
      type: eventData.type || "club_event",
      viewsCount: 1,
      registrationClicks: 0,
      status: eventData.status || "published",
      featured: false,
      tags: [eventData.category || "Opportunity"],
      ...eventData
    };
    const updated = [newEvent, ...events];
    storageService.setItem(storageService.KEYS.EVENTS, updated);
    return newEvent;
  },

  async updateEvent(id, updatedData) {
    try {
      const res = await api.put(`/events/${id}`, updatedData);
      if (res && res.data) {
        const events = this.getAllEvents();
        const index = events.findIndex(e => String(e.id) === String(id));
        if (index !== -1) {
          events[index] = res.data;
          storageService.setItem(storageService.KEYS.EVENTS, events);
        }
        return res.data;
      }
    } catch (err) {
      console.warn(`[EventService] Update event ${id} API failed, updating locally:`, err.message);
    }

    const events = this.getAllEvents();
    const index = events.findIndex(e => String(e.id) === String(id));
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedData };
      storageService.setItem(storageService.KEYS.EVENTS, events);
      return events[index];
    }
    return null;
  },

  async deleteEvent(id) {
    try {
      await api.delete(`/events/${id}`);
    } catch (err) {
      console.warn(`[EventService] Delete event ${id} API failed, deleting locally:`, err.message);
    }

    const events = this.getAllEvents();
    const updated = events.filter(e => String(e.id) !== String(id));
    storageService.setItem(storageService.KEYS.EVENTS, updated);
    return true;
  },

  searchAndFilterEvents({ query = '', type = 'all', category = '', city = '', fee = 'all', sort = 'upcoming' }, customList = null) {
    let list = Array.isArray(customList) ? [...customList] : this.getAllEvents();
    list = list.filter(e => e && e.status !== "draft");

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
      list = list.filter(e => !e.registrationFee || e.registrationFee === 0);
    } else if (fee === 'paid') {
      list = list.filter(e => e.registrationFee && e.registrationFee > 0);
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
    if (sort === 'upcoming') {
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
