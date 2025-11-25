CREATE TABLE `bookingConfirmations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`bookingDateTime` timestamp NOT NULL,
	`calendarEventId` varchar(100),
	`calendarName` varchar(200),
	`sourcePage` varchar(255),
	`ipAddress` varchar(45),
	`userAgent` text,
	`webhookPayload` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingConfirmations_id` PRIMARY KEY(`id`)
);
