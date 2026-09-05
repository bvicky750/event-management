-- ==========================================================
-- Database Schema for T&P Club Opportunity Hub (tp_club)
-- Simplified Full-Stack Architecture
-- Tables: users (Staff/Admin), events, registrations
-- Target: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `tp_club` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `tp_club`;

-- Drop obsolete tables if they exist from previous versions
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `od_requests`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `past_participation`;
DROP TABLE IF EXISTS `registrations`;

-- 1. USERS TABLE (Staff and Admin Authentication Only)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('staff', 'admin') NOT NULL DEFAULT 'staff',
  `department` VARCHAR(100) NULL,
  `phone` VARCHAR(30) NULL,
  `college` VARCHAR(150) DEFAULT 'Paavai Engineering College',
  `avatar` TEXT NULL,
  `employee_id` VARCHAR(50) NULL,
  `designation` VARCHAR(150) NULL,
  `cabin` VARCHAR(100) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_employee_id` (`employee_id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. EVENTS TABLE (Published & Draft Opportunities)
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

-- 3. REGISTRATIONS TABLE (Public Student Registrations linked to Event)
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` VARCHAR(64) NOT NULL,
  `registration_number` VARCHAR(64) NOT NULL,
  `event_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `register_number` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `year` VARCHAR(20) NULL,
  `college` VARCHAR(255) DEFAULT 'Paavai Engineering College',
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `event_title` VARCHAR(255) NOT NULL,
  `venue` VARCHAR(255) NULL,
  `event_dates` VARCHAR(100) NULL,
  `amount_paid` DECIMAL(10,2) DEFAULT 0.00,
  `payment_status` ENUM('PAID', 'FREE', 'PENDING') DEFAULT 'FREE',
  `registration_date` VARCHAR(50) NOT NULL,
  `status` ENUM('CONFIRMED', 'CANCELLED') DEFAULT 'CONFIRMED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reg_number` (`registration_number`),
  UNIQUE KEY `uq_event_reg_number` (`event_id`, `register_number`),
  UNIQUE KEY `uq_event_email` (`event_id`, `email`),
  INDEX `idx_registrations_event` (`event_id`),
  INDEX `idx_registrations_status` (`status`),
  CONSTRAINT `fk_reg_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
