import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertRepositorySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function RepositoryForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(insertRepositorySchema.pick({ url: true, name: true })),
    defaultValues: {
      url: "",
      name: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: { url: string; name: string }) => {
      const res = await apiRequest("POST", "/api/repositories", values);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Repository analysis started",
        description: "You'll be redirected to the analysis results."
      });
      setLocation(`/repository/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze repository",
        variant: "destructive"
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/user/repo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository Name</FormLabel>
              <FormControl>
                <Input placeholder="My Repository" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Analyzing..." : "Analyze Repository"}
        </Button>
      </form>
    </Form>
  );
}
