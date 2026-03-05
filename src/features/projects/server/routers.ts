import z from "zod";

import prisma from "@/lib/db";
import { NodeType } from "@/generated/prisma/enums";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const projectsRouter = createTRPCRouter({
  upsertNode: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        slug: z
          .string()
          .optional()
          .nullable()
          .transform((v) => v || null),
        type: z.nativeEnum(NodeType),
        projectId: z.string(),
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.record(z.string(), z.any()).optional().default({}),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.$transaction([
        prisma.node.upsert({
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
        }),
        prisma.project.update({
          where: { id: input.projectId },
          data: { updatedAt: new Date() },
        }),
      ]);
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
      return prisma.$transaction([
        ...input.nodes.map((n) =>
          prisma.node.update({
            where: { id: n.id },
            data: { position: n.position },
          }),
        ),
        prisma.project.update({
          where: { id: input.projectId },
          data: { updatedAt: new Date() },
        }),
      ]);
    }),
  deleteNode: protectedProcedure
    .input(z.object({ id: z.string(), projectId: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.$transaction([
        prisma.node.delete({
          where: { id: input.id },
        }),
        prisma.project.update({
          where: { id: input.projectId },
          data: { updatedAt: new Date() },
        }),
      ]);
    }),
  getScopeFeatures: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ input, ctx }) => {
      return prisma.node.findMany({
        where: {
          slug: { not: null },
          type: NodeType.SCOPE,
          projectId: input.projectId,
        },
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
      orderBy: {
        updatedAt: "desc",
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
