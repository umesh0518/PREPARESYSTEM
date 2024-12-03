-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: prepare
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `EVENTS`
--
Use PREPARE;
DROP TABLE IF EXISTS `EVENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`EVENT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVENTS`
--

LOCK TABLES `EVENTS` WRITE;
/*!40000 ALTER TABLE `EVENTS` DISABLE KEYS */;
INSERT INTO `EVENTS` VALUES (1,1,'Event 1',NULL,5,'psychomotor','dexterity',NULL,'2017-06-27 04:42:55','2017-06-27 04:42:55',-1,-1,-1,-1,-1,'no info'),(2,1,'Event 2',NULL,18,'psychomotor','dexterity',NULL,'2017-06-27 04:43:45','2017-06-27 04:43:45',56,65,34,45,45,'no info'),(3,3,'Event 1',NULL,24,'psychomotor','speed of skill',NULL,'2017-06-27 06:10:47','2017-06-27 06:10:47',-1,-1,79,-1,54,'Atrial Enlargement, Right'),(4,5,'Event 1',NULL,18,'cognitive','medical/procedural knowledge',NULL,'2017-06-27 08:08:33','2017-06-27 08:08:33',-1,-1,-1,-1,115,'no info'),(5,5,'Event 2',NULL,72,'psychomotor','critical/clinical decision making',NULL,'2017-06-27 08:09:24','2017-06-27 08:09:24',90,110,120,56,89,'no info'),(6,6,'Event 1',NULL,20,'psychomotor','dexterity',NULL,'2017-06-27 08:31:33','2017-06-27 08:31:33',120,-1,-1,-1,-1,'Asystole');
/*!40000 ALTER TABLE `EVENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PLAYED_EVENTS`
--

DROP TABLE IF EXISTS `PLAYED_EVENTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYED_EVENTS` (
  `PLAY_ID` int(11) NOT NULL,
  `EVENT_ID` varchar(64) NOT NULL,
  `POINTS` varchar(64) NOT NULL DEFAULT '50',
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CATEGORY` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PLAYED_EVENTS`
--

LOCK TABLES `PLAYED_EVENTS` WRITE;
/*!40000 ALTER TABLE `PLAYED_EVENTS` DISABLE KEYS */;
INSERT INTO `PLAYED_EVENTS` VALUES (6,'6','97','2017-06-27 08:33:55',1,NULL);
/*!40000 ALTER TABLE `PLAYED_EVENTS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PLAYS`
--

DROP TABLE IF EXISTS `PLAYS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PLAYS` (
  `PLAY_ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL,
  `TRAINEE_F_NAME` varchar(64) NOT NULL,
  `SCENARIO_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TRAINEE_L_NAME` varchar(64) NOT NULL,
  `TRAINEE_DISCIPLINE` varchar(45) NOT NULL,
  `TRAINEE_YEARS` int(11) NOT NULL,
  PRIMARY KEY (`PLAY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PLAYS`
--

LOCK TABLES `PLAYS` WRITE;
/*!40000 ALTER TABLE `PLAYS` DISABLE KEYS */;
INSERT INTO `PLAYS` VALUES (1,'1','fds',47,'2017-06-26 05:18:13','fd','gfd',1),(2,'1','hamza',58,'2017-06-27 03:56:10','owais','anestheology',3),(3,'1','talha',58,'2017-06-27 03:57:52','owais','engineering',5),(4,'1','hamza',58,'2017-06-27 04:00:36','owais','engineering',1),(5,'1','talha',58,'2017-06-27 04:01:52','owais','engineering',1),(6,'1','Talha',6,'2017-06-27 08:33:55','Owais','HM',1);
/*!40000 ALTER TABLE `PLAYS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SCENARIO`
--

DROP TABLE IF EXISTS `SCENARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SCENARIO` (
  `SCENARIO_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SCENARIO_NAME` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATE_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `TIME_DURATION` int(11) NOT NULL,
  `CATEGORY` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`SCENARIO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SCENARIO`
--

LOCK TABLES `SCENARIO` WRITE;
/*!40000 ALTER TABLE `SCENARIO` DISABLE KEYS */;
INSERT INTO `SCENARIO` VALUES (1,'Trauma 1','2017-06-27 04:41:22','2017-06-27 04:41:22',180,'ICU'),(2,'Trauma 2','2017-06-27 04:41:43','2017-06-27 04:41:43',240,'ICU'),(3,'Trauma 3','2017-06-27 06:09:39','2017-06-27 06:09:39',240,'ICU'),(4,'Trauma 4','2017-06-27 07:54:08','2017-06-27 07:54:08',120,'ANESTHESIA'),(5,'Trauma 6','2017-06-27 08:07:25','2017-06-27 08:07:25',180,'ICU'),(6,'Trauma 6','2017-06-27 08:30:35','2017-06-27 08:30:35',180,'ICU');
/*!40000 ALTER TABLE `SCENARIO` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

USE prepare;
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mowais','$2a$10$ZzsIfwXKVy.mxD.nUni9AuDxPP57WNVevU6g44k1fN/GLeUrNiMXW','hamza','owais','CS',1),(2,'spapada','$2a$10$IfSFEeSZZ89X47Nzc/fdAufLe4zzrciM7mCTjUjLrPyZKimREJz6O','Scott','Papada','Anesthesiology',3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-27  9:26:48
