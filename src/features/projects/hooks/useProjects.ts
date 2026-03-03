import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useSuspenseProject = (projectId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.projects.getProject.queryOptions({ projectId }));
};

export const useSuspenseProjects = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.projects.getProjects.queryOptions());
};

export const useCreateProjects = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Project ${data.name} created`);
        queryClient.invalidateQueries(trpc.projects.getProjects.queryOptions());
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      },
    }),
  );
};
