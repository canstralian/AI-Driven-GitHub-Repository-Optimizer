import { Card, CardContent } from "@/components/ui/card";
import RepositoryForm from "@/components/repository-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E1E4E8] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Code Analysis Platform</h1>
        <Card className="bg-[#24292E] border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-2xl mb-4">Analyze Repository</h2>
            <RepositoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
