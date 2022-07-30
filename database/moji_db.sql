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
  CONSTRAINT `bukti_transfer_ibfk_1` FOREIGN KEY (`id_reservasi`) REFERENCES `reservasi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bukti_transfer`
--

LOCK TABLES `bukti_transfer` WRITE;
/*!40000 ALTER TABLE `bukti_transfer` DISABLE KEYS */;
INSERT INTO `bukti_transfer` VALUES ('BKT-9fqbz5p','RSV-nfrlixb','bukti_transaksi-2022-07-28-542645896.jpg','14:02:2022-07-28','14:02:2022-07-28'),('BKT-dgt9phc','RSV-mqy0rr2','bukti_transaksi-2022-07-25-383580035.jpg','13:23:2022-07-25','13:30:2022-07-25'),('BKT-l88ayb5','RSV-jai85r1','bukti_transaksi-2022-07-26-947710770.jpg','17:20:2022-07-26','17:21:2022-07-26'),('BKT-q8tfnjg','RSV-5lusx8w','bukti_transaksi-2022-07-29-985086362.jpg','03:53:2022-07-29','03:53:2022-07-29');
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
INSERT INTO `meja` VALUES ('MJA-7za7jce','1',2,6,'terisi','21:49:03/06/2022','08:12:2022-07-08'),('MJA-okeif4a','1',3,6,'aktif','22:00:2022-07-07','19:00:2022-07-19'),('MJA-pz9u054','1',5,6,'aktif','14:29:2022-07-15','14:29:2022-07-15'),('MJA-wmfs4lo','1',4,4,'terisi','14:28:2022-07-15','14:28:2022-07-15'),('MJA-xkmi8ul','1',6,6,'aktif','14:29:2022-07-15','20:15:2022-07-20'),('MJA-ztth1xb','1',1,4,'aktif','21:48:03/06/2022','08:17:2022-07-08');
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
INSERT INTO `menu` VALUES ('MNU-0ulqzbq','1','Ricebowl Chicken','Makanan',25000,'gambar_menu-2022-07-29-439453719.png',44,'aktif','20:10:2022-07-19','00:00:2022-07-29'),('MNU-17k5dwn','1','Suki Medium (3 Orang)','Makanan',80000,'gambar_menu-2022-07-19-195505735.jpg',44,'aktif','20:17:2022-07-19','04:56:2022-07-25'),('MNU-40qt7a5','1','Nasi Putih','Makanan',5000,'gambar_menu-2022-07-29-285367542.jpg',44,'aktif','20:13:2022-07-19','00:16:2022-07-29'),('MNU-cwkti6s','1','Suki Jumbo (4 Orang)','Makanan',100000,'gambar_menu-2022-07-19-965132381.jpg',42,'aktif','20:17:2022-07-19','04:56:2022-07-25'),('MNU-hbf3ide','1','Ricebowl Beef','Makanan',30000,'gambar_menu-2022-07-29-209745037.jpg',43,'aktif','15:05:2022-07-01','00:17:2022-07-29'),('MNU-lqv41dy','1','Suki Value (2 Orang)','Makanan',55000,'gambar_menu-2022-07-12-55584399.jpg',49,'aktif','15:03:2022-07-01','04:57:2022-07-25'),('MNU-n03b0h9','1','Es Teh Manis','Minuman',5000,'gambar_menu-2022-07-29-883315399.jpg',40,'aktif','20:14:2022-07-19','00:17:2022-07-29'),('MNU-nfopm6j','1','Chicken 100gr','Makanan',15000,'gambar_menu-2022-07-29-904547475.jpg',43,'aktif','20:38:2022-07-01','00:18:2022-07-29'),('MNU-o57gm37','1','US Beef 100gr','Makanan',35000,'gambar_menu-2022-07-29-122064126.jpg',47,'aktif','15:02:2022-07-01','00:18:2022-07-29'),('MNU-t00uvew','1','Saikoro 100gr','Makanan',28000,'gambar_menu-2022-07-29-674405256.jpg',50,'aktif','20:07:2022-07-19','00:18:2022-07-29'),('MNU-vmnlsox','1','Es Lemon Tea','Minuman',7000,'gambar_menu-2022-07-29-826273844.png',44,'aktif','15:04:2022-07-01','00:18:2022-07-29');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `no_invoice`
--

DROP TABLE IF EXISTS `no_invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `no_invoice` (
  `id` varchar(20) NOT NULL,
  `id_pelanggan` varchar(11) NOT NULL,
  `create_at` varchar(50) NOT NULL,
  `update_at` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pelanggan` (`id_pelanggan`),
  CONSTRAINT `FKinvoices645485` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `no_invoice`
--

LOCK TABLES `no_invoice` WRITE;
/*!40000 ALTER TABLE `no_invoice` DISABLE KEYS */;
INSERT INTO `no_invoice` VALUES ('INV-2022/07/25-nzd6r','PLG-sh51o3n','13:23:2022-07-25','13:23:2022-07-25'),('INV-2022/07/26-gpse4','PLG-lelfouh','17:19:2022-07-26','17:19:2022-07-26'),('INV-2022/07/28-6h44a','PLG-vejktrb','14:01:2022-07-28','14:01:2022-07-28'),('INV-2022/07/29-t7or4','PLG-jjltwzk','03:50:2022-07-29','03:50:2022-07-29');
/*!40000 ALTER TABLE `no_invoice` ENABLE KEYS */;
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
INSERT INTO `pelanggan` VALUES ('PLG-jjltwzk','MJA-7za7jce','Gerry Rolfson','03:50:2022-07-29','03:50:2022-07-29'),('PLG-lelfouh','MJA-wmfs4lo','Hiram Borer','17:19:2022-07-26','17:19:2022-07-26'),('PLG-sh51o3n','MJA-wmfs4lo','Genoveva Roberts','13:23:2022-07-25','13:23:2022-07-25'),('PLG-vejktrb','MJA-wmfs4lo','Sarah Hill','14:01:2022-07-28','14:01:2022-07-28');
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
  CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesanan`
--

LOCK TABLES `pesanan` WRITE;
/*!40000 ALTER TABLE `pesanan` DISABLE KEYS */;
INSERT INTO `pesanan` VALUES ('PSN-0fvx74g','PLG-lelfouh','MNU-nfopm6j',3,'45000','17:19:2022-07-26'),('PSN-3wr2w8h','PLG-lelfouh','MNU-cwkti6s',1,'100000','17:19:2022-07-26'),('PSN-5g45403','PLG-sh51o3n','MNU-hbf3ide',1,'30000','13:23:2022-07-25'),('PSN-7cth0nn','PLG-vejktrb','MNU-vmnlsox',2,'14000','14:01:2022-07-28'),('PSN-bx5znio','PLG-lelfouh','MNU-n03b0h9',4,'20000','17:19:2022-07-26'),('PSN-hc1jdqc','PLG-jjltwzk','MNU-nfopm6j',3,'45000','03:50:2022-07-29'),('PSN-m8g80yd','PLG-jjltwzk','MNU-vmnlsox',4,'28000','03:50:2022-07-29'),('PSN-p78h53y','PLG-vejktrb','MNU-n03b0h9',2,'10000','14:01:2022-07-28'),('PSN-pwizs2g','PLG-jjltwzk','MNU-cwkti6s',1,'100000','03:50:2022-07-29'),('PSN-ztdi9oh','PLG-vejktrb','MNU-cwkti6s',1,'100000','14:01:2022-07-28');
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
  CONSTRAINT `FKreservasi682468` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservasi`
--

LOCK TABLES `reservasi` WRITE;
/*!40000 ALTER TABLE `reservasi` DISABLE KEYS */;
INSERT INTO `reservasi` VALUES ('RSV-5lusx8w','PLG-jjltwzk','gerry.rolfson70@ethereal.email','2022-07-29','Menunggu Kedatangan Tamu','03:50:2022-07-29','03:53:2022-07-29'),('RSV-jai85r1','PLG-lelfouh','hiram.borer@ethereal.email','2022-07-26','Selesai','17:19:2022-07-26','18:46:2022-07-26'),('RSV-mqy0rr2','PLG-sh51o3n','genoveva.roberts@ethereal.email','2022-07-25','Selesai','13:23:2022-07-25','15:44:2022-07-26'),('RSV-nfrlixb','PLG-vejktrb','sarah.hilll@ethereal.email','2022-07-28','Menunggu Kedatangan Tamu','14:01:2022-07-28','14:09:2022-07-28');
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
  CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_bukti`) REFERENCES `bukti_transfer` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
INSERT INTO `transaksi` VALUES ('TRS-h99id02','1','BKT-dgt9phc','transfer','30000','valid','13:30:2022-07-25','13:30:2022-07-25'),('TRS-hv9etwi','1','BKT-9fqbz5p','transfer','124000','valid','14:09:2022-07-28','14:09:2022-07-28'),('TRS-if4xf5e','1','BKT-q8tfnjg','transfer','173000','valid','03:53:2022-07-29','03:53:2022-07-29'),('TRS-tgzuu1i','1','BKT-l88ayb5','transfer','165000','valid','17:21:2022-07-26','17:21:2022-07-26');
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

-- Dump completed on 2022-07-30 13:54:43
