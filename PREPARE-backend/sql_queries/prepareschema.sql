-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: prepare
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `course` (
  `COURSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_NAME` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL,
  `COURSE_NUMBER` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `DEPARTMENT` varchar(45) DEFAULT NULL,
  `INACTIVE` int(11) NOT NULL DEFAULT '0',
  `coursecol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`COURSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empaticabanddata`
--

DROP TABLE IF EXISTS `empaticabanddata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `empaticabanddata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` decimal(24,4) NOT NULL,
  `label` varchar(45) NOT NULL,
  `value` decimal(15,7) NOT NULL,
  `serialNumber` varchar(45) NOT NULL,
  `deviceConnectTime` decimal(24,0) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=862626 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `events` (
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
) ENGINE=InnoDB AUTO_INCREMENT=196 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `learners`
--

DROP TABLE IF EXISTS `learners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `learners` (
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
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `physlogicaltable`
--

DROP TABLE IF EXISTS `physlogicaltable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `physlogicaltable` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `played_events`
--

DROP TABLE IF EXISTS `played_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `played_events` (
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
) ENGINE=InnoDB AUTO_INCREMENT=993 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plays`
--

DROP TABLE IF EXISTS `plays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `plays` (
  `PLAY_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `SCENARIO_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `INACTIVE` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`PLAY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plays_comments`
--

DROP TABLE IF EXISTS `plays_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `plays_comments` (
  `ROW_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COMMENT` text NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PLAY_ID` int(11) NOT NULL,
  PRIMARY KEY (`ROW_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plays_trainee`
--

DROP TABLE IF EXISTS `plays_trainee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `plays_trainee` (
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
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `plays_vid`
--

DROP TABLE IF EXISTS `plays_vid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `plays_vid` (
  `PLAYS_VID_ID` int(11) NOT NULL AUTO_INCREMENT,
  `PLAY_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PATH` text NOT NULL,
  `NAME` varchar(45) NOT NULL,
  PRIMARY KEY (`PLAYS_VID_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `postassessment_response`
--

DROP TABLE IF EXISTS `postassessment_response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `postassessment_response` (
  `RESPONSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `LEARNER_ID` int(11) NOT NULL,
  `LEARNER_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `LEARNER_DETAIL` mediumtext NOT NULL,
  `FORMDATA` mediumtext NOT NULL,
  PRIMARY KEY (`RESPONSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preassessment_response`
--

DROP TABLE IF EXISTS `preassessment_response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `preassessment_response` (
  `RESPONSE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `LEARNER_ID` int(11) NOT NULL,
  `LEARNER_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `LEARNER_DETAIL` mediumtext NOT NULL,
  `FORMDATA` mediumtext NOT NULL,
  PRIMARY KEY (`RESPONSE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenario`
--

DROP TABLE IF EXISTS `scenario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scenario` (
  `SCENARIO_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `TIME_DURATION` int(11) NOT NULL,
  `CATEGORY` varchar(45) DEFAULT NULL,
  `COURSE_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`SCENARIO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenario_goals`
--

DROP TABLE IF EXISTS `scenario_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scenario_goals` (
  `GOAL_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `GOAL_NAME` text,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`GOAL_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenario_postassessment`
--

DROP TABLE IF EXISTS `scenario_postassessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scenario_postassessment` (
  `QUESTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `QUESTIONTYPE` varchar(255) NOT NULL,
  `QUESTIONSTRING` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `TEXT` mediumtext NOT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUESTION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenario_preassessment`
--

DROP TABLE IF EXISTS `scenario_preassessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scenario_preassessment` (
  `QUESTION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `COURSE_ID` int(11) NOT NULL,
  `QUESTIONTYPE` varchar(255) NOT NULL,
  `QUESTIONSTRING` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `TEXT` mediumtext NOT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`QUESTION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=326 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenario_role`
--

DROP TABLE IF EXISTS `scenario_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `scenario_role` (
  `SCENARIO_ROLE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_ID` int(11) NOT NULL,
  `ROLE_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `NUMBER` int(11) NOT NULL,
  PRIMARY KEY (`SCENARIO_ROLE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vr_data`
--

DROP TABLE IF EXISTS `vr_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `vr_data` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `START_TIME` int(11) NOT NULL,
  `END_TIME` int(11) NOT NULL,
  `SCORE` int(11) NOT NULL,
  `VR_SIM_ID` int(11) NOT NULL,
  `VR_SUBJECT_ID` int(11) NOT NULL,
  `ANSWER` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'prepare'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-15 21:11:51
