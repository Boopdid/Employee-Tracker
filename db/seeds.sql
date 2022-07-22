USE employees_db;

-- Creates new rows
INSERT INTO departments (departmentName)
VALUES ("R&D"), ("Legal"), ("Engineering"), ("Sales & Marketing"), ("Finance"), ("IT"), ("Leadership");

INSERT INTO roles (title, salary, departmentId)
VALUES ("CEO", 500000, (SELECT id from departments where departmentName = "Leadership")), ("CFO", 350000, (SELECT id from departments where departmentName = "Finance")), ("Software Engineer", 200000, (SELECT id from departments where departmentName = "Engineering")), ("Director of IT", 250000, (SELECT id from departments where departmentName = "IT"));

INSERT INTO employees (firstName, lastName, roleId, managerId)
VALUES  ("George", "of the Jungle", (SELECT id from roles where title = "CEO"), null), ("Nigel", "Numbuh 1 Uno", (SELECT id from roles where title = "Software Engineer"), null);

INSERT INTO employees (firstName, lastName, roleId, managerId) VALUES ("Hoagie", "Numbuh 2 Gilligan Jr.", (SELECT id from roles where title = "Software Engineer"), 2), ("Kuki", "Numbuh 3 Sanban", (SELECT id from roles where title = "Software Engineer"), 2), ("Wallabee", "Numbuh 4 Beetles", (SELECT id from roles where title = "Software Engineer"), 2), ("Abigail", "Numbuh 5 Lincoln", (SELECT id from roles where title = "Software Engineer"), 2);


SELECT * FROM departments;
SELECT * FROM roles;
SELECT * FROM employees;