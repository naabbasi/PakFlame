https://github.com/LUSHDigital/modelgen
https://github.com/golang-migrate/migrate

drop database sanitary cascade;
create database sanitary encoding 'utf-8';
create table test1(id int default unique_rowid(), name varchar(20), primary key(id));
create table test2(id uuid default gen_random_uuid(), name varchar(20), primary key(id));
