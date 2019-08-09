--recreate all balance triggers
--drop old:
	drop trigger p_b_update_1;
	drop trigger p_b_update_2;
	drop trigger p_b_update_3; 
	drop trigger p_b_update_4; 
	drop trigger p_b_update_6;
	drop trigger p_b_update_7;
	drop trigger p_b_update_8;
	drop trigger p_b_update_9;
	drop trigger p_b_update_10;
	drop trigger p_b_update_11;

-- new function:
create procedure balancesUpdateTrigger(
  old_d date, new_d date,
  old_i decimal(10,2),  new_i decimal(10,2),
  old_a int, new_a int)
parameter style java
language java
modifies sql data
external name
'onassis.db.functions.Triggers.balancesUpdateTrigger';

--payments: balances update : this is optimized
	create trigger p_b_update_1
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	call balancesUpdateTrigger(
	old.d, new.d,
	old.i, new.i,
	old.a, new.a);

	--former p_b_update_11
	create trigger p_b_update_2
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	update b set l = hasUnlockedPayments(d)
	where a=0 and (d = new.d or d = old.d);
	
	