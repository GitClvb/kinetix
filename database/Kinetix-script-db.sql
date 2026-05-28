-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-05-2026 a las 01:27:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ecommerce_deportivo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_detalle`
--

CREATE TABLE `carrito_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_carrito` int(11) NOT NULL,
  `id_caract` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Playeras Deportivas', 'Playeras para entrenamiento y running'),
(2, 'Shorts Deportivos', 'Shorts ligeros y transpirables'),
(3, 'Pants Deportivos', 'Pants y joggers deportivos'),
(4, 'Sudaderas', 'Sudaderas deportivas y casuales'),
(5, 'Conjuntos Deportivos', 'Sets deportivos completos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones_usuario`
--

CREATE TABLE `direcciones_usuario` (
  `id_direccion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_destinatario` varchar(150) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `calle` varchar(150) NOT NULL,
  `numero_exterior` varchar(20) NOT NULL,
  `numero_interior` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `referencia` text DEFAULT NULL,
  `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direcciones_usuario`
--

INSERT INTO `direcciones_usuario` (`id_direccion`, `id_usuario`, `nombre_destinatario`, `telefono_contacto`, `calle`, `numero_exterior`, `numero_interior`, `colonia`, `estado`, `codigo_postal`, `pais`, `referencia`, `principal`) VALUES
(1, 1, 'Carlos López', '5512345678', 'Insurgentes Sur', '1234', 'Depto 5B', 'Del Valle', 'Ciudad de México', '03100', 'México', 'Edificio azul junto al Oxxo', 1),
(2, 1, 'Andres López', '5598761234', 'Av. Universidad', '450', NULL, 'Narvarte Oriente', 'Ciudad de México', '03020', 'México', 'Casa con portón negro', 0),
(3, 2, 'Diana Yared', '5523456789', 'Av. Revolución', '89', NULL, 'San Ángel', 'Ciudad de México', '01000', 'México', 'Frente al parque', 1),
(4, 3, 'Ricardo Hernandez', '5534567890', 'Blvd. Manuel Ávila', '312', 'Piso 3', 'Lomas de Chapultepec', 'Ciudad de México', '11000', 'México', 'Torre B, piso 3', 1),
(5, 4, 'Israel Espinosa', '5512345679', 'Calzada de Tlalpan', '567', NULL, 'Portales', 'Ciudad de México', '03300', 'México', 'Casa verde con reja blanca', 1),
(6, 5, 'Aaron Aguilar', '5512347878', 'Av. Texcoco', '220', NULL, 'Jardines de Aragón', 'Estado de México', '57170', 'México', 'Cerca del mercado municipal', 1),
(7, 5, 'Valeria Aguilar', '5512347878', 'Calle Hidalgo', '45', 'Int 2', 'Centro Histórico', 'Ciudad de México', '06060', 'México', 'Edificio colonial, timbre 2', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `estado_pago` varchar(50) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_pedido`, `metodo_pago`, `estado_pago`, `referencia`, `fecha_pago`) VALUES
(1, 1, 'Tarjeta Debito', 'Aprobado', 'DEP001', '2026-05-28 23:24:53'),
(2, 2, 'PayPal', 'Aprobado', 'PAY002', '2026-05-28 23:24:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_direccion` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','pagado','enviado','entregado','cancelado') DEFAULT 'pendiente',
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_usuario`, `id_direccion`, `total`, `estado`, `fecha_pedido`) VALUES
(1, 1, 1, 2199.97, 'pagado', '2026-05-28 23:24:27'),
(2, 2, 3, 1199.00, 'enviado', '2026-05-28 23:24:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_detalle`
--

CREATE TABLE `pedido_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_caract` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `marca` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `genero` enum('hombre','mujer','unisex') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `id_categoria`, `nombre`, `descripcion`, `marca`, `precio`, `estado`, `fecha_creacion`, `genero`) VALUES
(1, 1, 'Playera Nike Dri-FIT', 'Playera deportiva con tecnologia de absorcion de sudor', 'Nike', 799.99, 1, '2026-05-28 23:23:51', 'hombre'),
(2, 2, 'Short Puma Active', 'Short deportivo comodo y fresco', 'Puma', 599.99, 1, '2026-05-28 23:23:51', 'mujer'),
(3, 3, 'Pants Under Armour', 'Pants deportivo ajustable para gimnasio', 'Under Armour', 1199.00, 1, '2026-05-28 23:23:51', 'hombre'),
(4, 4, 'Sudadera Reebok Classic', 'Sudadera deportiva con gorro', 'Reebok', 1399.90, 1, '2026-05-28 23:23:51', 'mujer'),
(5, 5, 'Conjunto Deportivo Nike', 'Conjunto deportivo de playera y pants', 'Nike', 1999.99, 1, '2026-05-28 23:23:51', 'unisex');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_caracteristicas`
--

CREATE TABLE `producto_caracteristicas` (
  `id_caract` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `talla` varchar(20) NOT NULL,
  `color` varchar(50) NOT NULL,
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_caracteristicas`
--

INSERT INTO `producto_caracteristicas` (`id_caract`, `id_producto`, `talla`, `color`, `stock`) VALUES
(1, 1, 'CH', 'Negro', 20),
(2, 2, 'CH', 'Rosa', 18),
(3, 3, 'M', 'Gris', 25),
(4, 4, 'G', 'Negro', 6),
(5, 5, 'CH', 'Blanco-Marino', 9),
(6, 1, 'M', 'Blanco', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_imagenes`
--

CREATE TABLE `producto_imagenes` (
  `id_imagen` int(11) NOT NULL,
  `id_caract` int(11) NOT NULL,
  `url_imagen` varchar(500) NOT NULL,
  `principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_imagenes`
--

INSERT INTO `producto_imagenes` (`id_imagen`, `id_caract`, `url_imagen`, `principal`) VALUES
(1, 1, 'https://m.media-amazon.com/images/I/81D6qAjJf6L._AC_SX569_.jpg', 1),
(2, 2, 'https://m.media-amazon.com/images/I/71ZebpLyLlL._AC_SX569_.jpg', 1),
(3, 3, 'https://m.media-amazon.com/images/I/61ucFObnAbL._AC_SY741_.jpg', 1),
(4, 4, 'https://m.media-amazon.com/images/I/71nIE511OHL._AC_SY741_.jpg', 1),
(5, 5, 'https://m.media-amazon.com/images/I/61nWPY9HReL._AC_SY741_.jpg', 1),
(6, 6, 'https://m.media-amazon.com/images/I/71bqxirnQgL._AC_SX569_.jpg', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('admin','cliente') DEFAULT 'cliente',
  `estado` tinyint(1) DEFAULT 1,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `contrasena`, `telefono`, `rol`, `estado`, `fecha_registro`) VALUES
(1, 'Carlos', 'López', 'carlos@gmail.com', 'Car123.', '5512345678', 'cliente', 1, '2026-05-28 23:23:36'),
(2, 'Diana', 'Yared', 'diana@gmail.com', 'Dia123.', '5523456789', 'cliente', 1, '2026-05-28 23:23:36'),
(3, 'Ricardo', 'Hernandez', 'admin@gmail.com', 'Admin123.', '5534567890', 'admin', 1, '2026-05-28 23:23:36'),
(4, 'Israel', 'Espinosa', 'isra@gmail.com', 'Isr123.', '5512345679', 'cliente', 1, '2026-05-28 23:23:36'),
(5, 'Aaron', 'Aguilar', 'aaron@gmail.com', 'Aar123.', '5512347878', 'cliente', 1, '2026-05-28 23:23:36');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `FK_DETALLE_CARRITO` (`id_carrito`),
  ADD KEY `FK_V` (`id_caract`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `direcciones_usuario`
--
ALTER TABLE `direcciones_usuario`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `FK_DIRECCION_USUARIO` (`id_usuario`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `FK_PAGO_PEDIDO` (`id_pedido`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `FK_PEDIDO_USUARIO` (`id_usuario`),
  ADD KEY `FK_PEDIDO_DIRECCION` (`id_direccion`);

--
-- Indices de la tabla `pedido_detalle`
--
ALTER TABLE `pedido_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `FK_DETALLE_PEDIDO` (`id_pedido`),
  ADD KEY `FK_DETALLE_P_CARACT` (`id_caract`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `FK_PRODUCTO_CATEGORIA` (`id_categoria`);

--
-- Indices de la tabla `producto_caracteristicas`
--
ALTER TABLE `producto_caracteristicas`
  ADD PRIMARY KEY (`id_caract`),
  ADD KEY `FK_CARACTERISTICA_PRODUCTO` (`id_producto`);

--
-- Indices de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `FK_IMG_PRODUCTO` (`id_caract`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `direcciones_usuario`
--
ALTER TABLE `direcciones_usuario`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedido_detalle`
--
ALTER TABLE `pedido_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `producto_caracteristicas`
--
ALTER TABLE `producto_caracteristicas`
  MODIFY `id_caract` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD CONSTRAINT `FK_DETALLE_CARRITO` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  ADD CONSTRAINT `FK_V` FOREIGN KEY (`id_caract`) REFERENCES `producto_caracteristicas` (`id_caract`);

--
-- Filtros para la tabla `direcciones_usuario`
--
ALTER TABLE `direcciones_usuario`
  ADD CONSTRAINT `FK_DIRECCION_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `FK_PAGO_PEDIDO` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `FK_PEDIDO_DIRECCION` FOREIGN KEY (`id_direccion`) REFERENCES `direcciones_usuario` (`id_direccion`),
  ADD CONSTRAINT `FK_PEDIDO_USUARIO` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `pedido_detalle`
--
ALTER TABLE `pedido_detalle`
  ADD CONSTRAINT `FK_DETALLE_PEDIDO` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `FK_DETALLE_P_CARACT` FOREIGN KEY (`id_caract`) REFERENCES `producto_caracteristicas` (`id_caract`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `FK_PRODUCTO_CATEGORIA` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);

--
-- Filtros para la tabla `producto_caracteristicas`
--
ALTER TABLE `producto_caracteristicas`
  ADD CONSTRAINT `FK_CARACTERISTICA_PRODUCTO` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD CONSTRAINT `FK_IMG_PRODUCTO` FOREIGN KEY (`id_caract`) REFERENCES `producto_caracteristicas` (`id_caract`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
