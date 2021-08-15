ALTER TABLE `theredpin`.`precon_unit`
ADD INDEX `num_beds` (`num_beds` ASC),
ADD INDEX `num_baths` (`num_baths` ASC),
ADD INDEX `hidden` (`hidden` ASC),
ADD INDEX `is_comprehensive` (`is_comprehensive` ASC),
ADD INDEX `price` (`price` ASC);

ALTER TABLE `theredpin`.`precon`
ADD INDEX `price_min` (`price_min` ASC),
ADD INDEX `price_max` (`price_max` ASC),
ADD INDEX `is_vip_active` (`is_vip_active` ASC);

ALTER TABLE `theredpin`.`precon` ADD COLUMN `num_floorplans` INT(11) NULL DEFAULT 0  AFTER `num_floors` ;

insert into registry(domain, name, content) values('Application','interestRate','2.99');