/*
	Database Creation Script for the bookstore database
*/
DROP DATABASE IF EXISTS book_db;

CREATE DATABASE book_db;

USE book_db;

/* Create PRODUCT_GROUP table. */

CREATE TABLE product_category (
  product_category_number INT(3) NOT NULL PRIMARY KEY,
  product_category_name VARCHAR(25) NOT NULL DEFAULT ''
);

INSERT INTO product_category (product_category_number, product_category_name) VALUES
	(1, 'Fiction'),
  (2, 'Nonfiction'),
  (3, 'Children');

CREATE TABLE products (
  product_id INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(40) NOT NULL DEFAULT '',
  product_author VARCHAR(256) NOT NULL DEFAULT '',
  product_category INT(2) NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  img_url VARCHAR(256) NOT NULL DEFAULT '',
  FOREIGN KEY (product_category) REFERENCES product_category (product_category_number)
);

INSERT INTO products (product_name, product_author, product_category, price, img_url) VALUES
	('Homecoming', 'Kate Morton', 1, 32, 'fiction-1.jpg'),
	('Things I Wish I Told My Mother', 'Susan Patterson, Susan Dilallo, James Patterson', 1, 35, 'fiction-2.jpg'),
	('When In Rome', 'Liam Callanan', 1, 22, 'fiction-3.jpg'),
	('The Turban and the Hat', 'Sonallah Ibrahim', 2, 32, 'nonfiction-1.jpg'),
	('How to Be Perfect', 'Michael Schur', 2, 35, 'nonfiction-2.jpg'),
	('Who is Wellness for', 'Fariha Róisín', 2, 22, 'nonfiction-3.jpg'),
  ('Bo the Brave', 'Bethan Wollvin', 3, 32, 'children-1.jpg'),
	('A Girl Like You', 'Frank Murphy, Carla Murphy', 3, 35, 'children-2.jpg'),
	('Rosie Revere, Engineer', 'Andrea Beaty', 3, 22, 'children-3.jpg');

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);