import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import {
  ProjectError,
  ProjectHeader,
  ProjectLoading,
} from "@/features/projects/components/Project";
import { prefetchProject } from "@/features/projects/server/prefetch";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  await requireAuth();

  const { projectId } = await params;

  prefetchProject(projectId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProjectError />}>
        <Suspense fallback={<ProjectLoading />}>
          <ProjectHeader projectId={projectId} />
          <main className="flex-1">
            {/* <Editor workflowId={workflowId} /> */}
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
