-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2023 at 06:12 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prei`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `instructor` varchar(255) DEFAULT NULL,
  `price` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `instructor`, `price`, `image`, `createdAt`, `updatedAt`) VALUES
(1, 'Real Estate Investment Guide', 'This is a dummy course and has nothing to do with real payment.', 'Khawaja Hassan Butt', '25000', '1682524168956--1660481871085--Best-Types-Of-Real-Estate-Investments.jpg', '2023-04-26 15:49:28', '2023-04-26 15:49:28'),
(2, 'Become A Certified Broker', 'This Is A Dummy Course.', 'Khawaja Hassan Butt', '30000', '1682524663284--1654085659821--certificate-in-real-estate-process-for-development-investment-repdi-course.jpg', '2023-04-26 15:57:43', '2023-04-26 15:57:43'),
(3, 'Construction Finance', 'This Is A Dummy Course.', 'Khawaja Hassan Butt', '15000', '1682524719415--1653640150245--1653564143952--download.jfif', '2023-04-26 15:58:39', '2023-04-26 15:58:39');

-- --------------------------------------------------------

--
-- Table structure for table `enrolled_courses`
--

CREATE TABLE `enrolled_courses` (
  `id` int(11) NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CourseId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enrolled_courses`
--

INSERT INTO `enrolled_courses` (`id`, `UserId`, `CourseId`) VALUES
(1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `province` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `province`, `city`, `dob`, `passwordHash`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Ahmad Baig', 'ahmad@gmail.com', '03005025056', 'Punjab', 'Lahore', '1998-12-10', '$2b$10$HZxC0mSZJ8aUqWKhx0iiWeqfoW7EUtIdI4jHkOe0TSXnlaP.1NUYW', 'admin', '2023-04-26 15:13:00', '2023-04-26 15:13:00'),
(2, 'Abdul Wasay', 'wasay@gmail.com', '03217869365', 'Punjab', 'Lahore', '1998-06-25', '$2b$10$KjFR52DNSmpCxCXKjWzZqu7xVUxdrPQMMpt5cTN/wVEpgztqGTUTq', 'user', '2023-04-26 15:44:01', '2023-04-26 15:44:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrolled_courses`
--
ALTER TABLE `enrolled_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Enrolled_Courses_CourseId_UserId_unique` (`UserId`,`CourseId`),
  ADD KEY `CourseId` (`CourseId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrolled_courses`
--
ALTER TABLE `enrolled_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrolled_courses`
--
ALTER TABLE `enrolled_courses`
  ADD CONSTRAINT `enrolled_courses_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrolled_courses_ibfk_2` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
