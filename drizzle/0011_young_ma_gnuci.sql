CREATE TABLE `phoneCallTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`pagePath` varchar(255) NOT NULL,
	`pageTitle` varchar(255),
	`userEmail` varchar(320),
	`ipAddress` varchar(45),
	`userAgent` text,
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `phoneCallTracking_id` PRIMARY KEY(`id`)
);
