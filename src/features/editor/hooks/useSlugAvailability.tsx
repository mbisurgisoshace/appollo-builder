import { useState, useCallback, useEffect } from "react";

import { useCheckNodeSlugAvailability } from "@/features/projects/hooks/useProjects";
import { CheckCircleIcon, LoaderIcon, XCircleIcon } from "lucide-react";

type SlugStatus = "idle" | "checking" | "available" | "taken";

export const useSlugAvailability = (slug: string, projectId: string) => {
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");

  const { refetch: checkSlug, isFetching: isCheckingSlug } =
    useCheckNodeSlugAvailability(slug, projectId);

  useEffect(() => {
    setSlugStatus("idle");
  }, [slug]);

  const checkAvailability = useCallback(
    async (value: string) => {
      setSlugStatus("checking");

      const { data, error } = await checkSlug();

      if (error) {
        setSlugStatus("idle");
        return;
      }

      setSlugStatus(data ? "available" : "taken");
    },
    [checkSlug],
  );

  const reset = useCallback(() => {
    setSlugStatus("idle");
  }, []);

  return {
    reset,
    slugStatus,
    isCheckingSlug,
    checkAvailability,
  };
};

export function SlugStatusIcon({ status }: { status: string }) {
  if (status === "checking")
    return (
      <LoaderIcon className="h-4 w-4 animate-spin text-muted-foreground" />
    );
  if (status === "available")
    return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
  if (status === "taken")
    return <XCircleIcon className="h-4 w-4 text-destructive" />;
  return null;
}
