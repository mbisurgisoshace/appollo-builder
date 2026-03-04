"use client";

import z from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  SlugStatusIcon,
  useSlugAvailability,
} from "../hooks/useSlugAvailability";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS } from "@/config/constants";
import { StakeHolderNodeData } from "./StakeholderNode";
import { MultiSelect } from "@/components/ui/multiselect";
import { TagSelector } from "../components/TagSelector";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^\S+$/, "Slug cannot contain spaces")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Only lowercase letters, numbers, and hyphens allowed",
    ),
  role: z.string().min(1, { message: "Role is required" }),
  tags: z.string().optional(),
});

export type FormType = z.infer<typeof formSchema>;

interface StakeholderDialogProps {
  open: boolean;
  defaultData: StakeHolderNodeData;
  onSubmit: (values: FormType) => void;
  onOpenChange: (open: boolean) => void;
}

export const StakeholderDialog = ({
  open,
  onSubmit,
  defaultData,
  onOpenChange,
}: StakeholderDialogProps) => {
  const { projectId } = useParams<{ projectId: string }>();

  const form = useForm<FormType>({
    defaultValues: {
      name: defaultData.name || "",
      slug: defaultData.slug || "",
      role: defaultData.role || "",
      tags: defaultData.tags || "",
    },
    resolver: zodResolver(formSchema),
  });

  const watchSlug = form.watch("slug");
  const slugFieldState = form.getFieldState("slug");

  const { slugStatus, isCheckingSlug, checkAvailability, reset } =
    useSlugAvailability(watchSlug, defaultData.slug || "", projectId);

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultData.name || "",
        slug: defaultData.slug || "",
        role: defaultData.role || "",
        tags: defaultData.tags || "",
      });
      reset();
    }
  }, [open]);

  const handleSubmit = async (values: FormType) => {
    if (isCheckingSlug) return;

    if (slugStatus === "idle" && values.slug !== defaultData.slug) {
      await checkAvailability(values.slug);
      return;
    }

    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stakeholder</DialogTitle>
          <DialogDescription>
            Define a stakeholder for your project. Stakeholders can be users,
            organizations, or any other entities that have an interest in your
            project. You can reference stakeholders in your workflow to assign
            tasks, send notifications, and more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="stakeholder-user"
                        {...field}
                        className={cn(
                          "pr-9",
                          slugStatus === "taken" &&
                            "border-destructive focus-visible:ring-destructive",
                          slugStatus === "available" &&
                            "border-green-500 focus-visible:ring-green-500",
                        )}
                        onBlur={async (e) => {
                          if (e.target.value) {
                            const valid = await form.trigger("slug");
                            if (valid) checkAvailability(e.target.value);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SlugStatusIcon status={slugStatus} />
                      </div>
                    </div>
                  </FormControl>

                  {slugStatus === "taken" && !slugFieldState.error && (
                    <FormDescription className="text-[0.8rem] font-medium text-destructive">
                      This slug is already taken. Please choose another.
                    </FormDescription>
                  )}
                  {slugStatus === "available" && !slugFieldState.error && (
                    <FormDescription className="text-[0.8rem] font-medium text-green-600">
                      This slug is available!
                    </FormDescription>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  {/* <FormDescription></FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stakeholder Role</FormLabel>
                  <FormControl>
                    <MultiSelect
                      value={field.value}
                      options={ROLE_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Select roles"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                disabled={isCheckingSlug || slugStatus === "taken"}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
