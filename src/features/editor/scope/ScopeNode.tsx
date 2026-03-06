import { memo, useState } from "react";
import { useParams } from "next/navigation";
import { SerializedEditorState } from "lexical";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import {
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { NodeType } from "@/generated/prisma/enums";
import { FormType, ScopeDialog } from "./ScopeDialog";
import { Editor } from "@/components/rich-text-editor/editor";
import { BaseCanvasNode, BaseNodeData } from "../BaseCanvasNode";
import { useUpsertNode } from "@/features/editor/hooks/useEditor";

export type ScopeNodeData = {
  title?: string;
  richTextContent?: SerializedEditorState;
} & BaseNodeData;

type ScopeNodeType = Node<ScopeNodeData>;

export const ScopeNode = memo((props: NodeProps<ScopeNodeType>) => {
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
            },
          };
        }
        return node;
      }),
    );

    upsertNode({
      id: props.id,
      slug: values.slug,
      type: NodeType.SCOPE,
      projectId: params.projectId,
      data: {
        title: values.title,
        tags: values.tags,
        richTextContent: props.data.richTextContent,
      },
      position: { x: props.positionAbsoluteX, y: props.positionAbsoluteY },
    });
  };

  const handleEditorSave = (state: SerializedEditorState) => {
    upsertNode({
      id: props.id,
      slug: props.data.slug,
      type: NodeType.SCOPE,
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
      <ScopeDialog
        open={dialogOpen}
        defaultData={nodeData}
        onSubmit={handleSubmit}
        onOpenChange={setDialogOpen}
      />
      <BaseCanvasNode
        {...props}
        id={props.id}
        name="Scope"
        onSettings={handleOpenSettings}
        //onDoubleClick={handleOpenSettings}
      >
        <BaseNodeContent>
          <Editor
            className="h-125 w-112.5"
            onSave={handleEditorSave}
            editorSerializedState={props.data.richTextContent}
          />
        </BaseNodeContent>
      </BaseCanvasNode>
    </>
  );
});

ScopeNode.displayName = "ScopeNode";
