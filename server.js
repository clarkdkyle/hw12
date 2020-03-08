var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table")

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "This is the Employee Database?",
            choices: [
                "View all Departments",
                "View all Employees",
                "View all Roles",
                "Add Department",
                "Add Employee",
                "Add Role"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all Departments":
                    viewdepts();
                    break;

                case "View all Employees":
                    viewemps();
                    break;

                case "View all Roles":
                    viewroles();
                    break;

                case "Add Department":
                    addDept();
                    break;

                case "Add Employee":
                    addEmp();
                    break;

                case "Add Role":
                    addrole();
                    break;

                case "EXIT":
                    end();
                    break;
                default:
                    break;
            }
        });
}

function viewdepts() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table("All Departments:", res);

        start();
    })
}

function viewemps() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table("All Employees:", res);

        start();
    })
}

function viewroles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table("All Roles:", res);

        start();
    })
}


function addDept() {
    inquirer
        .prompt([
            {
                name: "dept",
                type: "input",
                message: "Name of the new Department:"
            }])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department set ?",
                { name: answer.dept }
            );
            viewdepts()
        })
}

function addEmp() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "Employee's fist name: ",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "Employee's last name: "
                },
                {
                    name: "role",
                    type: "list",
                    choices: function () {
                        var roles = [];
                        for (let i = 0; i < res.length; i++) {
                            roles.push(res[i].title);
                        }
                        return roles;
                    }, message: "What is their role?"
                }
            ])
            .then(function (answer) {
                let ID; for (let x = 0; x < res.length; x++) {
                    if (res[x].title == answer.role) {
                        ID = res[x].id; console.log(ID)
                    }
                }
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: ID,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Employee was added");
                        start();
                    }
                )
            })
    })
}

function addrole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer.prompt([{
            name: "role",
            type: "input",
            message: "What is the new Role?"
        },
        {
            name: "income",
            type: "input",
            message: "What is the salary for the Role?"
        },
        {
            name: "Dept",
            type: "rawlist",
            choices: function () {
                var dept = [];
                for (let i = 0; i < res.length; i++) {
                    dept.push(res[i].name);
                }
                return dept;
            },
        }
        ])
            .then(function (answer) {
                let ID; for (let x = 0; x < res.length; x++) {
                    if (res[x].title == answer.role) {
                        ID = res[x].id;
                    }
                }
                connection.query("INSERT INTO role SET ?", {
                    title: answer.role,
                    salary: answer.income,
                    department_id: ID
                }, function (err, res) {
                    if (err) throw err;
                    console.log("New role was added");
                    start()
                })
            })

    })
}

function end() {
    connection.end()
}