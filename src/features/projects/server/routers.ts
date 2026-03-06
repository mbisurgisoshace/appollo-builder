import z from "zod";
import { TRPCError } from "@trpc/server";

import prisma from "@/lib/db";
import { NodeType } from "@/generated/prisma/enums";
import { assertProjectAccess, ProjectRole } from "@/lib/project-access";
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
    .mutation(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id, [
        ProjectRole.OWNER,
        ProjectRole.EDITOR,
      ]);
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
    .mutation(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id, [
        ProjectRole.OWNER,
        ProjectRole.EDITOR,
      ]);
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
    .mutation(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id, [
        ProjectRole.OWNER,
        ProjectRole.EDITOR,
      ]);
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
    .query(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id);
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
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.auth.user.id,
        },
      });
      // Auto-add creator as OWNER member
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: ctx.auth.user.id,
          role: ProjectRole.OWNER,
        },
      });
      return project;
    }),
  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id);
      return prisma.project.findUniqueOrThrow({
        where: { id: input.projectId },
        include: { nodes: true },
      });
    }),
  getProjects: protectedProcedure.query(({ ctx }) => {
    return prisma.project.findMany({
      where: {
        members: { some: { userId: ctx.auth.user.id } },
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
      await assertProjectAccess(input.projectId, ctx.auth.user.id);
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
  listMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id);
      return prisma.projectMember.findMany({
        where: { projectId: input.projectId },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { createdAt: "asc" },
      });
    }),
  inviteMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.nativeEnum(ProjectRole).default(ProjectRole.EDITOR),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id, [
        ProjectRole.OWNER,
      ]);

      const invitee = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!invitee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with that email address.",
        });
      }
      if (invitee.id === ctx.auth.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot invite yourself.",
        });
      }

      return prisma.projectMember.upsert({
        where: {
          projectId_userId: { projectId: input.projectId, userId: invitee.id },
        },
        create: {
          projectId: input.projectId,
          userId: invitee.id,
          role: input.role,
        },
        update: { role: input.role },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      });
    }),
  removeMember: protectedProcedure
    .input(z.object({ projectId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await assertProjectAccess(input.projectId, ctx.auth.user.id, [
        ProjectRole.OWNER,
      ]);
      if (input.userId === ctx.auth.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner cannot remove themselves from the project.",
        });
      }
      return prisma.projectMember.delete({
        where: {
          projectId_userId: { projectId: input.projectId, userId: input.userId },
        },
      });
    }),
});
