import { TRPCError } from "@trpc/server";

import prisma from "@/lib/db";
import { ProjectRole } from "@/generated/prisma/enums";

export { ProjectRole };

export async function assertProjectAccess(
  projectId: string,
  userId: string,
  allowedRoles: ProjectRole[] = [
    ProjectRole.OWNER,
    ProjectRole.EDITOR,
    ProjectRole.VIEWER,
  ],
): Promise<void> {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (!member || !allowedRoles.includes(member.role)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}
