import { prefetch, trpc } from "@/trpc/server";

export const prefetchTags = () => {
  return prefetch(trpc.tags.getTags.queryOptions());
};
