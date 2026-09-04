-- ==========================================================
-- Database Schema for T&P Club Event Management (tp_club)
-- Target: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `tp_club` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `tp_club`;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'staff', 'admin') NOT NULL DEFAULT 'student',
  `department` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `college` VARCHAR(150) DEFAULT 'Paavai Engineering College',
  `avatar` TEXT NULL,
  `register_number` VARCHAR(50) NULL,
  `year` VARCHAR(20) NULL,
  `semester` VARCHAR(20) NULL,
  `section` VARCHAR(10) NULL,
  `cgpa` VARCHAR(10) NULL,
  `attendance_percentage` DECIMAL(5,2) DEFAULT 0.00,
  `employee_id` VARCHAR(50) NULL,
  `designation` VARCHAR(150) NULL,
  `cabin` VARCHAR(100) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_register_number` (`register_number`),
  UNIQUE KEY `uq_users_employee_id` (`employee_id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT NULL,
  `type` ENUM('club_event', 'external_opportunity') NOT NULL DEFAULT 'club_event',
  `category` VARCHAR(100) NOT NULL DEFAULT 'Career',
  `description` TEXT NULL,
  `full_description` LONGTEXT NULL,
  `poster` LONGTEXT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `start_time` VARCHAR(30) DEFAULT '09:30 AM',
  `end_time` VARCHAR(30) DEFAULT '04:30 PM',
  `venue` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'On-Campus',
  `institution` VARCHAR(255) DEFAULT 'Training & Placement Club',
  `department` VARCHAR(150) NULL,
  `registration_fee` DECIMAL(10,2) DEFAULT 0.00,
  `registration_deadline` DATE NULL,
  `registration_url` TEXT NULL,
  `eligibility` TEXT NULL,
  `capacity` INT DEFAULT 150,
  `registered_count` INT DEFAULT 0,
  `views_count` INT DEFAULT 0,
  `registration_clicks` INT DEFAULT 0,
  `status` ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
  `featured` BOOLEAN DEFAULT FALSE,
  `created_by` VARCHAR(64) NULL,
  `coordinator_name` VARCHAR(100) NULL,
  `coordinator_email` VARCHAR(150) NULL,
  `coordinator_phone` VARCHAR(30) NULL,
  `topics` JSON NULL,
  `tags` JSON NULL,
  `activities` JSON NULL,
  `od_config` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_events_type` (`type`),
  INDEX `idx_events_category` (`category`),
  INDEX `idx_events_status` (`status`),
  INDEX `idx_events_start_date` (`start_date`),
  INDEX `idx_events_created_by` (`created_by`),
  CONSTRAINT `fk_events_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` VARCHAR(64) NOT NULL,
  `registration_number` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `event_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `register_number` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(30) NULL,
  `event_title` VARCHAR(255) NOT NULL,
  `college` VARCHAR(255) NULL,
  `venue` VARCHAR(255) NULL,
  `event_dates` VARCHAR(100) NULL,
  `activities` JSON NULL,
  `amount_paid` DECIMAL(10,2) DEFAULT 0.00,
  `payment_status` ENUM('PAID', 'FREE', 'PENDING') DEFAULT 'PAID',
  `registration_date` VARCHAR(50) NOT NULL,
  `qr_code_token` VARCHAR(255) NOT NULL,
  `status` ENUM('CONFIRMED', 'ATTENDED', 'CANCELLED') DEFAULT 'CONFIRMED',
  `attendance_status` ENUM('NOT_CHECKED_IN', 'PRESENT', 'ABSENT') DEFAULT 'NOT_CHECKED_IN',
  `check_in_time` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reg_number` (`registration_number`),
  UNIQUE KEY `uq_qr_token` (`qr_code_token`),
  INDEX `idx_registrations_student` (`student_id`),
  INDEX `idx_registrations_event` (`event_id`),
  INDEX `idx_registrations_status` (`status`),
  CONSTRAINT `fk_reg_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(64) NOT NULL,
  `event_id` VARCHAR(64) NOT NULL,
  `registration_id` VARCHAR(64) NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `register_number` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `check_in_time` VARCHAR(30) NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('PRESENT', 'ABSENT', 'LATE') DEFAULT 'PRESENT',
  `verified_by` VARCHAR(100) NOT NULL,
  `verified_by_user_id` VARCHAR(64) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_event_student_attendance` (`event_id`, `student_id`),
  INDEX `idx_attendance_event` (`event_id`),
  INDEX `idx_attendance_student` (`student_id`),
  INDEX `idx_attendance_date` (`date`),
  CONSTRAINT `fk_att_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_reg` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_verifier` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ON-DUTY (OD) REQUESTS TABLE
CREATE TABLE IF NOT EXISTS `od_requests` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `register_number` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `year` VARCHAR(20) NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(30) NULL,
  `event_id` VARCHAR(64) NOT NULL,
  `event_title` VARCHAR(255) NOT NULL,
  `college` VARCHAR(255) NULL,
  `event_dates` VARCHAR(100) NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `od_duration` VARCHAR(100) NULL,
  `selected_activities` JSON NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
  `applied_at` VARCHAR(50) NOT NULL,
  `reviewed_at` VARCHAR(50) NULL,
  `reviewed_by` VARCHAR(100) NULL,
  `reviewed_by_user_id` VARCHAR(64) NULL,
  `rejection_reason` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_od_student` (`student_id`),
  INDEX `idx_od_event` (`event_id`),
  INDEX `idx_od_status` (`status`),
  CONSTRAINT `fk_od_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_od_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_od_reviewer` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(64) NOT NULL,
  `recipient_role` ENUM('student', 'staff', 'admin', 'all') DEFAULT 'student',
  `recipient_id` VARCHAR(64) NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('success', 'info', 'warning', 'announcement', 'action_required') DEFAULT 'info',
  `timestamp` VARCHAR(50) NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_notif_role` (`recipient_role`),
  INDEX `idx_notif_recipient` (`recipient_id`),
  INDEX `idx_notif_read` (`is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PAST PARTICIPATION TABLE
CREATE TABLE IF NOT EXISTS `past_participation` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `event_title` VARCHAR(255) NOT NULL,
  `organizer_college` VARCHAR(255) NULL,
  `date` VARCHAR(50) NULL,
  `category` VARCHAR(50) NULL,
  `od_status` VARCHAR(50) NULL,
  `registration_status` VARCHAR(50) NULL,
  `attendance_status` VARCHAR(50) NULL,
  `certificate_url` TEXT NULL,
  `achievement` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_past_part_student` (`student_id`),
  CONSTRAINT `fk_past_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
