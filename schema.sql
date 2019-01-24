CREATE DATABASE bamazon_db;

USE bamazon_db;


CREATE TABLE products (
	item_id INT NOT NULL auto_increment,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL (10,2),
    stock INT,
    primary key (item_id)
);



CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL (10, 2),
    primary key (department_id)
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


ALTER TABLE products 
ADD COLUMN sold INT AFTER stock;


ALTER TABLE departments
ADD COLUMN profit DECIMAL (10,2) generated always AS ( 0 - over_head_costs);




SELECT
  departments.department_id,
  departments.department_name,
  departments.over_head_costs,
  CASE WHEN SUM(products.$total) is NULL THEN 0
  ELSE SUM(products.$total) END AS total_sales,
  CASE WHEN SUM(products.$total) is NULL THEN (0 - departments.over_head_costs)
  ELSE (SUM(products.$total) - departments.over_head_costs) END AS profit
FROM
 departments
LEFT JOIN products ON departments.department_name = products.department_name
GROUP BY
 departments.department_id
ORDER BY
department_id asc;

SELECT * FROM products WHERE stock_quantity < 10;
