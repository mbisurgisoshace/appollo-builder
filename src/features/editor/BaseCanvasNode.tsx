"use client";

import Image from "next/image";
import { memo, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useDeleteNode } from "@/features/projects/hooks/useProjects";

import { ProjectNode } from "./ProjectNode";
import { BaseNode } from "@/components/react-flow/base-node";

export type BaseNodeData = {
  slugs: string[];
  features: string[];
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
    children,
    onSettings,
    icon: Icon,
    description,
    onDoubleClick,
  }: BaseCanvasNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const { mutate: deleteNode } = useDeleteNode();

    const handleDelete = () => {
      setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== id && edge.target !== id,
        ),
      );
      deleteNode({ id });
    };

    return (
      <ProjectNode
        name={name}
        onDelete={handleDelete}
        onSettings={onSettings}
        description={description}
      >
        <BaseNode onDoubleClick={onDoubleClick}>{children}</BaseNode>
      </ProjectNode>
    );
  },
);

BaseCanvasNode.displayName = "BaseCanvasNode";
