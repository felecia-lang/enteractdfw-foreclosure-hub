CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`pagePath` varchar(255) NOT NULL,
	`pageTitle` varchar(255),
	`userEmail` varchar(320),
	`ipAddress` varchar(45),
	`userAgent` text,
	`referrer` varchar(500),
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
