import type * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export interface ItemEditorTabsProps {
  defaultTab?: string;
  sensesContent: React.ReactNode;
  examplesContent: React.ReactNode;
  mediaContent?: React.ReactNode;
  metaContent?: React.ReactNode;
}

export function ItemEditorTabs({
  defaultTab,
  sensesContent,
  examplesContent,
  mediaContent,
  metaContent,
}: ItemEditorTabsProps) {
  return (
    <Tabs defaultValue={defaultTab ?? "senses"}>
      <TabsList className="border-b rounded-none w-full justify-start gap-0 h-auto bg-transparent p-0">
        <TabsTrigger
          value="senses"
          className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
        >
          Senses
        </TabsTrigger>
        <TabsTrigger
          value="examples"
          className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
        >
          Examples
        </TabsTrigger>
        {mediaContent !== undefined && (
          <TabsTrigger
            value="media"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
          >
            Media
          </TabsTrigger>
        )}
        {metaContent !== undefined && (
          <TabsTrigger
            value="meta"
            className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
          >
            Meta
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="senses" className="mt-4 focus-visible:outline-none">
        <div className="min-h-[200px]">{sensesContent}</div>
      </TabsContent>

      <TabsContent value="examples" className="mt-4 focus-visible:outline-none">
        <div className="min-h-[200px]">{examplesContent}</div>
      </TabsContent>

      {mediaContent !== undefined && (
        <TabsContent value="media" className="mt-4 focus-visible:outline-none">
          <div className="min-h-[200px]">{mediaContent}</div>
        </TabsContent>
      )}

      {metaContent !== undefined && (
        <TabsContent value="meta" className="mt-4 focus-visible:outline-none">
          <div className="min-h-[200px]">{metaContent}</div>
        </TabsContent>
      )}
    </Tabs>
  );
}
