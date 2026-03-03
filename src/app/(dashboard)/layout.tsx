import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prefetchProjects } from "@/features/projects/server/prefetch";
import { HydrateClient } from "@/trpc/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  prefetchProjects();

  return (
    <SidebarProvider>
      <HydrateClient>
        <AppSidebar />
      </HydrateClient>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
