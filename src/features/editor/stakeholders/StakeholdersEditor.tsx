"use client";

import {
  Panel,
  Controls,
  type Node,
  ReactFlow,
  Background,
  type NodeChange,
  applyNodeChanges,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import "@xyflow/react/dist/style.css";

import { transformNode } from "../adapters";
import { nodeComponents } from "../nodeComponents";
import { NodeType } from "@/generated/prisma/enums";
import { AddStakeholderButton } from "./AddStakeholderButton";
import { useSuspenseProject } from "@/features/projects/hooks/useProjects";
import { useUpdateNodePositions } from "@/features/editor/hooks/useEditor";
import { CollaborativeCursors } from "@/features/collaboration/components/CollaborativeCursors";
import { useCanvasSync } from "@/features/collaboration/hooks/useCanvasSync";
import { useOthers, useUpdateMyPresence } from "@/lib/liveblocks.config";

export const StakeholdersEditor = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);
  const { mutate: updateNodePositions } = useUpdateNodePositions();
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();
  useCanvasSync(projectId);

  const [nodes, setNodes] = useState<Node[]>(
    project.nodes
      .filter((n) => n.type === NodeType.STAKEHOLDER)
      .map(transformNode),
  );

  useEffect(() => {
    setNodes(
      project.nodes
        .filter((n) => n.type === NodeType.STAKEHOLDER)
        .map(transformNode),
    );
  }, [project.nodes]);

  useEffect(() => {
    const draggingUpdates = others
      .filter((o) => o.presence.draggingNodes)
      .flatMap((o) => o.presence.draggingNodes!);

    if (draggingUpdates.length === 0) return;

    setNodes((current) =>
      current.map((node) => {
        const update = draggingUpdates.find((u) => u.id === node.id);
        return update ? { ...node, position: update.position } : node;
      }),
    );
  }, [others]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onNodeDrag = useCallback(
    (_e: React.MouseEvent, _node: Node, draggedNodes: Node[]) => {
      updateMyPresence({
        draggingNodes: draggedNodes.map((n) => ({ id: n.id, position: n.position })),
      });
    },
    [updateMyPresence],
  );

  const onNodeDragStop = useCallback(
    (_e: React.MouseEvent, _node: Node, draggedNodes: Node[]) => {
      updateMyPresence({ draggingNodes: null });
      updateNodePositions({
        projectId,
        nodes: draggedNodes.map((n) => ({ id: n.id, position: n.position })),
      });
    },
    [updateMyPresence, updateNodePositions, projectId],
  );

  return (
    <div className="size-full">
      <ReactFlow
        fitView
        nodes={nodes}
        selectionOnDrag
        nodeTypes={nodeComponents}
        onNodesChange={onNodesChange}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
        <CollaborativeCursors />
        <Panel position="center-left">
          <AddStakeholderButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};
