"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SubmitFooter } from "@/components/admin/submit-footer"
import type { CollectionEditorField } from "./types"

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const

const collectionSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được trống"),
  description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tagsRaw: z.string().optional(), // comma-separated string input
})

type CollectionFormValues = z.infer<typeof collectionSchema>

export interface CollectionEditorFormProps {
  defaultValues?: {
    title?: string
    description?: string
    level?: string
    tags?: string[]
    coverImageUrl?: string
  }
  onSubmit: (values: CollectionEditorField) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function CollectionEditorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CollectionEditorFormProps) {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      level: isLevelValue(defaultValues?.level) ? defaultValues.level : undefined,
      tagsRaw: defaultValues?.tags?.join(", ") ?? "",
    },
  })

  async function handleSubmit(values: CollectionFormValues) {
    const tags = values.tagsRaw
      ? values.tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined

    const result: CollectionEditorField = {
      id: "",
      title: values.title,
      ...(values.description !== undefined && values.description !== ""
        ? { description: values.description }
        : {}),
      ...(values.level !== undefined ? { level: values.level } : {}),
      ...(tags !== undefined && tags.length > 0 ? { tags } : {}),
      ...(defaultValues?.coverImageUrl !== undefined
        ? { coverImageUrl: defaultValues.coverImageUrl }
        : {}),
    }

    await onSubmit(result)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) =>
                    field.onChange(isLevelValue(v) ? v : undefined)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEVEL_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagsRaw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Separate tags with commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitFooter
          submitLabel="Lưu Collection"
          {...(onCancel !== undefined ? { onCancel } : {})}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  )
}

function isLevelValue(
  v: string | undefined,
): v is "beginner" | "intermediate" | "advanced" {
  return v === "beginner" || v === "intermediate" || v === "advanced"
}
