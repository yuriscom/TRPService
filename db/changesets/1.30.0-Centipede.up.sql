-- CREATE EXCLUSIVE PROPERTY STYLE TABLE --
CREATE TABLE `exclusive_property_style` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `web_id` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY STATUS TABLE --
CREATE TABLE `exclusive_property_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY SALE TYPE TABLE --
CREATE TABLE `exclusive_property_sale_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `web_id` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY OWNERSHIP TABLE --
CREATE TABLE `exclusive_property_ownership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY TRP TYPE TABLE --
CREATE TABLE `exclusive_property_trp_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `sys_name` varchar(64) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `il8n_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sys_name` (`sys_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY TYPE TABLE --
CREATE TABLE `exclusive_property_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `web_id` varchar(100) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `web_id` (`web_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY TABLE --
CREATE TABLE `exclusive_property` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addr_full` varchar(100) DEFAULT NULL,
  `addr_full_slug` varchar(100) DEFAULT NULL,
  `addr_intersection` varchar(40) DEFAULT NULL,
  `addr_intersection_slug` varchar(100) DEFAULT NULL,
  `addr_hood` varchar(40) DEFAULT NULL,
  `addr_hood_slug` varchar(100) DEFAULT NULL,
  `addr_city` varchar(40) DEFAULT NULL,
  `addr_city_slug` varchar(100) DEFAULT NULL,
  `addr_street` varchar(40) DEFAULT NULL,
  `addr_street_dir` varchar(10) DEFAULT NULL,
  `addr_street_suffix` varchar(10) DEFAULT NULL,
  `addr_street_num` varchar(10) DEFAULT NULL,
  `addr_postal_code` varchar(10) DEFAULT NULL,
  `addr_province` varchar(40) DEFAULT NULL,
  `addr_unit_num` varchar(10) DEFAULT NULL,
  `air_conditioning` varchar(40) DEFAULT NULL,
  `architectural_style` varchar(100) DEFAULT NULL,
  `balcony` varchar(40) DEFAULT NULL,
  `basement_1` text,
  `basement_2` text,
  `broker` text,
  `client_remarks` text,
  `condo_exposure` varchar(10) DEFAULT NULL,
  `condo_management` varchar(40) DEFAULT NULL,
  `construction_style_attachment` varchar(100) DEFAULT NULL,
  `display_address` tinyint(1) DEFAULT NULL,
  `drive` varchar(40) DEFAULT NULL,
  `elevator` varchar(40) DEFAULT NULL,
  `energy_cert` varchar(40) DEFAULT NULL,
  `energy_cert_level` varchar(40) DEFAULT NULL,
  `exterior_1` text,
  `exterior_2` text,
  `extras` text,
  `fronting` varchar(10) DEFAULT NULL,
  `furnishing` varchar(40) DEFAULT NULL,
  `garage` varchar(40) DEFAULT NULL,
  `green_pis` varchar(40) DEFAULT NULL,
  `has_cable` tinyint(1) DEFAULT NULL,
  `has_central_vac` tinyint(1) DEFAULT NULL,
  `has_family_room` tinyint(1) DEFAULT NULL,
  `num_fireplaces` int(11) DEFAULT NULL,
  `has_gas` tinyint(1) DEFAULT NULL,
  `has_handi_equip` tinyint(1) DEFAULT NULL,
  `has_hydro` tinyint(1) DEFAULT NULL,
  `has_ensuite_laundry` tinyint(1) DEFAULT NULL,
  `has_private_entrance` tinyint(1) DEFAULT NULL,
  `has_telephone` tinyint(1) DEFAULT NULL,
  `heating_source` varchar(40) DEFAULT NULL,
  `heating_type` varchar(40) DEFAULT NULL,
  `is_out_of_area` tinyint(1) DEFAULT NULL,
  `is_retirement` tinyint(1) DEFAULT NULL,
  `laundry` varchar(40) DEFAULT NULL,
  `laundry_level` varchar(10) DEFAULT NULL,
  `locker` varchar(40) DEFAULT NULL,
  `locker_num` varchar(10) DEFAULT NULL,
  `lot_acreage` varchar(40) DEFAULT NULL,
  `lot_depth` double DEFAULT NULL,
  `lot_front` double DEFAULT NULL,
  `lot_irregularities` varchar(40) DEFAULT NULL,
  `lot_size_code` varchar(10) DEFAULT NULL,
  `mls_num` varchar(40) DEFAULT NULL,
  `monthly_maintenance` double DEFAULT NULL,
  `num_baths` int(11) DEFAULT NULL,
  `num_beds` int(11) DEFAULT NULL,
  `num_beds_plus` int(11) DEFAULT NULL,
  `num_kitchens` int(11) DEFAULT NULL,
  `num_kitchens_plus` int(11) DEFAULT NULL,
  `num_rooms` int(11) DEFAULT NULL,
  `num_rooms_plus` int(11) DEFAULT NULL,
  `num_garages` int(11) DEFAULT NULL,
  `num_parkings` int(11) DEFAULT NULL,
  `occupancy` varchar(40) DEFAULT NULL,
  `other_structures_1` text,
  `other_structures_2` text,
  `parcel_num` varchar(10) DEFAULT NULL,
  `parking` varchar(40) DEFAULT NULL,
  `parking_monthly_cost` double DEFAULT NULL,
  `pets` varchar(40) DEFAULT NULL,
  `pool` varchar(40) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `seller_pis` varchar(40) DEFAULT NULL,
  `sewers` varchar(40) DEFAULT NULL,
  `sqft` varchar(10) DEFAULT NULL,
  `taxes` double DEFAULT NULL,
  `taxes_year` int(11) DEFAULT NULL,
  `uffi` varchar(10) DEFAULT NULL,
  `water` varchar(40) DEFAULT NULL,
  `water_source` varchar(40) DEFAULT NULL,
  `waterfront` varchar(40) DEFAULT NULL,
  `zoning` varchar(40) DEFAULT NULL,
  `municipality_code` varchar(50) DEFAULT NULL,
  `municipality_district` varchar(50) DEFAULT NULL,
  `municipality` varchar(50) DEFAULT NULL,
  `precon_id` int(11) DEFAULT NULL,
  `unit_name` varchar(255) DEFAULT NULL,
  `deposit` varchar(255) DEFAULT NULL,
  `incentives` text,
  `exclusive_property_type_id` int(11) NOT NULL,
  `exclusive_property_trp_type_id` int(11) DEFAULT NULL,
  `exclusive_property_ownership_id` int(11) NOT NULL,
  `exclusive_property_status_id` int(11) NOT NULL,
  `exclusive_property_style_id` int(11) NOT NULL,
  `exclusive_property_sale_type_id` int(11) DEFAULT NULL,
  `re_district_id` int(11) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `unit_num` varchar(10) DEFAULT NULL,
  `virtual_tour_url` varchar(255) DEFAULT NULL,
  `walk_score` int(11) DEFAULT NULL,
  `transit_score` int(11) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `is_public_updated_on` datetime DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `region_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `hood_id` int(11) DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_exclusive_property_type` (`exclusive_property_type_id`),
  KEY `fk_exclusive_property_exclusive_property_ownership` (`exclusive_property_ownership_id`),
  KEY `fk_exclusive_property_exclusive_property_status` (`exclusive_property_status_id`),
  KEY `fk_exclusive_property_exclusive_property_style` (`exclusive_property_style_id`),
  KEY `fk_exclusive_property_re_district` (`re_district_id`),
  KEY `mls_num_index` (`mls_num`),
  KEY `addr_province_index` (`addr_province`),
  KEY `price` (`price`),
  KEY `num_beds` (`num_beds`),
  KEY `num_baths` (`num_baths`),
  KEY `lat` (`lat`),
  KEY `lng` (`lng`),
  KEY `addr_street` (`addr_street`),
  KEY `fk_exclusive_property__exclusive_property_trp_type` (`exclusive_property_trp_type_id`),
  KEY `addr_full_index` (`addr_full`),
  KEY `fk_exclusive_property_province_id` (`province_id`),
  KEY `fk_exclusive_property_region_id` (`region_id`),
  KEY `fk_exclusive_property_city_id` (`city_id`),
  KEY `fk_exclusive_property_hood_id` (`hood_id`),
  KEY `fk_exclusive_property_precon_id` (`precon_id`),
  KEY `fk_exclusive_property_exclusive_property_sale_type` (`exclusive_property_sale_type_id`),
  CONSTRAINT `fk_exclusive_property__exclusive_property_trp_type` FOREIGN KEY (`exclusive_property_trp_type_id`) REFERENCES `exclusive_property_trp_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_exclusive_property_sale_type` FOREIGN KEY (`exclusive_property_sale_type_id`) REFERENCES `exclusive_property_sale_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_city_id` FOREIGN KEY (`city_id`) REFERENCES `main_city` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_exclusive_property_ownership` FOREIGN KEY (`exclusive_property_ownership_id`) REFERENCES `exclusive_property_ownership` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_exclusive_property_status` FOREIGN KEY (`exclusive_property_status_id`) REFERENCES `exclusive_property_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_exclusive_property_style` FOREIGN KEY (`exclusive_property_style_id`) REFERENCES `exclusive_property_style` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_exclusive_property_type` FOREIGN KEY (`exclusive_property_type_id`) REFERENCES `exclusive_property_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_hood_id` FOREIGN KEY (`hood_id`) REFERENCES `main_hood` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_precon_id` FOREIGN KEY (`precon_id`) REFERENCES `precon` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_province_id` FOREIGN KEY (`province_id`) REFERENCES `main_province` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_re_district` FOREIGN KEY (`re_district_id`) REFERENCES `re_district` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_exclusive_property_region_id` FOREIGN KEY (`region_id`) REFERENCES `main_region` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY SPEC DES TABLE --
CREATE TABLE `exclusive_property_spec_des` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `spec_des` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_spec_des_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_spec_des_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY PARKING TABLE --
CREATE TABLE `exclusive_property_parking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `notes` varchar(40) DEFAULT NULL,
  `legal` varchar(40) DEFAULT NULL,
  `type` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_parking_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_parking_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--  CREATE EXCLUSIVE PROPERTY ROOM TABLE --
CREATE TABLE `exclusive_property_room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `level` varchar(40) DEFAULT NULL,
  `length` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `desc_1` varchar(40) DEFAULT NULL,
  `desc_2` varchar(40) DEFAULT NULL,
  `desc_3` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_room_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_room_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY FEATURE TABLE --
CREATE TABLE `exclusive_property_feature` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `feature` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_feature_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_feature_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY BUILDING AMENITY TABLE --
CREATE TABLE `exclusive_property_building_amenity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `amenity` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exclusive_property_id` (`exclusive_property_id`,`amenity`),
  KEY `fk_exclusive_property_building_amenity_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_building_amenity_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE EXCLUSIVE PROPERTY BATHROOM TABLE --
CREATE TABLE `exclusive_property_bathroom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exclusive_property_id` int(11) NOT NULL,
  `num` int(11) DEFAULT NULL,
  `num_pieces` int(11) DEFAULT NULL,
  `level` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exclusive_property_bathroom_exclusive_property` (`exclusive_property_id`),
  CONSTRAINT `fk_exclusive_property_bathroom_exclusive_property` FOREIGN KEY (`exclusive_property_id`) REFERENCES `exclusive_property` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Content --

INSERT INTO `exclusive_property_ownership` (`id`, `name`, `notes`)
VALUES
	(1, 'freehold', NULL),
	(2, 'condo', NULL);

INSERT INTO `exclusive_property_status` (`id`, `name`, `notes`)
VALUES
	(1, 'Active', NULL),
	(2, 'Sold', NULL),
	(3, 'Hidden', NULL),
	(4, 'Deactivated', NULL);

INSERT INTO `exclusive_property_sale_type` (`id`, `name`, `web_id`, `notes`)
VALUES
	(1, 'Extra Inventory', 'builder-extra-inventory' ,NULL),
	(2, 'Assignments', 'assignments' ,NULL),
	(3, 'Resale', 'resale', NULL);

INSERT INTO `exclusive_property_style` (`id`, `name`, `web_id`, `notes`)
VALUES
	(1, '1 1/2 Storey', '1-1-2-storey', NULL),
	(2, '2 1/2 Storey', '2-1-2-storey', NULL),
	(3, '2-Storey', '2-storey', NULL),
	(4, '3-Storey', '3-storey', NULL),
	(5, 'Bungalow-Raised', 'bungalow-raised', NULL),
	(6, 'Backsplit 3', 'backsplit-3', NULL),
	(7, 'Bungalow', 'bungalow', NULL),
	(8, 'Sidesplit 4', 'sidesplit-4', NULL),
	(9, 'Sidesplit 3', 'sidesplit-3', NULL),
	(10, 'Other', 'other', NULL),
	(11, 'Backsplit 4', 'backsplit-4', NULL),
	(12, 'Apartment', 'apartment', NULL),
	(13, 'Bungaloft', 'bungaloft', NULL),
	(14, 'Backsplit 5', 'backsplit-5', NULL),
	(15, 'Sidesplit 5', 'sidesplit-5', NULL),
	(16, 'Multi-Level', 'multi-level', NULL),
	(17, 'Bachelor/Studio', 'bachelor-studio', NULL),
	(18, 'Stacked Townhse', 'stacked-townhse', NULL),
	(19, 'Loft', 'loft', NULL),
	(20, '2 Level', '2-level', 'ddf'),
	(21, 'Ranch', 'ranch', 'ddf'),
	(22, 'Basement entry', 'basement-entry', 'ddf'),
	(23, '5 Level', '5-level', 'ddf'),
	(24, 'Split level entry', 'split-level-entry', 'ddf'),
	(25, '3 Level', '3-level', 'ddf'),
	(26, 'Ground level entry', 'ground-level-entry', 'ddf'),
	(27, '4 Level', '4-level', 'ddf'),
	(28, 'Cathedral entry', 'cathedral-entry', 'ddf'),
	(29, 'Cottage', 'cottage', 'ddf'),
	(30, 'Bi-level', 'bi-level', 'ddf'),
	(31, 'Raised bungalow', 'raised-bungalow', 'ddf');

INSERT INTO `exclusive_property_trp_type` (`id`, `name`, `sys_name`, `notes`, `il8n_code`)
VALUES
	(1, 'Detached Home', 'detached-homes', NULL, NULL),
	(2, 'Semi-detached Home', 'semi-detached-homes', NULL, NULL),
	(3, 'Townhouse', 'townhouses', NULL, NULL),
	(4, 'Condo', 'condos', NULL, NULL),
	(5, 'Multiplex', 'multiplexes', NULL, NULL),
	(6, 'Loft', 'lofts', NULL, NULL),
	(7, 'Bungalow', 'bungalows', NULL, NULL),
	(8, 'Cottage', 'cottages', NULL, NULL),
	(9, 'Misc. Listing', 'miscellaneous', NULL, NULL);

INSERT INTO `exclusive_property_type` (`id`, `name`, `web_id`, `notes`)
VALUES
	(1, 'Leasehold Condo', 'leasehold-condo', NULL),
	(2, 'Condo Apt', 'condo-apt', NULL),
	(3, 'Condo Townhouse', 'condo-townhouse', NULL),
	(4, 'Other', 'other', NULL),
	(5, 'Comm Element Condo', 'comm-element-condo', NULL),
	(6, 'Co-Ownership Apt', 'co-ownership-apt', NULL),
	(7, 'Parking Space', 'parking-space', NULL),
	(8, 'Co-Op Apt', 'co-op-apt', NULL),
	(9, 'Det Condo', 'det-condo', NULL),
	(10, 'Vacant Land Condo', 'vacant-land-condo', NULL),
	(11, 'Upper Level', 'upper-level', NULL),
	(12, 'Semi-Det Condo', 'semi-det-condo', NULL),
	(13, 'Multiplex', 'multiplex', NULL),
	(14, 'Semi-Detached', 'semi-detached', NULL),
	(15, 'Detached', 'detached', NULL),
	(16, 'Link', 'link', NULL),
	(17, 'Locker', 'locker', NULL),
	(18, 'New', 'new', NULL),
	(19, 'Time Share', 'time-share', NULL),
	(20, 'Att/Row/Twnhouse', 'att-row-twnhouse', NULL),
	(21, 'Store W/Apt/Offc', 'store-w-apt-offc', NULL),
	(22, 'Vacant Land', 'vacant-land', NULL),
	(23, 'Fourplex', 'fourplex', NULL),
	(24, 'Det W/Com Elements', 'det-w-com-elements', NULL),
	(25, 'Duplex', 'duplex', NULL),
	(26, 'Triplex', 'triplex', NULL),
	(27, 'Room', 'room', NULL),
	(28, 'Cottage', 'cottage', NULL),
	(29, 'Rural Resid', 'rural-resid', NULL),
	(30, 'Farm', 'farm', NULL),
	(31, 'Mobile/Trailer', 'mobile-trailer', NULL),
	(32, 'Lower Level', 'lower-level', NULL),
	(33, '', '', 'ddf'),
	(34, 'Apartment', 'apartment', 'ddf'),
	(35, 'House', 'house', 'ddf'),
	(36, 'Row / Townhouse', 'row-townhouse', 'ddf'),
	(37, 'Mobile Home', 'mobile-home', 'ddf'),
	(38, 'Recreational', 'recreational', 'ddf'),
	(39, 'Multi-Family', 'multi-family', 'ddf'),
	(40, 'No Building', 'no-building', 'ddf');