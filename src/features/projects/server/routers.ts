import z from "zod";

import prisma from "@/lib/db";
import { NodeType } from "@/generated/prisma/enums";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const projectsRouter = createTRPCRouter({
  upsertNode: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z.string(),
        type: z.nativeEnum(NodeType),
        projectId: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.record(z.string(), z.any()).optional().default({}),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.node.upsert({
        where: { id: input.id },
        create: {
          id: input.id,
          slug: input.slug,
          type: input.type,
          projectId: input.projectId,
          position: input.position,
          data: input.data,
        },
        update: {
          slug: input.slug,
          data: input.data,
          position: input.position,
        },
      });
    }),
  updateNodePositions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            position: z.object({ x: z.number(), y: z.number() }),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.$transaction(
        input.nodes.map((n) =>
          prisma.node.update({
            where: { id: n.id },
            data: { position: n.position },
          }),
        ),
      );
    }),
  deleteNode: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.node.delete({
        where: { id: input.id },
      });
    }),
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
