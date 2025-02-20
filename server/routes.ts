import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRepositorySchema, insertGithubInstallationSchema } from "@shared/schema";
import { appOctokit, getRepositoryContent } from "./lib/github";
import crypto from "crypto";
import * as express from 'express';

// Middleware to capture raw body
function rawBodySaver(req: any, res: any, buf: Buffer) {
  if (buf && buf.length) {
    req.rawBody = buf;
    // Add debug logging
    console.log('Raw body length:', buf.length);
    console.log('Raw body content:', buf.toString());
  }
}

function verifyGithubWebhook(req: any, res: any, next: any) {
  if (!process.env.GITHUB_APP_WEBHOOK_SECRET) {
    throw new Error("Webhook secret not configured");
  }

  const signature = req.headers["x-hub-signature-256"];

  // Debug logging
  console.log('Received signature:', signature);
  console.log('Raw body available:', !!req.rawBody);

  // Use the raw body instead of stringified JSON
  const hmac = crypto
    .createHmac("sha256", process.env.GITHUB_APP_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");

  const calculatedSignature = `sha256=${hmac}`;
  console.log('Calculated signature:', calculatedSignature);

  if (calculatedSignature !== signature) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure express to save raw body
  app.use(express.json({
    verify: rawBodySaver
  }));

  // GitHub App webhook endpoint
  app.post("/api/webhooks/github", verifyGithubWebhook, async (req, res) => {
    const event = req.headers["x-github-event"];

    if (event === "installation") {
      const { action, installation, repositories = [] } = req.body;

      if (action === "created") {
        try {
          const installationData = insertGithubInstallationSchema.parse({
            installationId: installation.id,
            accountName: installation.account.login,
          });

          await storage.createGithubInstallation(installationData);
          res.json({ message: "Installation recorded" });
        } catch (error) {
          console.error('Installation validation error:', error);
          res.status(400).json({ error: "Invalid installation data" });
        }
      } else {
        res.status(200).end();
      }
    } else {
      res.status(200).end();
    }
  });

  // Repository analysis endpoint
  app.post("/api/repositories", async (req, res) => {
    try {
      const { url, name, installationId } = req.body;

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

      // Validate the complete repository data before creating
      const validatedData = insertRepositorySchema.parse({
        url,
        name,
        installationId,
        ...mockAnalysis
      });

      const repository = await storage.createRepository(validatedData);
      res.json(repository);
    } catch (error) {
      console.error('Repository analysis error:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid repository data",
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          error: "Failed to analyze repository",
          message: error.message 
        });
      }
    }
  });

  app.get("/api/repositories/:id", async (req, res) => {
    try {
      const repository = await storage.getRepository(parseInt(req.params.id));
      if (!repository) {
        return res.status(404).json({ error: "Repository not found" });
      }
      res.json(repository);
    } catch (error) {
      console.error('Repository fetch error:', error);
      res.status(500).json({ error: "Failed to fetch repository" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}