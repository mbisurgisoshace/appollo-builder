import { createTRPCRouter } from "../init";
import { tagsRouter } from "@/features/editor/server/routers";
import { projectsRouter } from "@/features/projects/server/routers";

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  projects: projectsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
