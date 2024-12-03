-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: prepare
-- ------------------------------------------------------
-- Server version	5.7.18

-- !40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
-- !40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
-- !40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
-- !40101 SET NAMES utf8 */;
-- !40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
-- !40103 SET TIME_ZONE='+00:00' */;
-- !40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
-- !40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
-- !40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- !40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `COURSE`
--

DROP TABLE IF EXISTS `COURSE`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `COURSE` (
  `COURSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_NAME` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL,
  `COURSE_NUMBER` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `DEPARTMENT` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`COURSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `EVENTS`
--

DROP TABLE IF EXISTS `EVENTS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `EVENTS` (
  `EVENT_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_ID` int(11) NOT NULL,
  `EVENT_NAME` varchar(255) NOT NULL,
  `TIME_DURATION` int(11) DEFAULT NULL,
  `TIME_START` int(11) NOT NULL,
  `SKILL_TYPE` varchar(255) NOT NULL,
  `SPECIFIC_SKILL` varchar(255) NOT NULL,
  `WEIGHTAGE` int(11) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `HEART_RATE` int(11) DEFAULT NULL,
  `SYSTOLIC_BP` int(11) DEFAULT NULL,
  `DISTOLIC_BP` int(11) DEFAULT NULL,
  `SPO2` int(11) DEFAULT NULL,
  `R_RATE` int(11) DEFAULT NULL,
  `CARDIAC_RYTHM` varchar(255) DEFAULT NULL,
  `SCENARIO_ROLE_ID` int(11) NOT NULL,
  `OBJECTIVES` mediumtext,
  PRIMARY KEY (`EVENT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `LEARNERS`
--

DROP TABLE IF EXISTS `LEARNERS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `LEARNERS` (
  `LEARNER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `LEARNER_NAME` varchar(255) DEFAULT NULL,
  `ROCKET_ID` varchar(255) NOT NULL,
  `ROLE` varchar(255) DEFAULT NULL,
  `YEARS` int(11) DEFAULT NULL,
  `FACULTY` varchar(255) DEFAULT NULL,
  `COURSE_ID` int(11) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LEARNER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PLAYED_EVENTS`
--

DROP TABLE IF EXISTS `PLAYED_EVENTS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYED_EVENTS` (
  `PLAY_ID` int(11) NOT NULL,
  `EVENT_ID` varchar(64) NOT NULL,
  `POINTS` varchar(64) NOT NULL DEFAULT '50',
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CATEGORY` varchar(64) DEFAULT NULL,
  `SCENARIO_ROLE_ID` int(11) NOT NULL,
  `TIMESTAMP` varchar(16) DEFAULT NULL,
  `TIME` int(10) DEFAULT NULL,
  `SKILL_LEVEL` int(10) DEFAULT NULL,
  `OBJECTIVES` mediumtext,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=603 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PLAYS`
--

DROP TABLE IF EXISTS `PLAYS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYS` (
  `PLAY_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `SCENARIO_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PLAY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PLAYS_COMMENTS`
--

DROP TABLE IF EXISTS `PLAYS_COMMENTS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYS_COMMENTS` (
  `ROW_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COMMENT` text NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PLAY_ID` int(11) NOT NULL,
  PRIMARY KEY (`ROW_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PLAYS_TRAINEE`
--

DROP TABLE IF EXISTS `PLAYS_TRAINEE`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYS_TRAINEE` (
  `ROW_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PLAY_ID` int(11) NOT NULL,
  `TRAINEE_F_NAME` varchar(311) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TRAINEE_L_NAME` varchar(311) NOT NULL,
  `TRAINEE_DISCIPLINE` varchar(45) NOT NULL,
  `TRAINEE_YEARS` int(11) NOT NULL,
  `SCENARIO_ROLE_ID` int(11) NOT NULL,
  `RATING` int(11) NOT NULL,
  `DEVICECONNECTTIME` decimal(23,5) DEFAULT NULL,
  `SERIALNUMBER` varchar(45) DEFAULT NULL,
  `LEARNER_ID` int(11) NOT NULL,
  `ROCKET_ID` varchar(45) NOT NULL,
  PRIMARY KEY (`ROW_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PLAYS_VID`
--

DROP TABLE IF EXISTS `PLAYS_VID`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYS_VID` (
  `PLAYS_VID_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PLAY_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PATH` text NOT NULL,
  `NAME` varchar(45) NOT NULL,
  PRIMARY KEY (`PLAYS_VID_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `POSTASSESSMENT_RESPONSE`
--

DROP TABLE IF EXISTS `POSTASSESSMENT_RESPONSE`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `POSTASSESSMENT_RESPONSE` (
  `RESPONSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `LEARNER_ID` int(11) NOT NULL,
  `LEARNER_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `LEARNER_DETAIL` mediumtext NOT NULL,
  `FORMDATA` mediumtext NOT NULL,
  PRIMARY KEY (`RESPONSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PREASSESSMENT_RESPONSE`
--

DROP TABLE IF EXISTS `PREASSESSMENT_RESPONSE`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `PREASSESSMENT_RESPONSE` (
  `RESPONSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `LEARNER_ID` int(11) NOT NULL,
  `LEARNER_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `LEARNER_DETAIL` mediumtext NOT NULL,
  `FORMDATA` mediumtext NOT NULL,
  PRIMARY KEY (`RESPONSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCENARIO`
--

DROP TABLE IF EXISTS `SCENARIO`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO` (
  `SCENARIO_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `TIME_DURATION` int(11) NOT NULL,
  `CATEGORY` varchar(45) DEFAULT NULL,
  `COURSE_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`SCENARIO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCENARIO_GOALS`
--

DROP TABLE IF EXISTS `SCENARIO_GOALS`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO_GOALS` (
  `GOAL_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `GOAL_NAME` text,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`GOAL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCENARIO_POSTASSESSMENT`
--

DROP TABLE IF EXISTS `SCENARIO_POSTASSESSMENT`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO_POSTASSESSMENT` (
  `QUESTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `QUESTIONTYPE` varchar(255) NOT NULL,
  `QUESTIONSTRING` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `TEXT` mediumtext NOT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUESTION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCENARIO_PREASSESSMENT`
--

DROP TABLE IF EXISTS `SCENARIO_PREASSESSMENT`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO_PREASSESSMENT` (
  `QUESTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `QUESTIONTYPE` varchar(255) NOT NULL,
  `QUESTIONSTRING` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `TEXT` mediumtext NOT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUESTION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=latin1;
-- !40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SCENARIO_ROLE`
--

DROP TABLE IF EXISTS `SCENARIO_ROLE`;
-- !40101 SET @saved_cs_client     = @@character_set_client */;
-- !40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO_ROLE` (
  `SCENARIO_ROLE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_ID` int(11) NOT NULL,
  `ROLE_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `NUMBER` int(11) NOT NULL,
  PRIMARY KEY (`SCENARIO_ROLE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `empaticaBandData`;

CREATE TABLE `empaticaBandData` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` decimal(24,4) NOT NULL,
  `label` varchar(45) NOT NULL,
  `value` decimal(15,7) NOT NULL,
  `serialNumber` varchar(45) NOT NULL,
  `deviceConnectTime` decimal(24,0) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=862626 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `physlogicalTable`;

CREATE TABLE `physlogicalTable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `creationTimestamp` decimal(20,5) NOT NULL,
  `feature` varchar(45) NOT NULL,
  `value` decimal(20,5) NOT NULL,
  `SERIALNUMBER` varchar(45) NOT NULL,
  `DEVICECONNECTTIME` decimal(20,5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6794333 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` char(60) NOT NULL,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) NOT NULL,
  `discipline` varchar(45) NOT NULL,
  `experience` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
