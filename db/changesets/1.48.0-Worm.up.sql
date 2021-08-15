ALTER TABLE `theredpin`.`marketo_event`
ADD COLUMN `attempts` INT(11) NULL DEFAULT 0 COMMENT '' AFTER `status`,
ADD INDEX `attempts_idx` (`attempts` ASC)  COMMENT '';

ALTER TABLE `theredpin`.`contact`
ADD COLUMN `precon_is_vip_subscribed` INT(1) NULL DEFAULT NULL COMMENT '' AFTER `precon_is_vip`,
ADD INDEX `precon_is_vip_subscribed_idx` (`precon_is_vip_subscribed` ASC)  COMMENT '';