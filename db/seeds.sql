USE employee_tracker;

INSERT INTO department
    (name)
VALUES
    ("Sales"),
    ("Logistics"),
    ("Accounting"),
    ("Information Technology");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Sales Person", 50000, 1),
    ("Logistics analyst", 80000, 2),
    ("Account Manager", 70000, 3),
    ("Software Engineer", 150000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Jane", "Doe", 1, NULL),
    ("John", "West", 4, NULL),
    ("Jane", "Austin", 4, 2),
    ("Eric", "Johnson", 3, NULL);

