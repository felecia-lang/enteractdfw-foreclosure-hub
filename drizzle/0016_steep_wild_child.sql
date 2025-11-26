CREATE TABLE `linkClicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shortCode` varchar(20) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`referer` text,
	`userEmail` varchar(320),
	`sessionId` varchar(255),
	`clickedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `linkClicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shortenedLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`originalUrl` text NOT NULL,
	`shortCode` varchar(20) NOT NULL,
	`customAlias` varchar(100),
	`clicks` int NOT NULL DEFAULT 0,
	`createdBy` varchar(64),
	`title` varchar(255),
	`expiresAt` timestamp,
	`utmSource` varchar(100),
	`utmMedium` varchar(100),
	`utmCampaign` varchar(100),
	`utmTerm` varchar(100),
	`utmContent` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shortenedLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `shortenedLinks_shortCode_unique` UNIQUE(`shortCode`)
);
