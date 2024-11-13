drop table if exists group_members;
drop table if exists my_groups;
drop table if exists favorite;
drop table if exists review;
drop table if exists account;
drop type if exists visibility;

create type visibility as enum('HIDDEN,VISIBLE');


create table account (
    email varchar(255) constraint "PK_account" primary key,
    password varchar(255) not null
);

create table review (
	review_id serial primary key,
    email varchar(255) references account(email) on delete cascade,
    review_text varchar(255) not null,
    stars float not null,
    movie_name varchar(255)[],
    date timestamp not null
);

create table favorite (
	favorite_id serial primary key,
    email varchar(255) references account(email) on delete cascade,
    movie_name varchar(255)[],
    current_visibility visibility
);

create table my_groups (
    owner_email varchar(255) not null,
    group_name varchar(255) not null,
    movie_name varchar(255)[] not null,
    showtime JSONB[],
	constraint "PK_my_groups_owner_email" primary key (owner_email),
	constraint "FK_my_groups_owner_email" foreign key (owner_email)
	references account (email) on delete cascade
);

CREATE TABLE group_members (
    group_owner_email VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    CONSTRAINT "FK_group_members_group_owner_email" FOREIGN KEY (group_owner_email)
    REFERENCES my_groups(owner_email) on delete cascade,
    CONSTRAINT "FK_group_members_member_email" FOREIGN KEY (member_email)
    REFERENCES account(email) on delete cascade
);