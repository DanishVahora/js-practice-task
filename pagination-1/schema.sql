-- Schema for pagination-1 project
-- Creates the database and table used by home.js and script_for_data.js

CREATE DATABASE IF NOT EXISTS students;
USE students;

CREATE TABLE IF NOT EXISTS basic_info (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    dob DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_fname (fname),
    INDEX idx_lname (lname),
    INDEX idx_email (email)
);