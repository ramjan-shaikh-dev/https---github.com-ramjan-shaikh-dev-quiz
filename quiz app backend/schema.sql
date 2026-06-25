CREATE DATABASE IF NOT EXISTS quize_db;
USE quize_db;

CREATE TABLE users( 
  id int auto_increment primary key, 
  name varchar(500) not null,
  email varchar(500) not null, 
  password varchar(500) not null, 
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE
); 

ALTER TABLE users
ADD is_verified boolean default false; 

create table users_verification( 
id int auto_increment primary key, 
user_id int not null,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
is_active BOOLEAN DEFAULT TRUE,
is_deleted BOOLEAN DEFAULT FALSE ,

foreign key(user_id)
references users(id)
on delete cascade
);   
ALTER TABLE users_verification
ADD otp int not null; 





