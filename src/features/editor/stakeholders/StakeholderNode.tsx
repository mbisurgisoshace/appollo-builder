import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { BaseCanvasNode, BaseNodeData } from "../BaseCanvasNode";
import { FormType, StakeholderDialog } from "./StakeholderDialog";

export type StakeHolderNodeData = {
  name?: string;
  slug?: string;
  role?: string;
} & BaseNodeData;

type StakeHolderNodeType = Node<StakeHolderNodeData>;

export const StakeholderNode = memo((props: NodeProps<StakeHolderNodeType>) => {
  const { setNodes } = useReactFlow();
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
              slug: values.slug,
              //role: values.role,
            },
          };
        }
        return node;
      }),
    );
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
      {/* <BaseNode>
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Stakeholder</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>This is a stakeholder</BaseNodeContent>
      </BaseNode> */}
    </>
  );
});

StakeholderNode.displayName = "StakeholderNode";
