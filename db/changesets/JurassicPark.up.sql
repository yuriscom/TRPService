ALTER TABLE `theredpin`.`property`
ADD INDEX `addr_street` (`addr_street` ASC),
ADD INDEX `real_dom` (`real_dom` ASC);

ALTER TABLE `theredpin`.`precon`
ADD INDEX `addr_street` (`addr_street` ASC),
ADD INDEX `name` (`name` ASC);
