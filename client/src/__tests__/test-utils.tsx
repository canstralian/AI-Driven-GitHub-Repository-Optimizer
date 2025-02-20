import { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithProviders(ui: ReactElement) {
  const testQueryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    ),
    queryClient: testQueryClient,
  };
}

// Mock repository data for testing
export const mockRepositoryData = {
  id: 1,
  url: "https://github.com/test/repo",
  name: "Test Repository",
  installationId: 12345,
  lastAnalyzed: new Date().toISOString(),
  qualityScore: 85,
  metrics: {
    codeSmells: 5,
    bugs: 2,
    vulnerabilities: 1,
    coverage: 75,
  },
  recommendations: [
    "Add more tests",
    "Fix identified bugs",
    "Address code smells",
  ],
  files: [
    { name: "index.js", path: "/", type: "file" },
    { name: "src", path: "/src", type: "directory" },
  ],
};
