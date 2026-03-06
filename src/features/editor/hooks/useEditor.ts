import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useBroadcastEvent } from "@/lib/liveblocks.config";

export const useUpsertNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const broadcast = useBroadcastEvent();

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
        broadcast({ type: "NODE_UPSERTED", projectId: updatedProject.id });
      },
      onError: (error) => {
        toast.error(`Failed to save node: ${error.message}`);
      },
    }),
  );
};

export const useUpdateNodePositions = () => {
  const trpc = useTRPC();
  const broadcast = useBroadcastEvent();

  return useMutation(
    trpc.projects.updateNodePositions.mutationOptions({
      onSuccess: (data) => {
        const updatedProject = data[data.length - 1] as { id: string };
        broadcast({
          type: "NODE_POSITIONS_UPDATED",
          projectId: updatedProject.id,
        });
      },
      onError: (error) => {
        toast.error(`Failed to save position: ${error.message}`);
      },
    }),
  );
};

export const useDeleteNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const broadcast = useBroadcastEvent();

  return useMutation(
    trpc.projects.deleteNode.mutationOptions({
      onSuccess: (data) => {
        const updatedProject = data[1];
        queryClient.invalidateQueries(
          trpc.projects.getProject.queryOptions({
            projectId: updatedProject.id,
          }),
        );
        broadcast({ type: "NODE_DELETED", projectId: updatedProject.id });
      },
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
