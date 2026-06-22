"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SubmitFooter } from "@/components/admin/submit-footer"
import type { SenseEditorField } from "./types"

const PART_OF_SPEECH_OPTIONS = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adjective", label: "Adjective" },
  { value: "adverb", label: "Adverb" },
  { value: "other", label: "Other" },
] as const

const senseSchema = z.object({
  partOfSpeech: z
    .enum(["noun", "verb", "adjective", "adverb", "other"])
    .optional(),
  definition: z.string().min(1, "Định nghĩa không được trống"),
  exampleSentence: z.string().optional(),
  notes: z.string().optional(),
})

type SenseFormValues = z.infer<typeof senseSchema>

export interface SenseEditorFormProps {
  defaultValues?: Partial<SenseEditorField>
  onSubmit: (values: SenseEditorField) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function SenseEditorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SenseEditorFormProps) {
  const form = useForm<SenseFormValues>({
    resolver: zodResolver(senseSchema),
    defaultValues: {
      partOfSpeech: isPartOfSpeechValue(defaultValues?.partOfSpeech)
        ? defaultValues.partOfSpeech
        : undefined,
      definition: defaultValues?.definition ?? "",
      exampleSentence: defaultValues?.exampleSentence ?? "",
      notes: defaultValues?.notes ?? "",
    },
  })

  async function handleSubmit(values: SenseFormValues) {
    const result: SenseEditorField = {
      id: defaultValues?.id ?? "",
      definition: values.definition,
      ...(values.partOfSpeech !== undefined
        ? { partOfSpeech: values.partOfSpeech }
        : {}),
      ...(values.exampleSentence !== undefined &&
      values.exampleSentence !== ""
        ? { exampleSentence: values.exampleSentence }
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
            name="partOfSpeech"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Part of Speech</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={(v) =>
                    field.onChange(isPartOfSpeechValue(v) ? v : undefined)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select part of speech" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PART_OF_SPEECH_OPTIONS.map((opt) => (
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
            name="definition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Definition</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exampleSentence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Sentence</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
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
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitFooter
          submitLabel="Lưu Sense"
          {...(onCancel !== undefined ? { onCancel } : {})}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  )
}

function isPartOfSpeechValue(
  v: string | undefined,
): v is "noun" | "verb" | "adjective" | "adverb" | "other" {
  return (
    v === "noun" ||
    v === "verb" ||
    v === "adjective" ||
    v === "adverb" ||
    v === "other"
  )
}
