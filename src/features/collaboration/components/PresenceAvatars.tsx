"use client";

import { useSelf, useOthers } from "@/lib/liveblocks.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_SHOWN = 4;

export function PresenceAvatars() {
  const self = useSelf();
  const others = useOthers();
  const shown = others.slice(0, MAX_SHOWN);
  const overflow = others.length - MAX_SHOWN;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map(({ connectionId, info }) => (
        <Tooltip key={connectionId}>
          <TooltipTrigger asChild>
            <Avatar
              className="size-7 ring-2 ring-background cursor-default"
              style={{ borderColor: info.color }}
            >
              <AvatarImage src={info.image ?? undefined} />
              <AvatarFallback
                className="text-xs text-white"
                style={{ backgroundColor: info.color }}
              >
                {info.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{info.name}</TooltipContent>
        </Tooltip>
      ))}

      {self?.info.name && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar
              className="size-7 ring-2 ring-background cursor-default"
              style={{ borderColor: self.info.color }}
            >
              <AvatarImage src={self.info.image ?? undefined} />
              <AvatarFallback
                className="text-xs text-white"
                style={{ backgroundColor: self.info.color }}
              >
                {self.info.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{self.info.name} (You)</TooltipContent>
        </Tooltip>
      )}

      {overflow > 0 && (
        <div className="size-7 rounded-full bg-muted flex items-center justify-center text-xs ring-2 ring-background z-10">
          +{overflow}
        </div>
      )}
    </div>
  );
}
