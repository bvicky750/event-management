import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const { isStaff } = useAuth();

  const refreshEvents = useCallback(async () => {
    try {
      const fetchedEvents = await eventService.fetchAllEvents({ includeDrafts: isStaff });
      if (fetchedEvents && Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch events:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

  const refreshRegistrations = useCallback(async (eventId = null) => {
    if (!isStaff && !eventId) return;
    try {
      if (eventId) {
        const list = await registrationService.fetchRegistrationsByEvent(eventId);
        return list;
      } else {
        const list = await registrationService.fetchAllRegistrations();
        setRegistrations(list);
        return list;
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch registrations:', err.message);
      return [];
    }
  }, [isStaff]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  // Event actions
  const createEvent = useCallback(async (eventData) => {
    try {
      const created = await eventService.createEvent(eventData);
      await refreshEvents();
      showToast(`"${created.title}" posted successfully!`, 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
      throw err;
    }
  }, [refreshEvents, showToast]);

  const updateEvent = useCallback(async (id, updatedData) => {
    try {
      const updated = await eventService.updateEvent(id, updatedData);
      await refreshEvents();
      showToast(`Updated "${updated.title}" successfully!`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
      throw err;
    }
  }, [refreshEvents, showToast]);

  const deleteEvent = useCallback(async (id) => {
    try {
      await eventService.deleteEvent(id);
      await refreshEvents();
      showToast('Opportunity deleted successfully.', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
      throw err;
    }
  }, [refreshEvents, showToast]);

  // Public Student Registration
  const registerForEvent = useCallback(async (registrationData) => {
    try {
      const reg = await registrationService.registerForEvent(registrationData);

      // Trigger celebratory confetti for confirmed registration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(
        `Registration confirmed! ID: ${reg.registrationNumber}`,
        'success',
        'Registered Successfully'
      );

      await refreshEvents();
      return reg;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  }, [refreshEvents, showToast]);

  const trackEventView = useCallback((id) => {
    eventService.trackEventView(id);
  }, []);

  const trackRegistrationClick = useCallback((id) => {
    eventService.trackRegistrationClick(id);
  }, []);

  return (
    <DataContext.Provider
      value={{
        events,
        registrations,
        loading,
        refreshEvents,
        refreshRegistrations,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        trackEventView,
        trackRegistrationClick
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

export default DataContext;
