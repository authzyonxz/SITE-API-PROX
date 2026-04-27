ALTER TABLE `local_users` ADD `maxIps` int NOT NULL DEFAULT 1;
ALTER TABLE `local_users` ADD `sessionSecret` varchar(36) NOT NULL DEFAULT 'default-secret';
