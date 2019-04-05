/*

To run this file, we do the following in our Terminal:

1. Go to the directory of this sql file.

2. Get into our mysql console.

3. Run "source schema.sql"

*/

-- Create the database burger_db and specified it for use.
CREATE DATABASE burger_db;
USE burger_db;

-- Create the table plans.
CREATE TABLE burgers
(
id int NOT NULL AUTO_INCREMENT,
burger_name varchar(255) NOT NULL,
devoured boolean NOT NULL DEFAULT 0,
PRIMARY KEY (id)
);
