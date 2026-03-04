import z from "zod";

import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const tagsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return prisma.tag.create({
        data: {
          name: input.name,
        },
      });
    }),
  getTags: protectedProcedure.query(({ ctx }) => {
    return prisma.tag.findMany({});
  }),
});
