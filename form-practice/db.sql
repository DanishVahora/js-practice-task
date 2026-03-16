

CREATE DATABASE IF NOT EXISTS job_application;

USE job_application;


create table candidates (
 candidate_id INT AUTO_INCREMENT primary key,
 first_name varchar(50),
 last_name varchar(50),
 designation varchar(150),
 email varchar(100),
 mobile_number varchar(15),
 
 address_1 varchar(255),
 address_2 varchar(255),
 city varchar(50),
 state varchar(50),
 pincode varchar(15),
 
 gender enum('male','female'),
 relationship_status enum('single','married', 'divorced'),
 dob date,
 created_at timestamp default current_timestamp
);


create table education(
	education_id int auto_increment primary key ,
    candidate_id int not null,
    
    course_name varchar(100),
    passing_year int,
    university_board varchar(255),
    percentage decimal(5,2),

    created_at timestamp default current_timestamp,
    
    foreign key(candidate_id)
    references candidates(candidate_id)
    on delete cascade
);


create table experience(
	experience_id int auto_increment primary key,
    candidate_id int not null,
    
    company varchar(150),
    designation varchar(150),
    annual_package decimal(10,2),
    from_date date, 
    to_date date,
    reason_to_leaving text, 
    referral_contact varchar(50),
    referral_name varchar(100),

    created_at timestamp default current_timestamp,
    
    foreign key(candidate_id)
    references candidates(candidate_id)
    on delete cascade
    
);

create table language_known(
	language_id int auto_increment primary key,    
    language_name varchar(50),

    created_at timestamp default current_timestamp
);



create table candidate_language(
	candidate_language_id int auto_increment primary key,
    language_id int, 
    candidate_id int, 
    
    can_read boolean,
    can_write boolean, 
    can_speak boolean,

    created_at timestamp default current_timestamp,
    
    foreign key(language_id)
    references language_known(language_id) 
    on delete cascade,
    
    foreign key(candidate_id)
    references candidates(candidate_id)
    on delete cascade 
    
);


create table technology_known(
	technology_id int auto_increment primary key,    
    technology_name varchar(50) unique,

    created_at timestamp default current_timestamp
);



create table candidate_technology(
	candidate_technology_id int auto_increment primary key,
    technology_id int, 
    candidate_id int, 
    
    skill_level enum("Beginner","Intermidiate","Expert"),
    
    foreign key(technology_id)
    references technology_known(technology_id) 
    on delete cascade,

    created_at timestamp default current_timestamp,
    
    foreign key(candidate_id)
    references candidates(candidate_id)
    on delete cascade
    
);



create table reference_contact(
	reference_contact_id int auto_increment primary key,
    candidate_id int not null,
	reference_name varchar(50),
    
    email varchar(255),
    phone_number varchar(100),

    created_at timestamp default current_timestamp,
    
    foreign key(candidate_id)
    references candidates(candidate_id)
    on delete cascade
);

create table preferences(
	preference_id int auto_increment primary key,
    candidate_id int not null,
    
    cureent_salary decimal(10,2),
    expected_salary decimal(10,2),
    
    notice_period int,
    preferred_role varchar(100),

    created_at timestamp default current_timestamp,
    
    foreign key (candidate_id)
    references candidates(candidate_id)
    on delete cascade
);


create table location(
	location_id int auto_increment primary key,
    candidate_id int not null,
    preference_id int not null,
    
    preferred_location varchar(150),

    created_at timestamp default current_timestamp,
    
    foreign key (candidate_id) 
    references candidates(candidate_id)
    on delete cascade,
    
    foreign key (preference_id)
    references preferences(preference_id)
    on delete cascade 
);
