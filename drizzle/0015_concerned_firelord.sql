CREATE TABLE `chatEngagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` enum('chat_opened','message_sent','conversation_completed') NOT NULL,
	`pagePath` varchar(255) NOT NULL,
	`pageTitle` varchar(255),
	`userEmail` varchar(320),
	`ipAddress` varchar(45),
	`userAgent` text,
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`utmTerm` varchar(255),
	`utmContent` varchar(255),
	`eventAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatEngagement_id` PRIMARY KEY(`id`)
);
