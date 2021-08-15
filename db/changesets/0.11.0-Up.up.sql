UPDATE `theredpin`.`property_trp_type` SET `name` = 'Detached Home', `sys_name` = 'detached-homes' WHERE `id` = 1;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Semi-detached Home', `sys_name` = 'semi-detached-homes' WHERE `id` = 2;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Townhouse', `sys_name` = 'townhouses' WHERE `id` = 3;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Condo', `sys_name` = 'condos' WHERE `id` = 4;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Multiplex', `sys_name` = 'multiplexes' WHERE `id` = 5;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Loft', `sys_name` = 'lofts' WHERE `id` = 6;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Bungalow', `sys_name` = 'bungalows' WHERE `id` = 7;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Cottage', `sys_name` = 'cottages' WHERE `id` = 8;
UPDATE `theredpin`.`property_trp_type` SET `name` = 'Misc. Listing', `sys_name` = 'miscellaneous' WHERE `id` = 9;

ALTER TABLE `theredpin`.`oauth_refresh_token`
ADD COLUMN `access_token_id` INT(11) NULL AFTER `oauth_client_id`;