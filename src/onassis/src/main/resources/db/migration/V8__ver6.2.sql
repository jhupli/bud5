--Bug fix: lock indicator does not set when inserting

	create trigger p_b_insert_7
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set l = hasUnlockedPayments(d)
	where a=0 and d = new.d;