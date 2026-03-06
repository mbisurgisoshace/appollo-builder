"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { EditorState, SerializedEditorState } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { TooltipProvider } from "@/components/ui/tooltip";
import { editorTheme } from "@/components/rich-text-editor/themes/editor-theme";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { cn } from "@/lib/utils";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  onChange,
  editorState,
  className,
  editorSerializedState,
  onSerializedChange,
  onSave,
  autoSaveDelay = 3000,
}: {
  className?: string;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  onSave?: (state: SerializedEditorState) => void;
  autoSaveDelay?: number;
}) {
  const [isDirty, setIsDirty] = useState(false);
  const latestStateRef = useRef<SerializedEditorState | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstChangeRef = useRef(true);
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const handleSave = useCallback(() => {
    if (!latestStateRef.current || !onSaveRef.current) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    onSaveRef.current(latestStateRef.current);
    setIsDirty(false);
  }, []);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      const serialized = editorState.toJSON();
      onChange?.(editorState);
      onSerializedChange?.(serialized);
      latestStateRef.current = serialized;

      if (isFirstChangeRef.current) {
        isFirstChangeRef.current = false;
        return;
      }

      setIsDirty(true);

      if (onSaveRef.current && autoSaveDelay > 0) {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(handleSave, autoSaveDelay);
      }
    },
    [onChange, onSerializedChange, autoSaveDelay, handleSave],
  );

  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-lg border shadow nodrag nopan nowheel cursor-text",
        className,
      )}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins onSave={onSave ? handleSave : undefined} isDirty={isDirty} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={handleChange}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
