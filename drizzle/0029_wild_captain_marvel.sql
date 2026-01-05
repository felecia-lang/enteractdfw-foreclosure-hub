CREATE TABLE `timelineActionProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timelineId` int NOT NULL,
	`milestoneId` varchar(100) NOT NULL,
	`actionIndex` int NOT NULL,
	`completed` enum('yes','no') NOT NULL DEFAULT 'no',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timelineActionProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userTimelines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`noticeDate` varchar(10) NOT NULL,
	`milestones` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userTimelines_id` PRIMARY KEY(`id`)
);
