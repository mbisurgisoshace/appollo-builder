"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useReactFlow } from "@xyflow/react";
import { createId } from "@paralleldrive/cuid2";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "@/components/ui/separator";
import { useUpsertNode } from "@/features/editor/hooks/useEditor";

export type NodeTypeOption = {
  label: string;
  type: NodeType;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

interface NodeSelectorProps {
  open: boolean;
  title: string;
  description: string;
  nodes: NodeTypeOption[];
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function NodeSelector({
  open,
  nodes,
  title,
  children,
  description,
  onOpenChange,
}: NodeSelectorProps) {
  const { setNodes, screenToFlowPosition } = useReactFlow();
  const { mutate: upsertNode } = useUpsertNode();
  const params = useParams<{ projectId: string }>();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      const id = createId();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const flowPosition = screenToFlowPosition({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      });

      setNodes((nodes) => [
        ...nodes,
        {
          id,
          data: {},
          type: selection.type,
          position: flowPosition,
        },
      ]);

      upsertNode({
        id,
        slug: "",
        type: selection.type,
        projectId: params.projectId,
        position: flowPosition,
        data: {},
      });

      onOpenChange(false);
    },
    [
      setNodes,
      screenToFlowPosition,
      onOpenChange,
      upsertNode,
      params.projectId,
    ],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div>
          {nodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                onClick={() => handleNodeSelect(nodeType)}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm ">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div></div>
      </SheetContent>
    </Sheet>
  );
}
