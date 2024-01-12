--
-- Creates a root user that can connect from any host and sets the password for all root users in Mariadb
--
USE mysql;
CREATE user 'ec2-user'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'ec2-user'@'%';
UPDATE user SET password=PASSWORD("123456") WHERE user='ec2-user';
flush privileges;