import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  name: text("name").notNull(),
  lastAnalyzed: timestamp("last_analyzed").notNull().defaultNow(),
  qualityScore: integer("quality_score").notNull(),
  metrics: jsonb("metrics").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  files: jsonb("files").notNull()
});

export const insertRepositorySchema = createInsertSchema(repositories).pick({
  url: true,
  name: true,
  qualityScore: true,
  metrics: true,
  recommendations: true,
  files: true
});

export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Repository = typeof repositories.$inferSelect;