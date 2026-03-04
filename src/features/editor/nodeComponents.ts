import { NodeType } from "@/generated/prisma/enums";
import { StakeholderNode } from "./stakeholders/StakeholderNode";

export const nodeComponents = {
  [NodeType.STAKEHOLDER]: StakeholderNode,
};

export type registeredNodeType = keyof typeof nodeComponents;
