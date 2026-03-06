"use client";

import { useParams } from "next/navigation";
import { memo, useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";

import { ProjectNode } from "./ProjectNode";
import { BaseNode } from "@/components/react-flow/base-node";
import { useDeleteNode } from "@/features/editor/hooks/useEditor";
import { useUpdateMyPresence, useOthers } from "@/lib/liveblocks.config";

export type BaseNodeData = {
  slug?: string;
  tags?: string;
};

interface BaseCanvasNodeProps extends NodeProps {
  name: string;
  description?: string;
  children?: ReactNode;
  onSettings?: () => void;
  icon?: LucideIcon | string;
  onDoubleClick?: () => void;
}

export const BaseCanvasNode = memo(
  ({
    id,
    name,
    selected,
    children,
    onSettings,
    icon: Icon,
    description,
    onDoubleClick,
  }: BaseCanvasNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const { mutate: deleteNode } = useDeleteNode();
    const params = useParams<{ projectId: string }>();
    const updateMyPresence = useUpdateMyPresence();
    const others = useOthers();

    const editingUser = others.find((o) => o.presence.selectedNodeId === id);

    useEffect(() => {
      updateMyPresence({ selectedNodeId: selected ? id : null });
    }, [selected, id, updateMyPresence]);

    const handleDelete = () => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== id && edge.target !== id),
      );
      deleteNode({ id, projectId: params.projectId });
    };

    return (
      <div
        style={
          editingUser
            ? {
                outline: `2px solid ${editingUser.info.color}`,
                borderRadius: "var(--radius)",
              }
            : undefined
        }
      >
        <ProjectNode
          name={name}
          onDelete={handleDelete}
          onSettings={onSettings}
          description={description}
        >
          <BaseNode onDoubleClick={onDoubleClick}>{children}</BaseNode>
        </ProjectNode>
      </div>
    );
  },
);

BaseCanvasNode.displayName = "BaseCanvasNode";
