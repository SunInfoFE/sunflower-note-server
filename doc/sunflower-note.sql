/*
Navicat MySQL Data Transfer

Source Server         : MySQL
Source Server Version : 50720
Source Host           : localhost:33060
Source Database       : weeklyreport_db

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2018-04-12 16:13:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `email_info`
-- ----------------------------
DROP TABLE IF EXISTS `email_info`;
CREATE TABLE `email_info` (
  `email` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `licenseKey` char(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` enum('unactivated','activated') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unactivated',
  `activeCode` char(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`email`,`activeCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of email_info
-- ----------------------------

-- ----------------------------
-- Table structure for `group_info`
-- ----------------------------
DROP TABLE IF EXISTS `group_info`;
CREATE TABLE `group_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `memberNum` int(4) DEFAULT '0',
  `remark` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of group_info
-- ----------------------------

-- ----------------------------
-- Table structure for `journal_info`
-- ----------------------------
DROP TABLE IF EXISTS `journal_info`;
CREATE TABLE `journal_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `task` varchar(255) CHARACTER SET utf8 NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `status` enum('finished','unfinished') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unfinished',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of journal_info
-- ----------------------------

-- ----------------------------
-- Table structure for `report_info`
-- ----------------------------
DROP TABLE IF EXISTS `report_info`;
CREATE TABLE `report_info` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `title` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `summary` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `plan` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastUpdateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `week` date NOT NULL,
  `status` enum('public','private') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'private',
  `email` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `groupId` int(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of report_info
-- ----------------------------

-- ----------------------------
-- Table structure for `sendmail_info`
-- ----------------------------
DROP TABLE IF EXISTS `sendmail_info`;
CREATE TABLE `sendmail_info` (
  `email` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `name` char(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sendmail_info
-- ----------------------------

-- ----------------------------
-- Table structure for `user_info`
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `email` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `name` char(20) COLLATE utf8_unicode_ci NOT NULL,
  `sex` enum('female','male') COLLATE utf8_unicode_ci DEFAULT NULL,
  `remark` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `groupId` int(20) NOT NULL,
  `password` char(30) COLLATE utf8_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user_info
-- ----------------------------

-- ----------------------------
-- Table structure for `_mysql_session_store`
-- ----------------------------
DROP TABLE IF EXISTS `_mysql_session_store`;
CREATE TABLE `_mysql_session_store` (
  `id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `expires` bigint(20) DEFAULT NULL,
  `data` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of _mysql_session_store
-- ----------------------------