import { headers } from "next/headers";
import { Liveblocks } from "@liveblocks/node";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

function generateUserColor(userId: string): string {
  const colors = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
    "#84cc16",
    "#06b6d4",
    "#e11d48",
  ];
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export async function POST(req: Request) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { room } = await req.json();
  const projectId = (room as string).replace("project:", "");

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: session.user.id } },
  });

  if (!member) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const lb = liveblocks.prepareSession(session.user.id, {
    userInfo: {
      id: session.user.id,
      name: session.user.name,
      image: session.user.image ?? null,
      color: generateUserColor(session.user.id),
    },
  });

  lb.allow(room, lb.FULL_ACCESS);
  const { status, body } = await lb.authorize();
  return new Response(body, { status });
}
