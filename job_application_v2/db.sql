CREATE DATABASE job_portal;
USE job_portal;

CREATE TABLE select_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type ENUM('dropdown', 'radio', 'checkbox') NOT NULL,
    is_multiple BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE option_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    select_id INT NOT NULL,
    value VARCHAR(100) NOT NULL,
    label VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (select_id) REFERENCES select_master(id) ON DELETE CASCADE
);

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address1 TEXT,
    address2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),

    gender VARCHAR(50),
    relationship_status VARCHAR(50),

    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    expected_salary DECIMAL(10,2),
    current_salary DECIMAL(10,2),
    notice_period INT,
    preferred_role VARCHAR(50),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE candidate_education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    course VARCHAR(150),
    passing_year INT,
    board VARCHAR(150),
    percentage DECIMAL(5,2),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE candidate_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company VARCHAR(150),
    designation VARCHAR(150),
    salary DECIMAL(10,2),
    from_date DATE,
    to_date DATE,
    reason TEXT,
    ref_contact VARCHAR(100),
    ref_name VARCHAR(100),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE candidate_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    option_id INT NOT NULL,
    level ENUM('beginner', 'intermediate', 'expert'),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES option_master(id) ON DELETE CASCADE
);

CREATE TABLE candidate_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    option_id INT NOT NULL,
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_speak BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES option_master(id) ON DELETE CASCADE
);

CREATE TABLE candidate_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    location_value VARCHAR(100),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE candidate_reference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(15),

    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

INSERT INTO select_master (name, type, is_multiple) VALUES
('relationship_status', 'dropdown', FALSE),
('gender', 'radio', FALSE),
('technologies', 'checkbox', TRUE),
('languages', 'checkbox', TRUE),
('preferred_role', 'dropdown', FALSE);

INSERT INTO option_master (select_id, value, label) VALUES
(1, 'single', 'Single'),
(1, 'married', 'Married'),
(1, 'divorced', 'Divorced');


INSERT INTO option_master (select_id, value, label) VALUES
(2, 'male', 'Male'),
(2, 'female', 'Female');

INSERT INTO option_master (select_id, value, label) VALUES
(3, 'php', 'PHP'),
(3, 'mysql', 'MySQL'),
(3, 'laravel', 'Laravel'),
(3, 'oracle', 'Oracle');

INSERT INTO option_master (select_id, value, label) VALUES
(4, 'english', 'English'),
(4, 'hindi', 'Hindi'),
(4, 'gujarati', 'Gujarati');

INSERT INTO option_master (select_id, value, label) VALUES
(5, 'developer', 'Developer'),
(5, 'manager', 'Manager'),
(5, 'analyst', 'Analyst');