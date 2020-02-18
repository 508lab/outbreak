-- phpMyAdmin SQL Dump
-- version 4.0.10.20
-- https://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2020-02-18 21:55:31
-- 服务器版本: 5.5.61-log
-- PHP 版本: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `mtest`
--
CREATE DATABASE IF NOT EXISTS `mtest` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `mtest`;

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
(1601373310, '大哥', '矿业系', '17矿井通风与安全班');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- 转存表中的数据 `temperature`
--

INSERT INTO `temperature` (`id`, `sid`, `record`, `time`) VALUES
(1, 21, 35.6, '2020-02-17'),
(6, 21, 36.5, '2020-02-18'),
(13, 23, 36.3, '2020-02-18');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=24 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `wuhan`, `sex`, `department`, `clas`, `studentid`, `city`, `password`, `travel`) VALUES
(21, '大哥', 0, 0, '矿业系', '17矿井通风与安全班', 1601373310, '北京', '5590c48589361a82ee8476a3286e40e13f347949fb1703beb307ea9a0808a40e', ''),
(23, '武杰', 1, 0, '信息工程系', '17物流信息技术班', 1501373434, '北京', '709fd61da959694852b3d28ae67931a22d4189d192b85d2c6685aa5e948c5787', '[{"purpose":"晋城","way":"火车","trains1":"G624","start_time":"2020-02-01","en_time":"2020-03-01","trains2":"G621","note":"无"},{"purpose":"晋城","way":"火车","trains1":"G621","start_time":"2020-02-01","en_time":"2020-03-04","trains2":"无","note":""}]');

--
-- 限制导出的表
--

--
-- 限制表 `temperature`
--
ALTER TABLE `temperature`
  ADD CONSTRAINT `temperature_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `user` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
