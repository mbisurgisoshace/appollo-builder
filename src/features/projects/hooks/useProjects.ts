import {
  useQuery,
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

export const useUpsertNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.upsertNode.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.projects.getProject.queryOptions({ projectId: data.projectId }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save node: ${error.message}`);
      },
    }),
  );
};

export const useUpdateNodePositions = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.projects.updateNodePositions.mutationOptions({
      onError: (error) => {
        toast.error(`Failed to save position: ${error.message}`);
      },
    }),
  );
};

export const useDeleteNode = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.projects.deleteNode.mutationOptions({
      onError: (error) => {
        toast.error(`Failed to delete node: ${error.message}`);
      },
    }),
  );
};

export const useCheckNodeSlugAvailability = (
  slug: string,
  projectId: string,
) => {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.projects.isNodeSlugAvailable.queryOptions({ slug, projectId }),
    retry: false,
    enabled: false,
  });
};
