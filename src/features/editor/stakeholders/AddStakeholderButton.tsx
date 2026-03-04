"use client";

import { memo, useState } from "react";
import { PlusIcon, UserIcon } from "lucide-react";

import { NodeSelector } from "../NodeSelector";
import { Button } from "@/components/ui/button";
import { NodeType } from "@/generated/prisma/enums";

export const AddStakeholderButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector
      nodes={[
        {
          label: "Stakeholder",
          type: NodeType.STAKEHOLDER,
          description:
            "A person or organization that has an interest in the project.",
          icon: UserIcon,
        },
      ]}
      open={selectorOpen}
      title="Add Stakeholder"
      onOpenChange={setSelectorOpen}
      description="Add a new stakeholder to your project."
    >
      <Button size={"icon"} variant={"outline"} className="bg-background">
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddStakeholderButton.displayName = "AddStakeholderButton";
