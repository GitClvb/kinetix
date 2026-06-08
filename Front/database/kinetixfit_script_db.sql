CREATE DATABASE  IF NOT EXISTS `ecommerce_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `ecommerce_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_carrito`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `FK_CARRITO_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_productos`
--

DROP TABLE IF EXISTS `carrito_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_productos` (
  `id_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrito` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `FK_ITEM_CARRITO` (`id_carrito`),
  KEY `FK_ITEM_VARIANTE` (`id_variante`),
  CONSTRAINT `FK_ITEM_CARRITO` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  CONSTRAINT `FK_ITEM_VARIANTE` FOREIGN KEY (`id_variante`) REFERENCES `variantes` (`id_variante`),
  CONSTRAINT `CHK_CANTIDAD` CHECK (`cantidad` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_productos`
--

LOCK TABLES `carrito_productos` WRITE;
/*!40000 ALTER TABLE `carrito_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Playeras','Playeras deportivas para entrenamiento'),(2,'Shorts','Shorts deportivos para hombre y mujer'),(3,'Pants','Pantalones deportivos'),(4,'Sudaderas','Sudaderas para entrenamiento y uso casual'),(5,'Leggings','Leggings deportivos para mujer');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colores`
--

DROP TABLE IF EXISTS `colores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colores` (
  `id_color` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `codigo_hex` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`id_color`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colores`
--

LOCK TABLES `colores` WRITE;
/*!40000 ALTER TABLE `colores` DISABLE KEYS */;
INSERT INTO `colores` VALUES (1,'Negro','#000000'),(2,'Blanco','#FFFFFF'),(3,'Gris Oxford','#6D6D6D'),(4,'Gris Claro','#D3D3D3'),(5,'Azul Marino','#001F54'),(6,'Azul Rey','#0057B8'),(7,'Azul Cielo','#87CEEB'),(8,'Rojo','#E10600'),(9,'Vino','#722F37'),(10,'Verde Militar','#4B5320'),(11,'Verde Esmeralda','#50C878'),(12,'Verde Limón','#32CD32'),(13,'Amarillo','#FFD700'),(14,'Naranja','#FF7F00'),(15,'Rosa','#FF69B4'),(16,'Rosa Pastel','#FFD1DC'),(17,'Morado','#800080'),(18,'Lila','#C8A2C8'),(19,'Café','#6F4E37'),(20,'Beige','#F5F5DC');
/*!40000 ALTER TABLE `colores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones_usuario`
--

DROP TABLE IF EXISTS `direcciones_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones_usuario` (
  `id_direccion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nombre_destinatario` varchar(150) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `calle` varchar(150) NOT NULL,
  `numero_exterior` varchar(20) NOT NULL,
  `numero_interior` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `pais` varchar(100) NOT NULL DEFAULT 'México',
  `referencia` text DEFAULT NULL,
  PRIMARY KEY (`id_direccion`),
  KEY `FK_DIRECCION_USUARIO` (`id_usuario`),
  CONSTRAINT `FK_DIRECCION_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones_usuario`
--

LOCK TABLES `direcciones_usuario` WRITE;
/*!40000 ALTER TABLE `direcciones_usuario` DISABLE KEYS */;
INSERT INTO `direcciones_usuario` VALUES (1,2,'María González','5523456789','Av. Reforma','120','5A','Juárez','Ciudad de México','06600','México','Frente a la glorieta'),(2,3,'Carlos Hernández','5534567890','Calle Hidalgo','45',NULL,'Centro','Jalisco','44100','México','Portón negro'),(3,4,'Fernanda López','5545678901','Av. Vallarta','230','12','Americana','Jalisco','44160','México','Torre A'),(4,5,'Jorge Ramírez','5556789012','Calle Morelos','89',NULL,'Del Valle','Ciudad de México','03100','México','Casa color beige');
/*!40000 ALTER TABLE `direcciones_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `metodo_pago` enum('tarjeta','paypal','mercadopago') NOT NULL,
  `estado_pago` enum('pendiente','aprobado','rechazado') NOT NULL,
  `referencia` varchar(150) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pago`),
  KEY `FK_PAGO_PEDIDO` (`id_pedido`),
  CONSTRAINT `FK_PAGO_PEDIDO` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'mercadopago','aprobado','MP-20250601-001','2026-06-03 21:11:12'),(2,2,'tarjeta','aprobado','VISA-20250601-002','2026-06-03 21:11:12'),(3,3,'paypal','aprobado','PAYPAL-20250601-003','2026-06-03 21:11:12'),(4,4,'mercadopago','pendiente','MP-20250601-004','2026-06-03 21:11:12');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_productos`
--

DROP TABLE IF EXISTS `pedido_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_productos` (
  `id_item` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `FK_PI_PEDIDO` (`id_pedido`),
  KEY `FK_PI_VARIANTE` (`id_variante`),
  CONSTRAINT `FK_PI_PEDIDO` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `FK_PI_VARIANTE` FOREIGN KEY (`id_variante`) REFERENCES `variantes` (`id_variante`),
  CONSTRAINT `CHK_PI_CANTIDAD` CHECK (`cantidad` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_productos`
--

LOCK TABLES `pedido_productos` WRITE;
/*!40000 ALTER TABLE `pedido_productos` DISABLE KEYS */;
INSERT INTO `pedido_productos` VALUES (1,1,1,2,399.00,798.00),(2,1,5,1,349.00,349.00),(3,2,3,1,429.00,429.00),(4,3,8,2,599.00,1198.00),(5,3,10,1,649.00,649.00),(6,4,12,1,799.00,799.00);
/*!40000 ALTER TABLE `pedido_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_direccion` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','pagado','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `fecha_pedido` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pedido`),
  KEY `FK_PEDIDO_DIRECCION` (`id_direccion`),
  KEY `idx_pedido_usuario` (`id_usuario`),
  KEY `idx_pedido_estado` (`estado`),
  KEY `idx_pedido_fecha` (`fecha_pedido`),
  CONSTRAINT `FK_PEDIDO_DIRECCION` FOREIGN KEY (`id_direccion`) REFERENCES `direcciones_usuario` (`id_direccion`),
  CONSTRAINT `FK_PEDIDO_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,2,1,1147.00,'entregado','2026-06-03 21:08:27'),(2,3,2,429.00,'pagado','2026-06-03 21:08:27'),(3,4,3,1847.00,'enviado','2026-06-03 21:08:27'),(4,5,4,799.00,'pendiente','2026-06-03 21:08:27');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_color`
--

DROP TABLE IF EXISTS `producto_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_color` (
  `id_producto_color` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_color` int(11) NOT NULL,
  PRIMARY KEY (`id_producto_color`),
  UNIQUE KEY `UQ_PRODUCTO_COLOR` (`id_producto`,`id_color`),
  KEY `FK_PC_COLOR` (`id_color`),
  CONSTRAINT `FK_PC_COLOR` FOREIGN KEY (`id_color`) REFERENCES `colores` (`id_color`),
  CONSTRAINT `FK_PC_PRODUCTO` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_color`
--

LOCK TABLES `producto_color` WRITE;
/*!40000 ALTER TABLE `producto_color` DISABLE KEYS */;
INSERT INTO `producto_color` VALUES (1,1,1),(2,1,2),(3,1,5),(5,2,2),(4,2,15),(6,2,17),(7,3,1),(8,3,10),(9,4,1),(10,4,5),(11,5,1),(12,5,17),(13,6,1),(14,6,15),(15,7,2),(16,7,5),(17,8,1),(19,8,5),(18,8,8);
/*!40000 ALTER TABLE `producto_color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `genero` enum('hombre','mujer') NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_producto`),
  KEY `idx_producto_genero` (`genero`),
  KEY `idx_producto_categoria` (`id_categoria`),
  KEY `idx_producto_estado` (`estado`),
  CONSTRAINT `FK_PRODUCTO_CATEGORIA` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Playera Dry Fit Negra','Playera deportiva confeccionada en tela Dry Fit de poliéster de alta transpirabilidad. Diseñada para mantener la piel fresca y seca durante entrenamientos intensos. Cuenta con costuras reforzadas, ajuste cómodo y tejido ligero que favorece la libertad de movimiento. Ideal para gimnasio, running, entrenamiento funcional y actividades al aire libre.',399.00,'hombre','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(2,1,'Playera Performance Rosa','Playera deportiva para mujer elaborada con mezcla de poliéster y elastano que brinda suavidad, elasticidad y confort. Su tecnología de secado rápido ayuda a controlar la humedad durante el ejercicio. Presenta un corte moderno que se adapta al cuerpo sin limitar los movimientos. Recomendada para yoga, gimnasio y entrenamiento cardiovascular.',429.00,'mujer','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(3,2,'Short Deportivo Elite','Short deportivo fabricado en poliéster ligero con paneles de ventilación para mejorar la circulación del aire. Incluye cintura elástica con ajuste seguro y bolsillos laterales funcionales. Su tejido resistente permite un excelente desempeño durante actividades de alta intensidad como cross training, running y entrenamiento de fuerza.',349.00,'hombre','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(4,3,'Pants Training Pro','Pants deportivo confeccionado con tejido de algodón y poliéster que proporciona comodidad, resistencia y flexibilidad. Su interior suave ofrece una sensación agradable durante el uso diario o deportivo. Cuenta con cintura ajustable, bolsillos laterales y corte moderno que combina rendimiento y estilo.',599.00,'hombre','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(5,4,'Sudadera Kinetix Fit','Sudadera deportiva elaborada con mezcla premium de algodón y poliéster afelpado. Diseñada para conservar el calor corporal sin comprometer la comodidad. Incorpora capucha ajustable, puños elásticos y bolsillo frontal amplio. Perfecta para actividades al aire libre, calentamiento previo al entrenamiento o uso casual.',799.00,'mujer','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(6,5,'Leggings Power Flex','Leggings de alto rendimiento fabricados con tejido de compresión compuesto por poliéster y elastano. Su diseño favorece el soporte muscular y mejora la movilidad durante el ejercicio. Presentan cintura alta para mayor estabilidad, costuras planas que reducen el roce y tela transpirable de secado rápido. Ideales para gimnasio, yoga, pilates y running.',649.00,'mujer','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(7,2,'Short Runner Light','Short ligero para running confeccionado con tela ultraligera de poliéster técnico. Diseñado para maximizar la ventilación y reducir la acumulación de humedad durante recorridos largos. Incluye pretina elástica, costuras reforzadas y corte ergonómico que mejora la libertad de movimiento.',379.00,'mujer','activo','2026-06-03 19:27:06','2026-06-03 19:27:06'),(8,1,'Playera Compression Tech','Playera de compresión fabricada con tejido elástico de alto rendimiento que combina poliéster y elastano. Ayuda a brindar soporte muscular, mejorar el ajuste al cuerpo y favorecer la movilidad durante actividades de alta exigencia física. Su tecnología de absorción de humedad mantiene una sensación fresca y cómoda durante todo el entrenamiento.',499.00,'hombre','activo','2026-06-03 19:27:06','2026-06-03 19:27:06');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tallas`
--

DROP TABLE IF EXISTS `tallas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tallas` (
  `id_talla` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id_talla`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tallas`
--

LOCK TABLES `tallas` WRITE;
/*!40000 ALTER TABLE `tallas` DISABLE KEYS */;
INSERT INTO `tallas` VALUES (4,'L'),(3,'M'),(2,'S'),(5,'XL'),(1,'XS'),(6,'XXL');
/*!40000 ALTER TABLE `tallas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('admin','cliente') NOT NULL DEFAULT 'cliente',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Raúl','Ortiz','raul.ortiz@kinetixfit.com','Admin123.','5512345678','admin','activo','2026-06-03 19:23:06'),(2,'María','González','maria.gonzalez@gmail.com','Cliente123-','5523456789','cliente','activo','2026-06-03 19:23:06'),(3,'Carlos','Hernández','carlos.hernandez@gmail.com','Cliente123-','5534567890','cliente','activo','2026-06-03 19:23:06'),(4,'Fernanda','López','fernanda.lopez@gmail.com','Cliente123-','5545678901','cliente','activo','2026-06-03 19:23:06'),(5,'Jorge','Ramírez','jorge.ramirez@gmail.com','Cliente123-','5556789012','cliente','activo','2026-06-03 19:23:06');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variante_imagenes`
--

DROP TABLE IF EXISTS `variante_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variante_imagenes` (
  `id_imagen` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto_color` int(11) NOT NULL,
  `url_imagen` varchar(500) NOT NULL,
  `principal` enum('si','no') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id_imagen`),
  KEY `FK_IMAGEN_COLOR` (`id_producto_color`),
  CONSTRAINT `FK_IMAGEN_COLOR` FOREIGN KEY (`id_producto_color`) REFERENCES `producto_color` (`id_producto_color`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variante_imagenes`
--

LOCK TABLES `variante_imagenes` WRITE;
/*!40000 ALTER TABLE `variante_imagenes` DISABLE KEYS */;
INSERT INTO `variante_imagenes` VALUES (1,1,'https://http2.mlstatic.com/D_NQ_NP_2X_975571-MLM107577195257_022026-F.webp','si'),(2,2,'https://http2.mlstatic.com/D_NQ_NP_2X_932424-MLM107735440973_022026-F.webp','no'),(3,3,'https://http2.mlstatic.com/D_NQ_NP_2X_692795-MLM107464490974_032026-F.webp','no'),(4,4,'https://m.media-amazon.com/images/I/71Yy6hQuI-L._AC_SX466_.jpg','si'),(5,5,'https://m.media-amazon.com/images/I/81+wvi0r0QL._AC_SX466_.jpg','no'),(6,6,'https://m.media-amazon.com/images/I/71ynsnSMENL._AC_SX466_.jpg','no'),(7,7,'https://http2.mlstatic.com/D_NQ_NP_2X_904333-MLM104721121148_012026-F-short-deportivo-gym-caballero-correr-tela-de-secado-rapido.webp','si'),(8,8,'https://m.media-amazon.com/images/I/51smlwkoCqL._AC_SX679_.jpg','no'),(9,9,'https://m.media-amazon.com/images/I/61ZbYnPZdVL._AC_SX679_.jpg','si'),(10,10,'https://m.media-amazon.com/images/I/61Lns9tc0YL._AC_SX679_.jpg','no'),(11,11,'https://m.media-amazon.com/images/I/61FQJ4IZkGL._AC_SX679_.jpg','si'),(12,12,'https://m.media-amazon.com/images/I/713AI6UufkL._AC_SX679_.jpg','no'),(13,13,'https://mx.crzyoga.com/cdn/shop/files/R427-1-A-Q1_1296x.jpg?v=1779958828','si'),(14,14,'https://mx.crzyoga.com/cdn/shop/files/R427-57-N-NEW3_b339402d-b94f-4ddb-b7f0-50dcce357990_1296x.jpg?v=1779958852','no'),(15,15,'https://m.media-amazon.com/images/I/71SERKP1G1L._AC_SX466_.jpg','si'),(16,16,'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/671c4bb1-af3f-4264-92ce-3d3524efcea9/W+NK+ONE+DF+MR+3IN+2N1+SHORT.png','no'),(17,17,'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS4-tj0HnzXuHgqG_eGkDYsXtE3vn4Kps_PZBQ7xqbibXBGjYrAMRS9c1sbDugMOfjdSVySAkYfJZbkj2Zzw-KVgKAwYu5UxOPTG0zZDOMe6APAihQICC0_','si'),(18,19,'https://m.media-amazon.com/images/I/51c1UAaz5FL._AC_SX569_.jpg','no'),(19,18,'https://m.media-amazon.com/images/I/41FcG8ipVdL._AC_SX679_.jpg','no');
/*!40000 ALTER TABLE `variante_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variantes`
--

DROP TABLE IF EXISTS `variantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variantes` (
  `id_variante` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto_color` int(11) NOT NULL,
  `id_talla` int(11) NOT NULL,
  `stock` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_variante`),
  UNIQUE KEY `UQ_VARIANTE` (`id_producto_color`,`id_talla`),
  KEY `idx_variante_color` (`id_producto_color`),
  KEY `idx_variante_talla` (`id_talla`),
  CONSTRAINT `FK_VAR_COLOR` FOREIGN KEY (`id_producto_color`) REFERENCES `producto_color` (`id_producto_color`),
  CONSTRAINT `FK_VAR_TALLA` FOREIGN KEY (`id_talla`) REFERENCES `tallas` (`id_talla`),
  CONSTRAINT `CHK_STOCK` CHECK (`stock` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variantes`
--

LOCK TABLES `variantes` WRITE;
/*!40000 ALTER TABLE `variantes` DISABLE KEYS */;
INSERT INTO `variantes` VALUES (1,1,2,10),(2,1,3,15),(3,1,4,12),(4,1,5,8),(5,1,6,8),(6,2,2,7),(7,2,3,10),(8,2,4,5),(9,2,5,3),(10,3,2,7),(11,3,3,10),(12,3,4,5),(13,3,5,3),(14,4,2,7),(15,4,3,10),(16,4,4,5),(17,4,1,3),(18,5,2,7),(19,5,3,10),(20,5,4,5),(21,5,1,3),(22,6,2,7),(23,6,3,10),(24,6,4,5),(25,6,5,3),(26,7,2,7),(27,7,3,10),(28,7,4,5),(29,7,5,3),(30,8,2,7),(31,8,3,10),(32,8,4,5),(33,8,5,3),(34,9,2,7),(35,9,3,10),(36,9,4,5),(37,9,5,3),(38,10,6,7),(39,10,3,10),(40,10,4,5),(41,10,5,3),(42,11,2,7),(43,11,3,10),(44,11,4,5),(45,11,5,3),(46,12,2,7),(47,12,3,10),(48,12,4,5),(49,12,5,3),(50,13,1,6),(51,13,2,12),(52,13,3,10),(53,13,4,4),(54,14,2,8),(55,14,3,10),(56,14,4,6),(57,15,2,7),(58,15,3,10),(59,15,4,5),(60,15,1,3),(61,16,2,7),(62,16,3,10),(63,16,4,5),(64,16,1,3),(65,17,2,7),(66,17,3,10),(67,17,4,5),(68,17,6,3),(69,18,2,7),(70,18,3,10),(71,18,4,5),(72,18,1,3),(73,19,5,7),(74,19,3,10),(75,19,4,5),(76,19,1,3);
/*!40000 ALTER TABLE `variantes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03 22:10:17
