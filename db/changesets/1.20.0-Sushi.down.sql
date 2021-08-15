ALTER TABLE `theredpin`.`marketo_event`
CHANGE COLUMN `track_landing_page` `track_landing_page` VARCHAR(255) NULL DEFAULT NULL COMMENT '' ,
CHANGE COLUMN `track_http_referrer` `track_http_referrer` VARCHAR(255) NULL DEFAULT NULL COMMENT '' ,
CHANGE COLUMN `track_page_url` `track_page_url` VARCHAR(255) NULL DEFAULT NULL COMMENT '' ;
