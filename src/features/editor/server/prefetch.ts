import { prefetch, trpc } from "@/trpc/server";

export const prefetchTags = () => {
  return prefetch(trpc.tags.getTags.queryOptions());
};

export const prefetchScopeFeatures = (projectId: string) => {
  return prefetch(trpc.projects.getScopeFeatures.queryOptions({ projectId }));
};
