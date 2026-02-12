-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2026 at 01:31 PM
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
(124, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '68004c46-4c24-4715-a3cf-bf4aed66e667', '2018-06-02', 'morning', 'present', 'awudemihiret', NULL, '2026-02-09 15:33:16'),
(136, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'present', 'learning', NULL, '2026-02-12 10:12:31'),
(137, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'late', 'learning', '14:11:00', '2026-02-12 10:12:31'),
(138, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'learning', NULL, '2026-02-12 10:12:31'),
(139, 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'permission', 'learning', NULL, '2026-02-12 10:12:31'),
(140, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'learning', NULL, '2026-02-12 10:12:31'),
(141, '525d83cc-ce22-4390-8165-cc5a7279e355', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'present', 'learning', NULL, '2026-02-12 10:12:31'),
(142, '6534df26-6393-4627-b27b-34396e607761', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'permission', 'learning', NULL, '2026-02-12 10:12:31'),
(143, 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'learning', NULL, '2026-02-12 10:12:31'),
(144, '68004c46-4c24-4715-a3cf-bf4aed66e667', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'learning', NULL, '2026-02-12 10:12:31'),
(145, 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'learning', NULL, '2026-02-12 10:12:31'),
(146, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'present', 'learning', NULL, '2026-02-12 10:12:31'),
(147, '4e42994e-d3c8-4008-ab52-64d1645e5fd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(148, '82652f0f-58fe-400c-9e40-a12e8736abc9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'present', 'special', NULL, '2026-02-12 10:35:17'),
(149, '79eb4ca6-a03c-406d-a55f-b25f0da867ac', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'permission', 'special', NULL, '2026-02-12 10:35:17'),
(150, 'ea31f226-f8ca-472e-8f1a-4587df9d6073', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(151, '0259a4d3-ac8c-4665-aab9-0c4102fae5f1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(152, '525d83cc-ce22-4390-8165-cc5a7279e355', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(153, '6534df26-6393-4627-b27b-34396e607761', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(154, 'd0220f1a-1bf9-47a7-82de-d6c4bc28fbd8', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(155, '68004c46-4c24-4715-a3cf-bf4aed66e667', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(156, 'cb2c0c23-ea4b-41be-9eff-2c0e7f43e6df', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17'),
(157, 'c876f41c-4470-4ecf-9a08-3e9d9f01207f', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '79eb4ca6-a03c-406d-a55f-b25f0da867ac', '2018-06-05', 'morning', 'absent', 'special', NULL, '2026-02-12 10:35:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`user_id`,`attendance_date`,`session`,`attendance_type`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `fk_attendance_recorded_by` (`recorded_by_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=158;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendance_recorded_by` FOREIGN KEY (`recorded_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
