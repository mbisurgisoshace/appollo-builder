"use client";

import {
  Panel,
  addEdge,
  MiniMap,
  Controls,
  type Node,
  type Edge,
  ReactFlow,
  Background,
  type XYPosition,
  type NodeChange,
  type EdgeChange,
  type Connection,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import { nodeComponents } from "../nodeComponents";
import { AddStakeholderButton } from "./AddStakeholderButton";
import { useSuspenseProject } from "@/features/projects/hooks/useProjects";
import { transformNode } from "../adapters";

export const StakeholdersEditor = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);

  const [nodes, setNodes] = useState<Node[]>(project.nodes.map(transformNode));

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        fitView
        nodes={nodes}
        selectionOnDrag
        nodeTypes={nodeComponents}
        onNodesChange={onNodesChange}
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
