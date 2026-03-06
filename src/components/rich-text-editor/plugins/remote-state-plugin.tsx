import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SerializedEditorState } from "lexical";

export function RemoteStatePlugin({
  editorSerializedState,
  isDirty,
  onBeforeUpdate,
}: {
  editorSerializedState?: SerializedEditorState;
  isDirty?: boolean;
  onBeforeUpdate: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!editorSerializedState || isDirty) return;

    onBeforeUpdate();
    const newState = editor.parseEditorState(
      JSON.stringify(editorSerializedState),
    );
    editor.setEditorState(newState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorSerializedState]);

  return null;
}
