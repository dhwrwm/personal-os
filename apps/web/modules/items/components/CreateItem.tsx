"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";

import type { CreateItemPayload, ItemType, JobStatus } from "../types";

type CreateItemFormValues = {
  title: string;
  type: ItemType;
  content: string;
  tags: string;
  company: string;
  role: string;
  jobStatus: JobStatus;
};

type CreateItemProps = {
  onCreated: (input: CreateItemPayload) => Promise<void>;
};

export default function CreateItem({ onCreated }: CreateItemProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateItemFormValues>({
    defaultValues: {
      title: "",
      type: "job",
      content: "",
      tags: "",
      company: "",
      role: "",
      jobStatus: "applied",
    },
  });

  const itemType = useWatch({
    control,
    name: "type",
  });

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CreateItemPayload = {
        title: values.title.trim(),
        type: values.type,
        content: values.content.trim() || undefined,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (values.type === "job") {
        payload.job = {
          company: values.company.trim(),
          role: values.role.trim(),
          status: values.jobStatus,
        };
      }

      await onCreated(payload);
      reset();
      setOpen(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create item",
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 my-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new item.
          </DialogDescription>
        </DialogHeader>
        <form className="grid w-full gap-4 py-4" onSubmit={submit}>
          <div className="grid w-full items-center gap-2">
            <Input
              placeholder="Item Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              defaultValue="job"
              onValueChange={(value) =>
                setValue("type", value as ItemType, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="bookmark">Bookmark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              placeholder="Short description"
              {...register("content")}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="comma,separated,tags"
              {...register("tags")}
            />
          </div>
          {itemType === "job" ? (
            <>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Company</label>
                <Input
                  placeholder="Acme Inc."
                  {...register("company", {
                    required: "Company is required for job items",
                  })}
                />
                {errors.company ? (
                  <p className="text-red-500">{errors.company.message}</p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Role</label>
                <Input
                  placeholder="Frontend Engineer"
                  {...register("role", {
                    required: "Role is required for job items",
                  })}
                />
                {errors.role ? (
                  <p className="text-red-500">{errors.role.message}</p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  defaultValue="applied"
                  onValueChange={(value) =>
                    setValue("jobStatus", value as JobStatus, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select job status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
