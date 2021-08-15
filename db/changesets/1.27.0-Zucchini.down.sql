UPDATE `theredpin`.`main_hood` SET `feature_property`=null, feature_project=null WHERE feature_property is not null or feature_project is not null;
UPDATE `theredpin`.`main_city` SET `feature_property`=null, feature_project=null WHERE feature_property is not null or feature_project is not null;

UPDATE `theredpin`.`main_city` SET `feature_property`='0', `feature_project`='0' WHERE `id`='452';
UPDATE `theredpin`.`main_city` SET `feature_property`='1', `feature_project`='1' WHERE `id`='647';
UPDATE `theredpin`.`main_city` SET `feature_property`='2', `feature_project`='2' WHERE `id`='223';

UPDATE `theredpin`.`main_hood` SET `feature_property`= 0 WHERE `id`='1113';
UPDATE `theredpin`.`main_hood` SET `feature_property`= 1, `feature_project`= 2 WHERE `id`='1019';
UPDATE `theredpin`.`main_hood` SET `feature_property`= 2 WHERE `id`='892';
UPDATE `theredpin`.`main_hood` SET `feature_project`= 0 WHERE `id`='1020';
UPDATE `theredpin`.`main_hood` SET `feature_project`= 1 WHERE `id`='915';