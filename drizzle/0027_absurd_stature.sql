CREATE TABLE `formFieldInteractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`formName` varchar(100) NOT NULL DEFAULT 'contact_form',
	`fieldName` varchar(100) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`interactionType` enum('focus','blur','change','abandon') NOT NULL,
	`timeSpentMs` int,
	`fieldValue` text,
	`fieldCompleted` int DEFAULT 0,
	`userEmail` varchar(320),
	`ipAddress` varchar(45),
	`userAgent` text,
	`pagePath` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `formFieldInteractions_id` PRIMARY KEY(`id`)
);
