import z from "zod";

import prisma from "@/lib/db";
import { NodeType } from "@/generated/prisma/enums";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      console.log("input", input);
      console.log("ctx", ctx);

      return prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ input, ctx }) => {
      return prisma.project.findUniqueOrThrow({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
        },
        include: { nodes: true },
      });
    }),
  getProjects: protectedProcedure.query(({ ctx }) => {
    return prisma.project.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
  isNodeSlugAvailable: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        projectId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const existingNode = await prisma.node.findUnique({
        where: {
          slug_projectId: {
            slug: input.slug,
            projectId: input.projectId,
          },
        },
      });

      return !existingNode;
    }),
});
