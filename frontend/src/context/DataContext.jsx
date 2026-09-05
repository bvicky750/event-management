import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { odService } from '../services/odService';
import { registrationService } from '../services/registrationService';
import { attendanceService } from '../services/attendanceService';
import { storageService } from '../services/storageService';
import { api } from '../services/apiClient';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [odRequests, setOdRequests] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const { user } = useAuth();

  const refreshAll = useCallback(async () => {
    storageService.initStorage();
    // Initial sync from cached storage
    const cachedEvents = eventService.getAllEvents();
    if (cachedEvents && cachedEvents.length > 0) {
      setEvents(cachedEvents);
    }
    setOdRequests(odService.getAllODRequests());
    setRegistrations(registrationService.getAllRegistrations());
    setAttendance(attendanceService.getAllAttendance());
    setNotifications(storageService.getItem(storageService.KEYS.NOTIFICATIONS, []));

    // Fetch live database events directly from backend API
    try {
      const [fetchedEvents, fetchedOD, fetchedRegs, fetchedAtt] = await Promise.all([
        eventService.fetchAllEvents(),
        odService.fetchAllODRequests(),
        registrationService.fetchAllRegistrations(),
        attendanceService.fetchAllAttendance()
      ]);

      if (fetchedEvents && Array.isArray(fetchedEvents)) {
        setEvents(fetchedEvents);
        storageService.setItem(storageService.KEYS.EVENTS, fetchedEvents);
      }
      if (fetchedOD && Array.isArray(fetchedOD)) {
        setOdRequests(fetchedOD);
        storageService.setItem(storageService.KEYS.OD_REQUESTS, fetchedOD);
      }
      if (fetchedRegs && Array.isArray(fetchedRegs)) {
        setRegistrations(fetchedRegs);
        storageService.setItem(storageService.KEYS.REGISTRATIONS, fetchedRegs);
      }
      if (fetchedAtt && Array.isArray(fetchedAtt)) {
        setAttendance(fetchedAtt);
        storageService.setItem(storageService.KEYS.ATTENDANCE, fetchedAtt);
      }

      try {
        const notifRes = await api.get('/notifications');
        if (notifRes && notifRes.data) {
          setNotifications(notifRes.data);
          storageService.setItem(storageService.KEYS.NOTIFICATIONS, notifRes.data);
        }
      } catch (e) {}
    } catch (err) {
      console.warn('[DataContext] Background API sync error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions
  const applyForOD = useCallback(async (formData) => {
    const newReq = await odService.submitODRequest(formData);
    await refreshAll();
    showToast('OD request submitted successfully! Status: PENDING 🟡', 'success', 'OD Application Sent');
    return newReq;
  }, [refreshAll, showToast]);

  const approveOD = useCallback(async (requestId, staffName) => {
    const updated = await odService.approveODRequest(requestId, staffName || user?.name);
    await refreshAll();
    showToast(`OD Request approved for ${updated?.studentName}!`, 'success', 'OD Approved');
    return updated;
  }, [refreshAll, showToast, user]);

  const rejectOD = useCallback(async (requestId, reason, staffName) => {
    const updated = await odService.rejectODRequest(requestId, reason, staffName || user?.name);
    await refreshAll();
    showToast(`OD Request rejected with feedback sent to student.`, 'warning', 'OD Rejected');
    return updated;
  }, [refreshAll, showToast, user]);

  const registerForEvent = useCallback(async (regData) => {
    const newReg = await registrationService.registerForEvent(regData);
    await refreshAll();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`Registration confirmed! Pass ID: ${newReg.registrationNumber}`, 'success', 'Registration Successful');
    return newReg;
  }, [refreshAll, showToast]);

  const recordCheckInScan = useCallback(async (eventId, qrToken, staffName) => {
    const result = await attendanceService.recordScan(eventId, qrToken, staffName || user?.name);
    await refreshAll();
    if (result.success) {
      showToast(`✓ Check-in marked for ${result.student.studentName} (${result.student.registerNumber}) at ${result.checkInTime}`, 'success', 'Attendance Recorded');
    } else {
      showToast(result.message, 'error', 'Scan Error');
    }
    return result;
  }, [refreshAll, showToast, user]);

  const createEvent = useCallback(async (eventData) => {
    const newEv = await eventService.createEvent(eventData);
    await refreshAll();
    showToast(`Event "${newEv.title}" published successfully!`, 'success', 'Event Created');
    return newEv;
  }, [refreshAll, showToast]);

  const updateEvent = useCallback(async (id, data) => {
    const updated = await eventService.updateEvent(id, data);
    await refreshAll();
    showToast(`Event updated successfully!`, 'success');
    return updated;
  }, [refreshAll, showToast]);

  const deleteEvent = useCallback(async (id) => {
    await eventService.deleteEvent(id);
    await refreshAll();
    showToast('Event deleted', 'info');
  }, [refreshAll, showToast]);

  const trackRegistrationClick = useCallback((eventId) => {
    eventService.trackRegistrationClick(eventId);
    refreshAll();
  }, [refreshAll]);

  const trackEventView = useCallback((eventId) => {
    eventService.trackEventView(eventId);
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (e) {}

    const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    storageService.setItem(storageService.KEYS.NOTIFICATIONS, updated);
    setNotifications(updated);
  }, []);

  const markAllNotificationsRead = useCallback(async (role, userId) => {
    try {
      await api.put('/notifications/read-all');
    } catch (e) {}

    const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const updated = notifs.map(n => {
      if (n.recipientRole === role || n.recipientId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    storageService.setItem(storageService.KEYS.NOTIFICATIONS, updated);
    setNotifications(updated);
    showToast('All notifications marked as read', 'info');
  }, [showToast]);

  const resetAllData = useCallback(() => {
    storageService.resetAllToDefault();
  }, []);

  return (
    <DataContext.Provider
      value={{
        events,
        odRequests,
        registrations,
        attendance,
        notifications,
        loading,
        refreshAll,
        applyForOD,
        approveOD,
        rejectOD,
        registerForEvent,
        recordCheckInScan,
        createEvent,
        updateEvent,
        deleteEvent,
        trackRegistrationClick,
        trackEventView,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData
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
