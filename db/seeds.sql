-- Use company database --
USE company;

-- insert values for department, role, and employees --
INSERT INTO department (name)
VALUES  ("CEO"),
        ("MARKETING"),
        ("ENGINEER"),
        ("SALES"),
        ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES  ("CEO", 500000, 1),
        ("VP Marketing", 250000, 2),
        ("SENIOR ENGINEER", 225000, 3),
        ("SALES LEAD", 150000, 4),
        ("CFO", 500000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Mr.", "Krabs", 1, NULL),
        ("Squidward", "Tentacles", 2, 1),
        ("SpongeBob", "SquarePants", 3, 2),
        ("Patrick", "Star", 4, 3),
        ("Sandy", "Cheeks", 1,3);