CREATE TABLE `theredpin`.`oauth_client` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `client_id` VARCHAR(150) NOT NULL,
  `client_secret` VARCHAR(150) NOT NULL,
  `created_on` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `client_secret_UNIQUE` (`client_secret` ASC),
  UNIQUE INDEX `client_id_UNIQUE` (`client_id` ASC));

CREATE TABLE `theredpin`.`oauth_access_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `oauth_client_id` varchar(150) DEFAULT NULL,
  `token` varchar(150) DEFAULT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK__user__id__oauth_access_token_user_id_idx` (`user_id`),
  KEY `FK__client__id__oauth_access_token_client_id_idx` (`oauth_client_id`),
  CONSTRAINT `FK__client__id__oauth_access_token_client_id_idx` FOREIGN KEY (`oauth_client_id`) REFERENCES `oauth_client` (`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__user__id__oauth_access_token_user_id_idx` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `theredpin`.`oauth_refresh_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `oauth_client_id` varchar(150) DEFAULT NULL,
  `token` varchar(150) DEFAULT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK__user__id__oauth_refresh_token_user_id_idx` (`user_id`),
  KEY `FK__client__id__oauth_refresh_token_client_id_idx` (`oauth_client_id`),
  CONSTRAINT `FK__client__id__oauth_refresh_token_client_id_idx` FOREIGN KEY (`oauth_client_id`) REFERENCES `oauth_client` (`client_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__user__id__oauth_refresh_token_user_id_idx` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
);

INSERT INTO `theredpin`.`oauth_client` (name, client_id, client_secret)
VALUES ('TRP Web', 'trpweb', 'theredpin');

UPDATE `theredpin`.`main_hood` SET `feature_property`= null WHERE `id`='989';
UPDATE `theredpin`.`main_hood` SET `feature_project`= null WHERE `id`='1067';
UPDATE `theredpin`.`main_hood` SET `feature_property`= null, `feature_project`= null WHERE `id`='1066';
UPDATE `theredpin`.`main_hood` SET `feature_project`= null WHERE `id`='962';
UPDATE `theredpin`.`main_hood` SET `feature_property`= null WHERE `id`='892';

UPDATE `theredpin`.`main_hood` SET `feature_property`= 0 WHERE `id`='1113';
UPDATE `theredpin`.`main_hood` SET `feature_property`= 1, `feature_project`= 2 WHERE `id`='1019';
UPDATE `theredpin`.`main_hood` SET `feature_property`= 2 WHERE `id`='892';
UPDATE `theredpin`.`main_hood` SET `feature_project`= 0 WHERE `id`='1020';
UPDATE `theredpin`.`main_hood` SET `feature_project`= 1 WHERE `id`='915';