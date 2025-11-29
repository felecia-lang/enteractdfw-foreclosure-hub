CREATE TABLE `comparisonHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`propertyAddress` varchar(255),
	`zipCode` varchar(10) NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`squareFeet` int NOT NULL,
	`bedrooms` int NOT NULL,
	`bathrooms` int NOT NULL,
	`condition` varchar(50) NOT NULL,
	`estimatedValue` int NOT NULL,
	`mortgageBalance` int NOT NULL,
	`equity` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comparisonHistory_id` PRIMARY KEY(`id`)
);
