import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import {
  ProjectError,
  ProjectHeader,
  ProjectLoading,
  ProjectContent,
} from "@/features/projects/components/Project";
import { prefetchTags } from "@/features/editor/server/prefetch";
import { prefetchProject } from "@/features/projects/server/prefetch";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  await requireAuth();

  const { projectId } = await params;

  prefetchTags();
  prefetchProject(projectId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectError />}>
        <Suspense fallback={<ProjectLoading />}>
          <ProjectHeader projectId={projectId} />
          <main className="flex-1">
            <ProjectContent projectId={projectId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
