CREATE TABLE `abTestAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`variantId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `abTestAssignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `abTestEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`variantId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`eventType` enum('impression','focus','blur','input','validation_error','form_submit','form_success','form_error') NOT NULL,
	`eventData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `abTestEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `abTestVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`isControl` enum('yes','no') NOT NULL DEFAULT 'no',
	`trafficWeight` int NOT NULL DEFAULT 50,
	`fieldLabel` varchar(200),
	`fieldPlaceholder` varchar(200),
	`fieldRequired` enum('yes','no') NOT NULL DEFAULT 'yes',
	`fieldHelperText` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `abTestVariants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `abTests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`formName` varchar(100) NOT NULL,
	`fieldName` varchar(100) NOT NULL,
	`status` enum('draft','active','paused','completed') NOT NULL DEFAULT 'draft',
	`trafficAllocation` int NOT NULL DEFAULT 100,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abTests_id` PRIMARY KEY(`id`)
);
