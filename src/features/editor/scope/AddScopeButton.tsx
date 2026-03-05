"use client";

import { memo, useState } from "react";
import { ClipboardListIcon, PlusIcon } from "lucide-react";

import { NodeSelector } from "../NodeSelector";
import { Button } from "@/components/ui/button";
import { NodeType } from "@/generated/prisma/enums";

export const AddScopeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector
      nodes={[
        {
          label: "Scope",
          type: NodeType.SCOPE,
          description: "A scope or feature that affects your project.",
          icon: ClipboardListIcon,
        },
      ]}
      open={selectorOpen}
      title="Add Scope"
      onOpenChange={setSelectorOpen}
      description="Add a new scope to your project."
    >
      <Button size={"icon"} variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddScopeButton.displayName = "AddScopeButton";
