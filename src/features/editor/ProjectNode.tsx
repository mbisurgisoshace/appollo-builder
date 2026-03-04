"use client";

import { ReactNode } from "react";
import { NodeToolbar } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProjectNodeProps {
  name?: string;
  children: ReactNode;
  description?: string;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
}

export const ProjectNode = ({
  name,
  children,
  onDelete,
  onSettings,
  description,
  showToolbar = true,
}: ProjectNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button size={"sm"} variant={"ghost"} onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size={"sm"} variant={"ghost"} onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
    </>
  );
};
