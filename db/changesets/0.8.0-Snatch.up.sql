UPDATE `theredpin`.`main_province` SET `web_id`='on' WHERE `web_id`='ontario';
UPDATE `theredpin`.`main_province` SET `web_id`='bc' WHERE `web_id`='british-columbia-colombie-britannique';

UPDATE `theredpin`.`main_region` SET `name` = 'Greater Toronto Area', `web_id` = 'greater-toronto-area' where `web_id` = 'toronto';