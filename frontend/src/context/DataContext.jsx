import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { odService } from '../services/odService';
import { registrationService } from '../services/registrationService';
import { attendanceService } from '../services/attendanceService';
import { storageService } from '../services/storageService';
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

  const refreshAll = useCallback(() => {
    storageService.initStorage();
    setEvents(eventService.getAllEvents());
    setOdRequests(odService.getAllODRequests());
    setRegistrations(registrationService.getAllRegistrations());
    setAttendance(attendanceService.getAllAttendance());
    setNotifications(storageService.getItem(storageService.KEYS.NOTIFICATIONS, []));
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions
  const applyForOD = useCallback((formData) => {
    const newReq = odService.submitODRequest(formData);
    refreshAll();
    showToast('OD request submitted successfully! Status: PENDING 🟡', 'success', 'OD Application Sent');
    return newReq;
  }, [refreshAll, showToast]);

  const approveOD = useCallback((requestId, staffName) => {
    const updated = odService.approveODRequest(requestId, staffName || user?.name);
    refreshAll();
    showToast(`OD Request approved for ${updated?.studentName}!`, 'success', 'OD Approved');
    return updated;
  }, [refreshAll, showToast, user]);

  const rejectOD = useCallback((requestId, reason, staffName) => {
    const updated = odService.rejectODRequest(requestId, reason, staffName || user?.name);
    refreshAll();
    showToast(`OD Request rejected with feedback sent to student.`, 'warning', 'OD Rejected');
    return updated;
  }, [refreshAll, showToast, user]);

  const registerForEvent = useCallback((regData) => {
    const newReg = registrationService.registerForEvent(regData);
    refreshAll();
    // trigger celebration confetti
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

  const recordCheckInScan = useCallback((eventId, qrToken, staffName) => {
    const result = attendanceService.recordScan(eventId, qrToken, staffName || user?.name);
    refreshAll();
    if (result.success) {
      showToast(`✓ Check-in marked for ${result.student.studentName} (${result.student.registerNumber}) at ${result.checkInTime}`, 'success', 'Attendance Recorded');
    } else {
      showToast(result.message, 'error', 'Scan Error');
    }
    return result;
  }, [refreshAll, showToast, user]);

  const createEvent = useCallback((eventData) => {
    const newEv = eventService.createEvent(eventData);
    refreshAll();
    showToast(`Event "${newEv.title}" published successfully!`, 'success', 'Event Created');
    return newEv;
  }, [refreshAll, showToast]);

  const updateEvent = useCallback((id, data) => {
    const updated = eventService.updateEvent(id, data);
    refreshAll();
    showToast(`Event updated successfully!`, 'success');
    return updated;
  }, [refreshAll, showToast]);

  const deleteEvent = useCallback((id) => {
    eventService.deleteEvent(id);
    refreshAll();
    showToast('Event deleted', 'info');
  }, [refreshAll, showToast]);

  const trackRegistrationClick = useCallback((eventId) => {
    eventService.trackRegistrationClick(eventId);
    refreshAll();
  }, [refreshAll]);

  const trackEventView = useCallback((eventId) => {
    eventService.trackEventView(eventId);
  }, []);

  const markNotificationRead = useCallback((id) => {
    const notifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    storageService.setItem(storageService.KEYS.NOTIFICATIONS, updated);
    setNotifications(updated);
  }, []);

  const markAllNotificationsRead = useCallback((role, userId) => {
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
