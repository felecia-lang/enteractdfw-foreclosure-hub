CREATE TABLE `resourceDownloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`resourceName` varchar(200) NOT NULL,
	`resourceFile` varchar(200) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resourceDownloads_id` PRIMARY KEY(`id`)
);
