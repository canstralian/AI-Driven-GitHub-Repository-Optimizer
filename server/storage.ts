import { repositories, type Repository, type InsertRepository } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByUrl(url: string): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
}

export class DatabaseStorage implements IStorage {
  async getRepository(id: number): Promise<Repository | undefined> {
    const [repository] = await db.select().from(repositories).where(eq(repositories.id, id));
    return repository;
  }

  async getRepositoryByUrl(url: string): Promise<Repository | undefined> {
    const [repository] = await db.select().from(repositories).where(eq(repositories.url, url));
    return repository;
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const now = new Date().toISOString();
    const [repository] = await db
      .insert(repositories)
      .values({ ...insertRepo, lastAnalyzed: now })
      .returning();
    return repository;
  }
}

export const storage = new DatabaseStorage();