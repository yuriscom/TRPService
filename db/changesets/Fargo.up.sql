ALTER TABLE `theredpin`.`property`
ADD COLUMN `open_house` TINYINT NULL DEFAULT 0 AFTER `is_public_updated_on`,
ADD INDEX `price` (`price` ASC),
ADD INDEX `num_beds` (`num_beds` ASC),
ADD INDEX `num_baths` (`num_baths` ASC),
ADD INDEX `lat` (`lat` ASC),
ADD INDEX `lng` (`lng` ASC);