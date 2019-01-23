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
    
    displayInventory();
});

function displayInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        customerSale();
    });
};

function customerSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

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
                message: "What item would you like to purchase?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            }
        ])
        .then(function(ans) {

            if (parseInt(ans.quantity) <= 0) {
                console.log("\nPlease select an item quantity greater than zero.\n")
                displayInventory();
            } else {
                var purchItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === ans.product) {
                        purchItem = res[i];
                    }
                }

                if (purchItem.stock < parseInt(ans.quantity)) {
                    console.log("\nSorry!  There aren't enough items on hand to complete your purchase.  \nPlease select a different item or quantity.\n")
                    displayInventory();
                } else {
                    var purchTotal = parseInt(ans.quantity) * purchItem.price;
                    var new_quant = purchItem.stock - parseInt(ans.quantity);
                    
                    console.log("\nThank you for your purchase!\nYou bought " 
                    + ans.quantity + " " + ans.product + "(s) for a total of $" 
                    + purchTotal + ".\n");
                    updateDB(purchItem.item_id, new_quant, ans.quantity);
                }
            }
        
        });
    });
};

function updateDB(item, new_item_quant, sold_quant) {
    //update the DB and display new inventory
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
            stock: new_item_quant,
            sold: sold_quant 
            },
            {
            item_id: item
            }
        ],
        function(err) {
            if (err) throw err;
            displayInventory();
        }
    );
};

//add validation to update DB and customer sale inputs
