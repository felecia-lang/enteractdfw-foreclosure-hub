CREATE TABLE `leadNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`note` text NOT NULL,
	`noteType` enum('general','status_change','call','email','meeting') NOT NULL DEFAULT 'general',
	`createdBy` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadNotes_id` PRIMARY KEY(`id`)
);
