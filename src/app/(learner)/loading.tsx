import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="min-h-svh bg-background">
      <div className="sticky top-0 z-30 h-15 border-b border-border bg-card/85" />
      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-52" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32 rounded-card" />
            <Skeleton className="h-32 rounded-card" />
            <Skeleton className="h-32 rounded-card" />
          </div>
          <Skeleton className="h-48 rounded-card" />
        </div>
      </main>
    </div>
  );
}
