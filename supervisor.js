var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log ("connected: " + connection.threadId);
    supervisorOptions();
});



function supervisorOptions() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name:"choices",
                type:"list",
                choices: ["View Product Sales by Department", 
                "Create New Department"
                ],
                message: "What action would you like to take?"
            },

        ])
        .then(function(ans) {
            if (ans.choices === "View Product Sales by Department") {
                console.log("\n\n~~~~~~ View Product Sales by Department ~~~~~~\n");
                viewProductSales();
            } else if (ans.choices === "Create New Department") {
                console.log("\n\n~~~~~~ Create New Department ~~~~~~\n");
                inquirer.prompt([
                    {
                        name: "department",
                        type: "input",
                        message: "What department do you want to add?"
                    },
                    {
                        name: "overhead",
                        type: "input",
                        message: "What are the overhead costs of this department?"
                    },

                ])
                .then(function(ans) {
              
                    newDepartment(ans.department, ans.overhead);

                });
            
            }

        });
    });
};

function viewProductSales() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        console.table(res);
        supervisorOptions();
    });   
};


function newDepartment(dept, overhead) {
    console.log(dept, overhead);
    connection.query("INSERT INTO departments SET ?",    
    {
        department_name: dept,
        over_head_costs: overhead
    },
    function(err) {
        if (err) throw err;
        console.log("\nYou have successfully created a new department: " + 
        "\nNew department: " + dept + "\nWith overhead costs of: " + overhead + "\n\n");
        supervisorOptions();
    });
};

//add validation to confirm dept doesn't already exist
//finish dept sales function