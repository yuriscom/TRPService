UPDATE `theredpin`.`main_city` SET `feature_property`='0', `feature_project`='0' WHERE `id`='452';
UPDATE `theredpin`.`main_city` SET `feature_property`='1', `feature_project`='1' WHERE `id`='647';
UPDATE `theredpin`.`main_city` SET `feature_property`='2', `feature_project`='2' WHERE `id`='223';

UPDATE `theredpin`.`main_hood` SET `feature_property`='0', `feature_project`='0' WHERE `id`='25';
UPDATE `theredpin`.`main_hood` SET `feature_property`='1', `feature_project`='1' WHERE `id`='17';
UPDATE `theredpin`.`main_hood` SET `feature_property`='2', `feature_project`='2' WHERE `id`='18';

update property set sqft = replace(sqft, ' sqft', '') where sqft like '%sqft%' AND addr_province = "British Columbia" and rets_feed_id = 12;
