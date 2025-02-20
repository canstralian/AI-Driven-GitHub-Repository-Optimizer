import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RepositoryForm from "@/components/repository-form";

// Setup a fresh QueryClient for each test
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("RepositoryForm", () => {
  it("renders repository form fields", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RepositoryForm />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/Repository URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repository Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub App Installation ID/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RepositoryForm />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Analyze/i }));

    // Wait for validation messages
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RepositoryForm />
      </QueryClientProvider>
    );

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Repository URL/i), {
      target: { value: "https://github.com/test/repo" },
    });
    fireEvent.change(screen.getByLabelText(/Repository Name/i), {
      target: { value: "Test Repo" },
    });
    fireEvent.change(screen.getByLabelText(/GitHub App Installation ID/i), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Analyze/i }));

    // Button should show loading state
    expect(screen.getByText(/Analyzing/i)).toBeInTheDocument();
  });
});