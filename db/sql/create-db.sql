/*
	Database Creation Script for the bookstore database
*/
DROP DATABASE IF EXISTS book_db;

CREATE DATABASE book_db;

USE book_db;

/* Create PRODUCT_GROUP table. */

CREATE TABLE product_group (
  product_group_number INT(3) NOT NULL PRIMARY KEY,
  product_group_name VARCHAR(25) NOT NULL DEFAULT ''
);

INSERT INTO product_category (product_category_number, product_category_name) VALUES
	  (1, 'Fiction'),
      (2, 'Nonfiction'),
      (3, 'Children');

CREATE TABLE product (
  id INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(256) DEFAULT 'img/default-image.jpg',
  product_name VARCHAR(40) NOT NULL DEFAULT '',
  product_author VARCHAR(256) NOT NULL DEFAULT '',
  product_group INT(2) NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  FOREIGN KEY (product_category) REFERENCES product_category (product_category_number)
);

INSERT INTO product (product_name, description, price, product_group, img_url) VALUES
	  ('Homecoming', 'Kate Morton', 1, 32, 'img/fiction-1.jpg'),
	  ('Things I Wish I Told My Mother', 'Susan Patterson, Susan Dilallo, James Patterson', 1, 35, 'img/fiction-2.jpg'),
	  ('When In Rome', 'Liam Callanan', 1, 22, 'img/fiction-3.jpg'),
      ('The Turban and the Hat', 'Sonallah Ibrahim', 2, 32, 'img/nonfiction-1.jpg'),
	  ('How to Be Perfect', 'Michael Schur', 2, 35, 'img/nonfiction-2.jpg'),
	  ('Who is Wellness for', 'Fariha Róisín', 2, 22, 'img/nonfiction-3.jpg'),
      ('Bo the Brave', 'Bethan Wollvin', 3, 32, 'img/children-1.jpg'),
	  ('A Girl Like You', 'Frank Murphy', 'Carla Murphy', 3, 35, 'img/children-2.jpg'),
	  ('Rosie Revere, Engineer', 'Andrea Beaty', 3, 22, 'img/children-3.jpg');

CREATE TABLE `order` (
  order_number INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.0
);

CREATE TABLE order_item (
  order_number INT(5) NOT NULL,
  order_item_number INT(5) NOT NULL,
  product_id INT(3),
  quantity INT(2),
  amount DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (order_number, order_item_number),
  FOREIGN KEY (order_number) REFERENCES `order` (order_number),
  FOREIGN KEY (product_id) REFERENCES product (id)
);
