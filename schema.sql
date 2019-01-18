CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products (
	item_id INT NOT NULL auto_increment,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL (10,2),
    stock_quantity INT,
    primary key (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Squeeky Duck Toy", "pets", 7.50, 10), 
("Headphones", "electronics", 8.75, 35),
("Multivitamin", "health", 14.50, 200),
("Crest Toothpaste", "health", 3.15, 94),
("Sanuk Flip-Flops", "shoes", 19.44, 8),
("Coppertone Sunscreen", "health", 6.50, 250),
("Saucony Pro-grid 9", "shoes", 68.90, 52),
("Diamond Naturals Dog Food", "pets", 38.60, 31),
("LG OLED HD Smart TV", "electronics", 2230.87, 7);


SELECT * FROM products