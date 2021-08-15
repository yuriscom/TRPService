delete from user_affiliate where user_id in (select id from user where username = 'websiteFormBeta' and role_id = 8);
delete from user where username = 'websiteFormBeta' and role_id = 8;
delete from contact_source where sys_name = 'website-form-beta';