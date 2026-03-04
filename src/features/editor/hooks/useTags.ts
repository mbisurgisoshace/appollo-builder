import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

export const useSuspenseTags = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.tags.getTags.queryOptions());
};

export const useCreateTag = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.tags.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Tag ${data.name} created`);
        queryClient.invalidateQueries(trpc.tags.getTags.queryOptions());
      },
      onError: (error) => toast.error(`Failed to create tag: ${error.message}`),
    }),
  );
};
