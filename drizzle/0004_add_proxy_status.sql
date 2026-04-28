CREATE TABLE `proxy_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	`status` enum('online','offline') NOT NULL DEFAULT 'offline',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proxy_status_id` PRIMARY KEY(`id`),
	CONSTRAINT `proxy_status_name_unique` UNIQUE(`name`)
);
