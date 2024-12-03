-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: prepare
-- ------------------------------------------------------
-- Server version	5.7.18

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
  PRIMARY KEY (`EVENT_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EVENTS`
--

LOCK TABLES `EVENTS` WRITE;
/*!40000 ALTER TABLE `EVENTS` DISABLE KEYS */;
INSERT INTO `EVENTS` VALUES (23,1,'frr',NULL,45,'cognitive','critical/clinical decision making',NULL,'2017-06-18 18:25:44','2017-06-18 18:25:44'),(31,47,'Gappa',NULL,58,'psychomotor','critical/clinical decision making',NULL,'2017-06-18 23:50:23','2017-06-18 23:50:23'),(32,47,'JIhu',NULL,62,'cognitive','critical/clinical decision making',NULL,'2017-06-18 23:52:35','2017-06-18 23:52:35'),(33,48,'Airway Assesment',NULL,60,'cognitive','task prioritization',NULL,'2017-06-19 10:46:48','2017-06-19 10:46:48'),(34,48,'Apply Tourniqet',NULL,120,'psychomotor','time to initiation of care',NULL,'2017-06-19 10:48:06','2017-06-19 10:48:06'),(36,47,'hjjk',NULL,10,'cognitive','critical/clinical decision making',NULL,'2017-06-19 13:28:26','2017-06-19 13:28:26'),(37,49,'Event 1',NULL,20,'cognitive','task prioritization',NULL,'2017-06-20 14:04:05','2017-06-20 14:04:05'),(38,49,'event 2',NULL,50,'psychomotor','follow-up/ongoing assessment of patient status',NULL,'2017-06-20 14:04:21','2017-06-20 14:04:21'),(39,50,'Iniital Assessment',NULL,5,'cognitive','critical/clinical decision making',NULL,'2017-06-20 14:17:12','2017-06-20 14:17:12'),(40,50,'Establish IVs',NULL,30,'psychomotor','task efficiency (defined as both speed and quality of intervention)',NULL,'2017-06-20 14:19:00','2017-06-20 14:19:00'),(41,50,'Patient Crashes',NULL,120,'psychomotor','time to initiation of care',NULL,'2017-06-20 14:19:54','2017-06-20 14:19:54'),(42,51,'OR Team Communication',NULL,30,'behavioral','communication.',NULL,'2017-06-20 14:37:49','2017-06-20 14:37:49'),(43,51,'Assess Patient Depth of Anesthesia',NULL,60,'cognitive','medical/procedural knowledge',NULL,'2017-06-20 14:38:16','2017-06-20 14:38:16'),(44,51,'Patient Crashes',NULL,120,'psychomotor','critical/clinical decision making',NULL,'2017-06-20 14:39:12','2017-06-20 14:39:12'),(45,52,'Airway swells shut',NULL,180,'psychomotor','task efficiency (defined as both speed and quality of intervention)',NULL,'2017-06-20 15:38:12','2017-06-20 15:38:12'),(46,52,'Initial Assessment',NULL,5,'psychomotor','task efficiency (defined as both speed and quality of intervention)',NULL,'2017-06-20 15:40:51','2017-06-20 15:40:51'),(47,52,'Team Leader Call Out',NULL,30,'behavioral','communication.',NULL,'2017-06-20 15:41:24','2017-06-20 15:41:24'),(50,47,'this is test',NULL,20,'behavioral','leadership',NULL,'2017-06-21 10:36:42','2017-06-21 10:36:42'),(51,53,'Patient in SICU',NULL,60,'cognitive','task prioritization',NULL,'2017-06-21 11:03:49','2017-06-21 11:03:49'),(52,53,'Airway emergency',NULL,35,'psychomotor','medical/procedural knowledge',NULL,'2017-06-21 11:10:37','2017-06-21 11:10:37'),(53,53,'Chest Tube Insertion',NULL,120,'psychomotor','speed of skill',NULL,'2017-06-21 11:17:01','2017-06-21 11:17:01'),(54,53,'Death of patient',NULL,260,'behavioral','empathy/professionalism',NULL,'2017-06-21 11:18:52','2017-06-21 11:18:52');
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
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PLAYED_EVENTS`
--

LOCK TABLES `PLAYED_EVENTS` WRITE;
/*!40000 ALTER TABLE `PLAYED_EVENTS` DISABLE KEYS */;
INSERT INTO `PLAYED_EVENTS` VALUES (8,'31','16','2017-06-20 11:47:49',1),(8,'32','98','2017-06-20 11:47:49',2),(8,'36','73','2017-06-20 11:47:49',3),(9,'31','16','2017-06-20 11:56:27',4),(9,'32','98','2017-06-20 11:56:27',5),(9,'36','73','2017-06-20 11:56:27',6),(10,'31','16','2017-06-20 11:56:43',7),(10,'32','98','2017-06-20 11:56:43',8),(10,'36','73','2017-06-20 11:56:43',9),(11,'31','32','2017-06-20 12:00:01',10),(11,'32','86','2017-06-20 12:00:01',11),(11,'36','72','2017-06-20 12:00:01',12),(12,'31','32','2017-06-20 12:14:28',13),(12,'32','86','2017-06-20 12:14:28',14),(12,'36','72','2017-06-20 12:14:28',15),(13,'31','21','2017-06-20 12:19:41',16),(13,'32','86','2017-06-20 12:19:41',17),(13,'36','74','2017-06-20 12:19:41',18),(14,'31','96','2017-06-20 12:58:02',19),(14,'32','80','2017-06-20 12:58:02',20),(14,'36','11','2017-06-20 12:58:02',21),(15,'31','80','2017-06-20 13:32:20',22),(15,'32','99','2017-06-20 13:32:20',23),(15,'36','93','2017-06-20 13:32:20',24),(16,'37','97','2017-06-20 14:06:10',25),(16,'38','52','2017-06-20 14:06:10',26),(17,'45','51','2017-06-20 15:45:29',27),(17,'46','9','2017-06-20 15:45:29',28),(17,'47','73','2017-06-20 15:45:29',29),(18,'51','60','2017-06-21 11:15:52',30),(18,'52','85','2017-06-21 11:15:52',31),(19,'37','84','2017-06-21 15:10:52',32),(19,'38','69','2017-06-21 15:10:52',33);
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
  `OBSERVER_NAME` varchar(64) NOT NULL,
  `STUDENT_NAME` varchar(64) NOT NULL,
  `SCENARIO_ID` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PLAY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PLAYS`
--

LOCK TABLES `PLAYS` WRITE;
/*!40000 ALTER TABLE `PLAYS` DISABLE KEYS */;
INSERT INTO `PLAYS` VALUES (1,'mohammadowais','ScottPappada',1,'2017-06-20 11:12:46'),(2,'mohammadowais','ScottPappada',1,'2017-06-20 11:13:08'),(3,'mohammadowais','ScottPappada',1,'2017-06-20 11:13:09'),(4,'mohammadowais','ScottPappada',1,'2017-06-20 11:43:35'),(5,'mohammadowais','ScottPappada',1,'2017-06-20 11:45:23'),(6,'mohammadowais','ScottPappada',1,'2017-06-20 11:45:51'),(7,'mohammadowais','ScottPappada',1,'2017-06-20 11:46:35'),(8,'mohammadowais','ScottPappada',1,'2017-06-20 11:47:49'),(9,'mohammadowais','ScottPappada',1,'2017-06-20 11:56:27'),(10,'mohammadowais','ScottPappada',1,'2017-06-20 11:56:43'),(11,'HamzaOwais','ScottPappada',47,'2017-06-20 12:00:01'),(12,'hahajanzeb','lalakumar',47,'2017-06-20 12:14:28'),(13,'lssoffr','kjkeee',47,'2017-06-20 12:19:41'),(14,'balajisa','hamzaowais',47,'2017-06-20 12:58:02'),(15,'talhao','Hamzaowias',47,'2017-06-20 13:32:20'),(16,'ScottPappada','Hamzaowais',49,'2017-06-20 14:06:10'),(17,'HamzaOwais','JeffSchneiderman',52,'2017-06-20 15:45:29'),(18,'CristinaAlvarado','ScottPappada',53,'2017-06-21 11:15:52'),(19,'HamzaOwais','ScottPappada',49,'2017-06-21 15:10:52');
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
  PRIMARY KEY (`SCENARIO_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SCENARIO`
--

LOCK TABLES `SCENARIO` WRITE;
/*!40000 ALTER TABLE `SCENARIO` DISABLE KEYS */;
INSERT INTO `SCENARIO` VALUES (47,'hello this','2017-06-18 23:35:16','2017-06-18 23:35:16',300),(48,'Hemorrhage','2017-06-19 10:45:50','2017-06-19 10:45:50',900),(49,'Hemorrhage','2017-06-20 14:03:44','2017-06-20 14:03:44',180),(50,'Trauma 1','2017-06-20 14:15:57','2017-06-20 14:15:57',1200),(51,'Malignant Hyperthermia','2017-06-20 14:37:23','2017-06-20 14:37:23',900),(52,'Difficult Airway','2017-06-20 15:35:23','2017-06-20 15:35:23',1200),(53,'Airway Emergency','2017-06-21 11:03:05','2017-06-21 11:03:05',1800);
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
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mowais','$2a$10$PhePwqEdntwwcoDC3y5EHuqqD4g0kpuY0c5nswwWWIfXTbh6ui9sO'),(2,'mowais1','$2a$10$HUEaW.XoXGddtdtATCbaguOX94b4uvdVAmVnLE/3.zDrQjRAGOj0S'),(4,'mowais3','$2a$10$XWOfsrdz4JlnlhCJ9wI3eeerHS7GxQGD8uTrFYfTZWOiWb6ubtck2');
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

-- Dump completed on 2017-06-23  9:43:55
