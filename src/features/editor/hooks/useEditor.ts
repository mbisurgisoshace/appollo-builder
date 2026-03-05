import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useUpsertNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.upsertNode.mutationOptions({
      onSuccess: (data) => {
        const updatedProject = data[1];
        queryClient.invalidateQueries(
          trpc.projects.getProject.queryOptions({
            projectId: updatedProject.id,
          }),
        );
        queryClient.invalidateQueries(
          trpc.projects.getScopeFeatures.queryOptions({
            projectId: updatedProject.id,
          }),
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

export const useSuspenseScopeFeatures = (projectId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.projects.getScopeFeatures.queryOptions({ projectId }),
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
