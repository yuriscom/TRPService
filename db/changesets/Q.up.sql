Call AddColumn('city','feature_property', 'TINYINT NULL');
Call AddColumn('city','feature_project', 'TINYINT NULL');

Call AddColumn('hood','feature_property', 'TINYINT NULL');
Call AddColumn('hood','feature_project', 'TINYINT NULL');


UPDATE `theredpin`.`hood` SET `feature_property`='0' WHERE `id`='989';
UPDATE `theredpin`.`hood` SET `feature_project`='0' WHERE `id`='1067';
UPDATE `theredpin`.`hood` SET `feature_property`='1', `feature_project`='2' WHERE `id`='1066';
UPDATE `theredpin`.`hood` SET `feature_project`='1' WHERE `id`='962';
UPDATE `theredpin`.`hood` SET `feature_property`='2' WHERE `id`='451';

UPDATE `theredpin`.`city` SET `feature_property`='0', `feature_project`='0' WHERE `id`='697';
UPDATE `theredpin`.`city` SET `feature_property`='1', `feature_project`='1' WHERE `id`='1072';
UPDATE `theredpin`.`city` SET `feature_project`='2' WHERE `id`='1053';
UPDATE `theredpin`.`city` SET `feature_property`='2' WHERE `id`='787';
