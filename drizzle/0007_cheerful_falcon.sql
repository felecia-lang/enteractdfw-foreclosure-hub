CREATE TABLE `emailCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`campaignType` varchar(50) NOT NULL DEFAULT 'chatbot_nurture',
	`status` enum('active','paused','completed','unsubscribed') NOT NULL DEFAULT 'active',
	`currentEmailSequence` int NOT NULL DEFAULT 0,
	`email1ScheduledAt` timestamp,
	`email1SentAt` timestamp,
	`email2ScheduledAt` timestamp,
	`email2SentAt` timestamp,
	`email3ScheduledAt` timestamp,
	`email3SentAt` timestamp,
	`email4ScheduledAt` timestamp,
	`email4SentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailDeliveryLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`leadId` int NOT NULL,
	`emailSequence` int NOT NULL,
	`emailType` varchar(100) NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(200) NOT NULL,
	`deliveryStatus` enum('pending','sent','failed','bounced') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`sentAt` timestamp,
	`openedAt` timestamp,
	`clickedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailDeliveryLog_id` PRIMARY KEY(`id`)
);
