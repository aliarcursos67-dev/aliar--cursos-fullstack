CREATE TABLE `trialClasses` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`curso` varchar(255) NOT NULL,
	`area` varchar(100) NOT NULL,
	`dataAgendamento` timestamp NOT NULL,
	`horario` varchar(10) NOT NULL,
	`observacoes` text,
	`status` enum('agendado','confirmado','realizado','cancelado') NOT NULL DEFAULT 'agendado',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trialClasses_id` PRIMARY KEY(`id`)
);
