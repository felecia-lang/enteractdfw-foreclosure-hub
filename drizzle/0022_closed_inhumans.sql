CREATE TABLE `propertyValueLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`accessGrantedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `propertyValueLeads_id` PRIMARY KEY(`id`)
);
