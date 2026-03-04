import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import {
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { NodeType } from "@/generated/prisma/enums";
import { BaseCanvasNode, BaseNodeData } from "../BaseCanvasNode";
import { FormType, StakeholderDialog } from "./StakeholderDialog";
import { useUpsertNode } from "@/features/editor/hooks/useEditor";

export type StakeHolderNodeData = {
  name?: string;
  slug?: string;
  role?: string;
} & BaseNodeData;

type StakeHolderNodeType = Node<StakeHolderNodeData>;

export const StakeholderNode = memo((props: NodeProps<StakeHolderNodeType>) => {
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
              name: values.name,
              role: values.role,
              slug: values.slug,
            },
          };
        }
        return node;
      }),
    );

    upsertNode({
      id: props.id,
      slug: values.slug,
      type: NodeType.STAKEHOLDER,
      projectId: params.projectId,
      data: { name: values.name, role: values.role },
      position: { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
    });
  };

  const nodeData = props.data;

  return (
    <>
      <StakeholderDialog
        open={dialogOpen}
        defaultData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setDialogOpen}
      />
      <BaseCanvasNode
        {...props}
        id={props.id}
        name="Stakeholder"
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      >
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Stakeholder</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>This is a stakeholder</BaseNodeContent>
      </BaseCanvasNode>
    </>
  );
});

StakeholderNode.displayName = "StakeholderNode";
