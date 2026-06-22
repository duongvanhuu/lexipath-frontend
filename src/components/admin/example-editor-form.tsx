"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SubmitFooter } from "@/components/admin/submit-footer"
import type { ExampleEditorField } from "./types"

const exampleSchema = z.object({
  sentence: z.string().min(1, "Câu ví dụ không được trống"),
  translation: z.string().optional(),
  sourceLabel: z.string().optional(),
  notes: z.string().optional(),
})

type ExampleFormValues = z.infer<typeof exampleSchema>

export interface ExampleEditorFormProps {
  defaultValues?: Partial<ExampleEditorField>
  onSubmit: (values: ExampleEditorField) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function ExampleEditorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ExampleEditorFormProps) {
  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      sentence: defaultValues?.sentence ?? "",
      translation: defaultValues?.translation ?? "",
      sourceLabel: defaultValues?.sourceLabel ?? "",
      notes: defaultValues?.notes ?? "",
    },
  })

  async function handleSubmit(values: ExampleFormValues) {
    const result: ExampleEditorField = {
      id: defaultValues?.id ?? "",
      sentence: values.sentence,
      ...(values.translation !== undefined && values.translation !== ""
        ? { translation: values.translation }
        : {}),
      ...(values.sourceLabel !== undefined && values.sourceLabel !== ""
        ? { sourceLabel: values.sourceLabel }
        : {}),
      ...(values.notes !== undefined && values.notes !== ""
        ? { notes: values.notes }
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
            name="sentence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sentence <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Enter an example sentence…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="translation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Translation</FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Enter the translation…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Source{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Oxford English Dictionary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Notes{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Any additional notes…"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitFooter
          submitLabel="Lưu Example"
          {...(onCancel !== undefined ? { onCancel } : {})}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  )
}
