"use client";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useProjectMembers = (projectId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.projects.listMembers.queryOptions({ projectId }));
};

export const useInviteMember = (projectId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.inviteMember.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.projects.listMembers.queryOptions({ projectId }),
        );
        toast.success(`${data.user.name} has been added to the project.`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};

export const useRemoveMember = (projectId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.removeMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.projects.listMembers.queryOptions({ projectId }),
        );
        toast.success("Member removed.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
};
