"use client";

import {
  KeyIcon,
  StarIcon,
  LogOutIcon,
  HistoryIcon,
  CreditCardIcon,
  FolderOpenIcon,
  WorkflowIcon,
  ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useSuspenseProjects } from "@/features/projects/hooks/useProjects";
import { Suspense } from "react";
import { LoadingView } from "./BaseComponents";
//import { useQueryClient } from "@tanstack/react-query";

const MENU_ITEMS: {
  title: string;
  items: { title: string; icon: any; url: string }[];
}[] = [
  {
    title: "Main",
    items: [
      // { title: "Workflows", icon: FolderOpenIcon, url: "/workflows" },
      // { title: "Credentials", icon: KeyIcon, url: "/credentials" },
      // { title: "Executions", icon: HistoryIcon, url: "/executions" },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  //const queryClient = useQueryClient();
  //const { isLoading, hasActiveSubscription } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/" prefetch>
              <Image width={30} height={30} alt="Appollo" src="/logo.svg" />
              <span className="text-primary font-semibold text-xl">
                Appollo
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Collapsible defaultOpen>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={"Projects"}>
                <Link
                  href="/projects"
                  prefetch
                  className="flex flex-row gap-2 items-center"
                >
                  <WorkflowIcon className="size-4" />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
              {/* <Suspense fallback={<LoadingView />}> */}
              <ProjectsNavigation />
              {/* </Suspense> */}
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Sign Out"}
              className="gap-x-4 h-10 px-4 cursor-pointer"
              onClick={async () => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                });
              }}
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export const ProjectsNavigation = () => {
  const projects = useSuspenseProjects();

  return projects.data.length ? (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:rotate-90">
          <ChevronRightIcon />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {projects.data.map((subItem) => (
            <SidebarMenuSubItem key={subItem.id}>
              <SidebarMenuSubButton asChild>
                <Link href={`/projects/${subItem.id}`} prefetch>
                  <span>{subItem.name}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </>
  ) : null;
};
