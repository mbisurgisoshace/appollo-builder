import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.projects.getProjects>;

export const prefetchProject = (projectId: string) => {
  return prefetch(trpc.projects.getProject.queryOptions({ projectId }));
};

export const prefetchProjects = () => {
  return prefetch(trpc.projects.getProjects.queryOptions());
};
