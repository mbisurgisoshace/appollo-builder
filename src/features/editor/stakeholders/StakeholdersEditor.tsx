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
import { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import { transformNode } from "../adapters";
import { nodeComponents } from "../nodeComponents";
import { NodeType } from "@/generated/prisma/enums";
import { AddStakeholderButton } from "./AddStakeholderButton";
import { useSuspenseProject } from "@/features/projects/hooks/useProjects";
import { useUpdateNodePositions } from "@/features/editor/hooks/useEditor";

export const StakeholdersEditor = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);
  const { mutate: updateNodePositions } = useUpdateNodePositions();

  const [nodes, setNodes] = useState<Node[]>(
    project.nodes
      .filter((n) => n.type === NodeType.STAKEHOLDER)
      .map(transformNode),
  );

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
        <Panel position="center-left">
          <AddStakeholderButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};
