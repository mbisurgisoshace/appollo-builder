import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import {
  ProjectsList,
  ProjectsError,
  ProjectsLoading,
  ProjectsContainer,
} from "@/features/projects/components/Projects";
import { prefetchProjects } from "@/features/projects/server/prefetch";

export default async function ProjectsPage() {
  await requireAuth();
  prefetchProjects();

  return (
    <ProjectsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ProjectsError />}>
          <Suspense fallback={<ProjectsLoading />}>
            <ProjectsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ProjectsContainer>
  );
}
