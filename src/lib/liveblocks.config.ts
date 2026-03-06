"use client";

import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export type CursorCoords = { x: number; y: number };

export type DraggingNode = { id: string; position: { x: number; y: number } };

export type Presence = {
  cursor: CursorCoords | null;
  selectedNodeId: string | null;
  draggingNodes: DraggingNode[] | null;
  userInfo: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
};

export type UserMeta = {
  id: string;
  info: {
    id: string;
    name: string;
    image: string | null;
    color: string;
  };
};

export type RoomEvent =
  | { type: "NODE_UPSERTED"; projectId: string }
  | { type: "NODE_DELETED"; projectId: string }
  | { type: "NODE_POSITIONS_UPDATED"; projectId: string };

const client = createClient({
  throttle: 40,
  authEndpoint: "/api/liveblocks/auth",
});

export const {
  RoomProvider,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useSelf,
  useBroadcastEvent,
  useEventListener,
  suspense: { RoomProvider: RoomProviderSuspense },
} = createRoomContext<Presence, never, UserMeta, RoomEvent>(client);
