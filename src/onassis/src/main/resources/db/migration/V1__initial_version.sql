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
	a int not null);
alter table b 
add constraint b_u_da unique (d, a);

--functions------------------------------

--balances
create function balanceBefore( d date, a integer )
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.balanceBefore';

create function balanceAfter( d date, a integer )
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Balance.balanceAfter';

create function positive(a  decimal(10,2))
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Util.positive';

create function negative(a  decimal(10,2))
returns decimal(10,2)
parameter style java
language java
external name 'onassis.db.functions.Util.negative';

create procedure random_data()
parameter style java
language java
modifies sql data
external name 
'onassis.db.functions.DataProvider.random_data';

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
	referencing new as new
	for each row mode db2sql
	insert into h(id, d, i, c, a, s, g, descr, op, hd, rownr) values 
		(new.id, new.d, new.i, new.c, new.a, new.s, new.g, new.descr, 'U', current_timestamp, (select max(rownr) + 1 from h where id = new.id));

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
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a
	  from b
	  where  
	    d = new.d and a = new.a  
	  	having count(*)=0 
	);
	
	-- 0-account
	create trigger p_b_insert_1_sum_account 
	after insert on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0
	  from b
	  where  
	    d = new.d and a = 0  
	  	having count(*)=0 
	);

	--update income and expence to inserted value
	create trigger p_b_insert_2 
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set i = i + positive(new.i), e = e + negative(new.i)
	where d = new.d and (a = new.a or a=0);

	--update balances to inserted value
	create trigger p_b_insert_3 
	after insert on p
	referencing new as new
	for each row mode db2sql
	update b set b = b + new.i
	where d >= new.d and (a = new.a or a=0);

	
	--clean up if zero balance (i = 0 and e = 0)
	create trigger p_b_insert_4 
	after insert on p
	referencing new as new
	for each row mode db2sql
	delete from b
	where d = new.d and i = 0 and e = 0 and (a = new.a or a=0);

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

--payments: balances update : this is del (delete old value) + ins (insert as new)
	--update income and expence (del)

	create trigger p_b_update_ins_1 
	after update on p
	referencing new as new old as old
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, new.a), 0, 0, new.a
	  from b
	  where  
	    d = new.d and a = new.a  
	  	having count(*)=0 
	);
	-- 0-account
	create trigger p_b_update_ins_1_sum_account  
	after update on p
	referencing new as new
	for each row mode db2sql
	insert into b (  
	  select new.d, balanceBefore(new.d, 0), 0, 0, 0
	  from b
	  where  
	    d = new.d and a = 0  
	  	having count(*)=0 
	);
	
	create trigger p_b_update_del_1 
	after update on p
	referencing old as old
	for each row mode db2sql
	update b set i = i - positive(old.i), e = e - negative(old.i)
	where d = old.d and (a = old.a or a=0);

	--update balances (del)
	create trigger p_b_update_del_2  
	after update on p
	referencing old as old
	for each row mode db2sql
	update b set b = b - old.i
	where d >= old.d and (a = old.a or a=0);

	--update income and expence to inserted value
	create trigger p_b_update_ins_2
	after update on p
	referencing new as new
	for each row mode db2sql
	update b set i = i + positive(new.i), e = e + negative(new.i)
	where d = new.d and (a = new.a or a=0);

	--update balances to inserted value
	create trigger p_b_update_ins_3
	after update on p
	referencing new as new
	for each row mode db2sql
	update b set b = b + new.i
	where d >= new.d and (a = new.a or a=0);

	--clean up if zero balance (i = 0 and e = 0)
	create trigger p_b_update_ins_4
	after update on p
	referencing new as new
	for each row mode db2sql
	delete from b
	where d = new.d and i = 0 and e = 0 and (a = new.a or a=0);
	
	--clean up if zero balance (i = 0 and e = 0) (del)
	create trigger p_b_update_del_3 
	after update on p
	referencing old as old
	for each row mode db2sql
	delete from b
	where d = old.d and i = 0 and e = 0 and (a = old.a or a=0);
