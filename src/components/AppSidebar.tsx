"use client";

import {
  KeyIcon,
  StarIcon,
  LogOutIcon,
  HistoryIcon,
  CreditCardIcon,
  FolderOpenIcon,
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
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
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
        {MENU_ITEMS.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="gap-x-4 h-10 px-4"
                      >
                        <Link href={item.url} prefetch>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
