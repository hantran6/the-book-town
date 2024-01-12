--
-- Creates a root user that can connect from any host and sets the password for all root users in Mariadb
--
USE mysql;
CREATE user 'root'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
UPDATE user SET password=PASSWORD("123456") WHERE user='root';
flush privileges;