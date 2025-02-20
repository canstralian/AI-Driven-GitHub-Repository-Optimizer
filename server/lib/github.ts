import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
  throw new Error("GitHub App credentials not configured");
}

// Create an Octokit instance authenticated as the GitHub App
export const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
  },
});

// Get an installation access token for a specific installation
export async function getInstallationToken(installationId: number) {
  const { data: { token } } = await appOctokit.apps.createInstallationAccessToken({
    installation_id: installationId,
  });
  return token;
}

// Create an Octokit instance for a specific installation
export async function createInstallationClient(installationId: number) {
  const token = await getInstallationToken(installationId);
  return new Octokit({ auth: token });
}

// Parse GitHub repository URL to get owner and repo
export function parseRepoUrl(url: string) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

// Get repository content using installation token
export async function getRepositoryContent(installationId: number, repoUrl: string) {
  const client = await createInstallationClient(installationId);
  const { owner, repo } = parseRepoUrl(repoUrl);
  
  // Get repository contents
  const { data: contents } = await client.repos.getContent({
    owner,
    repo,
    path: '',
  });

  return Array.isArray(contents) ? contents : [contents];
}
