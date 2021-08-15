Call DropIndex('precon_unit','num_beds');
Call DropIndex('precon_unit','num_baths');
Call DropIndex('precon_unit','hidden');
Call DropIndex('precon_unit','price');

Call DropIndex('precon','price_min');
Call DropIndex('precon','price_max');
Call DropIndex('precon','is_vip_active');

Alter table `theredpin`.`precon` drop COLUMN `num_floorplans`;

delete from registry where name = 'interestRate' and domain = 'Application';