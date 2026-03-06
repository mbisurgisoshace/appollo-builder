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
import { AddScopeButton } from "./AddScopeButton";
import { useSuspenseProject } from "@/features/projects/hooks/useProjects";
import { useUpdateNodePositions } from "@/features/editor/hooks/useEditor";
import { CollaborativeCursors } from "@/features/collaboration/components/CollaborativeCursors";
import { useCanvasSync } from "@/features/collaboration/hooks/useCanvasSync";

export const ScopeEditor = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);
  const { mutate: updateNodePositions } = useUpdateNodePositions();
  useCanvasSync(projectId);

  const [nodes, setNodes] = useState<Node[]>(
    project.nodes.filter((n) => n.type === NodeType.SCOPE).map(transformNode),
  );

  useEffect(() => {
    setNodes(
      project.nodes
        .filter((n) => n.type === NodeType.SCOPE)
        .map(transformNode),
    );
  }, [project.nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onNodeDragStop = useCallback(
    (_e: React.MouseEvent, _node: Node, draggedNodes: Node[]) => {
      updateNodePositions({
        projectId,
        nodes: draggedNodes.map((n) => ({ id: n.id, position: n.position })),
      });
    },
    [updateNodePositions, projectId],
  );

  return (
    <div className="size-full">
      <ReactFlow
        fitView
        nodes={nodes}
        selectionOnDrag
        nodeTypes={nodeComponents}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
        <CollaborativeCursors />
        <Panel position="center-left">
          <AddScopeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};
