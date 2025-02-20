import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

interface Props {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: Props) {
  return (
    <Card className="bg-[#24292E] border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-[#28A745]" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-[#28A745] font-mono">→</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
