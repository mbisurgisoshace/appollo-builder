import { DataNode } from "./data/DataNode";
import { ScopeNode } from "./scope/ScopeNode";
import { NodeType } from "@/generated/prisma/enums";
import { StakeholderNode } from "./stakeholders/StakeholderNode";

export const nodeComponents = {
  [NodeType.STAKEHOLDER]: StakeholderNode,
  [NodeType.SCOPE]: ScopeNode,
  [NodeType.DATA]: DataNode,
};

export type registeredNodeType = keyof typeof nodeComponents;
