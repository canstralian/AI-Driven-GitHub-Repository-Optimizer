import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnalysisDashboard from "@/components/analysis-dashboard";

const mockRepository = {
  id: 1,
  url: "https://github.com/test/repo",
  name: "Test Repo",
  installationId: 12345,
  lastAnalyzed: new Date().toISOString(),
  qualityScore: 85,
  metrics: {
    codeSmells: 5,
    bugs: 2,
    vulnerabilities: 1,
    coverage: 75,
  },
  recommendations: ["Add more tests"],
  files: [],
};

describe("AnalysisDashboard", () => {
  it("displays repository metrics correctly", () => {
    render(<AnalysisDashboard repository={mockRepository} />);

    // Check quality score
    expect(screen.getByText("85%")).toBeInTheDocument();

    // Check metrics
    expect(screen.getByText("5")).toBeInTheDocument(); // Code smells
    expect(screen.getByText("2")).toBeInTheDocument(); // Bugs
    expect(screen.getByText("1")).toBeInTheDocument(); // Vulnerabilities
    expect(screen.getByText("75%")).toBeInTheDocument(); // Coverage
  });

  it("renders all metric cards", () => {
    render(<AnalysisDashboard repository={mockRepository} />);

    expect(screen.getByText("Code Smells")).toBeInTheDocument();
    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("Vulnerabilities")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
  });
});
