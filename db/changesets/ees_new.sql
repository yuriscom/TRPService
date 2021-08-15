 CREATE  TABLE `theredpin`.`saved_search_property` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `user_id` INT(11) NOT NULL ,
  `name` VARCHAR(255) NULL DEFAULT NULL ,
  `city_id` INT(11) NULL DEFAULT NULL,
  `hood_ids` varchar(255) NULL DEFAULT NULL ,
  `polygon_text` TEXT NULL DEFAULT NULL ,
  `polygon` POLYGON NULL DEFAULT NULL ,
  `min_price` INT NULL DEFAULT NULL ,
  `max_price` INT NULL DEFAULT NULL ,
  `beds` VARCHAR(45) NULL DEFAULT NULL ,
  `baths` VARCHAR(45) NULL DEFAULT NULL ,
  `property_type` TEXT NULL DEFAULT NULL ,
  `notification_frequency` VARCHAR(100) NULL DEFAULT NULL ,
  `track_info` TEXT NULL DEFAULT NULL ,
  `updated_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_checked` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  `last_sent` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) ,
  INDEX `fk__saved_search_property__user_id_idx` (`user_id` ASC) ,
  INDEX `fk__saved_search_property__city_id_idx` (`city_id` ASC) ,
  INDEX `saved_search__name__idx` (`name` ASC) ,
  INDEX `saved_search__combined__idx` (`min_price` ASC, `max_price` ASC, `beds` ASC, `baths` ASC) ,
  CONSTRAINT `fk__saved_search_property__user_id`
    FOREIGN KEY (`user_id` )
    REFERENCES `theredpin`.`user` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk__saved_search_property__city_id`
    FOREIGN KEY (`city_id` )
    REFERENCES `theredpin`.`main_city` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE);



CREATE  TABLE `theredpin`.`saved_search_property_type` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `saved_search_id` INT(11) NOT NULL ,
  `property_type` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `unique_idx` (`saved_search_id` ASC, `property_type` ASC) ,
  INDEX `fk__saved_search_property_type__saved_search_id_idx` (`saved_search_id` ASC) ,
  CONSTRAINT `fk__saved_search_property_type__saved_search_id`
    FOREIGN KEY (`saved_search_id` )
    REFERENCES `theredpin`.`saved_search_property` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE  TABLE `theredpin`.`saved_search_property_hood` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `saved_search_id` INT(11) NOT NULL ,
  `hood_id` INT(11) NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `unique_idx` (`saved_search_id` ASC, `hood_id` ASC) ,
  INDEX `fk__saved_search_property_hood__saved_search_id_idx` (`saved_search_id` ASC) ,
  INDEX `fk__saved_search_property_hood__hood_id_idx` (`hood_id` ASC) ,
  CONSTRAINT `fk__saved_search_property_hood__saved_search_id`
    FOREIGN KEY (`saved_search_id` )
    REFERENCES `theredpin`.`saved_search_property` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk__saved_search_property_hood__hood_id`
      FOREIGN KEY (`hood_id` )
      REFERENCES `theredpin`.`main_hood` (`id` )
      ON DELETE CASCADE
      ON UPDATE CASCADE);

CREATE TABLE `property_geom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(11) NOT NULL,
  `pt` GEOMETRY NOT NULL,
  PRIMARY KEY (`id`),
  SPATIAL INDEX(pt),
  KEY `fk_property_geom_property` (`property_id`),
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8

insert into property_geom (property_id, pt) select id, point(lng, lat) from property where lat is not null and lng is not null and lat <> '' and lng <> '' order by id asc;