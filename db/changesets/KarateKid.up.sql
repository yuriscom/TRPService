insert into contact_source(`name`,`sys_name`,`created_on`) values('Website Form Beta','website-form-beta',now());
set @contact_source_id = LAST_INSERT_ID();
insert into user (login_type_id,username,password,role_id,created_on,user_status_id) values (1,'websiteFormBeta',md5('f4LggB'),8,now(),1);
set @affiliate_user_id = LAST_INSERT_ID();
insert into user_affiliate(`user_id`,`contact_source_id`,`created_on`) values(@affiliate_user_id,@contact_source_id,now());
insert into api_key(`user_id`,`key_hash`,`api_key_status_id`,`created_on`) values(@affiliate_user_id,'4Ax3724V57FU3np5m55TjraD5J7Fzz',2,now());