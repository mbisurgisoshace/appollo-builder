"use client";

import { memo, useState } from "react";
import { DatabaseIcon, PlusIcon } from "lucide-react";

import { NodeSelector } from "../NodeSelector";
import { Button } from "@/components/ui/button";
import { NodeType } from "@/generated/prisma/enums";

export const AddDataButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector
      nodes={[
        {
          label: "Data",
          type: NodeType.DATA,
          description: "A data entity that affects your project.",
          icon: DatabaseIcon,
        },
      ]}
      open={selectorOpen}
      title="Add Data"
      onOpenChange={setSelectorOpen}
      description="Add a new data entity to your project."
    >
      <Button size={"icon"} variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddDataButton.displayName = "AddDataButton";
