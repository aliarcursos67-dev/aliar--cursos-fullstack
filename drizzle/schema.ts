import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leads/Cadastros table
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  area: varchar("area", { length: 100 }),
  status: mysqlEnum("status", ["novo", "contatado", "interessado", "matriculado", "rejeitado"]).default("novo").notNull(),
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// Agendamentos de aulas experimentais
export const trialClasses = mysqlTable("trialClasses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  curso: varchar("curso", { length: 255 }).notNull(),
  area: varchar("area", { length: 100 }).notNull(),
  dataAgendamento: timestamp("dataAgendamento").notNull(),
  horario: varchar("horario", { length: 10 }).notNull(),
  observacoes: text("observacoes"),
  status: mysqlEnum("status", ["agendado", "confirmado", "realizado", "cancelado"]).default("agendado").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type TrialClass = typeof trialClasses.$inferSelect;
export type InsertTrialClass = typeof trialClasses.$inferInsert;

// Feedback/Avaliações
export const feedbacks = mysqlTable("feedbacks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  curso: varchar("curso", { length: 255 }).notNull(),
  avaliacao: varchar("avaliacao", { length: 1 }).notNull(), // 1-5 stars
  comentario: text("comentario").notNull(),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado"]).default("pendente").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;


// Currículos para NAE (Centro de Estágio)
export const curriculos = mysqlTable("curriculos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  area: varchar("area", { length: 100 }).notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  caminhoArquivo: text("caminhoArquivo").notNull(),
  tamanhoArquivo: varchar("tamanhoArquivo", { length: 20 }).notNull(),
  tipoArquivo: varchar("tipoArquivo", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["recebido", "analisando", "aprovado", "rejeitado"]).default("recebido").notNull(),
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Curriculo = typeof curriculos.$inferSelect;
export type InsertCurriculo = typeof curriculos.$inferInsert;

