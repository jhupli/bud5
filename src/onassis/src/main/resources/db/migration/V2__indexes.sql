--indexes------------------------------
create index p_d_index on p(d ASC);
create index b_d_a_index on p(a ASC);
create index b_d_a_index on p(c ASC);
create index b_d_a_index on b(d DESC, a ASC);
create index b_d_a_index on b(d ASC, a ASC);