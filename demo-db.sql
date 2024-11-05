-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: demo_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `c_id` int NOT NULL AUTO_INCREMENT,
  `c_name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `u_id` int DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  KEY `u_id` (`u_id`),
  CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `users` (`u_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (42,'ABHISHEK SUTRADHAR','PowerApps Developer',1),(43,'AASTHA SANGTANI','Inside Sales ',2),(44,'MIHIR JAMGADE','Inside Sales ',2),(45,'AYUSH SHRIVASTAVA','Power BI Developer',2),(46,'SUBODH SANJAY MOGARKAR','Power BI Developer',3),(47,'TANUSHRI MANDAL','Power BI Developer',3),(48,'AKSH AHER1','Web dev',1),(49,'VIRAT','Intern',1),(50,'DAMMODAR','AI/ML',1),(51,'ADITYAA GANGURDE','IIT',1),(52,'VISHAL PATIL','powerBI',1),(53,'PRATHMES JADHAV','Web Developer',1),(54,'DEMO CANDIDATE','Intern',2),(55,'SANJAY JADHAVV','Web Developer',1),(56,'VIJAY JADHAV','IT',2),(57,'DEMO CANDIDATE1','PBI',1),(58,'DEMO CANDIDATE2','PBI',1),(59,'DEMO CANDIDATE3','PBI',1),(60,'ABCDEF','it',1),(61,'ABC','Manager',1),(62,'DEMO CANDIDATE 9','Manager',1),(63,'SSS','s',1);
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_rounds`
--

DROP TABLE IF EXISTS `interview_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_rounds` (
  `ir_id` int NOT NULL AUTO_INCREMENT,
  `c_id` int DEFAULT NULL,
  `round_number` varchar(10) NOT NULL,
  `interviewer` varchar(100) NOT NULL,
  `interview_date` date NOT NULL,
  `status` varchar(100) NOT NULL,
  `remarks` text,
  PRIMARY KEY (`ir_id`),
  KEY `c_id` (`c_id`),
  CONSTRAINT `interview_rounds_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `candidates` (`c_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_rounds`
--

LOCK TABLES `interview_rounds` WRITE;
/*!40000 ALTER TABLE `interview_rounds` DISABLE KEYS */;
INSERT INTO `interview_rounds` VALUES (46,43,'1','Rahul Sawant','2024-09-24','Rejected','Rejected Because...'),(47,44,'1','Rahul Sawant','2024-10-01','Selected','Waiting for R2\n'),(48,45,'1','Tarannum Syed','2024-10-17','Interview is scheduled',''),(49,46,'1','Taranumm Syed','2024-09-27','Rejected','R1 Rescheduled- 1st R1-24.09.2024\n'),(53,51,'1','Pankaj','2024-10-31','Selected','Selected for 1st'),(56,52,'1','New Interviewr','2024-10-31','Scheduled','Scheduled...'),(58,53,'2','Chaitanya','2024-11-01','Selected','1st round scheduled'),(60,55,'2','Sushil Sir','2024-11-01','Selected','Inrrviw is scheduled'),(61,56,'1','Chaitanya sir','2024-10-31','Scheduled','...'),(63,57,'Round 1','ABC','2024-10-30','Scheduled',''),(64,57,'Round 1','ABC','2024-10-30','Selected',''),(65,57,'Round 2','XYZ','2024-10-31','Scheduled',''),(66,57,'Round 2','XYZ','2024-10-31','Rejected',''),(68,54,'3','Sushil Shinde','2024-11-05','Offered','Offered'),(69,62,'1','Ch','2024-11-14','Offered','........');
/*!40000 ALTER TABLE `interview_rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Prachi','123'),(2,'Shreyansh','123'),(3,'Sakshi','123'),(4,'Siyona','123'),(5,'Sushil','123');
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

-- Dump completed on 2024-11-05 10:00:06
