-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2020-05-03 20:06:07
-- 服务器版本： 5.5.62-log
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `outbreak`
--
CREATE DATABASE IF NOT EXISTS `outbreak` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `outbreak`;

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL COMMENT '用户名',
  `password` varchar(12) NOT NULL COMMENT '密码',
  `level` int(1) NOT NULL COMMENT '级别'
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='utf8_general_ci';

--
-- 转存表中的数据 `admin`
--

INSERT INTO `admin` (`id`, `name`, `password`, `level`) VALUES
(1, 'admin', '123456', 0);

-- --------------------------------------------------------

--
-- 表的结构 `article`
--

CREATE TABLE IF NOT EXISTS `article` (
  `id` int(11) NOT NULL,
  `title` char(250) NOT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容',
  `time` date NOT NULL,
  `tag` char(100) DEFAULT NULL COMMENT '标签',
  `sid` int(11) NOT NULL,
  `audit` int(1) NOT NULL DEFAULT '0' COMMENT '审核'
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COMMENT='utf8_general_ci';

--
-- 转存表中的数据 `article`
--

INSERT INTO `article` (`id`, `title`, `content`, `time`, `tag`, `sid`, `audit`) VALUES
(19, 'aaasdas', '<p>adaaaaaada</p>', '2020-04-19', '["0"]', 362, 1),
(21, 'adas', '<p>dasda</p>', '2020-04-25', '["0"]', 362, 0);

-- --------------------------------------------------------

--
-- 表的结构 `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '评论的时间',
  `sid` int(11) NOT NULL COMMENT '学生id',
  `content` varchar(350) NOT NULL COMMENT '评论内容',
  `aid` int(11) NOT NULL COMMENT '文章id'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `comments`
--

INSERT INTO `comments` (`id`, `time`, `sid`, `content`, `aid`) VALUES
(1, '2020-04-19 08:58:40', 362, '1', 19);

-- --------------------------------------------------------

--
-- 表的结构 `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL COMMENT '姓名',
  `sex` int(1) NOT NULL COMMENT '0:男 1:女',
  `department` varchar(300) NOT NULL COMMENT '所在系',
  `clas` varchar(250) NOT NULL COMMENT '所在班级',
  `studentid` varchar(12) NOT NULL COMMENT '学号',
  `password` varchar(300) NOT NULL,
  `email` char(100) DEFAULT NULL COMMENT '邮箱'
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8 COMMENT='utf8_general_ci';

--
-- 转存表中的数据 `students`
--

INSERT INTO `students` (`id`, `name`, `sex`, `department`, `clas`, `studentid`, `password`, `email`) VALUES
(362, 'test', 1, '信息工程系', '19物流信息技术班', '1501373434', 'c602e848d382024feb75f90b10425a86', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL DEFAULT '老师' COMMENT '姓名',
  `sex` int(1) NOT NULL DEFAULT '1' COMMENT '0:男 1:女',
  `department` varchar(300) NOT NULL DEFAULT '信息工程系' COMMENT '所在系',
  `studentid` varchar(12) NOT NULL COMMENT '工号',
  `password` varchar(300) NOT NULL DEFAULT 'c602e848d382024feb75f90b10425a86',
  `email` char(100) DEFAULT NULL COMMENT '邮箱'
) ENGINE=InnoDB AUTO_INCREMENT=1522 DEFAULT CHARSET=utf8 COMMENT='utf8_general_ci';

--
-- 转存表中的数据 `teacher`
--

INSERT INTO `teacher` (`id`, `name`, `sex`, `department`, `studentid`, `password`, `email`) VALUES
(1521, 'test', 1, '信息工程系', '123456', 'c602e848d382024feb75f90b10425a86', '2833324528@qq.com');

-- --------------------------------------------------------

--
-- 表的结构 `teachertemp`
--

CREATE TABLE IF NOT EXISTS `teachertemp` (
  `id` int(11) NOT NULL,
  `sid` int(11) NOT NULL COMMENT '老师Id',
  `record` float NOT NULL COMMENT '体温',
  `time` date NOT NULL COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `temperature`
--

CREATE TABLE IF NOT EXISTS `temperature` (
  `id` int(11) NOT NULL,
  `sid` int(11) NOT NULL COMMENT '用户Id',
  `record` float NOT NULL COMMENT '体温',
  `time` date NOT NULL COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sid` (`sid`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `sid` (`sid`),
  ADD KEY `aid` (`aid`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `studentid` (`studentid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `studentid` (`studentid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teachertemp`
--
ALTER TABLE `teachertemp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `studentid` (`sid`);

--
-- Indexes for table `temperature`
--
ALTER TABLE `temperature`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `studentid` (`sid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=363;
--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1522;
--
-- AUTO_INCREMENT for table `teachertemp`
--
ALTER TABLE `teachertemp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `temperature`
--
ALTER TABLE `temperature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 限制导出的表
--

--
-- 限制表 `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `article_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `students` (`id`);

--
-- 限制表 `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`aid`) REFERENCES `article` (`id`),
  ADD CONSTRAINT `studendcom` FOREIGN KEY (`sid`) REFERENCES `students` (`id`);

--
-- 限制表 `teachertemp`
--
ALTER TABLE `teachertemp`
  ADD CONSTRAINT `teachertemp_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `teacher` (`id`);

--
-- 限制表 `temperature`
--
ALTER TABLE `temperature`
  ADD CONSTRAINT `temperature_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `students` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
