alter table h
add column dc date not null default current_date;

update h set dc = d;

drop trigger p_audit_insert;
drop trigger p_audit_update;
drop trigger p_audit_delete;
drop procedure history;

alter table p
add column dc date not null default current_date;

update p set dc = d;

create procedure historify(
	old_l boolean, new_l boolean,
	old_id int, old_dc date , old_d date , old_i decimal(10,2), old_c int, old_a int, old_s boolean, old_g varchar(15), old_descr varchar(50),
 	new_id int, new_dc date , new_d date , new_i decimal(10,2), new_c int, new_a int, new_s boolean, new_g varchar(15), new_descr varchar(50))
parameter style java
language java
modifies sql data
external name
'onassis.db.functions.History.historify';

--triggers------------------------------
--payments: audit log (history),
	--insert payment:
	create trigger p_audit_insert
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into h(id, dc, d, i, c, c_descr, a, a_descr, s, g, descr, op, hd, rownr) values
		(new.id, new.dc, new.d, new.i, new.c, (select descr from c where id = new.c), new.a, (select descr from a where id = new.a), new.s, new.g, new.descr, 'C', current_timestamp, 0);

	--update payment:
	create trigger p_audit_update
	after update on p
	referencing old as old new as new
	for each row mode db2sql
	call historify(old.l, new.l,
	old.id, old.dc ,old.d, old.i, old.c, old.a, old.s, old.g, old.descr,
	new.id, new.dc,  new.d, new.i, new.c, new.a, new.s, new.g, new.descr);
	--insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values
	--	(new.id, new.d, new.i, new.c, new.a, new.s, new.g, new.descr, 'U', current_timestamp, (select max(rownr) + 1 from h where id = new.id));

	--delete payment:
	create trigger p_audit_delete
	after delete on p
	referencing old as old
	for each row mode db2sql
	insert into h(id, dc, d, i, c, c_descr, a, a_descr, s, g, descr, op, hd, rownr) values
		(old.id, old.dc, old.d, old.i, old.c, (select descr from c where id = old.c), old.a, (select descr from a where id = old.a), old.s, old.g, old.descr,'D', current_timestamp,
		(select max(rownr) + 1 from h where id = old.id));

	--update account (credit may not be updated)
create procedure checkCredit(old_credit boolean, new_credit boolean)
parameter style java
language java
external name
'onassis.db.functions.Util.checkCredit';

	create trigger a_update
	after update on a
	referencing old as old new as new
	for each row mode db2sql
	call checkCredit(old.credit, new.credit);

create index p_dc_a_index on p(dc ASC, d ASC, a ASC);
-- new function:
create procedure checkDc_D(dc date, d date)
parameter style java
language java
external name
'onassis.db.functions.Util.checkDc_D';

--payments: check: dc < d

	create trigger p_insert_1
	after insert on p
	referencing new as new
	for each row mode db2sql
	call checkDc_D(new.dc, new.d);

	create trigger p_update_1
	after update on p
	referencing new as new
	for each row mode db2sql
	call checkDc_D(new.dc, new.d);

create index a_credit_index on a(credit ASC, id ASC);

--balances table for categories
--balances
--date, balance, income, expence, account
create table cb(
	dc date not null,
	b decimal(10,2) not null,
	i decimal(10,2) not null,
	c int not null);

alter table cb
add constraint cb_u_dcc unique (dc, c);

--categroy balances
create function cBalanceAfter(dc date, c integer)
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.cBalanceAfter';

create function cBalanceBefore(dc date, c integer)
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.cBalanceBefore';

--payments: cbalances insert:
	--create entry to cbalances if not already exists

	create trigger p_cb_insert_1
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into cb (
	  select new.dc, cBalanceBefore(new.dc, new.c), 0, new.c
	  from cb
	  where
	    dc = new.dc and c = new.c
	  	having count(*)=0
	);

	--update income and expence to inserted value
	create trigger p_cb_insert_2
	after insert on p
	referencing new as new
	for each row mode db2sql
	update cb set i = i + new.i
	where dc = new.dc and c = new.c;

	--update balances to inserted value
	create trigger p_cb_insert_3
	after insert on p
	referencing new as new
	for each row mode db2sql
	update cb set b = b + new.i
	where dc >= new.dc and c = new.c;

	--clean up if zero balance (i = 0)
	create trigger p_cb_insert_4
	after insert on p
	referencing new as new
	for each row mode db2sql
	delete from cb
	where dc = new.dc and i = 0 and c = new.c;

--payments: balances delete:
	--update income and expence to deleted value
	create trigger p_cb_delete_1
	after delete on p
	referencing old as old
	for each row mode db2sql
	update cb set i = i - old.i
	where dc = old.dc and c = old.c;

	--update balances to deleted value
	create trigger p_cb_delete_2
	after delete on p
	referencing old as old
	for each row mode db2sql
	update cb set b = b - old.i
	where dc >= old.dc and c = old.c;

	--clean up if zero balance (i = 0)
	create trigger p_cb_delete_3
	after delete on p
	referencing old as old
	for each row mode db2sql
	delete from cb
	where dc = old.dc and i = 0 and c = old.c;

	-- new function:
create procedure cBalancesUpdateTrigger(
  old_dc date, new_dc date,
  old_i decimal(10,2),  new_i decimal(10,2),
  old_c int, new_c int)
parameter style java
language java
modifies sql data
external name
'onassis.db.functions.CbTriggers.cBalancesUpdateTrigger';

--payments: balances update : this is optimized
	create trigger p_cb_update_1
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	call cBalancesUpdateTrigger(
	old.dc, new.dc,
	old.i, new.i,
	old.c, new.c);