Call DropColumn('saved_search','last_checked');
Call DropColumn('saved_search','last_sent');
Call DropIndex('property', 'addr_full_index');
Call DropIndex('precon', 'title_index');