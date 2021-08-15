CREATE TABLE `resource_temp` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) DEFAULT NULL,
  `entity_type` varchar(150) DEFAULT NULL,
  `storage_engine` varchar(150) DEFAULT NULL,
  `path` varchar(255) DEFAULT '',
  `alt_tag` text,
  `created_on` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `entity_id` (`entity_id`),
  KEY `entity_type` (`entity_type`),
  KEY `storage_engine` (`storage_engine`),
  KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;