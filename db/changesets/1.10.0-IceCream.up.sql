CALL AddColumn('saved_search','last_checked', 'TIMESTAMP NULL DEFAULT now()');
CALL AddColumn('saved_search','last_sent', 'TIMESTAMP NULL DEFAULT now()');
CREATE INDEX addr_full_index ON `theredpin`.`property`(`addr_full`);
ALTER TABLE precon  ADD FULLTEXT (name, addr_street);
