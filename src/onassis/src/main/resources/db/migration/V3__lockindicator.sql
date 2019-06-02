alter table b add column l boolean not null default true;

create function hasUnlockedPayments(d date)
returns boolean
parameter style java
language java
external name 'onassis.db.functions.Balance.hasUnlockedPayments';

update b set l = hasUnlockedPayments(d)
where a = 0;

--recreate all balance triggers
--drop old:
	drop trigger p_b_insert_1; 
	drop trigger p_b_insert_2; 
	drop trigger p_b_insert_3; 
	drop trigger p_b_insert_4; 
	drop trigger p_b_insert_5; 
	drop trigger p_b_insert_6; 
	drop trigger p_b_delete_1; 
	drop trigger p_b_delete_2;  
	drop trigger p_b_delete_3; 
	drop trigger p_b_delete_4; 
	drop trigger p_b_update_1; 
	drop trigger p_b_update_2;
	drop trigger p_b_update_3; 
	drop trigger p_b_update_4; 
	drop trigger p_b_update_6;
	drop trigger p_b_update_7;
	drop trigger p_b_update_8;
	drop trigger p_b_update_9;
	drop trigger p_b_update_10;
	
--triggers ------------------------------
--payments: balances insert:
	--create entry to balances if not already exists
	
	create trigger p_b_insert_1 
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a, 0, true
	  from b
	  where  
	    d = new.d and a = new.a  
	  	having count(*)=0 
	);
	
	-- 0-account
	create trigger p_b_insert_2 
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0, 0, true
	  from b
	  where  
	    d = new.d and a = 0  
	  	having count(*)=0 
	);

	--update income and expence to inserted value
	create trigger p_b_insert_3 
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set i = i + positive(new.i), e = e + negative(new.i)
	where d = new.d and (a = new.a or a=0);

	--update balances to inserted value
	create trigger p_b_insert_4 
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set b = b + new.i
	where d >= new.d and (a = new.a or a=0);

	--clean up if zero balance (i = 0 and e = 0)
	create trigger p_b_insert_5 
	after insert on p
	referencing new as new
	for each row mode db2sql
	delete from b
	where d = new.d and i = 0 and e = 0 and (a = new.a or a=0);
	
	--update smallest balance to 0-account
	create trigger p_b_insert_6 
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set smallestb = smallestBalanceAt(d)
	where a = 0 and d >= new.d;
	
--payments: balances delete:
	--update income and expence to deleted value
	create trigger p_b_delete_1 
	after delete on p
	referencing old as old
	for each row mode db2sql
	update b set i = i - positive(old.i), e = e - negative(old.i)
	where d = old.d and (a = old.a or a=0);

	--update balances to deleted value
	create trigger p_b_delete_2  
	after delete on p
	referencing old as old
	for each row mode db2sql
	update b set b = b - old.i
	where d >= old.d and (a = old.a or a=0);

	--clean up if zero balance (i = 0 and e = 0)
	create trigger p_b_delete_3 
	after delete on p
	referencing old as old
	for each row mode db2sql
	delete from b
	where d = old.d and i = 0 and e = 0 and (a = old.a or a=0);
	
	--update smallest balance to 0-account
	create trigger p_b_delete_4 
	after delete on p
	referencing old as old
	for each row mode db2sql
	update b set smallestb = smallestBalanceAt(d)
	where a = 0 and d >= old.d;

--payments: balances update : this is delete part (delete old value) + insert part (insert as new)
	--update income and expence (del)

	-- create row for account (insert part), if not exitsts
	create trigger p_b_update_1 
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a, 0, true
	  from b
	  where  
	    d = new.d and a = new.a  
	  	having count(*)=0 
	);
	-- create row for 0-account (insert part), if not exitsts
	create trigger p_b_update_2
	after update on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0, 0, true
	  from b
	  where  
	    d = new.d and a = 0  
	  	having count(*)=0 
	);
	
	--update account's and 0-account's income and expence (delete part)
	create trigger p_b_update_3 
	after update on p
	referencing old as old
	for each row mode db2sql
	update b set i = i - positive(old.i), e = e - negative(old.i)
	where d = old.d and (a = old.a or a=0);

	--update account's and 0-account's balance (delete part)
	create trigger p_b_update_4 
	after update on p
	referencing old as old
	for each row mode db2sql
	update b set b = b - old.i
	where d >= old.d and (a = old.a or a=0);

	--update smallest balance to 0-account (delete part)
	/*create trigger p_b_update_5 
	after update on p
	referencing old as old
	for each row mode db2sql
	update b set smallestb = smallestBalanceAt(d)
	where a = 0 and d >= old.d;*/
	
	--update account's and 0-account's income and expence (insert part)
	create trigger p_b_update_6
	after update on p
	referencing new as new
	for each row mode db2sql
	update b set i = i + positive(new.i), e = e + negative(new.i)
	where d = new.d and (a = new.a or a=0);

	--update account's and 0-account's balance (insert part)
	create trigger p_b_update_7
	after update on p
	referencing new as new
	for each row mode db2sql
	update b set b = b + new.i
	where d >= new.d and (a = new.a or a=0);

	--clean up if zero balance (i = 0 and e = 0) (delete part)
	create trigger p_b_update_8
	after update on p
	referencing new as new
	for each row mode db2sql
	delete from b
	where d = new.d and i = 0 and e = 0 and (a = new.a or a=0);
	
	--clean up if zero balance (i = 0 and e = 0) (insert part)
	create trigger p_b_update_9
	after update on p
	referencing old as old
	for each row mode db2sql
	delete from b
	where d = old.d and i = 0 and e = 0 and (a = old.a or a=0);
	
	--update smallest balance to 0-account
	create trigger p_b_update_10
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	update b set smallestb = smallestBalanceAt(d)
	where a = 0 and d >= earlier(new.d, old.d);

-----new triggers:

--delete p trigger
	--update l
	create trigger p_b_delete_5 
	after delete on p
	referencing old as old
	for each row mode db2sql
	update b set l = hasUnlockedPayments(d)
	where a=0 and d = old.d;
	
--update p trigger
	--update l
	create trigger p_b_update_11
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	update b set l = hasUnlockedPayments(d)
	where a=0 and (d = new.d or d = old.d);
	
	