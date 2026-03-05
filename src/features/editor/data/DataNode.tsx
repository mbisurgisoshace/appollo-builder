import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import {
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { NodeType } from "@/generated/prisma/enums";
import { FormType, DataDialog } from "./DataDialog";
import { BaseCanvasNode, BaseNodeData } from "../BaseCanvasNode";
import { useUpsertNode } from "@/features/editor/hooks/useEditor";

export type DataNodeData = {
  title?: string;
  features?: string;
} & BaseNodeData;

type DataNodeType = Node<DataNodeData>;

export const DataNode = memo((props: NodeProps<DataNodeType>) => {
  const { setNodes } = useReactFlow();
  const { mutate: upsertNode } = useUpsertNode();
  const params = useParams<{ projectId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: FormType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              title: values.title,
              slug: values.slug,
              tags: values.tags,
              features: values.features,
            },
          };
        }
        return node;
      }),
    );

    upsertNode({
      id: props.id,
      slug: values.slug,
      type: NodeType.DATA,
      projectId: params.projectId,
      data: {
        title: values.title,
        tags: values.tags,
        features: values.features,
      },
      position: { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
    });
  };

  const nodeData = props.data;

  return (
    <>
      <DataDialog
        open={dialogOpen}
        defaultData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setDialogOpen}
      />
      <BaseCanvasNode
        {...props}
        id={props.id}
        name="Data"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      >
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Data</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>This is a data node</BaseNodeContent>
      </BaseCanvasNode>
    </>
  );
});

DataNode.displayName = "DataNode";
