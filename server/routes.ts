import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRepositorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/repositories", async (req, res) => {
    try {
      const repoData = insertRepositorySchema.parse(req.body);
      
      // Mock analysis results
      const mockAnalysis = {
        qualityScore: Math.floor(Math.random() * 100),
        metrics: {
          codeSmells: Math.floor(Math.random() * 50),
          bugs: Math.floor(Math.random() * 20),
          vulnerabilities: Math.floor(Math.random() * 10),
          coverage: Math.floor(Math.random() * 100),
        },
        recommendations: [
          "Consider adding more unit tests to improve coverage",
          "Some functions could benefit from better error handling",
          "Several code blocks could be refactored for better maintainability"
        ],
        files: [
          { name: "index.js", path: "/", type: "file" },
          { name: "src", path: "/src", type: "directory" },
          { name: "app.js", path: "/src", type: "file" }
        ]
      };

      const repository = await storage.createRepository({
        ...repoData,
        ...mockAnalysis,
        lastAnalyzed: new Date().toISOString()
      });

      res.json(repository);
    } catch (error) {
      res.status(400).json({ error: "Invalid repository data" });
    }
  });

  app.get("/api/repositories/:id", async (req, res) => {
    const repository = await storage.getRepository(parseInt(req.params.id));
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.json(repository);
  });

  const httpServer = createServer(app);
  return httpServer;
}
