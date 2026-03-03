"use client";

import z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, WorkflowIcon } from "lucide-react";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ErrorView,
  EntityList,
  EntityItem,
  LoadingView,
  EntityHeader,
  EntityContainer,
  EntityPagination,
} from "@/components/BaseComponents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/generated/prisma/client";
import { useCreateProjects, useSuspenseProjects } from "../hooks/useProjects";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().optional(),
});

export type FormType = z.infer<typeof formSchema>;

export const ProjectsLoading = () => {
  return <LoadingView message="Loading projects..." />;
};

export const ProjectsError = () => {
  return <ErrorView message="Error loading projects" />;
};

export const NewProjectButton = () => {
  const router = useRouter();
  const createProject = useCreateProjects();
  const [sheetOpen, setSheetOpen] = useState(false);

  const form = useForm<FormType>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = (values: FormType) => {
    console.log("values", values);

    createProject.mutate(values, {
      onError: (error) => {},
      onSuccess: (data) => {
        setSheetOpen(false);
        router.push(`/projects/${data.id}`);
      },
    });
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          className="cursor-pointer"
          size={"sm"}
          disabled={createProject.isPending}
        >
          <PlusIcon className="size-4" />
          New Project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
          <SheetDescription>Create a new project.</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 mt-4"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="mt-4 px-0">
                <Button type="submit" disabled={createProject.isPending}>
                  Save
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const ProjectsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Projects"
        disabled={disabled}
        newButton={<NewProjectButton />}
        description="Create and manage your projects"
      />
    </>
  );
};

export const ProjectsList = () => {
  const projects = useSuspenseProjects();

  return (
    <EntityList
      items={projects.data}
      getKey={(project) => project.id}
      renderItem={(project) => <ProjectItem key={project.id} data={project} />}
    />
  );
};

export const ProjectItem = ({ data }: { data: Project }) => {
  return (
    <EntityItem
      title={data.name}
      //onRemove={handleRemove}
      href={`/projects/${data.id}`}
      //isRemoving={removeWorkflow.isPending}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
          {""} &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
    />
  );
};

export const ProjectsPagination = () => {
  //   const workflows = useSuspenseWorkflows();
  //   const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      page={1}
      totalPages={2}
      onPageChange={() => {}}
      //page={workflows.data.page}
      //disabled={workflows.isFetching}
      //totalPages={workflows.data.totalPages}
      //onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ProjectsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      //search={<WorkflowsSearch />}
      pagination={<ProjectsPagination />}
      header={<ProjectsHeader />}
    >
      {children}
    </EntityContainer>
  );
};
