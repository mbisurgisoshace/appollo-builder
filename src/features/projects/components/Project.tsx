"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ErrorView, LoadingView } from "@/components/BaseComponents";
import { useSuspenseProject } from "../hooks/useProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StakeholdersEditor } from "@/features/editor/stakeholders/StakeholdersEditor";
import { ScopeEditor } from "@/features/editor/scope/ScopeEditor";
import { DataEditor } from "@/features/editor/data/DataEditor";
import { PresenceAvatars } from "@/features/collaboration/components/PresenceAvatars";
import { InviteDialog } from "@/features/collaboration/components/InviteDialog";
import { authClient } from "@/lib/auth-client";

export const ProjectLoading = () => {
  return <LoadingView message="Loading project..." />;
};

export const ProjectError = () => {
  return <ErrorView message="Error loading project" />;
};

export const ProjectBreadcrums = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/projects" prefetch>
              Projects
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* <EditorNameInput workflowId={workflowId} /> */}

        <BreadcrumbItem className="cursor-pointer hover:text-foreground transition-colors">
          {project.name}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const ProjectHeader = ({ projectId }: { projectId: string }) => {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <ProjectBreadcrums projectId={projectId} />
        <div className="flex items-center gap-3">
          <PresenceAvatars />
          {session?.user?.id && (
            <InviteDialog
              projectId={projectId}
              currentUserId={session.user.id}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export const ProjectContent = ({ projectId }: { projectId: string }) => {
  return (
    <Tabs className="h-full" defaultValue="stakeholders-builder">
      <div className="p-2">
        <TabsList>
          <TabsTrigger value="stakeholders-builder">Stakeholders</TabsTrigger>
          <TabsTrigger value="scope-builder">Scope</TabsTrigger>
          <TabsTrigger value="data-builder">Data</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="stakeholders-builder">
        <div className="h-full">
          <StakeholdersEditor projectId={projectId} />
        </div>
      </TabsContent>
      <TabsContent value="scope-builder">
        <div className="h-full">
          <ScopeEditor projectId={projectId} />
        </div>
      </TabsContent>
      <TabsContent value="data-builder">
        <div className="h-full">
          <DataEditor projectId={projectId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
