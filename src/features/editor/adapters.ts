import { type Node, type XYPosition } from "@xyflow/react";

import { Node as DbNode } from "@/generated/prisma/client";

export const transformNode = (node: DbNode): Node => {
  const parsedData = JSON.parse(JSON.stringify(node.data) || "{}");

  return {
    id: node.id,
    type: node.type,
    position: node.position as XYPosition,
    data: {
      ...parsedData,
      slug: node.slug,
    } as Record<string, unknown>,
  };
};
