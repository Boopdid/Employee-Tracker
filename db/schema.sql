DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  departmentName VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    departmentId INT,
    salary INT NOT NULL,
    FOREIGN KEY (departmentId)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    roleId INT,
    managerId INT,
    FOREIGN KEY (roleId)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (managerId)
    REFERENCES employees(id)
    ON DELETE SET NULL
);