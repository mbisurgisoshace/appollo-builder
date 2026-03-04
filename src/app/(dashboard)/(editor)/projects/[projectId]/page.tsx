import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  prefetchProject,
  prefetchProjectStakeholders,
} from "@/features/projects/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import {
  ProjectContent,
  ProjectError,
  ProjectHeader,
  ProjectLoading,
} from "@/features/projects/components/Project";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  await requireAuth();

  const { projectId } = await params;

  prefetchProject(projectId);
  prefetchProjectStakeholders(projectId);

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
