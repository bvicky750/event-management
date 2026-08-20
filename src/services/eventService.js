import { storageService } from './storageService';
import { initialEvents } from '../data/events';

export const eventService = {
  getAllEvents() {
    storageService.initStorage();
    return storageService.getItem(storageService.KEYS.EVENTS, initialEvents);
  },

  getEventById(id) {
    const events = this.getAllEvents();
    return events.find(e => String(e.id) === String(id)) || null;
  },

  getClubEvents() {
    return this.getAllEvents().filter(e => e.type === "club_event" && e.status !== "draft");
  },

  getExternalOpportunities() {
    return this.getAllEvents().filter(e => e.type === "external_opportunity" && e.status !== "draft");
  },

  trackRegistrationClick(id) {
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

  trackEventView(id) {
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

  createEvent(eventData) {
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

  updateEvent(id, updatedData) {
    const events = this.getAllEvents();
    const index = events.findIndex(e => String(e.id) === String(id));
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedData };
      storageService.setItem(storageService.KEYS.EVENTS, events);
      return events[index];
    }
    return null;
  },

  deleteEvent(id) {
    const events = this.getAllEvents();
    const updated = events.filter(e => String(e.id) !== String(id));
    storageService.setItem(storageService.KEYS.EVENTS, updated);
    return true;
  },

  searchAndFilterEvents({ query = '', type = 'all', category = '', city = '', fee = 'all', sort = 'upcoming' }) {
    let list = this.getAllEvents().filter(e => e.status !== "draft");

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
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.institution && e.institution.toLowerCase().includes(q)) ||
        (e.category && e.category.toLowerCase().includes(q)) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
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
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return list;
  }
};
