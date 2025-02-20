import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderIcon, FileIcon } from "lucide-react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
}

interface Props {
  files: FileNode[];
}

export default function FileBrowser({ files }: Props) {
  return (
    <Card className="bg-[#24292E] border-gray-700">
      <CardHeader>
        <CardTitle>Repository Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded cursor-pointer"
            >
              {file.type === "directory" ? (
                <FolderIcon className="h-4 w-4 text-[#0366D6]" />
              ) : (
                <FileIcon className="h-4 w-4 text-[#E1E4E8]" />
              )}
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
