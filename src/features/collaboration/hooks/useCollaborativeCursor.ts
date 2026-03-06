"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { useUpdateMyPresence } from "@/lib/liveblocks.config";

export function useCollaborativeCursor() {
  const updateMyPresence = useUpdateMyPresence();
  const { screenToFlowPosition } = useReactFlow();

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      updateMyPresence({ cursor: flowPosition });
    },
    [updateMyPresence, screenToFlowPosition],
  );

  const onMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  return { onMouseMove, onMouseLeave };
}
