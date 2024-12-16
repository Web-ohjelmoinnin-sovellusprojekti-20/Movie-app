drop table if exists join_requests;
drop table if exists group_members;
drop table if exists my_groups;
drop table if exists favorite;
drop table if exists review;
drop table if exists account;
drop type if exists visibility;
drop type if exists request_status;

create type visibility as enum('HIDDEN', 'VISIBLE');
create type request_status as enum('PENDING', 'ACCEPTED', 'DECLINED');


create table account (
    email varchar(255) constraint "PK_account" primary key,
    password varchar(255) not null
);

create table review (
	review_id serial primary key,
    email varchar(255) references account(email) on delete cascade,
    review_text varchar(255) not null,
    stars float not null,
    movie_name varchar(255),
    date timestamp not null
);

create table favorite (
	favorite_id serial primary key,
    email varchar(255) references account(email) on delete cascade,
    movie_name varchar(255)[],
    current_visibility visibility
);

create table my_groups (
    id serial primary key,
    owner_email varchar(255) not null,
    group_name varchar(255) not null,
    movie_name varchar(255)[],
    showtime JSONB[],
	constraint "FK_my_groups_owner_email" foreign key (owner_email)
	references account (email) on delete cascade
);

CREATE TABLE group_members (
    group_id INT not null,
    member_email VARCHAR(255) NOT NULL,
    CONSTRAINT "FK_group_members_group_id" FOREIGN KEY (group_id)
    REFERENCES my_groups(id) on delete cascade,
    CONSTRAINT "FK_group_members_member_email" FOREIGN KEY (member_email)
    REFERENCES account(email) on delete cascade,
    primary key (group_id, member_email)
);

CREATE TABLE join_requests (
    group_id INT NOT NULL,
    request_email VARCHAR(255) NOT NULL,
    status request_status NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "FK_join_requests_group_id" FOREIGN KEY (group_id)
    REFERENCES my_groups(id) ON DELETE CASCADE,
    CONSTRAINT "FK_join_requests_request_email" FOREIGN KEY (request_email)
    REFERENCES account(email) ON DELETE CASCADE,
    PRIMARY KEY (group_id, request_email)
);
