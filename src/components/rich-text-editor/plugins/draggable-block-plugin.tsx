"use client";

import { JSX, useEffect, useRef } from "react";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useStoreApi } from "@xyflow/react";
import { GripVerticalIcon } from "lucide-react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export function DraggableBlockPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement | null;
}): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const store = useStoreApi();

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    let lastSetY = NaN;

    const observer = new MutationObserver(() => {
      const zoom = store.getState().transform[2];
      if (zoom === 1) return;

      const transform = menu.style.transform;
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (!match) return;

      const x = parseFloat(match[1]);
      const y = parseFloat(match[2]);

      // Skip if this is the corrected value we just set (prevents infinite loop)
      if (Math.abs(y - lastSetY) < 0.5) return;

      const correctedY = y / zoom;
      lastSetY = correctedY;
      menu.style.transform = `translate(${x}px, ${correctedY}px)`;
    });

    observer.observe(menu, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [anchorElem, store]);

  if (!anchorElem) {
    return null;
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef as React.RefObject<HTMLDivElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLDivElement>}
      menuComponent={
        <div
          ref={menuRef}
          className="draggable-block-menu absolute top-[4.5px] left-0 cursor-grab rounded-sm px-px py-0.5 opacity-0 will-change-transform hover:bg-gray-100 active:cursor-grabbing"
        >
          <GripVerticalIcon className="size-4 opacity-30" />
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="bg-secondary-foreground pointer-events-none absolute top-0 left-0 h-1 opacity-0 will-change-transform"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
