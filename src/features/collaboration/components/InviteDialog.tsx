"use client";

import { useState } from "react";
import { UserPlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useProjectMembers,
  useInviteMember,
  useRemoveMember,
} from "@/features/collaboration/hooks/useProjectMembers";

interface InviteDialogProps {
  projectId: string;
  currentUserId: string;
}

export function InviteDialog({ projectId, currentUserId }: InviteDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");

  const { data: members = [] } = useProjectMembers(projectId);
  const { mutate: inviteMember, isPending: isInviting } =
    useInviteMember(projectId);
  const { mutate: removeMember } = useRemoveMember(projectId);

  const isOwner = members.some(
    (m) => m.userId === currentUserId && m.role === "OWNER",
  );

  if (!isOwner) return null;

  const handleInvite = () => {
    if (!email.trim()) return;
    inviteMember(
      { projectId, email: email.trim(), role },
      {
        onSuccess: () => setEmail(""),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlusIcon className="size-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite collaborators</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "EDITOR" | "VIEWER")}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} disabled={isInviting || !email.trim()}>
              {isInviting ? "Inviting…" : "Invite"}
            </Button>
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Members
              </p>
              <ul className="space-y-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="size-7 shrink-0">
                        <AvatarImage src={member.user.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
                          {member.userId === currentUserId && " (you)"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground capitalize">
                        {member.role.toLowerCase()}
                      </span>
                      {member.role !== "OWNER" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            removeMember({ projectId, userId: member.userId })
                          }
                        >
                          <TrashIcon className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
