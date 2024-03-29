--
-- DC: date of category (issue)
--

alter table h
add column dc date not null default current_date;
update h set dc = d;

drop trigger p_audit_insert;
drop trigger p_audit_update;
drop trigger p_audit_delete;
drop procedure history;

 -- must be recreated
drop trigger p_b_update_1;
drop trigger p_b_update_2;

alter table p
add column dc date not null default current_date;

update p set dc = d;

--recreate
create trigger p_b_update_1
after update on p
referencing new as new old as old
for each row mode db2sql
call balancesUpdateTrigger(
old.d, new.d,
old.i, new.i,
old.a, new.a);

--recreate
create trigger p_b_update_2
after update on p
referencing new as new old as old
for each row mode db2sql
update b set l = hasUnlockedPayments(d)
where a=0 and (d = new.d or d = old.d);

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
