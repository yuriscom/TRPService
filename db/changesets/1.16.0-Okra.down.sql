Call DropIndex('user', 'forgot_password_token');
Call DropIndex('user', 'forgot_password_token_UNIQUE');
Call DropColumn('user','forgot_password_token');
Call DropColumn('user','forgot_password_expires_on');

delete from marketo_event_type where sys_name = 'forgot-password';