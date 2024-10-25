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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (42,'ABHISHEK SUTRADHAR','PowerApps Developer',1),(43,'AASTHA SANGTANI','Inside Sales ',2),(44,'MIHIR JAMGADE','Inside Sales ',2),(45,'AYUSH SHRIVASTAVA','Power BI Developer',2),(46,'SUBODH SANJAY MOGARKAR','Power BI Developer',3),(47,'TANUSHRI MANDAL','Power BI Developer',3),(48,'AKSH AHER1','Web dev',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_rounds`
--

LOCK TABLES `interview_rounds` WRITE;
/*!40000 ALTER TABLE `interview_rounds` DISABLE KEYS */;
INSERT INTO `interview_rounds` VALUES (42,42,'1','Sushil Shinde','2024-09-20','Selected',''),(43,42,'2','Amit, Abhishek,Preksha','2024-09-27','Selected',''),(44,42,'3','Rahul Sawant','2024-10-04','Selected',''),(45,42,'HR Round','Prachi & Siyona','2024-10-08','Offered','Offered 00LPA'),(46,43,'1','Rahul Sawant','2024-09-24','Rejected','Rejected Because...'),(47,44,'1','Rahul Sawant','2024-10-01','Selected','Waiting for R2\n'),(48,45,'1','Tarannum Syed','2024-10-17','Interview is scheduled',''),(49,46,'1','Taranumm Syed','2024-09-27','Rejected','R1 Rescheduled- 1st R1-24.09.2024\n'),(50,48,'1','Chaitnya','2024-10-26','Interview is scheduled','..');
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

-- Dump completed on 2024-10-25 12:49:33
