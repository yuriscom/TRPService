insert into user(login_type_id,username,password,role_id,created_on,user_status_id) values (1,'websiteForm',md5('q$n0cB'),8,now(),1);
set @affiliate_user_id = LAST_INSERT_ID();
insert into user_affiliate(`user_id`,`contact_source_id`,`created_on`) values(@affiliate_user_id,13,now());
insert into api_key(`user_id`,`key_hash`,`api_key_status_id`,`created_on`) values(@affiliate_user_id,'7272KY9Vj9tKKHpX3k5KzgZtGQYuyw',2,now());