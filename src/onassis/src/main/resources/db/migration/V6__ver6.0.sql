--
-- CB: cumulative balance of category (issue)
--
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

-- new procedure for update of cb
create procedure cBalancesUpdateTrigger(
  old_dc date, new_dc date,
  old_i decimal(10,2),  new_i decimal(10,2),
  old_c int, new_c int)
parameter style java
language java
modifies sql data
external name
'onassis.db.functions.CbTriggers.cBalancesUpdateTrigger';

--migration:
insert into cb(dc, b, i, c)
    (select dc, 0, sum(i), c
     from p
     group by dc, c);

update cb set b = (select sum(i) from p where c = cb.c and dc <= cb.dc);

delete from cb
where i = 0;

--after migration lets create triggers:
--payments: cbalances triggers insert:
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

--update cbalances to inserted value
create trigger p_cb_insert_3
after insert on p
referencing new as new
for each row mode db2sql
update cb set b = b + new.i
where dc >= new.dc and c = new.c;

--clean up if zero cbalance (i = 0)
create trigger p_cb_insert_4
after insert on p
referencing new as new
for each row mode db2sql
delete from cb
where dc = new.dc and i = 0 and c = new.c;

--payments: cbalances delete:
--update income and expence to deleted value
create trigger p_cb_delete_1
after delete on p
referencing old as old
for each row mode db2sql
update cb set i = i - old.i
where dc = old.dc and c = old.c;

--update cbalances to deleted value
create trigger p_cb_delete_2
after delete on p
referencing old as old
for each row mode db2sql
update cb set b = b - old.i
where dc >= old.dc and c = old.c;

--clean up if zero cbalance (i = 0)
create trigger p_cb_delete_3
after delete on p
referencing old as old
for each row mode db2sql
delete from cb
where dc = old.dc and i = 0 and c = old.c;

--payments: cbalances update: trigger for update
create trigger p_cb_update_1
after update on p
referencing new as new old as old
for each row mode db2sql
call cBalancesUpdateTrigger(
old.dc, new.dc,
old.i, new.i,
old.c, new.c);

