-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 11, 2026 at 11:35 AM
-- Server version: 11.4.10-MariaDB
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amdehaqe_akilesiya`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `assessment_name` varchar(255) NOT NULL,
  `max_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `course_id`, `tenant_id`, `assessment_name`, `max_score`) VALUES
(1, 1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'shs', 50),
(2, 1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'hs', 50),
(4, 2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'dyh', 20),
(5, 2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'trt', 40),
(6, 2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rtey', 40),
(7, 3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ertyui', 78),
(8, 3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sdfgh', 22),
(9, 4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'correct', 51),
(10, 4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'incorrect', 49),
(11, 5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'hssh', 50),
(12, 5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'eje', 50),
(13, 6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'mid exam', 30),
(14, 6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'final', 50),
(15, 6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'assignment', 20),
(16, 7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'mid', 20),
(17, 7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'final', 50),
(21, 9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rrr', 25),
(22, 9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ttff', 25),
(23, 9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'easesr', 40),
(24, 9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'rrrrrr', 10);

-- --------------------------------------------------------

--
-- Table structure for table `assigned_books`
--

CREATE TABLE `assigned_books` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `deadline` date DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `availability` enum('siteLibrary','online','unavailable') DEFAULT 'unavailable',
  `assigned_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `recorded_by_id` varchar(36) DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `session` enum('morning','afternoon') NOT NULL,
  `status` enum('present','absent','late','permission') NOT NULL,
  `attendance_type` enum('learning','hymnLearning','awudemihiret','special') NOT NULL,
  `late_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `user_id`, `tenant_id`, `recorded_by_id`, `attendance_date`, `session`, `status`, `attendance_type`, `late_time`, `created_at`) VALUES
(97, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'permission', 'learning', NULL, '2026-01-24 20:37:29'),
(98, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'present', 'learning', NULL, '2026-01-24 20:37:29'),
(99, 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'absent', 'learning', NULL, '2026-01-24 20:37:29'),
(100, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'permission', 'learning', NULL, '2026-01-24 20:37:29'),
(101, 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'absent', 'learning', NULL, '2026-01-24 20:37:29'),
(102, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '2018-05-16', 'morning', 'late', 'learning', '17:25:00', '2026-01-24 20:37:29'),
(103, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(104, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(105, 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(106, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(107, '525d83cc-ce22-4390-8165-cc5a7279e355', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(108, '6534df26-6393-4627-b27b-34396e607761', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(109, 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(110, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(111, '68004c46-4c24-4715-a3cf-bf4aed66e667', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(112, 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(113, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-05-30', 'morning', 'absent', 'learning', NULL, '2026-02-07 17:51:15'),
(114, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(115, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(116, 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(117, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(118, '525d83cc-ce22-4390-8165-cc5a7279e355', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(119, '6534df26-6393-4627-b27b-34396e607761', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(120, 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(121, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(122, '68004c46-4c24-4715-a3cf-bf4aed66e667', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(123, 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(124, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `admin_user_id` varchar(36) NOT NULL COMMENT 'UUID of the admin who performed the action',
  `affected_user_id` varchar(36) DEFAULT NULL COMMENT 'UUID of the user whose data was changed',
  `action_type` varchar(50) NOT NULL COMMENT 'e.g., GRADE_UPDATE, ATTENDANCE_UPDATE, ROLE_CHANGE',
  `action_description` varchar(255) DEFAULT NULL COMMENT 'Human-readable summary of the action',
  `previous_value` text DEFAULT NULL COMMENT 'The value before the change (can be JSON)',
  `new_value` text DEFAULT NULL COMMENT 'The value after the change (can be JSON)',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `tenant_id`, `admin_user_id`, `affected_user_id`, `action_type`, `action_description`, `previous_value`, `new_value`, `timestamp`) VALUES
(69, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-21 16:22:55'),
(70, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'permission', '2026-01-24 20:37:29'),
(71, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'present', '2026-01-24 20:37:29'),
(72, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'absent', '2026-01-24 20:37:29'),
(73, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'permission', '2026-01-24 20:37:29'),
(74, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'absent', '2026-01-24 20:37:29'),
(75, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-16', 'Not Recorded', 'late', '2026-01-24 20:37:29'),
(76, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-25 10:19:27'),
(77, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-01-25 10:19:38'),
(78, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '6534df26-6393-4627-b27b-34396e607761', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-26 15:34:29'),
(79, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '82652f0f-58fe-400c-9e40-a12e8736abc9', '6534df26-6393-4627-b27b-34396e607761', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-26 15:35:38'),
(80, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-27 08:48:33'),
(81, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-01-27 08:48:37'),
(82, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-27 08:48:39'),
(83, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-27 08:49:50'),
(84, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-01-27 08:49:52'),
(85, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-27 08:54:19'),
(86, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'grade_admin', 'user', '2026-01-27 08:54:25'),
(87, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-27 08:54:27'),
(88, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'grade_admin', 'user', '2026-01-27 08:54:29'),
(89, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-27 08:54:31'),
(90, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-27 09:37:58'),
(91, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'grade_admin', 'user', '2026-01-27 09:38:00'),
(92, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'grade_admin', '2026-01-27 09:38:01'),
(93, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'grade_admin', 'user', '2026-01-27 09:38:03'),
(94, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-01-30 08:46:03'),
(95, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-01-30 08:46:06'),
(96, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-06 08:58:25'),
(97, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(98, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(99, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(100, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(101, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '525d83cc-ce22-4390-8165-cc5a7279e355', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(102, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '6534df26-6393-4627-b27b-34396e607761', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(103, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(104, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(105, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(106, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(107, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ATTENDANCE_UPDATE', 'Attendance for 2018-05-30', 'Not Recorded', 'absent', '2026-02-07 17:51:15'),
(108, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(109, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(110, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(111, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(112, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '525d83cc-ce22-4390-8165-cc5a7279e355', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(113, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '6534df26-6393-4627-b27b-34396e607761', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(114, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(115, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(116, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(117, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(118, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ATTENDANCE_UPDATE', 'Attendance for 2018-06-02', 'Not Recorded', 'present', '2026-02-09 15:33:16'),
(119, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:01'),
(120, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:02'),
(121, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:05'),
(122, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '525d83cc-ce22-4390-8165-cc5a7279e355', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:10'),
(123, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:16'),
(124, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:19'),
(125, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 15:34:22'),
(126, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:07'),
(127, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:09'),
(128, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:14'),
(129, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:14'),
(130, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '525d83cc-ce22-4390-8165-cc5a7279e355', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:19'),
(131, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '6534df26-6393-4627-b27b-34396e607761', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:19'),
(132, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:29'),
(133, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:32'),
(134, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:37'),
(135, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-09 15:41:42'),
(136, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 21:33:16'),
(137, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-09 21:33:45'),
(138, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-10 15:28:43'),
(139, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'attendance_admin', 'user', '2026-02-10 15:28:57'),
(140, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'plan_admin', '2026-02-10 15:43:08'),
(141, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ROLE_CHANGE', 'Role permissions updated', 'user', 'attendance_admin', '2026-02-11 09:35:16');

-- --------------------------------------------------------

--
-- Table structure for table `batch_enrollments`
--

CREATE TABLE `batch_enrollments` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `spiritual_class` varchar(100) NOT NULL,
  `academic_year` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `cover_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `genres` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`genres`)),
  `pull_quote` text DEFAULT NULL,
  `full_review` text DEFAULT NULL,
  `perfect_for` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`perfect_for`)),
  `is_featured` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `tenant_id`, `title`, `author`, `cover_url`, `description`, `rating`, `genres`, `pull_quote`, `full_review`, `perfect_for`, `is_featured`) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Fetha Negest', 'Emperor Gelawdewos', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Fetha_Nagast.jpg/800px-Fetha_Nagast.jpg', 'The Fetha Negest is a legal code compiled around 1240...', 4.80, '[\"History\", \"Law\", \"Theology\"]', 'A profound collection of laws...', 'This book is an essential read...', '[\"History Buffs\", \"Theology Students\"]', 1),
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'The Life of St. Tekle Haymanot', 'Various Hagiographers', 'https://i.etsystatic.com/23725585/r/il/644673/3400589635/il_570xN.3400589635_e40p.jpg', 'A hagiography detailing the life...', 4.50, '[\"Biography\", \"Spirituality\"]', 'An inspiring story of faith...', 'Follow the incredible journey...', '[\"Spiritual Seekers\"]', 0),
(3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'bbb', 'ndnd', 'https://picsum.photos/seed/picsum/200/300', 'fuhq7gfygufyuwgf rgyfq gffcyugcrygfyugrwya ygrvygr iaqvry vrqyvr yyrivryegrgtfvtrevtf      ettfetdftr      fgtrgftfgtrg fgrgfy crge', 0.00, NULL, NULL, NULL, NULL, 0),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'neger kristos behadis kidan', 'me', 'https://picsum.photos/seed/picsum/200/300', 'uwwwwwwwwwwwwwwwwwwwwwh https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', 0.00, NULL, NULL, NULL, NULL, 0),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'jdneeeeeeee', 'cje', 'https://picsum.photos/seed/picsum/200/300', 'jewdmks, https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', 0.00, NULL, NULL, NULL, NULL, 0),
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'jjjj', 'nnn', 'https://picsum.photos/seed/picsum/200/300', 'nnnn', 0.00, '[]', '', '', '[]', 0),
(7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'nn', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', 4.80, '[\"history\",\"theology\"]', 'trdyfg', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', '[\"rt\",\"yyy\",\"y\"]', 0),
(8, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300\n', 4.50, '[\"https://picsum.photos/seed/picsum/200/300\",\"https://picsum.photos/seed/picsum/200/300\",\"https://picsum.photos/seed/picsum/200/300\"]', 'https://picsum.photos/seed/picsum/200/300\n', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', '[\"https://picsum.photos/seed/picsum/200/300\"]', 0),
(9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300\n', 3.90, '[\"https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300\"]', 'https://picsum.photos/seed/picsum/200/300\n', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', '[\"https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300\"]', 0),
(10, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', 3.90, '[\"https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300\"]', 'https://picsum.photos/seed/picsum/200/300\n', 'https://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\nhttps://picsum.photos/seed/picsum/200/300\n', '[\"https://picsum.photos/seed/picsum/200/300https://picsum.photos/seed/picsum/200/300\"]', 0),
(11, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'w', 'w', 'w', 'w', 2.00, '[\"w\"]', 'w', 'w', '[\"w\"]', 0),
(12, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'w', 'w', 'ww', 'w', 2.00, '[\"w\"]', 'ws', 'ww', '[\"w\"]', 0),
(13, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's', 's', 's', 's', 0.00, '[\"s\"]', 's', 's', '[\"s\"]', 0),
(14, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'j', 'w', 'w', 'w', 0.00, '[\"w\"]', 'w', 'w', '[\"w\"]', 0),
(15, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ww', 'w', 'qq', 'e', 3.00, '[\"e\"]', 'e', 'wq', '[\"w\"]', 0),
(16, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'x', 'x', 'x', 'x', 0.00, '[\"x\"]', 'x', 'x', '[\"x\"]', 0),
(17, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ww', 'wiwi', 'wiiw', 'wiw', 0.00, '[\"wiwi\"]', 'wiwi', 'wi', '[\"wwj\"]', 1),
(18, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'w', 'e', 'e', 'e', 2.00, '\"[\\\"e\\\"]\"', 'e', 'd', '\"[\\\"d\\\"]\"', 0),
(19, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ss', 'ss', 'ss', 'ss', 3.00, '\"[\\\"s\\\"]\"', 's', 's', '\"[\\\"s\\\"]\"', 0),
(20, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd', 'd', 'dd', 'd', 3.00, '\"[\\\"d\\\"]\"', 'f', 'f', '\"[\\\"f\\\"]\"', 0),
(21, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'fghjkl', 'Assigned by Admin', NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 0),
(22, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'kk', 'Assigned by Admin', NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 0),
(23, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'jhg', 'Assigned by Admin', NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 0),
(24, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ertfgvv', 'Assigned by Admin', NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 0),
(25, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'testing', 'Assigned by Admin', NULL, NULL, 0.00, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `book_comments`
--

CREATE TABLE `book_comments` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `book_likes`
--

CREATE TABLE `book_likes` (
  `id` int(11) NOT NULL,
  `assigned_book_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `change_logs`
--

CREATE TABLE `change_logs` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL COMMENT 'The user whose profile was changed',
  `changed_by_user_id` varchar(36) NOT NULL COMMENT 'The user who made the change (admin or self)',
  `field_name` varchar(255) NOT NULL COMMENT 'e.g., phone_number, christian_name',
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_reviewed` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'For admin notifications'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `change_logs`
--

INSERT INTO `change_logs` (`id`, `user_id`, `changed_by_user_id`, `field_name`, `old_value`, `new_value`, `created_at`, `is_reviewed`) VALUES
(60, '82652f0f-58fe-400c-9e40-a12e8736abc9', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-24 20:35:40', 1),
(61, '82652f0f-58fe-400c-9e40-a12e8736abc9', '82652f0f-58fe-400c-9e40-a12e8736abc9', 'Custom: የአልገልግሎት ክፍል', '', 'ታዳጊ', '2026-01-24 20:35:40', 1),
(62, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-25 10:26:31', 1),
(63, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'Custom: የአልገልግሎት ክፍል', '', 'ታዳጊ', '2026-01-25 10:26:31', 1),
(64, '525d83cc-ce22-4390-8165-cc5a7279e355', '525d83cc-ce22-4390-8165-cc5a7279e355', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-25 19:32:47', 1),
(65, '525d83cc-ce22-4390-8165-cc5a7279e355', '525d83cc-ce22-4390-8165-cc5a7279e355', 'academic_level', 'university', 'universit', '2026-01-25 19:43:46', 1),
(66, '525d83cc-ce22-4390-8165-cc5a7279e355', '525d83cc-ce22-4390-8165-cc5a7279e355', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-25 19:43:46', 1),
(67, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'gender', 'Male', 'Female', '2026-01-27 07:29:09', 1),
(68, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'phone_number', '', '251911000000', '2026-01-27 07:29:09', 1),
(69, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 07:29:09', 1),
(70, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'kifil', '', 'መረጃ ማደራጀት', '2026-01-27 07:29:09', 1),
(71, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'Custom: የአልገልግሎት ክፍል', 'ታዳጊ', 'ወጣት', '2026-01-27 07:29:09', 1),
(72, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 08:01:48', 1),
(73, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'parent_name', '', 'መሠረት', '2026-01-27 08:01:48', 1),
(74, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'parent_phone_number', '', '25199999999', '2026-01-27 08:01:48', 1),
(75, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 08:02:07', 1),
(76, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 08:02:20', 1),
(77, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 08:04:04', 1),
(78, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'Custom: የአልገልግሎት ክፍል', 'ወጣት', 'ታዳጊ', '2026-01-27 08:04:04', 1),
(79, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-01-27 08:26:08', 1),
(80, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'phone_number', '251911000000', '96', '2026-02-06 08:01:00', 1),
(81, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-06 08:01:00', 1),
(82, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'kifil', 'መረጃ ማደራጀት', ' kiflochn berasu ayametam', '2026-02-06 08:01:00', 1),
(83, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-09 19:25:21', 0),
(84, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'Custom: የአልገልግሎት ክፍል', '', 'ታዳጊ', '2026-02-09 19:25:21', 0),
(89, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 13:00:29', 0),
(90, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'Custom: gg', '', 'nn', '2026-02-10 13:00:29', 0),
(91, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'Custom: testing', '', 'bbbs', '2026-02-10 13:00:29', 0),
(101, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'full_name', 'w', '', '2026-02-10 13:46:32', 0),
(102, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'christian_name', 'w', '', '2026-02-10 13:46:32', 0),
(103, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'confession_father_name', 'w', '', '2026-02-10 13:46:32', 0),
(104, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'mother_name', 'w', '', '2026-02-10 13:46:32', 0),
(105, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'academic_level', '3', '', '2026-02-10 13:46:32', 0),
(106, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 13:46:32', 0),
(107, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 13:46:49', 0),
(108, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 13:59:55', 0),
(109, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 14:00:31', 0),
(112, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-10 14:11:30', 0),
(122, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-11 10:13:17', 0),
(123, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-11 10:26:26', 0),
(124, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '1899-11-30', '2026-02-11 10:27:43', 0),
(125, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'parent_name', '', 'rr', '2026-02-11 10:27:43', 0),
(126, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'parent_phone_number', '', 'ggg', '2026-02-11 10:27:43', 0),
(127, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'dob', 'Thu Nov 30 1899 00:00:00 GMT+0000 (Coordinated Universal Time)', '2003-07-14', '2026-02-11 10:54:04', 0);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `spiritual_class` varchar(100) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `academic_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `tenant_id`, `spiritual_class`, `course_name`, `academic_year`) VALUES
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '10ኛ ክፍል', 'meserete haymanot', NULL),
(7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '10ኛ ክፍል', 'sinemigibar', NULL),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '5ኛ ክፍል', 'hshs', NULL),
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6ኛ ክፍል', 'ah', NULL),
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6ኛ ክፍል', 'hs', NULL),
(3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6ኛ ክፍል', 'test', NULL),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6ኛ ክፍል', 'testing the load', NULL),
(10, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9ኛ ክፍል', 'rtr5yujikl', NULL),
(8, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9ኛ ክፍል', 'tttt', NULL),
(9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9ኛ ክፍል', 'ttttree', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `custom_fields`
--

CREATE TABLE `custom_fields` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('DROPDOWN') NOT NULL DEFAULT 'DROPDOWN',
  `managed_by` enum('ADMIN','USER') NOT NULL DEFAULT 'ADMIN',
  `profile_tab` enum('PERSONAL','SPIRITUAL','FAMILY','EDUCATION') NOT NULL DEFAULT 'PERSONAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custom_fields`
--

INSERT INTO `custom_fields` (`id`, `tenant_id`, `name`, `type`, `managed_by`, `profile_tab`) VALUES
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የአልገልግሎት ክፍል', 'DROPDOWN', 'USER', 'SPIRITUAL'),
(16, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'testing edit', '', 'USER', 'PERSONAL'),
(17, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'testing type', '', 'USER', 'PERSONAL'),
(18, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'create test', '', 'USER', 'PERSONAL'),
(19, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'edit test', '', 'USER', 'PERSONAL');

-- --------------------------------------------------------

--
-- Table structure for table `custom_field_options`
--

CREATE TABLE `custom_field_options` (
  `id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `option_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custom_field_options`
--

INSERT INTO `custom_field_options` (`id`, `field_id`, `option_value`) VALUES
(8, 6, 'ታዳጊ'),
(9, 6, 'ወጣት'),
(10, 6, 'ጎልማሳ');

-- --------------------------------------------------------

--
-- Table structure for table `custom_field_values`
--

CREATE TABLE `custom_field_values` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `field_id` int(11) NOT NULL,
  `option_id` int(11) DEFAULT NULL,
  `value_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `custom_field_values`
--

INSERT INTO `custom_field_values` (`id`, `user_id`, `field_id`, `option_id`, `value_text`) VALUES
(68, '82652f0f-58fe-400c-9e40-a12e8736abc9', 6, 8, NULL),
(69, '68004c46-4c24-4715-a3cf-bf4aed66e667', 6, 9, NULL),
(71, 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 6, 9, NULL),
(73, '6534df26-6393-4627-b27b-34396e607761', 6, 9, NULL),
(79, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 6, 9, NULL),
(119, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 6, 8, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `daily_topics`
--

CREATE TABLE `daily_topics` (
  `id` int(10) UNSIGNED NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `session` enum('morning','afternoon') NOT NULL,
  `attendance_type` enum('learning','hymnLearning','awudemihiret','special') NOT NULL,
  `topic` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `tenant_id`, `name`, `description`, `color`, `created_at`) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'tmhrt kifil', 'vvvhsbngbnf\\sgbfnvw fygeyfgy rfgyf ewg wf,yygyufgvyfv,frfgyefsjb', '#3b82f6', '2025-11-03 06:00:19'),
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'mm', 'mmm', '#3b82f6', '2026-02-11 09:34:32');

-- --------------------------------------------------------

--
-- Table structure for table `department_members`
--

CREATE TABLE `department_members` (
  `department_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` enum('admin','member','manager') NOT NULL DEFAULT 'member'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `department_members`
--

INSERT INTO `department_members` (`department_id`, `user_id`, `role`) VALUES
(1, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'member'),
(1, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `development_notes`
--

CREATE TABLE `development_notes` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `admin_id` varchar(36) NOT NULL,
  `category` enum('Discipline','Skills','Background','Habits') NOT NULL,
  `issue` text NOT NULL,
  `plan` text NOT NULL,
  `date` date NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `family_links`
--

CREATE TABLE `family_links` (
  `id` int(11) NOT NULL,
  `parent_user_id` varchar(36) NOT NULL,
  `student_user_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learning_content`
--

CREATE TABLE `learning_content` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL COMMENT 'Author of the content',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` text DEFAULT NULL,
  `type` enum('video','article') NOT NULL,
  `content` longtext NOT NULL COMMENT 'Video ID or Markdown for article',
  `duration` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `difficulty` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `visibility` enum('tenant','public') NOT NULL DEFAULT 'tenant' COMMENT 'tenant-only or for everyone',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learning_content`
--

INSERT INTO `learning_content` (`id`, `tenant_id`, `user_id`, `title`, `description`, `image_url`, `type`, `content`, `duration`, `category`, `difficulty`, `visibility`, `created_at`, `updated_at`) VALUES
(9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', 'የግማሽ አመት ሪፖርት', 'ጠቅላላ ጉባኤ ተደረገ።\n\n     በዛሬው ዕለት የጅማ/ደ/ኤ/ቅ/ድ/ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት የ2018 ዓ.ም የ6 ወር ጠቅላላ ጉባኤ ተደረጎ ዋለ።\n\n  በጉባኤውም የ6 ወር ጠቅላላ የስራ አፈጻጸም ሪፖርት የሒሳብ ሪፕርት እና ለሰንበት ትምህርት ቤቱ አዲስ ብራንዲንግ ምክረ ሃሳብ ቀርቦ በስተመጨረሻም ውይይቶች ተደርገው ፍፃሜውንን አግኝቷል።\n\nዓምደ ሃይማኖት ሚድያ\nጥር 24/2018 ዓ.ም\nጅማ/ኢትዮጵያ', 'http://akilesiya.amdehaymanot.com/uploads/scaled_1000013003-1770486027835.jpg', 'article', 'የግማሽ አመት ዕቅድ አፈፃፀም ', '', 'ይመልከቱ   ጠቅላላ ጉባኤ ተደረገ።     በዛሬው ዕለት የጅማ/ደ/ኤ/ቅ/ድ/ማርያም ካቴድራል ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት የ2018 ዓ.ም የ6 ወር ጠ', '', 'tenant', '2026-02-07 17:42:51', '2026-02-07 17:44:43'),
(10, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'hhhehe', 'hheeh', 'http://akilesiya.amdehaymanot.com/uploads/photo_2025-10-18_22-55-32-1770728556755.jpg', 'video', 'https://youtu.be/CP03_BdG7cY?si=GQNTIz1wNZOlb_zK', '15', 'tttt', '', 'tenant', '2026-02-10 13:04:33', '2026-02-10 13:04:33');

-- --------------------------------------------------------

--
-- Table structure for table `learning_content_bookmarks`
--

CREATE TABLE `learning_content_bookmarks` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learning_content_comments`
--

CREATE TABLE `learning_content_comments` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learning_content_comments`
--

INSERT INTO `learning_content_comments` (`id`, `content_id`, `user_id`, `comment_text`, `created_at`) VALUES
(5, 9, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'C', '2026-02-09 19:02:02');

-- --------------------------------------------------------

--
-- Table structure for table `learning_content_likes`
--

CREATE TABLE `learning_content_likes` (
  `id` int(11) NOT NULL,
  `content_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `learning_content_likes`
--

INSERT INTO `learning_content_likes` (`id`, `content_id`, `user_id`) VALUES
(10, 9, '4e42994e-d3c8-4008-ab52-64d1645e5fd8'),
(8, 9, '68004c46-4c24-4715-a3cf-bf4aed66e667');

-- --------------------------------------------------------

--
-- Table structure for table `pending_registrations`
--

CREATE TABLE `pending_registrations` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `otp_expires_at` datetime NOT NULL,
  `registration_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`registration_data`)),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pending_registrations`
--

INSERT INTO `pending_registrations` (`id`, `email`, `otp_code`, `otp_expires_at`, `registration_data`, `created_at`) VALUES
(2, 'tetertech@gmail.com', '884659', '2025-12-31 09:45:05', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"dawit\",\"email\":\"tetertech@gmail.com\",\"phone\":null,\"christianName\":\"gebre kidan\",\"confessionFatherName\":\"aba kasahun\",\"motherName\":\"momy\",\"gender\":\"Male\",\"dob\":\"Tir 1, 2018\",\"academicLevel\":\"degree student\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{\"1\":\"2\",\"3\":\"6\"}}', '2025-12-31 09:30:29'),
(3, 'dawittamasgen1@gmail.com', '960865', '2025-12-31 10:19:22', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"e\",\"email\":\"dawittamasgen1@gmail.com\",\"phone\":null,\"christianName\":null,\"confessionFatherName\":\"d\",\"motherName\":\"d\",\"gender\":\"Male\",\"dob\":\"Tahsas 22, 2018\",\"academicLevel\":\"2wsx\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{\"1\":\"2\",\"3\":\"6\"}}', '2025-12-31 10:00:27'),
(5, 'rakebgetachew058@gmail.com', '755956', '2025-12-31 11:26:48', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"ራኬብ ጌታቸው ጫንያለው\",\"email\":\"rakebgetachew058@gmail.com\",\"phone\":null,\"christianName\":\"ፀዳለ ማርያም\",\"confessionFatherName\":\"ጌታቸው\",\"motherName\":\"ሰላማዊት\",\"gender\":\"Female\",\"dob\":\"Tahsas 26, 1997\",\"academicLevel\":\"2nd year student\",\"parentName\":\"ዮዲት ኃ/ጊዮርጊስ\",\"parentPhone\":\"0917051243\",\"spiritualClass\":null,\"customFields\":{\"1\":\"1\",\"3\":\"6\"}}', '2025-12-31 11:15:33'),
(7, 'elshadaymesfen854@gmail.com', '571065', '2026-01-01 17:11:25', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"elshday mesfen\",\"email\":\"elshadaymesfen854@gmail.com\",\"phone\":null,\"christianName\":\"gebre sadk\",\"confessionFatherName\":\"mesfen\",\"motherName\":\"zuriash werk\",\"gender\":\"Male\",\"dob\":\"Tahsas 25, 2018\",\"academicLevel\":\"12\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{\"1\":\"1\",\"3\":\"5\"}}', '2026-01-01 17:01:25'),
(8, 'elshadaymesfen988@gmail.com', '288944', '2026-01-01 17:12:42', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"elshday mesfen\",\"email\":\"elshadaymesfen988@gmail.com\",\"phone\":null,\"christianName\":\"gebre sadk\",\"confessionFatherName\":\"mesfen\",\"motherName\":\"zuriash werk\",\"gender\":\"Male\",\"dob\":\"Tahsas 25, 2018\",\"academicLevel\":\"12\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{\"1\":\"1\",\"3\":\"5\"}}', '2026-01-01 17:02:42'),
(20, 'aemiroyibeltal7@gmail.com', '263704', '2026-01-25 13:58:16', '{\"tenantId\":\"2b52028d-4d93-4858-bcc9-e46e7d87dcb6\",\"tenantName\":\"ggd\",\"fullName\":\"Aemiro Yibeltal Mengistu\",\"email\":\"aemiroyibeltal7@gmail.com\",\"phone\":null,\"christianName\":\"gebre iyesus\",\"confessionFatherName\":\"kesis abayneh\",\"motherName\":\"tiruwork kelkay\",\"gender\":\"Male\",\"dob\":\"Sene 19, 1995\",\"academicLevel\":\"undergraduate\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{}}', '2026-01-25 13:48:16'),
(22, 'ytest@gmail.com', '251193', '2026-01-25 17:38:44', '{\"tenantId\":\"4871fe3c-d948-4c6a-8bf0-42d56026be21\",\"tenantName\":\"felege yared\",\"fullName\":\"yared kassa\",\"email\":\"ytest@gmail.com\",\"phone\":null,\"christianName\":\"zyared\",\"confessionFatherName\":\"hmariyam\",\"motherName\":\"selam\",\"gender\":\"Male\",\"dob\":\"Tir 17, 1989\",\"academicLevel\":\"degre\",\"parentName\":\"habtamu\",\"parentPhone\":\"0909090909\",\"spiritualClass\":null,\"customFields\":{}}', '2026-01-25 17:28:44'),
(26, 'kidistkid55@gmail.com', '480990', '2026-02-02 15:47:22', '{\"tenantId\":\"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\",\"tenantName\":\"Amdehaymanot Sunday School\",\"fullName\":\"kidist beyene worku\",\"email\":\"kidistkid55@gmail.com\",\"phone\":null,\"christianName\":\"Tsegamaryame\",\"confessionFatherName\":null,\"motherName\":null,\"gender\":\"Female\",\"dob\":\"Hamle 16, 1997\",\"academicLevel\":\"2nd year\",\"parentName\":null,\"parentPhone\":null,\"spiritualClass\":null,\"customFields\":{\"6\":\"9\"}}', '2026-02-02 15:37:22');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `department_id` int(11) NOT NULL,
  `assignee_id` varchar(36) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `plan_date` date DEFAULT NULL,
  `is_done` tinyint(1) NOT NULL DEFAULT 0,
  `is_high_priority` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `academic_year` int(11) NOT NULL DEFAULT year(curdate()),
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','archived') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `tenant_id`, `department_id`, `assignee_id`, `title`, `description`, `plan_date`, `is_done`, `is_high_priority`, `created_at`, `academic_year`, `is_recurring`, `status`) VALUES
(3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'mm ', 'mcm', '2025-10-22', 1, 1, '2025-11-03 06:08:02', 2025, 0, 'archived'),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, ' j j', 'jn', '2025-11-02', 1, 0, '2025-11-03 06:13:10', 2025, 0, 'archived'),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'mm', 'mm', '2030-10-28', 1, 0, '2025-11-03 07:02:46', 2027, 0, 'active'),
(7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'nnn', 'nnn', '2025-11-02', 1, 0, '2025-11-03 07:10:58', 2025, 0, 'archived'),
(8, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'dd', 'xx', '2025-10-22', 1, 0, '2025-11-03 07:50:14', 2025, 0, 'active'),
(9, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'cvbnm,,', 'dxfcvnbm', '2025-11-03', 1, 1, '2025-11-03 13:10:55', 2025, 0, 'active'),
(10, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, NULL, 'jjsjs', 'nxbcjs', '2025-11-03', 1, 0, '2025-11-03 13:20:41', 2025, 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `platform_links`
--

CREATE TABLE `platform_links` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `icon_name` varchar(50) NOT NULL,
  `color` varchar(10) NOT NULL,
  `is_social_media` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `platform_links`
--

INSERT INTO `platform_links` (`id`, `tenant_id`, `name`, `url`, `icon_name`, `color`, `is_social_media`, `display_order`, `created_at`) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ዋና ድረ-ገጻችን', 'https://www.amdehaymanot.org', 'globe', '#1a73e8', 0, 0, '2025-11-08 12:56:28'),
(2, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'መዝሙር መተግበሪያ', 'https://play.google.com/store/apps/details?id=com.example.app', 'googleplay', '#3DDC84', 0, 1, '2025-11-08 12:56:28'),
(3, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የቴሌግራም ቻናል', 'https://t.me/sundayschoolchannel', 'telegram', '#2AABEE', 1, 0, '2025-11-08 12:56:28'),
(4, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የዩቲዩብ ገጻችን', 'https://youtube.com/c/sundayschoolchannel', 'youtube', '#FF0000', 1, 1, '2025-11-08 12:56:28'),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የፌስቡክ ገጻችን', 'https://facebook.com/sunndayschoolpage', 'facebook', '#1877f2', 1, 0, '2025-11-08 12:56:28'),
(6, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የቲክቶክ ገጻችን', 'https://tiktok.com/@sundayschool', 'tiktok', '#010101', 1, 3, '2025-11-08 12:56:28'),
(7, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'የኢንስታግራም ገጻችን', 'https://instagram.com/sundayschool21', 'instagram', '#e4405f', 1, 0, '2025-11-08 12:56:28');

-- --------------------------------------------------------

--
-- Table structure for table `private_posts`
--

CREATE TABLE `private_posts` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` text DEFAULT NULL,
  `type` enum('event','announcement','news','prayer') NOT NULL DEFAULT 'news',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `location` varchar(255) DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `is_important` tinyint(1) NOT NULL DEFAULT 0,
  `target_groups` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_groups`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `private_post_comments`
--

CREATE TABLE `private_post_comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `private_post_likes`
--

CREATE TABLE `private_post_likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `user_id` varchar(36) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `christian_name` varchar(255) DEFAULT NULL,
  `confession_father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `academic_level` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `parent_name` varchar(255) DEFAULT NULL,
  `parent_phone_number` varchar(50) DEFAULT NULL,
  `spiritual_class` varchar(100) DEFAULT NULL,
  `kifil` varchar(100) DEFAULT NULL,
  `member_level` varchar(100) DEFAULT NULL,
  `had_previous_service` tinyint(1) DEFAULT 0,
  `previous_department` varchar(255) DEFAULT NULL,
  `previous_responsibility` varchar(255) DEFAULT NULL,
  `previous_service_level` varchar(100) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `service_assignment` text DEFAULT NULL,
  `service_status` enum('Active','Inactive','OnBreak') NOT NULL DEFAULT 'Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`user_id`, `full_name`, `profile_image_url`, `christian_name`, `confession_father_name`, `mother_name`, `gender`, `age`, `academic_level`, `phone_number`, `dob`, `parent_name`, `parent_phone_number`, `spiritual_class`, `kifil`, `member_level`, `had_previous_service`, `previous_department`, `previous_responsibility`, `previous_service_level`, `updated_at`, `service_assignment`, `service_status`) VALUES
('0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'kidist beyene worku', NULL, 'tsegamareyam', NULL, 'aynalem habte', 'Female', NULL, '2 nd year', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-02-03 05:41:54', NULL, 'Inactive'),
('1382eabd-01dd-4890-8878-1850336b22de', 'አብርሃም ሽመልስ አታክልት', NULL, 'ገብረ ማርያም', 'ቀሲስ ቀለምወርቅ', 'ሁሉአገርሽ', 'Male', NULL, NULL, NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-23 18:28:52', NULL, 'Inactive'),
('4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'Abraham shimelis Atakilt', 'uploads/4e42994e-d3c8-4008-ab52-64d1645e5fd8-1769276548156.jpg', 'ገብረማርያም', 'ቀሲስ ቀለምወርቅ', 'ሁሉአገርሽ', 'Female', NULL, 'University Student', '96', '1899-11-30', 'መሠረት', '25199999999', NULL, ' kiflochn berasu ayametam', NULL, 0, NULL, NULL, NULL, '2026-02-06 08:01:00', NULL, 'Inactive'),
('525d83cc-ce22-4390-8165-cc5a7279e355', 'mik', NULL, 'tekle mikale', 'aba gebre eyesus', 'fanos', 'Female', NULL, 'universit', '', '1899-11-30', 'god', '01223345', NULL, '', NULL, 0, NULL, NULL, NULL, '2026-01-25 19:43:46', NULL, 'Inactive'),
('6534df26-6393-4627-b27b-34396e607761', 'naol', NULL, 'hayle meskel', 'Tesema', 'dinknesh', 'Male', NULL, 'degree', NULL, '0000-00-00', 'Tesema', '0920613508', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-26 15:23:45', NULL, 'Inactive'),
('68004c46-4c24-4715-a3cf-bf4aed66e667', 'Yohannes abebe Ashelo', NULL, 'ወልደ ሚካኤል', NULL, NULL, 'Male', NULL, NULL, NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-25 09:33:58', NULL, 'Inactive'),
('79eb4ca6-a03c-406d-a55f-b25f0da867ac', '', 'uploads/79eb4ca6-a03c-406d-a55f-b25f0da867ac-1767173530243.jpg', '', '', '', 'Male', NULL, '', '', '2003-07-14', 'rr', 'ggg', NULL, '', NULL, 0, NULL, NULL, NULL, '2026-02-11 10:54:04', NULL, 'Inactive'),
('803b551a-6639-486f-87af-c8bdada0240c', 'Aemiro Yibeltal Mengistu', NULL, 'gebre iyesus', 'kesis abayneh', 'tiruwork kelkay', 'Male', NULL, 'undergraduate', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-25 13:52:38', NULL, 'Inactive'),
('82652f0f-58fe-400c-9e40-a12e8736abc9', 'dawit temesgen', 'uploads/82652f0f-58fe-400c-9e40-a12e8736abc9-1767177912837.jpg', 'gebre kidan', 'aba kasahun', 'tsehay', 'Male', NULL, 'degree', '', '1899-11-30', '', '', NULL, '', NULL, 0, NULL, NULL, NULL, '2026-01-24 20:35:40', NULL, 'Inactive'),
('b8f2940b-d2c2-4367-b7c6-0f90fb4b6b8a', 'Mikiyas Hailemariam wazema', NULL, 'Bisrate Gebriel', 'Aba Etale', 'wagaye Beyene', 'Male', NULL, 'Digree', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-23 07:58:43', NULL, 'Inactive'),
('c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'ነቢያት ቾምቤ ተማም', NULL, 'ወለተ መድኅን', 'ቾምቤ ተማም', 'ገነት በዛብህ', 'Female', NULL, 'BA degree in electrica and computer engineering', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-23 14:30:57', NULL, 'Inactive'),
('cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'ቢኒያም መኮንን ካሣ', 'uploads/cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df-1768987613613.jpg', 'ኪዳነ ማርያም', 'ቆሞስ አባ መላኩ', 'ገነት ተሰማ', 'Male', NULL, 'ደረጃ 4', NULL, '0000-00-00', 'መኮንን ካሣ', '0917102892', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-21 09:26:53', NULL, 'Inactive'),
('d0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'Tamrat Tesfaye Amde', NULL, 'Kinfe Mikael', NULL, NULL, 'Male', NULL, 'Undergraduate Degree', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-25 12:37:37', NULL, 'Inactive'),
('ea31f226-f8ca-472e-8f1a-4587df9d6073', 'EYOB ZEWDU ASEFA', NULL, 'WELDE KIDAN', 'ABA MELAKU', 'GORFNESH AYELE', 'Male', NULL, 'COLLEGE', NULL, '0000-00-00', 'GORFNESH AYELE', '+251955055194', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-01 09:13:18', NULL, 'Inactive'),
('fb7492ef-484c-414f-b4dd-5359a89ad1d9', 'Ananiya yohannes kiflu', NULL, 'hayle mikael', 'melake meheret komos aba welde selase', 'Tigist kinfu', 'Male', NULL, 'university', NULL, '0000-00-00', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, '2026-01-26 16:14:17', NULL, 'Inactive');

-- --------------------------------------------------------

--
-- Table structure for table `public_posts`
--

CREATE TABLE `public_posts` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL COMMENT 'The user who created the post',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` text DEFAULT NULL,
  `type` enum('event','announcement','news','prayer') NOT NULL DEFAULT 'news',
  `location` varchar(255) DEFAULT NULL,
  `event_date` datetime DEFAULT NULL,
  `is_important` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `public_posts`
--

INSERT INTO `public_posts` (`id`, `user_id`, `title`, `description`, `image_url`, `type`, `location`, `event_date`, `is_important`, `created_at`) VALUES
(6, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'Testing post', 'Here we are testing what the post will looks like', 'uploads/82652f0f-58fe-400c-9e40-a12e8736abc9-1769287231494.jpg', 'announcement', NULL, NULL, 1, '2026-01-24 20:40:31');

-- --------------------------------------------------------

--
-- Table structure for table `public_post_comments`
--

CREATE TABLE `public_post_comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `public_post_comments`
--

INSERT INTO `public_post_comments` (`id`, `post_id`, `user_id`, `comment_text`, `created_at`) VALUES
(4, 6, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'Everyone.donot forget to test and.touch everything available', '2026-01-24 20:46:06'),
(5, 6, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'ok', '2026-01-25 09:38:32'),
(6, 6, '525d83cc-ce22-4390-8165-cc5a7279e355', 'nice ui design', '2026-01-25 19:31:29'),
(7, 6, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '22', '2026-01-27 07:41:46');

-- --------------------------------------------------------

--
-- Table structure for table `public_post_likes`
--

CREATE TABLE `public_post_likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `public_post_likes`
--

INSERT INTO `public_post_likes` (`id`, `post_id`, `user_id`, `created_at`) VALUES
(7, 6, '82652f0f-58fe-400c-9e40-a12e8736abc9', '2026-01-24 20:40:44'),
(8, 6, '68004c46-4c24-4715-a3cf-bf4aed66e667', '2026-01-25 09:34:10'),
(10, 6, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', '2026-01-26 09:26:11'),
(12, 6, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', '2026-01-26 15:49:39'),
(16, 6, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-01-30 08:42:30'),
(17, 6, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', '2026-02-03 05:42:22');

-- --------------------------------------------------------

--
-- Table structure for table `recommended_books`
--

CREATE TABLE `recommended_books` (
  `id` int(11) NOT NULL,
  `student_user_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `deadline` date NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_screen_permissions`
--

CREATE TABLE `role_screen_permissions` (
  `role_name` varchar(50) NOT NULL,
  `screen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `screens`
--

CREATE TABLE `screens` (
  `id` int(11) NOT NULL,
  `screen_key` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screens`
--

INSERT INTO `screens` (`id`, `screen_key`, `display_name`) VALUES
(1, 'ATTENDANCE_MANAGEMENT', 'የትምህርት ክትትል'),
(2, 'ATTENDANCE_SUMMARY', 'የክትትል ሪፖርት'),
(3, 'ACADEMIC_MANAGEMENT', 'አካዳሚክ አስተዳደር'),
(4, 'LIBRARY_MANAGEMENT', 'ቤተ-መጽሐፍት አስተዳደር'),
(5, 'PLAN_MANAGEMENT', 'የእቅድ አስተዳደር'),
(6, 'MEMBER_DEVELOPMENT', 'የአባላት ክትትልና እድገት'),
(7, 'USER_LIST', 'የተጠቃሚዎች ዝርዝር'),
(8, 'ADMIN_HUB', 'Admin Hub'),
(9, 'MEMBER_ACCOUNT_ADJUSTMENT', 'የአባላት መለያ ማስተካከያ'),
(10, 'MANAGE_FAMILY_LINKS', 'የቤተሰብ ማያያዣ'),
(11, 'PERMISSIONS_AND_SCREENS', 'Permissions & Screens'),
(12, 'AUDIT_REPORT', 'የኦዲት ሪፖርት'),
(13, 'SYSTEM_SETTINGS', 'System Settings');

-- --------------------------------------------------------

--
-- Table structure for table `screen_time_logs`
--

CREATE TABLE `screen_time_logs` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `app_package_name` varchar(255) NOT NULL,
  `duration_seconds` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_assignments`
--

CREATE TABLE `service_assignments` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `assignment_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_scores`
--

CREATE TABLE `student_scores` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_audit_logs`
--

CREATE TABLE `system_audit_logs` (
  `id` int(11) NOT NULL,
  `system_admin_id` varchar(36) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `action_description` varchar(500) NOT NULL,
  `affected_tenant_id` varchar(36) DEFAULT NULL,
  `affected_user_id` varchar(36) DEFAULT NULL,
  `previous_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_audit_logs`
--

INSERT INTO `system_audit_logs` (`id`, `system_admin_id`, `action_type`, `action_description`, `affected_tenant_id`, `affected_user_id`, `previous_value`, `new_value`, `ip_address`, `user_agent`, `timestamp`) VALUES
(1, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_DEACTIVATED', 'Deactivated school: felege yared', '4871fe3c-d948-4c6a-8bf0-42d56026be21', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 09:50:02'),
(2, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_ACTIVATED', 'Activated school: felege yared', '4871fe3c-d948-4c6a-8bf0-42d56026be21', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 09:50:07'),
(3, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_DEACTIVATED', 'Deactivated school: felege yared', '4871fe3c-d948-4c6a-8bf0-42d56026be21', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:11:18'),
(4, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_ACTIVATED', 'Activated school: felege yared', '4871fe3c-d948-4c6a-8bf0-42d56026be21', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:11:22'),
(5, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_UPDATED', 'Updated school information: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:26:37'),
(6, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '10f16b19-a2d1-4681-9836-b816f9189ec1', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:51:33'),
(7, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:51:44'),
(8, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'USER_DEMOTED', 'Removed superior admin rights from user in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:51:51'),
(9, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_CREATED', 'Created new school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:54:13'),
(10, '9bf7701f-eb80-49cd-8f3f-eb489dabdf2e', 'SCHOOL_DEACTIVATED', 'Deactivated school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '2025-11-08 10:54:24'),
(11, '166cfd2a-59e0-4aeb-915c-03ec52ae0c9d', 'SCHOOL_UPDATED', 'Updated school information: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2025-12-24 07:59:51'),
(12, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_DEMOTED', 'Removed superior admin rights from user in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-21 16:24:58'),
(13, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-21 16:25:00'),
(14, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: felege yared', '4871fe3c-d948-4c6a-8bf0-42d56026be21', 'b8f2940b-d2c2-4367-b7c6-0f90fb4b6b8a', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-23 14:52:46'),
(15, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '4e42994e-d3c8-4008-ab52-64d1645e5fd8', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-24 17:39:20'),
(16, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'SCHOOL_ACTIVATED', 'Activated school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', NULL, NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-24 17:40:23'),
(17, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'SCHOOL_DEACTIVATED', 'Deactivated school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', NULL, NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-24 17:40:26'),
(18, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '6534df26-6393-4627-b27b-34396e607761', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-26 15:32:34'),
(19, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', '1382eabd-01dd-4890-8878-1850336b22de', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-27 06:06:44'),
(20, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', 'fb7492ef-484c-414f-b4dd-5359a89ad1d9', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-27 06:06:48'),
(21, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: ggd', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', '803b551a-6639-486f-87af-c8bdada0240c', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-27 06:06:50'),
(22, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '525d83cc-ce22-4390-8165-cc5a7279e355', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-27 07:06:40'),
(23, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-01-30 08:43:45'),
(24, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', NULL, NULL, '127.0.0.1', 'Dart/3.9 (dart:io)', '2026-02-06 06:41:15'),
(25, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'USER_PROMOTED', 'Promoted user to superior admin in school: Amdehaymanot Sunday School', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', NULL, NULL, '127.0.0.1', 'Dart/3.10 (dart:io)', '2026-02-09 20:45:19'),
(26, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'SYSTEM_SETTINGS_UPDATED', 'Updated system settings', NULL, NULL, NULL, NULL, '127.0.0.1', 'Dart/3.10 (dart:io)', '2026-02-09 20:50:37');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text NOT NULL,
  `data_type` enum('string','boolean','number','json') NOT NULL DEFAULT 'string',
  `description` text DEFAULT NULL,
  `updated_by` varchar(36) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `data_type`, `description`, `updated_by`, `updated_at`) VALUES
(1, 'platform_name', 'Akilesiya School System', 'string', 'Display name for the platform', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(2, 'allow_new_registrations', 'true', 'boolean', 'Allow new schools and users to register', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(3, 'require_email_verification', 'true', 'boolean', 'Users must verify their email address', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(4, 'max_schools_per_account', '1', 'number', 'Maximum number of schools a user can create', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(5, 'default_user_role', 'user', 'string', 'Default role for new users', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(6, 'maintenance_mode', 'false', 'boolean', 'Put the entire platform in maintenance mode', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(7, 'email_notifications', 'true', 'boolean', 'Send system-wide email notifications', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37'),
(8, 'data_retention_days', '365', 'number', 'How long to keep user data after account deletion', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2026-02-09 20:50:37');

-- --------------------------------------------------------

--
-- Table structure for table `system_statistics`
--

CREATE TABLE `system_statistics` (
  `id` int(11) NOT NULL,
  `total_schools` int(11) NOT NULL DEFAULT 0,
  `active_schools` int(11) NOT NULL DEFAULT 0,
  `total_users` int(11) NOT NULL DEFAULT 0,
  `active_users` int(11) NOT NULL DEFAULT 0,
  `total_admins` int(11) NOT NULL DEFAULT 0,
  `statistics_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` text DEFAULT NULL,
  `primary_color` varchar(20) DEFAULT NULL,
  `accent_color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pastor_name` varchar(255) DEFAULT NULL,
  `service_times` text DEFAULT NULL,
  `member_count` int(11) DEFAULT 0,
  `established_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `system_admin_notes` text DEFAULT NULL,
  `last_activity` timestamp NULL DEFAULT NULL,
  `motto` varchar(255) DEFAULT NULL,
  `founding_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `name`, `logo_url`, `primary_color`, `accent_color`, `created_at`, `description`, `address`, `phone`, `email`, `pastor_name`, `service_times`, `member_count`, `established_date`, `is_active`, `system_admin_notes`, `last_activity`, `motto`, `founding_year`) VALUES
('2b52028d-4d93-4858-bcc9-e46e7d87dcb6', 'ggd', NULL, '#012564', '#FFD700', '2025-11-08 10:54:13', 'hhhw', 'jimma', '098765', 'u', '', 'whwh', 0, '2025-11-03', 0, NULL, NULL, NULL, NULL),
('4871fe3c-d948-4c6a-8bf0-42d56026be21', 'felege yared', '', '#012564', '#FFD700', '2025-11-04 21:06:32', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 1, NULL, NULL, NULL, NULL),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Amdehaymanot Sunday School', 'http://localhost:3000/uploads/logo-1766563095642.jpeg', '#012564', '#FFD700', '2025-11-03 04:25:51', 'A vibrant Sunday school community dedicated to nurturing faith and building strong Christian foundations for all generations.', 'jimma ethiopia', '+251-11-123-4567', '', 'ወጣት  ብሩክ ፍቃዱ', 'Sunday: 8:30 AM - Children Service\n10:00 AM - Youth Service\n11:30 AM - Adult Bible Study', 200, '1963-01-12', 1, NULL, NULL, 'የተማረ ትዉልድ የጸናች ቤተክርስቲያን', 1964);

-- --------------------------------------------------------

--
-- Table structure for table `tenant_profile_settings`
--

CREATE TABLE `tenant_profile_settings` (
  `id` int(11) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `widget_key` varchar(255) NOT NULL COMMENT 'e.g., confession_father, academic_level',
  `is_visible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tenant_profile_settings`
--

INSERT INTO `tenant_profile_settings` (`id`, `tenant_id`, `widget_key`, `is_visible`) VALUES
(1, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'kifil', 1),
(5, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'age', 1),
(12, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'christian_name', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` set('user','system_admin','superior_admin','plan_admin','manager','development_admin','grade_admin','attendance_admin','librarian','library_admin','learning_admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `tenant_id`, `email`, `password_hash`, `role`, `created_at`, `is_verified`, `is_active`, `last_login`, `phone_number`, `otp_code`, `otp_expires_at`) VALUES
('0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'kidistkide55@gmail.com', '$2a$10$EJluVF4NEA9qmwcxcgxu4OVW.2v75QMiaK1LTRf34L2IxVdz3pzjy', 'development_admin', '2026-02-03 05:41:54', 0, 1, NULL, NULL, NULL, NULL),
('1382eabd-01dd-4890-8878-1850336b22de', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', 'abrahamshimelis2@gmail.com', '$2a$10$Y2HAX5KQgGsxuwBwLt.ut.hYM.25dCOSdZhwKMlgx3FiO54tSNDs6', 'superior_admin', '2026-01-23 18:28:52', 0, 1, NULL, NULL, NULL, NULL),
('4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'shimelisabrham0@gmail.com', '$2a$10$Qpg3cCZdJn1Nt8lR1PERduA3.G7IUXJOsSdekquncZt/kdqXK8F4O', 'superior_admin,development_admin,attendance_admin', '2026-01-24 16:53:03', 0, 1, NULL, NULL, NULL, NULL),
('525d83cc-ce22-4390-8165-cc5a7279e355', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'markos1win@gmail.com', '$2a$10$jlA8hp/UvJCTA0kkK4svdO8j01S3OYvh4nAYaZ5YvzInsZebp/dkK', 'superior_admin,development_admin', '2026-01-25 19:28:55', 0, 1, NULL, NULL, NULL, NULL),
('6534df26-6393-4627-b27b-34396e607761', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'naoletesema@gmail.com', '$2a$10$JAKXz9HhGMwT6MNRX362PuI1TniGklqy2FezYXVYxi6qM4Ayo1zf.', 'superior_admin,development_admin,grade_admin,librarian,library_admin', '2026-01-26 15:23:45', 0, 1, NULL, NULL, NULL, NULL),
('68004c46-4c24-4715-a3cf-bf4aed66e667', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'yabebe996@gmail.com', '$2a$10$OUCp6eVzFx07cz.4pgu2TOub1jEB0IV44/wqcy9ZEPsl9eZsJ84RG', 'superior_admin,attendance_admin', '2026-01-25 09:33:58', 0, 1, NULL, NULL, NULL, NULL),
('79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'dawittemesgen2025@gmail.com', '$2a$10$WSH08BBi.Sy9g6V23WEN4etn6OcrO6R9C49.UYQJkdWxQDYrGzLeS', 'system_admin,superior_admin,plan_admin,development_admin,attendance_admin', '2025-12-31 09:31:49', 0, 1, NULL, NULL, NULL, NULL),
('803b551a-6639-486f-87af-c8bdada0240c', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', 'aemiroyibeltal6@gmail.com', '$2a$10$RAMMBCnDkcglxZd1PUUcneJIwZG8OFRfWcwqtJY8xV10X.aqltEem', 'superior_admin', '2026-01-25 13:52:38', 0, 1, NULL, NULL, NULL, NULL),
('82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'dawityelidetaw@gmail.com', '$2a$10$djbGz0OucdMcMjpu0QO27ucfpAuBS1OIXVgL3J.7QSIJKa8eThTGG', 'superior_admin,development_admin,grade_admin,attendance_admin', '2025-12-31 10:44:24', 0, 1, NULL, NULL, NULL, NULL),
('b8f2940b-d2c2-4367-b7c6-0f90fb4b6b8a', '4871fe3c-d948-4c6a-8bf0-42d56026be21', 'bisratmiki21@gmail.com', '$2a$10$0uZ3WqGCdO2MmIyLWaUnGOc2VxwKS6.8aTmcqESCjFDuQ49lLf31u', 'superior_admin', '2026-01-23 07:58:43', 0, 1, NULL, NULL, NULL, NULL),
('c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'nebachombe5@gmail.com', '$2a$10$b5tnXIkAyORebh0XjGEwm.WlWIrdYNLxbHzhTpDVs6K8rxb4UNbca', 'development_admin', '2026-01-23 14:30:57', 0, 1, NULL, NULL, NULL, NULL),
('cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'biniyammekonn61@gmail.com', '$2a$10$VLZADY.9hcBXW15UExlJTef1OboZpe97zhcCvOh/oEalB9v40j5FG', 'superior_admin,development_admin', '2026-01-21 09:23:38', 0, 1, NULL, NULL, NULL, NULL),
('d0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'tamrattesfaye4@gmail.com', '$2a$10$oAM/LmtW8YDPWyQ26YS0P.L/YV8NqqsEO2PVo.k6P/l4mFPMHiwRO', 'superior_admin,development_admin', '2026-01-25 12:37:37', 0, 1, NULL, NULL, NULL, NULL),
('ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'eyobzewdu2124@gmail.com', '$2a$10$AiQqOy6rqZmU.CiP9oiUYehVJQbZ.9bJmkvR6L9wcvj4M0xyHSjZ2', 'superior_admin,development_admin', '2026-01-01 09:13:18', 0, 1, NULL, NULL, NULL, NULL),
('fb7492ef-484c-414f-b4dd-5359a89ad1d9', '2b52028d-4d93-4858-bcc9-e46e7d87dcb6', 'yohannesananiya157@gmail.com', '$2a$10$SjctHX4zIx17CBdqG/X1ruq3ybiRRVX.jDz17HU.9HX27gZfsRCBe', 'superior_admin', '2026-01-26 16:14:17', 0, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_screen_permissions`
--

CREATE TABLE `user_screen_permissions` (
  `user_id` char(36) NOT NULL,
  `screen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_screen_permissions`
--

INSERT INTO `user_screen_permissions` (`user_id`, `screen_id`) VALUES
('6534df26-6393-4627-b27b-34396e607761', 1),
('3902e217-c561-4266-a413-f55faffe845f', 2),
('6534df26-6393-4627-b27b-34396e607761', 2),
('6534df26-6393-4627-b27b-34396e607761', 3),
('6534df26-6393-4627-b27b-34396e607761', 4),
('6534df26-6393-4627-b27b-34396e607761', 5),
('6534df26-6393-4627-b27b-34396e607761', 6),
('6534df26-6393-4627-b27b-34396e607761', 7),
('6534df26-6393-4627-b27b-34396e607761', 8),
('6534df26-6393-4627-b27b-34396e607761', 9),
('6534df26-6393-4627-b27b-34396e607761', 10),
('6534df26-6393-4627-b27b-34396e607761', 11),
('6534df26-6393-4627-b27b-34396e607761', 12),
('6534df26-6393-4627-b27b-34396e607761', 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `assigned_books`
--
ALTER TABLE `assigned_books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assignment` (`book_id`,`user_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `assigned_by` (`assigned_by`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`user_id`,`attendance_date`,`session`,`attendance_type`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `fk_attendance_recorded_by` (`recorded_by_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tenant_id` (`tenant_id`),
  ADD KEY `idx_timestamp` (`timestamp`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `admin_user_id` (`admin_user_id`),
  ADD KEY `affected_user_id` (`affected_user_id`);

--
-- Indexes for table `batch_enrollments`
--
ALTER TABLE `batch_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`user_id`,`academic_year`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `book_comments`
--
ALTER TABLE `book_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `book_likes`
--
ALTER TABLE `book_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`assigned_book_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `change_logs`
--
ALTER TABLE `change_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `changed_by_user_id` (`changed_by_user_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_course_year` (`tenant_id`,`spiritual_class`,`course_name`,`academic_year`);

--
-- Indexes for table `custom_fields`
--
ALTER TABLE `custom_fields`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `custom_field_options`
--
ALTER TABLE `custom_field_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `field_id` (`field_id`);

--
-- Indexes for table `custom_field_values`
--
ALTER TABLE `custom_field_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`field_id`),
  ADD KEY `field_id` (`field_id`),
  ADD KEY `option_id` (`option_id`);

--
-- Indexes for table `daily_topics`
--
ALTER TABLE `daily_topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_topic_per_session` (`tenant_id`,`date`,`session`,`attendance_type`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `department_members`
--
ALTER TABLE `department_members`
  ADD PRIMARY KEY (`department_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `development_notes`
--
ALTER TABLE `development_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_notes_user_id_idx` (`user_id`),
  ADD KEY `fk_notes_admin_id_idx` (`admin_id`);

--
-- Indexes for table `family_links`
--
ALTER TABLE `family_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_link_idx` (`parent_user_id`,`student_user_id`),
  ADD KEY `fk_link_parent_idx` (`parent_user_id`),
  ADD KEY `fk_link_student_idx` (`student_user_id`);

--
-- Indexes for table `learning_content`
--
ALTER TABLE `learning_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `learning_content_bookmarks`
--
ALTER TABLE `learning_content_bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bookmark` (`content_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `learning_content_comments`
--
ALTER TABLE `learning_content_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_id` (`content_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `learning_content_likes`
--
ALTER TABLE `learning_content_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`content_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pending_registrations`
--
ALTER TABLE `pending_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_otp_expires` (`otp_expires_at`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `assignee_id` (`assignee_id`),
  ADD KEY `idx_academic_year` (`academic_year`);

--
-- Indexes for table `platform_links`
--
ALTER TABLE `platform_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tenant_id` (`tenant_id`);

--
-- Indexes for table `private_posts`
--
ALTER TABLE `private_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `private_post_comments`
--
ALTER TABLE `private_post_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_private_comment_post_idx` (`post_id`),
  ADD KEY `fk_private_comment_user_idx` (`user_id`);

--
-- Indexes for table `private_post_likes`
--
ALTER TABLE `private_post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `public_posts`
--
ALTER TABLE `public_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_public_post_user` (`user_id`);

--
-- Indexes for table `public_post_comments`
--
ALTER TABLE `public_post_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_public_comment_post` (`post_id`),
  ADD KEY `fk_public_comment_user` (`user_id`);

--
-- Indexes for table `public_post_likes`
--
ALTER TABLE `public_post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_public_like` (`post_id`,`user_id`),
  ADD KEY `fk_public_like_user` (`user_id`);

--
-- Indexes for table `recommended_books`
--
ALTER TABLE `recommended_books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_book_student_idx` (`student_user_id`);

--
-- Indexes for table `role_screen_permissions`
--
ALTER TABLE `role_screen_permissions`
  ADD PRIMARY KEY (`role_name`,`screen_id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- Indexes for table `screens`
--
ALTER TABLE `screens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `screen_key` (`screen_key`);

--
-- Indexes for table `screen_time_logs`
--
ALTER TABLE `screen_time_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_log_date` (`user_id`,`log_date`),
  ADD KEY `fk_screentime_tenant` (`tenant_id`);

--
-- Indexes for table `service_assignments`
--
ALTER TABLE `service_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_assignment_user_idx` (`user_id`);

--
-- Indexes for table `student_scores`
--
ALTER TABLE `student_scores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_score` (`user_id`,`academic_year`,`assessment_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `assessment_id` (`assessment_id`);

--
-- Indexes for table `system_audit_logs`
--
ALTER TABLE `system_audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_system_admin` (`system_admin_id`),
  ADD KEY `idx_tenant` (`affected_tenant_id`),
  ADD KEY `idx_timestamp` (`timestamp`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_setting_key` (`setting_key`);

--
-- Indexes for table `system_statistics`
--
ALTER TABLE `system_statistics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date` (`statistics_date`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tenant_profile_settings`
--
ALTER TABLE `tenant_profile_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenant_id` (`tenant_id`,`widget_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `user_screen_permissions`
--
ALTER TABLE `user_screen_permissions`
  ADD PRIMARY KEY (`user_id`,`screen_id`),
  ADD KEY `screen_id` (`screen_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `assigned_books`
--
ALTER TABLE `assigned_books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `batch_enrollments`
--
ALTER TABLE `batch_enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `book_comments`
--
ALTER TABLE `book_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `book_likes`
--
ALTER TABLE `book_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `change_logs`
--
ALTER TABLE `change_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `custom_fields`
--
ALTER TABLE `custom_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `custom_field_options`
--
ALTER TABLE `custom_field_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `custom_field_values`
--
ALTER TABLE `custom_field_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT for table `daily_topics`
--
ALTER TABLE `daily_topics`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `development_notes`
--
ALTER TABLE `development_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `family_links`
--
ALTER TABLE `family_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `learning_content`
--
ALTER TABLE `learning_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `learning_content_bookmarks`
--
ALTER TABLE `learning_content_bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `learning_content_comments`
--
ALTER TABLE `learning_content_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `learning_content_likes`
--
ALTER TABLE `learning_content_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pending_registrations`
--
ALTER TABLE `pending_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `platform_links`
--
ALTER TABLE `platform_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `private_posts`
--
ALTER TABLE `private_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `private_post_comments`
--
ALTER TABLE `private_post_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `private_post_likes`
--
ALTER TABLE `private_post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `public_posts`
--
ALTER TABLE `public_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `public_post_comments`
--
ALTER TABLE `public_post_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `public_post_likes`
--
ALTER TABLE `public_post_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `recommended_books`
--
ALTER TABLE `recommended_books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `screens`
--
ALTER TABLE `screens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `screen_time_logs`
--
ALTER TABLE `screen_time_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `service_assignments`
--
ALTER TABLE `service_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_scores`
--
ALTER TABLE `student_scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `system_audit_logs`
--
ALTER TABLE `system_audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `system_statistics`
--
ALTER TABLE `system_statistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tenant_profile_settings`
--
ALTER TABLE `tenant_profile_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assigned_books`
--
ALTER TABLE `assigned_books`
  ADD CONSTRAINT `assigned_books_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assigned_books_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assigned_books_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendance_recorded_by` FOREIGN KEY (`recorded_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `audit_logs_ibfk_2` FOREIGN KEY (`affected_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `batch_enrollments`
--
ALTER TABLE `batch_enrollments`
  ADD CONSTRAINT `batch_enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `batch_enrollments_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_comments`
--
ALTER TABLE `book_comments`
  ADD CONSTRAINT `book_comments_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `book_likes`
--
ALTER TABLE `book_likes`
  ADD CONSTRAINT `book_likes_ibfk_1` FOREIGN KEY (`assigned_book_id`) REFERENCES `assigned_books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `book_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `change_logs`
--
ALTER TABLE `change_logs`
  ADD CONSTRAINT `change_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `change_logs_ibfk_2` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_fields`
--
ALTER TABLE `custom_fields`
  ADD CONSTRAINT `custom_fields_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_field_options`
--
ALTER TABLE `custom_field_options`
  ADD CONSTRAINT `custom_field_options_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `custom_fields` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_field_values`
--
ALTER TABLE `custom_field_values`
  ADD CONSTRAINT `custom_field_values_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `custom_field_values_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `custom_fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `custom_field_values_ibfk_3` FOREIGN KEY (`option_id`) REFERENCES `custom_field_options` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `department_members`
--
ALTER TABLE `department_members`
  ADD CONSTRAINT `department_members_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `department_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `development_notes`
--
ALTER TABLE `development_notes`
  ADD CONSTRAINT `fk_notes_admin_id` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_notes_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `family_links`
--
ALTER TABLE `family_links`
  ADD CONSTRAINT `fk_link_parent` FOREIGN KEY (`parent_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_link_student` FOREIGN KEY (`student_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `learning_content`
--
ALTER TABLE `learning_content`
  ADD CONSTRAINT `learning_content_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `learning_content_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `learning_content_bookmarks`
--
ALTER TABLE `learning_content_bookmarks`
  ADD CONSTRAINT `learning_content_bookmarks_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `learning_content` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `learning_content_bookmarks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `learning_content_comments`
--
ALTER TABLE `learning_content_comments`
  ADD CONSTRAINT `learning_content_comments_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `learning_content` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `learning_content_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `learning_content_likes`
--
ALTER TABLE `learning_content_likes`
  ADD CONSTRAINT `learning_content_likes_ibfk_1` FOREIGN KEY (`content_id`) REFERENCES `learning_content` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `learning_content_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plans_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plans_ibfk_3` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `platform_links`
--
ALTER TABLE `platform_links`
  ADD CONSTRAINT `fk_platform_links_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `private_posts`
--
ALTER TABLE `private_posts`
  ADD CONSTRAINT `private_posts_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `private_posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `private_post_comments`
--
ALTER TABLE `private_post_comments`
  ADD CONSTRAINT `fk_private_comment_post` FOREIGN KEY (`post_id`) REFERENCES `private_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_private_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `private_post_likes`
--
ALTER TABLE `private_post_likes`
  ADD CONSTRAINT `private_post_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `private_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `private_post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `public_posts`
--
ALTER TABLE `public_posts`
  ADD CONSTRAINT `fk_public_post_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `public_post_comments`
--
ALTER TABLE `public_post_comments`
  ADD CONSTRAINT `fk_public_comment_post` FOREIGN KEY (`post_id`) REFERENCES `public_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_public_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `public_post_likes`
--
ALTER TABLE `public_post_likes`
  ADD CONSTRAINT `fk_public_like_post` FOREIGN KEY (`post_id`) REFERENCES `public_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_public_like_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recommended_books`
--
ALTER TABLE `recommended_books`
  ADD CONSTRAINT `fk_book_student` FOREIGN KEY (`student_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_screen_permissions`
--
ALTER TABLE `role_screen_permissions`
  ADD CONSTRAINT `role_screen_permissions_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `screen_time_logs`
--
ALTER TABLE `screen_time_logs`
  ADD CONSTRAINT `fk_screentime_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_screentime_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `service_assignments`
--
ALTER TABLE `service_assignments`
  ADD CONSTRAINT `fk_assignment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_scores`
--
ALTER TABLE `student_scores`
  ADD CONSTRAINT `student_scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_scores_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_scores_ibfk_3` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenant_profile_settings`
--
ALTER TABLE `tenant_profile_settings`
  ADD CONSTRAINT `tenant_profile_settings_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`);

--
-- Constraints for table `user_screen_permissions`
--
ALTER TABLE `user_screen_permissions`
  ADD CONSTRAINT `user_screen_permissions_ibfk_1` FOREIGN KEY (`screen_id`) REFERENCES `screens` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
