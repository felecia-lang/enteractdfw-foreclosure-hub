CREATE TABLE `formAnalyticsEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` enum('view','start','complete','error') NOT NULL,
	`formName` varchar(100) NOT NULL DEFAULT 'contact_form',
	`sessionId` varchar(64),
	`userEmail` varchar(320),
	`errorType` varchar(100),
	`errorMessage` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`pagePath` varchar(255),
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `formAnalyticsEvents_id` PRIMARY KEY(`id`)
);
