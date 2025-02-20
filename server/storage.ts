import { repositories, githubInstallations, type Repository, type InsertRepository, type GithubInstallation, type InsertGithubInstallation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByUrl(url: string): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
  createGithubInstallation(installation: InsertGithubInstallation): Promise<GithubInstallation>;
  getGithubInstallation(installationId: number): Promise<GithubInstallation | undefined>;
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
    const [repository] = await db
      .insert(repositories)
      .values(insertRepo)
      .returning();
    return repository;
  }

  async createGithubInstallation(installation: InsertGithubInstallation): Promise<GithubInstallation> {
    const [created] = await db
      .insert(githubInstallations)
      .values(installation)
      .returning();
    return created;
  }

  async getGithubInstallation(installationId: number): Promise<GithubInstallation | undefined> {
    const [installation] = await db
      .select()
      .from(githubInstallations)
      .where(eq(githubInstallations.installationId, installationId));
    return installation;
  }
}

export const storage = new DatabaseStorage();