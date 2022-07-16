-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: moji_db
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bukti_transfer`
--

DROP TABLE IF EXISTS `bukti_transfer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bukti_transfer` (
  `id` varchar(11) NOT NULL,
  `id_reservasi` varchar(11) NOT NULL,
  `bukti` text NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_reservasi` (`id_reservasi`),
  CONSTRAINT `bukti_transfer_ibfk_1` FOREIGN KEY (`id_reservasi`) REFERENCES `reservasi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bukti_transfer`
--

LOCK TABLES `bukti_transfer` WRITE;
/*!40000 ALTER TABLE `bukti_transfer` DISABLE KEYS */;
INSERT INTO `bukti_transfer` VALUES ('BKT-buf73n3','RSV-b84x3bj','bukti_transaksi-2022-07-15-687193845.jpg','21:34:2022-07-15','21:34:2022-07-15'),('BKT-gpwwhjt','RSV-yv6k90a','bukti_transaksi-2022-07-15-311250392.jpg','21:03:2022-07-15','21:16:2022-07-15');
/*!40000 ALTER TABLE `bukti_transfer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meja`
--

DROP TABLE IF EXISTS `meja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meja` (
  `id` varchar(11) NOT NULL,
  `id_user` varchar(11) NOT NULL,
  `nomor_meja` int(10) NOT NULL,
  `max_person` int(10) NOT NULL,
  `status` varchar(11) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `FKmeja786312` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meja`
--

LOCK TABLES `meja` WRITE;
/*!40000 ALTER TABLE `meja` DISABLE KEYS */;
INSERT INTO `meja` VALUES ('MJA-7za7jce','1',2,6,'aktif','21:49:03/06/2022','08:12:2022-07-08'),('MJA-okeif4a','1',3,2,'aktif','22:00:2022-07-07','08:42:2022-07-08'),('MJA-pz9u054','1',5,6,'aktif','14:29:2022-07-15','14:29:2022-07-15'),('MJA-wmfs4lo','1',4,4,'aktif','14:28:2022-07-15','14:28:2022-07-15'),('MJA-xkmi8ul','1',6,3,'aktif','14:29:2022-07-15','14:29:2022-07-15'),('MJA-ztth1xb','1',1,4,'aktif','21:48:03/06/2022','08:17:2022-07-08');
/*!40000 ALTER TABLE `meja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `id` varchar(11) NOT NULL,
  `id_user` varchar(11) NOT NULL,
  `nama_menu` varchar(50) NOT NULL,
  `jenis_menu` varchar(30) NOT NULL,
  `harga` int(100) NOT NULL,
  `gambar_menu` varchar(50) NOT NULL,
  `qty` int(12) NOT NULL,
  `status` varchar(20) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES ('MNU-hbf3ide','1','Es Kopi Susu','Minuman',6000,'gambar_menu-2022-07-01-611609384.jpg',22,'aktif','15:05:2022-07-01','03:38:2022-07-07'),('MNU-lqv41dy','1','Suki','Makanan',20000,'gambar_menu-2022-07-12-55584399.jpg',31,'aktif','15:03:2022-07-01','22:45:2022-07-12'),('MNU-nfopm6j','1','Chicken','Makanan',35000,'gambar_menu-2022-07-01-176727495.jpg',1,'aktif','20:38:2022-07-01','02:33:2022-07-08'),('MNU-o57gm37','1','US Beef 100g','Makanan',35000,'gambar_menu-2022-07-01-48045720.jpg',19,'aktif','15:02:2022-07-01','15:02:2022-07-01'),('MNU-vmnlsox','1','Es Lemon Tea','Minuman',7000,'gambar_menu-2022-07-01-578542253.jpg',14,'aktif','15:04:2022-07-01','17:36:2022-07-03');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pelanggan`
--

DROP TABLE IF EXISTS `pelanggan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pelanggan` (
  `id` varchar(11) NOT NULL,
  `id_meja` varchar(11) NOT NULL,
  `nama_pelanggan` varchar(50) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_meja` (`id_meja`),
  CONSTRAINT `FKpelanggan638256` FOREIGN KEY (`id_meja`) REFERENCES `meja` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pelanggan`
--

LOCK TABLES `pelanggan` WRITE;
/*!40000 ALTER TABLE `pelanggan` DISABLE KEYS */;
INSERT INTO `pelanggan` VALUES ('PLG-7mkxp8f','MJA-7za7jce','Person','21:33:2022-07-15','21:33:2022-07-15'),('PLG-htgr1d1','MJA-ztth1xb','Prastiawan','21:02:2022-07-15','21:02:2022-07-15');
/*!40000 ALTER TABLE `pelanggan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesanan`
--

DROP TABLE IF EXISTS `pesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pesanan` (
  `id` varchar(11) NOT NULL,
  `id_pelanggan` varchar(11) NOT NULL,
  `id_menu` varchar(11) NOT NULL,
  `qty` int(6) NOT NULL,
  `total_harga` varchar(100) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pelanggan` (`id_pelanggan`),
  KEY `id_menu` (`id_menu`),
  CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id`),
  CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesanan`
--

LOCK TABLES `pesanan` WRITE;
/*!40000 ALTER TABLE `pesanan` DISABLE KEYS */;
INSERT INTO `pesanan` VALUES ('PSN-1v088ma','PLG-7mkxp8f','MNU-lqv41dy',1,'20000','21:33:2022-07-15'),('PSN-820rep2','PLG-htgr1d1','MNU-nfopm6j',1,'35000','21:02:2022-07-15'),('PSN-e7667k9','PLG-htgr1d1','MNU-vmnlsox',1,'7000','21:02:2022-07-15'),('PSN-pf2sonx','PLG-htgr1d1','MNU-hbf3ide',1,'6000','21:02:2022-07-15'),('PSN-q7qt87v','PLG-7mkxp8f','MNU-hbf3ide',1,'6000','21:33:2022-07-15'),('PSN-qczajmp','PLG-htgr1d1','MNU-lqv41dy',1,'20000','21:02:2022-07-15');
/*!40000 ALTER TABLE `pesanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservasi`
--

DROP TABLE IF EXISTS `reservasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservasi` (
  `id` varchar(11) NOT NULL,
  `id_pelanggan` varchar(11) NOT NULL,
  `email` varchar(40) NOT NULL,
  `untuk_tanggal` varchar(50) NOT NULL,
  `status_reservasi` varchar(50) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pelanggan` (`id_pelanggan`),
  CONSTRAINT `FKreservasi682468` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservasi`
--

LOCK TABLES `reservasi` WRITE;
/*!40000 ALTER TABLE `reservasi` DISABLE KEYS */;
INSERT INTO `reservasi` VALUES ('RSV-b84x3bj','PLG-7mkxp8f','person@gmail.com','2022-07-16','Menunggu Validasi','21:33:2022-07-15','21:34:2022-07-15'),('RSV-yv6k90a','PLG-htgr1d1','alifnurda@gmail.com','2022-07-20','Menunggu Kedatangan Tamu','21:02:2022-07-15','21:16:2022-07-15');
/*!40000 ALTER TABLE `reservasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaksi` (
  `id` varchar(11) NOT NULL,
  `id_user` varchar(11) NOT NULL,
  `id_bukti` varchar(11) NOT NULL,
  `metode_pembayaran` varchar(50) NOT NULL,
  `total_transaksi` varchar(100) NOT NULL,
  `status_transaksi` varchar(50) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_bukti` (`id_bukti`),
  CONSTRAINT `FKtransaksi17932` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_bukti`) REFERENCES `bukti_transfer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
INSERT INTO `transaksi` VALUES ('TRS-4ex9l3q','1','BKT-gpwwhjt','transfer','68000','valid','21:16:2022-07-15','21:16:2022-07-15');
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `email` varchar(40) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(11) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1','Alif Panglima Nurda','alifnurda@gmail.com','Jl.Anu','super-admin','sadmin1','aktif','21:48:2022-06-3','21:48:2022-06-3'),('ADM-3uy203t','Wapa','wap@gmail.com','Curug, Bojong Sari','admin','admin4','non-aktif ','09:53:2022-07-01','14:38:2022-07-01'),('ADM-g22ehr1','Adi Prayitno','prayitno@gmail.com','Jl.Maze Runner, Gaplek Depok','admin','admin1','aktif','18:22:2022-06-30','09:06:2022-07-01'),('ADM-obwkdx6','Elgi','elji@hotmail.com','Pondok Sambel','admin','admin2','non-aktif ','18:14:2022-06-30','09:01:2022-07-01'),('ADM-w0vjw8a','Caca Handika','cacahandika@gmail.com','Rempoa Timur','admin','admin3','non-aktif','14:19:2022-06-30','14:19:2022-06-30');
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

-- Dump completed on 2022-07-16 15:11:14
