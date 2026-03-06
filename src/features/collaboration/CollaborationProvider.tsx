"use client";

import { RoomProvider as LBRoomProvider } from "@/lib/liveblocks.config";

// Cast needed for React 19 + Liveblocks v3 type compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoomProvider = LBRoomProvider as any;

interface CollaborationProviderProps {
  projectId: string;
  children: React.ReactNode;
}

export function CollaborationProvider({
  projectId,
  children,
}: CollaborationProviderProps) {
  return (
    <RoomProvider
      id={`project:${projectId}`}
      initialPresence={{
        cursor: null,
        selectedNodeId: null,
        draggingNodes: null,
        userInfo: { id: "", name: "", image: null, color: "#6366f1" },
      }}
    >
      {children}
    </RoomProvider>
  );
}
