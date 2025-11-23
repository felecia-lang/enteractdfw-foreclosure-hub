CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`location` varchar(100) NOT NULL,
	`situation` varchar(200) NOT NULL,
	`story` text NOT NULL,
	`outcome` text NOT NULL,
	`permissionToPublish` enum('yes','no') NOT NULL DEFAULT 'no',
	`email` varchar(320),
	`phone` varchar(20),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
