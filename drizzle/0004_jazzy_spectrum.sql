CREATE TABLE `curriculos` (
	`id` varchar(64) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`area` varchar(100) NOT NULL,
	`nomeArquivo` varchar(255) NOT NULL,
	`caminhoArquivo` text NOT NULL,
	`tamanhoArquivo` varchar(20) NOT NULL,
	`tipoArquivo` varchar(50) NOT NULL,
	`status` enum('recebido','analisando','aprovado','rejeitado') NOT NULL DEFAULT 'recebido',
	`notas` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `curriculos_id` PRIMARY KEY(`id`)
);
