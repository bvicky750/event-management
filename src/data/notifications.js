export const initialNotifications = [
  {
    id: "notif_001",
    recipientRole: "student",
    recipientId: "stud_001",
    title: "OD Request Approved! 🎉",
    message: "Your On-Duty (OD) application for CODEFEST 2026 has been approved by Dr. K. Ramanathan. You may now proceed with final registration.",
    type: "success",
    timestamp: "2026-08-15 02:15 PM",
    read: false,
    link: "/student/od"
  },
  {
    id: "notif_002",
    recipientRole: "student",
    recipientId: "stud_001",
    title: "Registration Confirmed 🎟️",
    message: "Registration for CODEFEST 2026 is confirmed. Your Pass ID is REG-DEMO-2026-001.",
    type: "info",
    timestamp: "2026-08-15 03:30 PM",
    read: true,
    link: "/student/registrations/reg_001"
  },
  {
    id: "notif_003",
    recipientRole: "student",
    recipientId: "stud_001",
    title: "New Featured Event: TECHFINIX'26",
    message: "National level symposium TECHFINIX'26 is open for On-Duty applications and registration.",
    type: "announcement",
    timestamp: "2026-08-16 09:00 AM",
    read: false,
    link: "/events/evt_1"
  },
  {
    id: "notif_004",
    recipientRole: "staff",
    recipientId: "staff_001",
    title: "New OD Request Pending Review",
    message: "Ananya S (23IT042) submitted an OD request for TECHFINIX'26.",
    type: "action_required",
    timestamp: "2026-08-16 04:45 PM",
    read: false,
    link: "/staff/od"
  },
  {
    id: "notif_005",
    recipientRole: "staff",
    recipientId: "staff_001",
    title: "Registration Milestone",
    message: "TECHFINIX'26 has crossed 140 registered participants!",
    type: "info",
    timestamp: "2026-08-16 06:00 PM",
    read: true,
    link: "/staff/events/evt_1/registrations"
  }
];
