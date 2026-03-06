"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useEventListener } from "@/lib/liveblocks.config";

export function useCanvasSync(projectId: string) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  useEventListener(({ event }) => {
    if (event.projectId !== projectId) return;

    queryClient.invalidateQueries(
      trpc.projects.getProject.queryOptions({ projectId }),
    );

    if (event.type === "NODE_UPSERTED" || event.type === "NODE_DELETED") {
      queryClient.invalidateQueries(
        trpc.projects.getScopeFeatures.queryOptions({ projectId }),
      );
    }
  });
}
