"use client";

import { useEffect, useRef } from "react";
import { useReactFlow, useViewport } from "@xyflow/react";

import { useOthers, useUpdateMyPresence } from "@/lib/liveblocks.config";

/**
 * Renders other users' cursors on the canvas and tracks the local user's cursor.
 *
 * Must be placed INSIDE <ReactFlow> (e.g. as a sibling to <Controls>).
 * Cursor positions are stored in flow coordinates (viewport-independent).
 * We convert to canvas-relative pixel coords with: x = flowX * zoom + translateX
 * This formula correctly handles zoom and pan on both sides without any screen-offset math.
 */
export function CollaborativeCursors() {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();
  const { screenToFlowPosition } = useReactFlow();
  const { x: translateX, y: translateY, zoom } = useViewport();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current?.closest<HTMLElement>(".react-flow");
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const flowPosition = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      updateMyPresence({ cursor: flowPosition });
    };

    const handleMouseLeave = () => {
      updateMyPresence({ cursor: null });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [screenToFlowPosition, updateMyPresence]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-50"
    >
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor) return null;

        const x = presence.cursor.x * zoom + translateX;
        const y = presence.cursor.y * zoom + translateY;

        return (
          <div
            key={connectionId}
            className="absolute"
            style={{
              left: x,
              top: y,
              transform: "translate(-4px, -4px)",
            }}
          >
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0L0 14L4 10.5L7 17L9.5 16L6.5 9.5L12 9.5L0 0Z"
                fill={info.color}
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="absolute top-4 left-3 text-xs px-1.5 py-0.5 rounded whitespace-nowrap text-white font-medium shadow-sm"
              style={{ backgroundColor: info.color }}
            >
              {info.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
