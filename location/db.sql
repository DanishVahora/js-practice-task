
create DATABASE location_combos;

use location_combos;

create table countries(
	country_id int auto_increment primary key,
    country_name varchar(50) not null
);

create table states(
	state_id int auto_increment primary key,
    state_name varchar(50) not null,

    country_id int not null,
    unique(state_name, state_id),

    
	constraint foreign key(country_id) references countries(country_id) on delete cascade
);

create table cities(
	city_id int auto_increment primary key,
    city_name varchar(50) not null,

    state_id int not null,
    unique(city_name, state_id),
    
    constraint foreign key(state_id) references states(state_id) on delete cascade
);

CREATE TABLE temp_locations(
	country varchar(100),
    state varchar(100),
    city varchar(100)
);






insert ignore into countries (country_name)
select distinct country from temp_locations;

insert ignore into states (state_name, country_id)
select distinct t.state, c.country_id from temp_locations t join countries c on c.country_name = t.country;

insert ignore into cities (city_name, state_id)
select distinct t.city, s.state_id  from temp_locations t join states s ON t.state=s.state_name 
join countries c on s.country_id = c.country_id and c.country_name=t.country
