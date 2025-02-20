import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_APP_PRIVATE_KEY) {
  throw new Error("GitHub App credentials not configured");
}

// Format private key by ensuring proper line breaks
const formatPrivateKey = (key: string) => {
  // If key already has proper format, return as is
  if (key.includes("-----BEGIN RSA PRIVATE KEY-----") && key.includes("-----END RSA PRIVATE KEY-----")) {
    return key;
  }

  // Add header and footer if missing
  const keyContent = key
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN RSA PRIVATE KEY-----|\n|-----END RSA PRIVATE KEY-----/g, "")
    .trim();

  return `-----BEGIN RSA PRIVATE KEY-----\n${keyContent}\n-----END RSA PRIVATE KEY-----`;
};

// Create an Octokit instance authenticated as the GitHub App
export const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: formatPrivateKey(process.env.GITHUB_APP_PRIVATE_KEY),
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

  try {
    // Get repository contents
    const { data: contents } = await client.repos.getContent({
      owner,
      repo,
      path: '',
    });

    return Array.isArray(contents) ? contents : [contents];
  } catch (error: any) {
    console.error('GitHub API error:', error);
    throw error;
  }
}