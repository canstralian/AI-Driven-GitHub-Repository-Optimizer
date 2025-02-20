import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRepositorySchema, insertGithubInstallationSchema } from "@shared/schema";
import { appOctokit, getRepositoryContent } from "./lib/github";
import crypto from "crypto";

function verifyGithubWebhook(req: any, res: any, next: any) {
  if (!process.env.GITHUB_APP_WEBHOOK_SECRET) {
    throw new Error("Webhook secret not configured");
  }

  const signature = req.headers["x-hub-signature-256"];
  const payload = JSON.stringify(req.body);
  const hmac = crypto
    .createHmac("sha256", process.env.GITHUB_APP_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  if (`sha256=${hmac}` !== signature) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub App webhook endpoint
  app.post("/api/webhooks/github", verifyGithubWebhook, async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "installation") {
      const { action, installation, repositories = [] } = req.body;

      if (action === "created") {
        await storage.createGithubInstallation({
          installationId: installation.id,
          accountName: installation.account.login,
        });

        res.json({ message: "Installation recorded" });
      }
    }

    res.status(200).end();
  });

  // Repository analysis endpoint
  app.post("/api/repositories", async (req, res) => {
    try {
      const { url, name, installationId } = insertRepositorySchema.parse(req.body);

      // Get repository contents using GitHub App installation token
      const contents = await getRepositoryContent(installationId, url);

      // Mock analysis results based on repository contents
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
        files: contents.map(file => ({
          name: file.name,
          path: file.path,
          type: file.type
        }))
      };

      const repository = await storage.createRepository({
        url,
        name,
        installationId,
        ...mockAnalysis
      });

      res.json(repository);
    } catch (error) {
      console.error('Repository analysis error:', error);
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