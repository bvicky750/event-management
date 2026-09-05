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
  console.log('  T&P Club Opportunity Hub — Database Setup');
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
      console.log(`✓ Simplified schema applied successfully (Tables: users, events, registrations)`);
    }

    // Step 4: Remove obsolete student users and enforce staff/admin roles
    await connection.query("DELETE FROM users WHERE role = 'student' OR id LIKE 'stud_%'");
    try {
      await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('staff', 'admin') NOT NULL DEFAULT 'staff'");
    } catch (e) {}

    // Step 5: Seed/Update Staff Accounts
    const { users: staffUsers } = getSeedData();
    for (const u of staffUsers) {
      await connection.query(
        `INSERT INTO users (
          id, name, email, password_hash, role, department, phone, college,
          avatar, employee_id, designation, cabin, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          password_hash = VALUES(password_hash),
          role = VALUES(role),
          department = VALUES(department),
          designation = VALUES(designation)`,
        [
          u.id, u.name, u.email, u.password_hash, u.role, u.department, u.phone, u.college,
          u.avatar, u.employee_id, u.designation, u.cabin, u.status
        ]
      );
    }
    console.log(`✓ Seeded/Updated ${staffUsers.length} staff administrator accounts`);

    // Step 5: Check and seed initial events if empty
    const [eventRows] = await connection.query('SELECT COUNT(*) AS count FROM events');
    const eventCount = eventRows[0]?.count || 0;

    if (eventCount === 0) {
      console.log('Seeding initial verified opportunities...');
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
          activities: JSON.stringify([])
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
          activities: JSON.stringify([])
        },
        {
          id: "tp_evt_3",
          title: "Speed Aptitude Battle — TCS NQT & Cognizant Pattern",
          subtitle: "Weekly speed diagnostic covering Quants, Logical Reasoning & Verbal Ability",
          type: "club_event",
          category: "Aptitude",
          description: "Online 60-minute aptitude test simulating the latest TCS NQT, Accenture, and Cognizant assessment patterns with real-time rank lists and solution analysis.",
          full_description: "Speed and accuracy in quantitative aptitude and verbal reasoning make or break mass hiring rounds. Join 400+ peers in this timed challenge hosted on our campus testing platform. Immediate rank breakdown by section.",
          poster: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-26",
          end_date: "2026-08-26",
          start_time: "05:30 PM",
          end_time: "06:45 PM",
          venue: "Central Computing Facility (Lab 4)",
          city: "On-Campus",
          institution: "Training & Placement Club",
          department: "T&P Aptitude Division",
          registration_fee: 0,
          registration_deadline: "2026-08-26",
          registration_url: "https://forms.google.com/d/e/1FAIpQLSe-demo-aptitude-battle/viewform",
          views_count: 388,
          registration_clicks: 140,
          status: "published",
          featured: 0,
          eligibility: "All engineering students (1st to Final Year)",
          created_by: "staff_002",
          coordinator_name: "Prof. S. Meenakshi",
          coordinator_email: "meenakshi.it@college.edu",
          coordinator_phone: "+91 94432 10988",
          topics: JSON.stringify([
            "Quantitative Aptitude (Percentages, Profit/Loss, Time & Work)",
            "Logical Reasoning (Coding-Decoding, Puzzles)",
            "Verbal Ability & Reading Comprehension"
          ]),
          tags: JSON.stringify(["Aptitude", "NQT", "Placement Test", "Speed Battle"]),
          activities: JSON.stringify([])
        },
        {
          id: "ext_evt_1",
          title: "CODEFEST 2026 — 24-Hour State Level Hackathon",
          subtitle: "Build production-ready prototypes with industry mentors and cash prizes up to ₹1,50,000",
          type: "external_opportunity",
          category: "Hackathon",
          description: "24-Hour non-stop product building sprint organized at KSR College of Engineering. Tracks include Generative AI, Web3 & FinTech, Smart Healthcare, and Open Innovation.",
          full_description: "CODEFEST 2026 brings together the top student coders across Tamil Nadu. Work under direct mentorship from tech leads at leading SaaS companies. Free food, stay, and API credits provided for shortlisted teams.",
          poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-08-25",
          end_date: "2026-08-26",
          start_time: "10:00 AM",
          end_time: "10:00 AM",
          venue: "KSR Innovation Hub, KSR College of Engineering",
          city: "Tiruchengode",
          institution: "KSR College of Engineering",
          department: "Department of Information Technology",
          registration_fee: 300,
          registration_deadline: "2026-08-24",
          registration_url: "https://codefest2026-ksr.devpost.com",
          views_count: 852,
          registration_clicks: 340,
          status: "published",
          featured: 1,
          eligibility: "Teams of 2-4 members from any recognized university",
          created_by: "staff_001",
          coordinator_name: "Prof. S. Meenakshi & Student Leads",
          coordinator_email: "codefest2026@ksrce.ac.in",
          coordinator_phone: "+91 98421 55667",
          topics: JSON.stringify([
            "Round 1: Abstract & Architecture Submission",
            "Round 2: 24-Hour Prototype Coding Sprint",
            "Round 3: Grand Jury Pitching & Live Demo"
          ]),
          tags: JSON.stringify(["Hackathon", "External", "Cash Prize", "AI", "KSR"]),
          activities: JSON.stringify([])
        },
        {
          id: "ext_evt_2",
          title: "Edge AI & Embedded TinyML Hands-on Masterclass",
          subtitle: "Deploy deep neural networks on ESP32 & Raspberry Pi Pico hardware",
          type: "external_opportunity",
          category: "Workshop",
          description: "Two-day intensive hardware lab organized by Sona College of Technology. Hardware kits provided for hands-on sensory data processing and on-device machine learning inference.",
          full_description: "Learn how to optimize and quantize machine learning models to run directly on microcontrollers without cloud connectivity. Build gesture-recognition devices and real-time acoustic defect detectors.",
          poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
          start_date: "2026-09-02",
          end_date: "2026-09-03",
          start_time: "09:00 AM",
          end_time: "05:00 PM",
          venue: "IoT Excellence Center, Sona College of Technology",
          city: "Salem",
          institution: "Sona College of Technology",
          department: "ECE & Mechatronics",
          registration_fee: 450,
          registration_deadline: "2026-08-30",
          registration_url: "https://sonatech.ac.in/events/edge-ai-workshop-2026",
          views_count: 512,
          registration_clicks: 180,
          status: "published",
          featured: 0,
          eligibility: "ECE, EEE, CSE, IT & Mechatronics students",
          created_by: "staff_003",
          coordinator_name: "Dr. R. Balaji (Event Advisor)",
          coordinator_email: "edgeai.workshop@sonatech.ac.in",
          coordinator_phone: "+91 94432 10989",
          topics: JSON.stringify([
            "TensorFlow Lite for Microcontrollers",
            "Sensor Interfacing with ESP32-S3",
            "Real-time Audio & Vision Classification at 15mW"
          ]),
          tags: JSON.stringify(["Workshop", "Edge AI", "TinyML", "Hardware", "External"]),
          activities: JSON.stringify([])
        }
      ];

      for (const e of initialEvents) {
        await connection.query(
          `INSERT INTO events (
            id, title, subtitle, type, category, description, full_description,
            poster, start_date, end_date, start_time, end_time, venue, city,
            institution, department, registration_fee, registration_deadline,
            registration_url, views_count, registration_clicks, status, featured,
            eligibility, created_by, coordinator_name, coordinator_email,
            coordinator_phone, topics, tags, activities
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          [
            e.id, e.title, e.subtitle, e.type, e.category, e.description, e.full_description,
            e.poster, e.start_date, e.end_date, e.start_time, e.end_time, e.venue, e.city,
            e.institution, e.department, e.registration_fee, e.registration_deadline,
            e.registration_url, e.views_count, e.registration_clicks, e.status, e.featured,
            e.eligibility, e.created_by, e.coordinator_name, e.coordinator_email,
            e.coordinator_phone, e.topics, e.tags, e.activities
          ]
        );
      }
      console.log(`✓ Seeded ${initialEvents.length} initial verified opportunities`);
    } else {
      console.log(`ℹ Database already contains ${eventCount} events.`);
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
