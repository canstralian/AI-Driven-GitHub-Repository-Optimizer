import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const githubInstallations = pgTable("github_installations", {
  id: serial("id").primaryKey(),
  installationId: integer("installation_id").notNull(),
  accountName: text("account_name").notNull(),
  installedAt: timestamp("installed_at").notNull().defaultNow()
});

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  installationId: integer("installation_id").notNull(),
  lastAnalyzed: timestamp("last_analyzed").notNull().defaultNow(),
  qualityScore: integer("quality_score").notNull(),
  metrics: jsonb("metrics").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  files: jsonb("files").notNull()
});

export const insertGithubInstallationSchema = createInsertSchema(githubInstallations);
export const insertRepositorySchema = createInsertSchema(repositories).pick({
  url: true,
  name: true,
  installationId: true,
  qualityScore: true,
  metrics: true,
  recommendations: true,
  files: true
});

export type InsertGithubInstallation = z.infer<typeof insertGithubInstallationSchema>;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;
export type GithubInstallation = typeof githubInstallations.$inferSelect;