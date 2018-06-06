CREATE DATABASE PandaExpress;
USE PandaExpress;

DROP TABLE IF EXISTS `prg_sample_storelist`;

CREATE TABLE `prg_sample_storelist` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `region` varchar(8) DEFAULT NULL,
  `ship_address` varchar(255) DEFAULT NULL,
  `ship_city` varchar(255) DEFAULT NULL,
  `ship_state` varchar(255) DEFAULT NULL,
  `ship_zip` varchar(15) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL
);

DROP TABLE IF EXISTS `prg_sample_supervisor`;

CREATE TABLE `prg_sample_supervisor` (
  `id` int(11) DEFAULT NULL,
  `firstname` varchar(64) DEFAULT NULL,
  `lastname` varchar(64) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `region` varchar(8) DEFAULT NULL
);
