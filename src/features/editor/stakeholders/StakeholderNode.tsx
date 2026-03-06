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
import { Editor } from "@/components/rich-text-editor/editor";
import { SerializedEditorState } from "lexical";
import { Input } from "@/components/ui/input";

export type StakeHolderNodeData = {
  name?: string;
  role?: string;
  features?: string;
  richTextContent?: SerializedEditorState;
} & BaseNodeData;

type StakeHolderNodeType = Node<StakeHolderNodeData>;

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export const StakeholderNode = memo((props: NodeProps<StakeHolderNodeType>) => {
  const { setNodes } = useReactFlow();
  const { mutate: upsertNode } = useUpsertNode();
  const params = useParams<{ projectId: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editorState, setEditorState] = useState<SerializedEditorState>(
    props.data.richTextContent ?? initialValue,
  );

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
      type: NodeType.STAKEHOLDER,
      projectId: params.projectId,
      data: {
        name: values.name,
        role: values.role,
        tags: values.tags,
        features: values.features,
        richTextContent: editorState,
      },
      position: { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
    });
  };

  const handleEditorSave = (state: SerializedEditorState) => {
    upsertNode({
      id: props.id,
      slug: props.data.slug,
      type: NodeType.STAKEHOLDER,
      projectId: params.projectId,
      data: {
        ...props.data,
        richTextContent: state,
      },
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
        //onDoubleClick={handleOpenSettings}
      >
        <BaseNodeContent>
          <Editor
            className="h-125 w-112.5"
            editorSerializedState={editorState}
            onSerializedChange={(value) => setEditorState(value)}
            onSave={handleEditorSave}
          />
        </BaseNodeContent>
      </BaseCanvasNode>
    </>
  );
});

StakeholderNode.displayName = "StakeholderNode";
