--tables------------------------------
--categories
create table c(
	id int not null generated always as identity (start with 1, increment by 1) primary key,
	descr varchar(30) not null,
	i decimal(10,2) not null, 
	active boolean not null,
	color varchar(20) not null);

--accounts
create table a(
	id int not null generated always as identity (start with 1, increment by 1) primary key,
	descr varchar(30) not null,
	active boolean not null,
	color varchar(20) not null,
	credit boolean not null);

--payments 
--id, d_ate, i_ncomes, c_ategory a_ccount, l_ocked, s_lice, g_roup
create table p(
	id int not null generated always as identity (start with 1, increment by 1) primary key, 
	d date not null, 
	i decimal(10,2) not null, 
	c int not null, 
	a int not null, 
	l boolean not null default false,
	s boolean not null default true,
	g varchar(15),
	descr varchar(50),
	constraint p_c_fk foreign key (c) references c (id),
	constraint p_a_fk foreign key (a) references a (id)
	);

--history
--payment id, date, income, account, operation, historydate, rownr
create table h(
	id int not null, 
	d date not null, 
	i decimal(10,2) not null, 
	c int not null, 
	a int not null,
	s boolean not null,
	g varchar(15),
	descr varchar(50),
	op varchar(1) not null, 
	hd timestamp not null, 
	rownr int not null,
	constraint h_c_fk foreign key (c) references c (id),
	constraint h_a_fk foreign key (a) references a (id)
	);

--balances
--date, balance, income, expence, account
create table b(
	d date not null, 
	b decimal(10,2) not null, 
	i decimal(10,2) not null, 
	e decimal(10,2) not null, 
	a int not null,
	smallestb decimal(10,2));
--0 account holds the smallest balance of accounts of that date
alter table b 
add constraint b_u_da unique (d, a);

--functions------------------------------

--balances
create function balanceBefore(d date, a integer)
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.balanceBefore';

create function smallestBalanceAt(d date)
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.smallestBalanceAt';

create function balanceAfter(d date, a integer)
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.balanceAfter';

create function positive(a decimal(10,2))
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Util.positive';

create function negative(a decimal(10,2))
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Util.negative';

create function earlier(d1 date, d2 date)
returns date
parameter style java
language java
external name 'onassis.db.functions.Util.earlier';

create procedure random_data()
parameter style java
language java
modifies sql data
external name 
'onassis.db.functions.DataProvider.random_data';

create procedure history(
	old_l boolean, new_l boolean,
 	new_id int, new_d date , new_i decimal(10,2), new_c int, new_a int, new_s boolean, new_g varchar(15), new_descr varchar(50))
parameter style java
language java
modifies sql data
external name 
'onassis.db.functions.History.history';

--triggers------------------------------
--payments: audit log (history), 
	--insert payment: 
	create trigger p_audit_insert 
	after insert on p 
	referencing new as new
	for each row mode db2sql
	insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values 
		(new.id, new.d, new.i, new.c, new.a, new.s, new.g, new.descr, 'C', current_timestamp, 0);
		
	--update payment: 
	create trigger p_audit_update 
	after update on p 
	referencing old as old new as new 
	for each row mode db2sql
	call history(old.l, new.l, new.id, new.d, new.i, new.c, new.a, new.s, new.g, new.descr);
	--insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values 
	--	(new.id, new.d, new.i, new.c, new.a, new.s, new.g, new.descr, 'U', current_timestamp, (select max(rownr) + 1 from h where id = new.id));

	--delete payment: 
	create trigger p_audit_delete 
	after delete on p
	referencing old as old
	for each row mode db2sql
	insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values 
		(old.id, old.d, old.i, old.c, old.a, old.s, old.g, old.descr,'D', current_timestamp, 
		(select max(rownr) + 1 from h where id = old.id));

--payments: balances insert:
	--create entry to balances if not already exists
	
	create trigger p_b_insert_1 
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a, 0
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
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0, 0
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
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a, 0
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
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0, 0
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

