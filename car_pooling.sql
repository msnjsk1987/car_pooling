-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2015 at 12:04 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `car_pooling`
--

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE IF NOT EXISTS `rides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `departure` varchar(50) NOT NULL,
  `arrival` varchar(50) NOT NULL,
  `departure_date` varchar(50) NOT NULL,
  `departure_time` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `seats` int(11) NOT NULL,
  `further_details` text NOT NULL,
  `luggage_size` varchar(20) NOT NULL,
  `leave` varchar(20) NOT NULL,
  `detour` varchar(20) NOT NULL,
  `status` int(11) NOT NULL,
  `userid` varchar(20) NOT NULL,
  `created_date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`id`, `departure`, `arrival`, `departure_date`, `departure_time`, `price`, `seats`, `further_details`, `luggage_size`, `leave`, `detour`, `status`, `userid`, `created_date`) VALUES
(6, 'Bangalore, Karnataka, India', 'Salem, Tamil Nadu, India', '2015-04-28T18:30:00.000Z', '2015-04-25T12:53:37.838Z', 300, 4, 'Please add further details about your ride - it''ll save you answering lots of questions from co-travellers.', 'medium', 'rightOnTime', '15detour', 0, '981243725226988', '2015-04-25 16:00:51'),
(7, 'Chennai, Tamil Nadu, India', 'Salem, Tamil Nadu, India', '2015-04-28T18:30:00.000Z', '2015-04-25T13:23:47.149Z', 1000, 5, 'Please add further details about your ride - it''ll save you answering lots of questions from co-travellers.Please add further details about your ride - it''ll save you answering lots of questions from co-travellers.', 'small', 'rightOnTime', '15detour', 0, '981243725226988', '2015-04-25 16:29:24'),
(8, 'Chennai, Tamil Nadu, India', 'Salem, Tamil Nadu, India', '2015-04-28T18:30:00.000Z', '2015-04-25T13:30:41.762Z', 455, 5, 'fsdfsf', 'small', '15MinWindow', '15detour', 0, '981243725226988', '2015-04-25 16:36:18'),
(9, 'Salem, Tamil Nadu, India', 'Kerala, India', '2015-04-29T18:30:00.000Z', '2015-04-25T15:37:19.472Z', 677, 2, 'Please add further details about your ride - it''ll save you answering lots of questions from co-travellers.', 'small', '15MinWindow', '15detour', 0, '0', '2015-04-25 18:43:06');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
