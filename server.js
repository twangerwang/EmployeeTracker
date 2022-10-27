const mysql = require('mysql2');
const inquirer = require('inquirer');
const ctable = require('console.table');
const fs = require('fs');
const db = require ('./db/db');

const PORT = process.env.PORT || 3004;

const team = [];


const startQuestion = function() {
inquirer.prompt([
    {
        type:'list',
        name:'firstoption',
        message:'Please select an option.',
        choices:[
            'View all Departments',
            'View all Roles',
            'View all employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ],
    }
]).then((answers) =>{
    switch (answers.firstoption) {
        case 'View all Departments':
            viewAllDepartments();
            break;
        case 'View all Roles':
            viewAllRoles();
            break;
        case 'View all employees':
            viewAllEmployees();
            break;  
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
        case 'Exit':
            db.end();
            break;
        }
    })
}
startQuestion();

function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    db.query(query, (err,res)=> {
        console.table(res);
        startQuestion();
    });
}

function viewAllRoles() {
    const query = 'SELECT * FROM role';
    db.query(query, (err,res)=> {
        console.table(res);
        startQuestion();
    });
}

function viewAllEmployees() {
    const query = 'SELECT * FROM employee';
    db.query(query, (err,res)=> {
        console.table(res);
        startQuestion();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the new department?'
        }
    ]).then(data=> {
        db.query('INSERT INTO department SET ?',
        {
            dept:data.dept
        },function (err) {
            if (err) throw err;
            let values = [[data.dept]]
                console.log('\n Department added! \n')
                console.table(["New Department"], values)
                startQuestion();
        });
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What new role would you like to add?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?' 
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Which department does the new role fall under?'
        }
    ]).then((data)=> {
        db.query('INSERT INTO role SET ?', 
        {
            title: data.role,
            salary: data.salary,
            department_id: data.dept
        },
        function (err) {
            if (err) throw err;
            let values = [[data.role]]
                console.log('\n New role added! \n')
                console.table(['New Role'], values)
                startQuestion();
        })
    })
}

function addEmployee() {
    db.query('SELECT * FROM role', (err, roles)=> {
        if (err) console.log(err);
        roles.roles.map((role)=> {
            return {
                name:role.title,
                value:role.id
            };
        });
        db.query('SELECT * FROM EMPLOYEE', (err, manager)=> {
            if (err) console.log(err);
            manager.manager.map((manager)=> {
                return {
                    name: manager.first_name+""+manager.last_name,
                    value:manager.manager_id
                };
            })
        })
        inquirer.prompt ([
            {
                type:'input',
                name:'firstName',
                message:"What is the new employee's first name?"
            },
            {
                type:'input',
                name:'lastName',
                message:"What is the new employee's last name?"
            },
            {
                type:'list',
                name:'role',
                message:"What is the new employee's role?",
                choices:roles
            },
            {
                type:'list',
                name:'managerID',
                message:"Who will be the new employee's new manager?",
                choices:manager
            }
        ]).then((data)=> {
            console.log(data.role);
            db.query('INSERT INTO emplyee SET ?',
            {
                first_name:data.firstName,
                last_name: data.lastName,
                role_id: data.role,
                manager_id: data.managerID
            },
            (err)=> {
                if (err) throw err;
                let values =[[data.firstName, data.lastName]]
                console.log('\n New eployee added \n');
                console.table(["First Name", "Last Name"], values)
                startQuestion();
            }
            )
        })
    })
    
};

function updateEmployeeRole() {
    db.query('SELECT * FROM employee',(err,employee) => {
        if (err) console.log(err);
        employees=employees.map((employee)=> {
            return {
                name: employee.first_name+""+employee.last_name,
                value: employee.role_id
            };
        });
        db.query('SELECT * FROM role', (err, roles)=> {
            if (err) console.log(err);
            roles=roles.map((role)=> {
                return {
                    name: role.title,
                    value: role.id,
                };
            });
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'chooseEmployee',
                    message: 'Which employee whould you like to update?',
                    choices: employees,
                },
                {
                    type: 'list',
                    name: 'chooseRole',
                    message: 'Select the new role for the employee',
                    choices: roles,
                },
            ]).then((data)=> {
                db.query('UPDATE employee SET ? WHERE ?',
                [{
                    role_id:data.chooseRole,
                },
                {
                    id:data.chooseEmployee,
                },
                ],
                function (err) {
                    if (err) throw err;
                }
                
                );
                console.log('Employee role updated');
                viewAllEmployees();
            })
        })
    })
}