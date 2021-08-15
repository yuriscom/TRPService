ALTER TABLE `theredpin`.`user` 
ADD COLUMN `forgot_password_token` VARCHAR(45) NULL AFTER `user_status_id`,
ADD COLUMN `forgot_password_expires_on` DATETIME NULL AFTER `forgot_password_token`;

ALTER TABLE `theredpin`.`user`
ADD UNIQUE INDEX `forgot_password_token_UNIQUE` (`forgot_password_token` ASC);

ALTER TABLE `theredpin`.`user`
ADD INDEX `forgot_password_token` (`forgot_password_token` ASC);

INSERT INTO `theredpin`.`marketo_event_type` (name, sys_name, created_on)
VALUES ('Forgot Password', 'forgot-password', now());
