"use client";

import { SaveIcon } from "lucide-react";

import { useToolbarContext } from "@/components/rich-text-editor/context/toolbar-context";
import { Button } from "@/components/ui/button";

export function SaveToolbarPlugin() {
  const { onSave, isDirty } = useToolbarContext();

  if (!onSave) return null;

  return (
    <Button
      onClick={onSave}
      disabled={!isDirty}
      variant={"outline"}
      size={"icon-sm"}
    >
      <SaveIcon className="size-4" />
    </Button>
  );
}
