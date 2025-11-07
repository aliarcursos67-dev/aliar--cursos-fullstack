CREATE TABLE `leads` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`area` varchar(100),
	`status` enum('novo','contatado','interessado','matriculado','rejeitado') NOT NULL DEFAULT 'novo',
	`notas` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
