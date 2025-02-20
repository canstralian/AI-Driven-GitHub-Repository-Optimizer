import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Repository } from "@shared/schema";
import AnalysisDashboard from "@/components/analysis-dashboard";
import FileBrowser from "@/components/file-browser";
import Recommendations from "@/components/recommendations";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepositoryView() {
  const { id } = useParams();
  const { data: repository, isLoading } = useQuery<Repository>({
    queryKey: [`/api/repositories/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-[#E1E4E8] p-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!repository) return null;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E1E4E8] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{repository.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnalysisDashboard repository={repository} />
          <Recommendations recommendations={repository.recommendations as string[]} />
        </div>
        <div className="mt-8">
          <FileBrowser files={repository.files as any[]} />
        </div>
      </div>
    </div>
  );
}
