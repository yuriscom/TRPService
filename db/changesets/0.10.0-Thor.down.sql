drop table if exists oauth_access_token;
drop table if exists oauth_refresh_token;
drop table if exists oauth_client;

UPDATE `theredpin`.`main_hood` SET `feature_property`='0' WHERE `id`='989';
UPDATE `theredpin`.`main_hood` SET `feature_project`='0' WHERE `id`='1067';
UPDATE `theredpin`.`main_hood` SET `feature_property`='1', `feature_project`='2' WHERE `id`='1066';
UPDATE `theredpin`.`main_hood` SET `feature_project`='1' WHERE `id`='962';
UPDATE `theredpin`.`main_hood` SET `feature_property`='2' WHERE `id`='892';