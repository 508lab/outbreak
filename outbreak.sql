-- phpMyAdmin SQL Dump
-- version 4.0.10.20
-- https://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2020-02-22 16:09:31
-- 服务器版本: 5.5.61-log
-- PHP 版本: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `outbreak`
--
CREATE DATABASE IF NOT EXISTS `outbreak` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `outbreak`;

-- --------------------------------------------------------

--
-- 表的结构 `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT '用户名',
  `password` varchar(12) NOT NULL COMMENT '密码',
  `level` int(1) NOT NULL COMMENT '级别',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `config`
--

INSERT INTO `config` (`id`, `name`, `password`, `level`) VALUES
(1, 'admin', '123456', 0);

-- --------------------------------------------------------

--
-- 表的结构 `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `id` int(11) NOT NULL COMMENT '学号',
  `name` varchar(300) NOT NULL COMMENT '姓名',
  `clas` varchar(300) NOT NULL COMMENT '班级',
  `department` varchar(300) NOT NULL COMMENT '所在系',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `students`
--

INSERT INTO `students` (`id`, `name`, `clas`, `department`) VALUES
(1501373434, '武杰', '17物流信息技术班', '信息工程系'),
(1501373435, '测试1', '17物流信息技术班', '信息工程系'),
(1601373310, '大哥', '17矿井通风与安全班', '矿业系');

-- --------------------------------------------------------

--
-- 表的结构 `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL DEFAULT '老师' COMMENT '姓名',
  `wuhan` int(1) NOT NULL DEFAULT '1' COMMENT '是否去过武汉0:是 1:否',
  `sex` int(1) NOT NULL DEFAULT '1' COMMENT '0:男 1:女',
  `department` varchar(300) NOT NULL DEFAULT '信息工程系' COMMENT '所在系',
  `studentid` int(10) NOT NULL COMMENT '工号',
  `city` varchar(250) NOT NULL DEFAULT '晋城' COMMENT '目前所在城市',
  `password` varchar(300) NOT NULL DEFAULT 'b8ad08a3a547e35829b821b75370301dd8c4b06bdd7771f9b541a75914068718' COMMENT '密码',
  `travel` text NOT NULL COMMENT '出行信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `studentid` (`studentid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- 转存表中的数据 `teacher`
--

INSERT INTO `teacher` (`id`, `name`, `wuhan`, `sex`, `department`, `studentid`, `city`, `password`, `travel`) VALUES
(24, '老师', 1, 1, '信息工程系', 123456, '北京', 'b8ad08a3a547e35829b821b75370301dd8c4b06bdd7771f9b541a75914068718', '[{"purpose":"北京","way":"大巴","trains1":"无","start_time":"2020-01-03","en_time":"2020-03-05","trains2":"无","note":"无异常"}]');

-- --------------------------------------------------------

--
-- 表的结构 `teachertemp`
--

CREATE TABLE IF NOT EXISTS `teachertemp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '老师Id',
  `record` float NOT NULL COMMENT '体温',
  `time` date NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `studentid` (`sid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `teachertemp`
--

INSERT INTO `teachertemp` (`id`, `sid`, `record`, `time`) VALUES
(15, 24, 36.5, '2020-02-21'),
(16, 24, 37.3, '2020-02-22');

-- --------------------------------------------------------

--
-- 表的结构 `temperature`
--

CREATE TABLE IF NOT EXISTS `temperature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '用户Id',
  `record` float NOT NULL COMMENT '体温',
  `time` date NOT NULL COMMENT '时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `studentid` (`sid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- 转存表中的数据 `temperature`
--

INSERT INTO `temperature` (`id`, `sid`, `record`, `time`) VALUES
(1, 21, 39.6, '2020-02-01'),
(6, 25, 39.5, '2020-02-12'),
(13, 25, 37.1, '2020-02-19'),
(14, 25, 37.1, '2020-02-21'),
(15, 25, 36.5, '2020-02-02');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL COMMENT '姓名',
  `wuhan` int(1) NOT NULL COMMENT '是否去过武汉0:是 1:否',
  `sex` int(1) NOT NULL COMMENT '0:男 1:女',
  `department` varchar(300) NOT NULL DEFAULT '1' COMMENT '所在系',
  `clas` varchar(250) NOT NULL COMMENT '所在班级',
  `studentid` int(10) NOT NULL COMMENT '学号',
  `city` varchar(250) NOT NULL COMMENT '目前所在城市',
  `password` varchar(300) NOT NULL COMMENT '密码',
  `travel` text NOT NULL COMMENT '出行信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `studentid` (`studentid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `wuhan`, `sex`, `department`, `clas`, `studentid`, `city`, `password`, `travel`) VALUES
(21, '大哥', 0, 0, '矿业系', '17矿井通风与安全班', 1601373310, '北京', 'b8ad08a3a547e35829b821b75370301dd8c4b06bdd7771f9b541a75914068718', ''),
(25, '武杰', 1, 0, '信息工程系', '17物流信息技术班', 1501373434, '北京', 'b8ad08a3a547e35829b821b75370301dd8c4b06bdd7771f9b541a75914068718', '[{"purpose":"北京","way":"大巴","trains1":"无","start_time":"2020-01-03","en_time":"2020-01-05","trains2":"无","note":"无异常"},{"purpose":"北京","way":"大巴","trains1":"无","start_time":"2020-01-08","en_time":"2020-01-10","trains2":"无","note":""}]');

--
-- 限制导出的表
--

--
-- 限制表 `teachertemp`
--
ALTER TABLE `teachertemp`
  ADD CONSTRAINT `teachertemp_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `teacher` (`id`);

--
-- 限制表 `temperature`
--
ALTER TABLE `temperature`
  ADD CONSTRAINT `temperature_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `user` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
