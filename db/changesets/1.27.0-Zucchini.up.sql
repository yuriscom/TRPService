UPDATE `theredpin`.`main_hood` SET `feature_property`=null, feature_project=null WHERE feature_property is not null or feature_project is not null;
UPDATE `theredpin`.`main_city` SET `feature_property`=null, feature_project=null WHERE feature_property is not null or feature_project is not null;

-- Featured Cities ON ---
UPDATE `theredpin`.`main_city` SET `feature_property`='0', `feature_project`='0' WHERE `id`='1072';
UPDATE `theredpin`.`main_city` SET `feature_property`='1', `feature_project`='1' WHERE `id`='697';
UPDATE `theredpin`.`main_city` SET `feature_property`='2' WHERE `id`='980';
UPDATE `theredpin`.`main_city` SET `feature_project`='4' WHERE `id`='1229';
UPDATE `theredpin`.`main_city` SET `feature_property`='3', `feature_project`='3' WHERE `id`='1053';
UPDATE `theredpin`.`main_city` SET `feature_property`='4', `feature_project`='2' WHERE `id`='1195';
UPDATE `theredpin`.`main_city` SET `feature_property`='5', `feature_project`='5' WHERE `id`='997';

-- Featured Hoods ON ---
UPDATE `theredpin`.`main_hood` SET `feature_property`='0', `feature_project`='2' WHERE `id`='558';
UPDATE `theredpin`.`main_hood` SET `feature_property`='1' WHERE `id`='759';
UPDATE `theredpin`.`main_hood` SET `feature_property`='2', `feature_project`='4' WHERE `id`='516';
UPDATE `theredpin`.`main_hood` SET `feature_property`='3', `feature_project`='0' WHERE `id`='613';
UPDATE `theredpin`.`main_hood` SET `feature_property`='4', `feature_project`='1' WHERE `id`='495';
UPDATE `theredpin`.`main_hood` SET `feature_property`='5' WHERE `id`='660';
UPDATE `theredpin`.`main_hood` SET `feature_project`='3' WHERE `id`='571';
UPDATE `theredpin`.`main_hood` SET `feature_project`='5' WHERE `id`='601';

-- Featured Cities BC ---
UPDATE `theredpin`.`main_city` SET `feature_property`='0' WHERE `id`='647';
UPDATE `theredpin`.`main_city` SET `feature_property`='1', `feature_project`='0' WHERE `id`='223';
UPDATE `theredpin`.`main_city` SET `feature_property`='2' WHERE `id`='137';
UPDATE `theredpin`.`main_city` SET `feature_property`='3', `feature_project`='2' WHERE `id`='452';
UPDATE `theredpin`.`main_city` SET `feature_property`='4', `feature_project`='1' WHERE `id`='482';
UPDATE `theredpin`.`main_city` SET `feature_property`='5' WHERE `id`='229';
UPDATE `theredpin`.`main_city` SET `feature_project`='3' WHERE `id`='81';
UPDATE `theredpin`.`main_city` SET `feature_project`='4' WHERE `id`='280';
UPDATE `theredpin`.`main_city` SET `feature_project`='5' WHERE `id`='69';

-- Featured Hoods BC ---
UPDATE `theredpin`.`main_hood` SET `feature_property`='0' WHERE `id`='1054';
UPDATE `theredpin`.`main_hood` SET `feature_property`='1' WHERE `id`='1012';
UPDATE `theredpin`.`main_hood` SET `feature_property`='2', `feature_project`='2' WHERE `id`='1006';
UPDATE `theredpin`.`main_hood` SET `feature_property`='3' WHERE `id`='924';
UPDATE `theredpin`.`main_hood` SET `feature_property`='4', `feature_project`='1' WHERE `id`='897';
UPDATE `theredpin`.`main_hood` SET `feature_property`='5' WHERE `id`='1129';
UPDATE `theredpin`.`main_hood` SET `feature_project`='0' WHERE `id`='895';
UPDATE `theredpin`.`main_hood` SET `feature_project`='3' WHERE `id`='997';
UPDATE `theredpin`.`main_hood` SET `feature_project`='4' WHERE `id`='894';
UPDATE `theredpin`.`main_hood` SET `feature_project`='5' WHERE `id`='967';

