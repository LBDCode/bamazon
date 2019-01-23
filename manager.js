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
    managerOptions();
});



function managerOptions() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        inquirer
        .prompt([
            {
                name:"choices",
                type:"list",
                choices: ["View products", "View low inventory",
                "Add to inventory",
                "Add new product",
                ],
                message: "What action would you like to take?"
            },

        ])
        .then(function(ans) {
            if (ans.choices === "View products") {
                console.log("\n\n~~~~~~ View Products ~~~~~~\n");
                viewProducts();
            } else if (ans.choices === "View low inventory") {
                console.log("\n\n~~~~~~ View Low Inventory Items ~~~~~~\n");
                lowInventory();
            } else if (ans.choices === "Add to inventory") {
                console.log("\n~~~~~~ Add Inventory to Existing Products ~~~~~~\n");
                inquirer
                .prompt([
                    {
                        name:"product",
                        type:"rawlist",
                        choices: function() {
                            var invArray = [];
                            for (var i = 0; i < res.length; i++) {
                                invArray.push(res[i].product_name);
                            }
                            return invArray;
                        },
                        message: "What item would you like to update?"
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many items should be added to inventory?"
                    }
                ])
                .then(function(ans) {
                    var updateItem;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].product_name === ans.product) {
                            updateItem = res[i];
                        }
                    }

                    var newInv = updateItem.stock + parseInt(ans.quantity)

                    addInventory(updateItem.item_id, updateItem.product_name, ans.quantity, newInv);
                })
                
                
                
            } else if (ans.choices === "Add new product") {
                console.log("\n~~~~~~ Add a New Product ~~~~~~\n");
                inquirer.prompt([
                    {
                        name: "name",
                        type: "input",
                        message: "What product do you want to add?"
                    },
                    {
                        name: "department",
                        type: "input",
                        message: "What department?"
                    },
                    {
                        name: "price",
                        type: "input",
                        message: "What is the unit price for each item you want to add?"
                    },
                    {
                        name: "quant",
                        type: "input",
                        message: "How many items do you want to add?"
                    },
                ])
                .then(function(ans) {
              
                    addProduct(ans.name, ans.department, ans.price, ans.quant);

                });
                
            }
        
        });
    });
};


function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        managerOptions();
    });
};


function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock < 10", function(err, res) {
        if (err) throw err;
        console.table(res);
        managerOptions();
    });
};

function addInventory(itemID, prod, addQuant, newQuant) {
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {
        stock: newQuant
        },
        {
        item_id: itemID
        }
    ],
    function(err) {
        if (err) throw err;
        console.log("\nYou have successfully added " + addQuant + " item(s) to the " 
        + prod + " inventory.\n\n");
        managerOptions();
    });
};

function addProduct(name, dept, item_price, quant) {

    connection.query("INSERT INTO products SET ?",    
        {
            product_name: name,
            department_name: dept,
            price: item_price,
            stock: quant
        },
    function(err) {
        if (err) throw err;
        console.log("\nYou have successfully added a new product to inventory: " + 
        "\nItem: " + name + "\nDepartment: " + dept + "\nUnit Price: "
        + "\nQuant: " + quant + "\n\n");
        managerOptions();
    });
};



//validation check to make sure entries are correct types, and that product does not already exist.
