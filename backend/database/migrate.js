import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { getSeedData } from './seeds.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tp_club',
  multipleStatements: true,
  dateStrings: true
};

async function runMigration() {
  console.log('==================================================');
  console.log('  T&P Club Event Management — Database Setup');
  console.log('==================================================');
  console.log(`Connecting to MySQL server at ${dbConfig.host}:${dbConfig.port} as "${dbConfig.user}"...`);

  let connection;
  try {
    // Step 1: Connect to server without database to ensure database exists
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });

    console.log(`✓ Connected to MySQL server`);

    // Step 2: Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci`);
    console.log(`✓ Database "${dbConfig.database}" ensured`);

    await connection.changeUser({ database: dbConfig.database });
    console.log(`✓ Switched to database "${dbConfig.database}"`);

    // Step 3: Run schema.sql DDL
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log(`✓ Schema applied successfully (Tables: users, events, registrations, attendance, od_requests, notifications, past_participation)`);
    }

    // Step 4: Check if users table is populated, if not seed initial data
    const [userRows] = await connection.query('SELECT COUNT(*) AS count FROM users');
    const userCount = userRows[0]?.count || 0;

    if (userCount === 0) {
      console.log('Seeding initial development data...');
      const { users } = getSeedData();

      // Seed Users
      for (const u of users) {
        await connection.query(
          `INSERT INTO users (
            id, name, email, password_hash, role, department, phone, college,
            avatar, register_number, year, semester, section, cgpa,
            attendance_percentage, employee_id, designation, cabin, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = VALUES(name)`,
          [
            u.id, u.name, u.email, u.password_hash, u.role, u.department, u.phone, u.college,
            u.avatar, u.register_number, u.year, u.semester, u.section, u.cgpa,
            u.attendance_percentage, u.employee_id, u.designation, u.cabin, u.status
          ]
        );
      }
      console.log(`✓ Seeded ${users.length} initial user accounts (Students & Staff)`);

      // Seed Initial Events
      const initialEvents = [
        {
          id: "tp_evt_1",
          title: "Resume Building & ATS Optimization Workshop",
          subtitle: "Craft a high-converting tech resume that passes corporate Applicant Tracking Systems",
          type: "club_event",
          category: "Career",
          description: "Hands-on workshop organized by the T&P Club. Learn the exact resume formats preferred by Tier-1 product and service companies, keyword mapping, action-verb formulas, and get your resume live-reviewed by our senior mentors.",
          full_description: "A strong resume is your entry ticket to placement drives. In this 3-hour intensive session, the Training & Placement Club breaks down modern ATS parsing algorithms, common formatting mistakes that get applications rejected, and real before/after resume transformation case studies. Bring your draft resume or laptop for live peer review and personalized feedback.",
          poster: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-25",
          end_date: "2026-08-25",
          start_time: "02:00 PM",
          end_time: "05:00 PM",
          venue: "Main Seminar Hall (Block 2)",
          city: "On-Campus",
          institution: "Training & Placement Club",
          department: "T&P Club Student Council",
          registration_fee: 0,
          registration_deadline: "2026-08-24",
          registration_url: "https://forms.google.com/d/e/1FAIpQLSe-demo-resume-workshop/viewform",
          views_count: 482,
          registration_clicks: 164,
          status: "published",
          featured: 1,
          eligibility: "Open to 2nd, 3rd & Final Year students across all branches",
          created_by: "staff_001",
          coordinator_name: "Harish Kumar (T&P Student Head)",
          coordinator_email: "tnp.resume@college.edu",
          coordinator_phone: "+91 98765 11223",
          topics: JSON.stringify([
            "ATS Scoring Mechanics & Common Traps",
            "Writing Impactful Bullet Points with Google XYZ Formula",
            "Structuring Projects, Open-Source & Internships",
            "Live 1-on-1 Resume Roasting & Formatting"
          ]),
          tags: JSON.stringify(["Resume", "Placement", "ATS", "Career", "Free"]),
          activities: JSON.stringify([]),
          od_config: JSON.stringify({ available: true, requiresApproval: true, eligibleYears: ["2nd Year", "3rd Year", "Final Year"], maxDays: 1 })
        },
        {
          id: "tp_evt_2",
          title: "Mock Technical & HR Interview Sprint",
          subtitle: "Simulated company interview rounds with feedback from placed alumni & faculty",
          type: "club_event",
          category: "Placement",
          description: "Experience realistic 1-on-1 technical coding interviews and HR behavioral rounds. Receive comprehensive scoring sheets and pinpoint areas for improvement before real placement drives begin.",
          full_description: "Prepare for high-pressure corporate interviews in a safe, constructive environment. The T&P Club brings alumni working at top tech firms (Amazon, Zoho, TCS Digital, Cognizant) along with experienced faculty to conduct mock rounds spanning DSA problem solving, resume deep-dives, and situational HR queries.",
          poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-28",
          end_date: "2026-08-28",
          start_time: "09:30 AM",
          end_time: "04:30 PM",
          venue: "T&P Training Center (3rd Floor)",
          city: "On-Campus",
          institution: "Training & Placement Club",
          department: "T&P Club Career Cell",
          registration_fee: 0,
          registration_deadline: "2026-08-27",
          registration_url: "https://forms.google.com/d/e/1FAIpQLSe-demo-mock-interview/viewform",
          views_count: 630,
          registration_clicks: 215,
          status: "published",
          featured: 1,
          eligibility: "3rd & Final Year registered placement candidates",
          created_by: "staff_001",
          coordinator_name: "Dr. K. Ramanathan & Placement Team",
          coordinator_email: "tnp.interviews@college.edu",
          coordinator_phone: "+91 94432 10987",
          topics: JSON.stringify([
            "Live Data Structures & Algorithmic Problem Solving",
            "Core CS Fundamentals (DBMS, OS, Networks, OOPs)",
            "HR Behavioral Questions (STAR Method)",
            "Detailed Performance Scorecard & Feedback"
          ]),
          tags: JSON.stringify(["Mock Interview", "Placement", "HR Round", "DSA", "On-Campus"]),
          activities: JSON.stringify([]),
          od_config: JSON.stringify({ available: true, requiresApproval: true, eligibleYears: ["3rd Year", "Final Year"], maxDays: 1 })
        },
        {
          id: "tp_evt_3",
          title: "Aptitude Challenge #04 — Speed & Logic Battle",
          subtitle: "Weekly online diagnostic challenge covering quantitative, logical, and verbal tracks",
          type: "club_event",
          category: "Aptitude",
          description: "Test your speed and accuracy against your batchmates. Weekly 45-minute timed test featuring company-pattern questions from AMCAT, CoCubes, eLitmus, and TCS NQT.",
          full_description: "Aptitude round is the first filter in 90% of on-campus placement drives. T&P Club conducts this weekly challenge to build your test stamina and speed. Detailed video solutions, ranking leaderboards, and accuracy analytics will be shared immediately after the challenge concludes.",
          poster: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-30",
          end_date: "2026-08-30",
          start_time: "07:00 PM",
          end_time: "08:00 PM",
          venue: "Online Portal / Hackerrank",
          city: "Online",
          institution: "Training & Placement Club",
          department: "T&P Aptitude Training Wing",
          registration_fee: 0,
          registration_deadline: "2026-08-30",
          registration_url: "https://hackerrank.com/tnp-aptitude-04-demo",
          views_count: 710,
          registration_clicks: 340,
          status: "published",
          featured: 0,
          eligibility: "All engineering batches and branches",
          created_by: "staff_001",
          coordinator_name: "Sneha M (Aptitude Coordinator)",
          coordinator_email: "aptitude.tnp@college.edu",
          coordinator_phone: "+91 98421 99887",
          topics: JSON.stringify([
            "Quantitative Aptitude (Time & Work, Percentages, Probability)",
            "Logical Reasoning (Puzzles, Blood Relations, Syllogisms)",
            "Verbal Ability (Error Spotting, Reading Comprehension)"
          ]),
          tags: JSON.stringify(["Aptitude", "Online Challenge", "TCS NQT", "Practice", "Free"]),
          activities: JSON.stringify([]),
          od_config: JSON.stringify({ available: false, requiresApproval: false, eligibleYears: [], maxDays: 0 })
        },
        {
          id: "ext_evt_1",
          title: "TECHFINIX'26 — National Level Technical Symposium",
          subtitle: "Flagship annual symposium featuring AI hackathons, paper presentations, and edge computing",
          type: "external_opportunity",
          category: "Symposium",
          description: "Two-day national symposium hosted by the Department of CSE (AI & ML) at Paavai Engineering College. Over 1,500 students from 80+ engineering institutions participate in technical challenges with cash prizes over ₹50,000.",
          full_description: "TECHFINIX'26 is one of the region's largest student technical festivals. Features 5 competitive tracks including AI Vision Craft (OpenCV/PyTorch model deployment), National Paper Presentation, AI Tri Quest coding relay, Edge AI Masterclass, and fun technical mini-games. Great networking opportunity and external certificate recognition.",
          poster: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-09-10",
          end_date: "2026-09-11",
          start_time: "09:00 AM",
          end_time: "04:30 PM",
          venue: "Main Auditorium & Labs",
          city: "Namakkal",
          institution: "Paavai Engineering College",
          department: "Department of CSE (AI & ML)",
          registration_fee: 250,
          registration_deadline: "2026-09-05",
          registration_url: "https://techfinix26.paavai.edu.in/register",
          views_count: 890,
          registration_clicks: 312,
          status: "published",
          featured: 1,
          eligibility: "Engineering students from all accredited colleges and universities",
          created_by: "staff_002",
          coordinator_name: "Prof. N. Sivakumar (Convenor)",
          coordinator_email: "techfinix2026@paavai.edu.in",
          coordinator_phone: "+91 94432 99881",
          topics: JSON.stringify([
            "AI Vision Craft (Live Computer Vision Challenge)",
            "National Paper Presentation on GenAI & Cloud",
            "AI Tri-Quest Speed Coding Challenge",
            "Edge AI & Embedded Machine Learning Session"
          ]),
          tags: JSON.stringify(["Symposium", "AI", "External", "Cash Prizes", "Namakkal"]),
          activities: JSON.stringify([
            { name: "Paper Presentation", fee: 150 },
            { name: "AI Vision Craft", fee: 200 }
          ]),
          od_config: JSON.stringify({ available: true, requiresApproval: true, eligibleYears: ["2nd Year", "3rd Year", "Final Year"], maxDays: 2 })
        },
        {
          id: "ext_evt_2",
          title: "CODEFEST 2026 — 24-Hour State Level Hackathon",
          subtitle: "24-Hour non-stop product building sprint with industry mentors and cash prizes",
          type: "external_opportunity",
          category: "Hackathon",
          description: "Build innovative software and hardware prototypes in a 24-hour non-stop hackathon. Problem statements cover Smart Healthcare, FinTech, Autonomous Mobility, and Climate Tech.",
          full_description: "CodeFest 2026 provides full high-speed lab connectivity, hardware sensor kits, cloud credits from AWS, and on-site mentors from startup founders. Top 3 teams win cash awards of ₹1,00,000 along with direct internship interview opportunities with partner firms.",
          poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-25",
          end_date: "2026-08-26",
          start_time: "10:00 AM",
          end_time: "10:00 AM (Next Day)",
          venue: "KSR Convention Center",
          city: "Tiruchengode",
          institution: "KSR College of Engineering",
          department: "Information Technology & Innovation Cell",
          registration_fee: 300,
          registration_deadline: "2026-08-24",
          registration_url: "https://codefest2026.ksrce.ac.in",
          views_count: 780,
          registration_clicks: 245,
          status: "published",
          featured: 1,
          eligibility: "Teams of 2–4 students from any branch or year",
          created_by: "staff_002",
          coordinator_name: "Prof. S. Meenakshi & Student Leads",
          coordinator_email: "codefest2026@ksrce.ac.in",
          coordinator_phone: "+91 98421 65432",
          topics: JSON.stringify([
            "24-Hour End-to-End Prototype Development",
            "1-on-1 Mentorship & Architecture Reviews",
            "Pitch Deck Presentation to VC Jury",
            "Networking with Regional Tech Communities"
          ]),
          tags: JSON.stringify(["Hackathon", "24-Hours", "External", "Cash Prize ₹1L", "Tiruchengode"]),
          activities: JSON.stringify([
            { name: "24-Hour Prototype Sprint", fee: 300 }
          ]),
          od_config: JSON.stringify({ available: true, requiresApproval: true, eligibleYears: ["2nd Year", "3rd Year", "Final Year"], maxDays: 2 })
        }
      ];

      for (const ev of initialEvents) {
        await connection.query(
          `INSERT INTO events (
            id, title, subtitle, type, category, description, full_description, poster,
            start_date, end_date, start_time, end_time, venue, city, institution, department,
            registration_fee, registration_deadline, registration_url, views_count, registration_clicks,
            status, featured, eligibility, created_by, coordinator_name, coordinator_email,
            coordinator_phone, topics, tags, activities, od_config
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          [
            ev.id, ev.title, ev.subtitle, ev.type, ev.category, ev.description, ev.full_description, ev.poster,
            ev.start_date, ev.end_date, ev.start_time, ev.end_time, ev.venue, ev.city, ev.institution, ev.department,
            ev.registration_fee, ev.registration_deadline, ev.registration_url, ev.views_count, ev.registration_clicks,
            ev.status, ev.featured, ev.eligibility, ev.created_by, ev.coordinator_name, ev.coordinator_email,
            ev.coordinator_phone, ev.topics, ev.tags, ev.activities, ev.od_config
          ]
        );
      }
      console.log(`✓ Seeded ${initialEvents.length} initial opportunities & events`);

      // Seed Initial Registrations
      const initialRegistrations = [
        {
          id: "reg_001",
          registration_number: "REG-DEMO-2026-001",
          student_id: "stud_001",
          student_name: "Vignesh B",
          register_number: "23CSE001",
          department: "Computer Science and Engineering",
          email: "student@college.edu",
          phone: "+91 98765 43210",
          event_id: "ext_evt_2",
          event_title: "CODEFEST 2026 — 24-Hour State Level Hackathon",
          college: "KSR College of Engineering",
          venue: "KSR Convention Center, Tiruchengode",
          event_dates: "2026-08-25 - 2026-08-26",
          activities: JSON.stringify(["24-Hour Prototype Sprint"]),
          amount_paid: 300,
          payment_status: "PAID",
          registration_date: "2026-08-15 03:30 PM",
          qr_code_token: "REG-DEMO-2026-001",
          status: "CONFIRMED",
          attendance_status: "NOT_CHECKED_IN",
          check_in_time: null
        },
        {
          id: "reg_002",
          registration_number: "REG-DEMO-2026-002",
          student_id: "stud_002",
          student_name: "Ananya S",
          register_number: "23IT042",
          department: "Information Technology",
          email: "ananya.23it@college.edu",
          phone: "+91 98765 43211",
          event_id: "ext_evt_1",
          event_title: "TECHFINIX'26 — National Level Technical Symposium",
          college: "Paavai Engineering College",
          venue: "Main Auditorium & Labs",
          event_dates: "2026-09-10 - 2026-09-11",
          activities: JSON.stringify(["Paper Presentation"]),
          amount_paid: 250,
          payment_status: "PAID",
          registration_date: "2026-08-16 05:00 PM",
          qr_code_token: "REG-DEMO-2026-002",
          status: "CONFIRMED",
          attendance_status: "PRESENT",
          check_in_time: "09:12 AM"
        }
      ];

      for (const r of initialRegistrations) {
        await connection.query(
          `INSERT INTO registrations (
            id, registration_number, student_id, event_id, student_name, register_number,
            department, email, phone, event_title, college, venue, event_dates, activities,
            amount_paid, payment_status, registration_date, qr_code_token, status,
            attendance_status, check_in_time
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE student_name = VALUES(student_name)`,
          [
            r.id, r.registration_number, r.student_id, r.event_id, r.student_name, r.register_number,
            r.department, r.email, r.phone, r.event_title, r.college, r.venue, r.event_dates, r.activities,
            r.amount_paid, r.payment_status, r.registration_date, r.qr_code_token, r.status,
            r.attendance_status, r.check_in_time
          ]
        );
      }
      console.log(`✓ Seeded ${initialRegistrations.length} initial registrations`);

      // Seed Initial Attendance Records
      await connection.query(
        `INSERT INTO attendance (
          id, event_id, registration_id, student_id, student_name, register_number,
          department, check_in_time, date, status, verified_by, verified_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [
          "att_001", "ext_evt_1", "reg_002", "stud_002", "Ananya S", "23IT042",
          "Information Technology", "09:12 AM", "2026-09-10", "PRESENT", "Dr. K. Ramanathan", "staff_001"
        ]
      );
      console.log(`✓ Seeded initial attendance records`);

      // Seed Initial OD Requests
      const initialODRequests = [
        {
          id: "od_req_001",
          student_id: "stud_001",
          student_name: "Vignesh B",
          register_number: "23CSE001",
          department: "Computer Science and Engineering",
          year: "2nd Year",
          email: "student@college.edu",
          phone: "+91 98765 43210",
          event_id: "ext_evt_2",
          event_title: "CODEFEST 2026 — 24-Hour State Level Hackathon",
          college: "KSR College of Engineering",
          event_dates: "2026-08-25 - 2026-08-26",
          start_date: "2026-08-25",
          end_date: "2026-08-26",
          od_duration: "2 Days (Full Day)",
          selected_activities: JSON.stringify(["24-Hour Prototype Sprint"]),
          reason: "Representing our college in the Smart Healthcare track with our AI diagnosis prototype.",
          status: "APPROVED",
          applied_at: "2026-08-14 11:30 AM",
          reviewed_at: "2026-08-15 02:15 PM",
          reviewed_by: "Dr. K. Ramanathan",
          reviewed_by_user_id: "staff_001",
          rejection_reason: null
        },
        {
          id: "od_req_002",
          student_id: "stud_002",
          student_name: "Ananya S",
          register_number: "23IT042",
          department: "Information Technology",
          year: "2nd Year",
          email: "ananya.23it@college.edu",
          phone: "+91 98765 43211",
          event_id: "ext_evt_1",
          event_title: "TECHFINIX'26 — National Level Technical Symposium",
          college: "Paavai Engineering College",
          event_dates: "2026-09-10 - 2026-09-11",
          start_date: "2026-09-10",
          end_date: "2026-09-11",
          od_duration: "2 Days (Full Day)",
          selected_activities: JSON.stringify(["Paper Presentation"]),
          reason: "Selected for presenting research paper on 'Privacy-Preserving Federated Learning in Healthcare'.",
          status: "PENDING",
          applied_at: "2026-08-16 04:45 PM",
          reviewed_at: null,
          reviewed_by: null,
          reviewed_by_user_id: null,
          rejection_reason: null
        }
      ];

      for (const od of initialODRequests) {
        await connection.query(
          `INSERT INTO od_requests (
            id, student_id, student_name, register_number, department, year, email, phone,
            event_id, event_title, college, event_dates, start_date, end_date, od_duration,
            selected_activities, reason, status, applied_at, reviewed_at, reviewed_by,
            reviewed_by_user_id, rejection_reason
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status)`,
          [
            od.id, od.student_id, od.student_name, od.register_number, od.department, od.year, od.email, od.phone,
            od.event_id, od.event_title, od.college, od.event_dates, od.start_date, od.end_date, od.od_duration,
            od.selected_activities, od.reason, od.status, od.applied_at, od.reviewed_at, od.reviewed_by,
            od.reviewed_by_user_id, od.rejection_reason
          ]
        );
      }
      console.log(`✓ Seeded ${initialODRequests.length} initial OD requests`);

      // Seed Initial Notifications
      const initialNotifications = [
        {
          id: "notif_001",
          recipient_role: "student",
          recipient_id: "stud_001",
          title: "OD Request Approved! 🎉",
          message: "Your On-Duty (OD) application for CODEFEST 2026 has been approved by Dr. K. Ramanathan. You may now proceed with final registration.",
          type: "success",
          timestamp: "2026-08-15 02:15 PM",
          is_read: 0,
          link: "/student/od"
        },
        {
          id: "notif_002",
          recipient_role: "student",
          recipient_id: "stud_001",
          title: "Registration Confirmed 🎟️",
          message: "Registration for CODEFEST 2026 is confirmed. Your Pass ID is REG-DEMO-2026-001.",
          type: "info",
          timestamp: "2026-08-15 03:30 PM",
          is_read: 1,
          link: "/student/registrations/reg_001"
        },
        {
          id: "notif_003",
          recipient_role: "staff",
          recipient_id: "staff_001",
          title: "New OD Request Pending Review",
          message: "Ananya S (23IT042) submitted an OD request for TECHFINIX'26.",
          type: "action_required",
          timestamp: "2026-08-16 04:45 PM",
          is_read: 0,
          link: "/staff/od"
        }
      ];

      for (const n of initialNotifications) {
        await connection.query(
          `INSERT INTO notifications (
            id, recipient_role, recipient_id, title, message, type, timestamp, is_read, link
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          [n.id, n.recipient_role, n.recipient_id, n.title, n.message, n.type, n.timestamp, n.is_read, n.link]
        );
      }
      console.log(`✓ Seeded ${initialNotifications.length} initial notifications`);

      // Seed Past Participation
      await connection.query(
        `INSERT INTO past_participation (
          id, student_id, event_title, organizer_college, date, category,
          od_status, registration_status, attendance_status, certificate_url, achievement
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE achievement = VALUES(achievement)`,
        [
          "part_001", "stud_001", "KAIZEN '25 — National CAD Fest", "Kongu Engineering College",
          "14 Feb 2025", "Workshop", "Approved", "Registered", "Attended", "#", "Participant"
        ]
      );
      console.log(`✓ Seeded past participation records`);
    } else {
      console.log(`ℹ Database already contains ${userCount} users. Skipping initial seed.`);
    }

    console.log('==================================================');
    console.log('  Database setup & migration completed successfully!');
    console.log('==================================================');
  } catch (error) {
    console.error('❌ Migration Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n[Troubleshooting] Access denied for MySQL user. Please check your DB_USER and DB_PASSWORD in backend/.env');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
