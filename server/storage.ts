import { repositories, type Repository, type InsertRepository } from "@shared/schema";

export interface IStorage {
  getRepository(id: number): Promise<Repository | undefined>;
  getRepositoryByUrl(url: string): Promise<Repository | undefined>;
  createRepository(repo: InsertRepository): Promise<Repository>;
}

export class MemStorage implements IStorage {
  private repositories: Map<number, Repository>;
  currentId: number;

  constructor() {
    this.repositories = new Map();
    this.currentId = 1;
  }

  async getRepository(id: number): Promise<Repository | undefined> {
    return this.repositories.get(id);
  }

  async getRepositoryByUrl(url: string): Promise<Repository | undefined> {
    return Array.from(this.repositories.values()).find(
      (repo) => repo.url === url
    );
  }

  async createRepository(insertRepo: InsertRepository): Promise<Repository> {
    const id = this.currentId++;
    const repo: Repository = { ...insertRepo, id };
    this.repositories.set(id, repo);
    return repo;
  }
}

export const storage = new MemStorage();
