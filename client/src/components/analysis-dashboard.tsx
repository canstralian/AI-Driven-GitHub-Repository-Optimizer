import { type Repository } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CodeIcon, BugIcon, ShieldAlertIcon, BarChartIcon } from "lucide-react";

interface Props {
  repository: Repository;
}

export default function AnalysisDashboard({ repository }: Props) {
  const metrics = repository.metrics as {
    codeSmells: number;
    bugs: number;
    vulnerabilities: number;
    coverage: number;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-[#24292E] border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={repository.qualityScore} className="w-full" />
            <span className="text-2xl font-bold">{repository.qualityScore}%</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#24292E] border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              Code Smells
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{metrics.codeSmells}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#24292E] border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <BugIcon className="h-4 w-4" />
              Bugs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{metrics.bugs}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#24292E] border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldAlertIcon className="h-4 w-4" />
              Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{metrics.vulnerabilities}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#24292E] border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-2xl font-bold">{metrics.coverage}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
