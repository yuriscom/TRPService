CREATE TABLE `resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) DEFAULT NULL,
  `entity_type` varchar(150) DEFAULT NULL,
  `storage_engine` varchar(150) DEFAULT NULL,
  `path` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`),
  KEY `entity_type` (`entity_type`),
  KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
