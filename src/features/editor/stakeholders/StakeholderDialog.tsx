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
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StakeHolderNodeData } from "./StakeholderNode";
import { useCheckNodeSlugAvailability } from "@/features/projects/hooks/useProjects";
import {
  SlugStatusIcon,
  useSlugAvailability,
} from "../hooks/useSlugAvailability";
import { cn } from "@/lib/utils";

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
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultData.name || "",
        slug: defaultData.slug || "",
        role: defaultData.role || "",
      });
    }
  }, [open]);

  const watchSlug = form.watch("slug");
  const slugFieldState = form.getFieldState("slug");

  const { slugStatus, isCheckingSlug, checkAvailability, reset } =
    useSlugAvailability(watchSlug, projectId);

  const handleSubmit = async (values: FormType) => {
    if (isCheckingSlug) return;

    if (slugStatus === "idle") {
      await checkAvailability(values.slug);
      return;
    }

    //onSubmit(values);
    //onOpenChange(false);
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

            {/* <FormField
              name="method"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method to use for this request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
