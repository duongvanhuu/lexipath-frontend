import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils/cn";

import type { FaqItem } from "../types/marketing.types";

export type FAQAccordionProps = {
  items: FaqItem[];
  className?: string;
};

/**
 * FAQAccordion — expandable FAQ list built on the shadcn (Radix) Accordion.
 * Single-open, collapsible. Use in a "Câu hỏi thường gặp" section.
 */
function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        "overflow-hidden rounded-card border border-border bg-card",
        className
      )}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          value={`faq-${i}`}
          className="px-5 not-last:border-b"
        >
          <AccordionTrigger className="py-4 text-base font-medium text-text-primary hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-text-secondary">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export { FAQAccordion };
