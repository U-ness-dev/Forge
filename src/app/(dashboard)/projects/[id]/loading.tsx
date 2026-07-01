import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProjectDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="h-8 w-64 rounded-lg bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-lg bg-muted" />
          <div className="h-9 w-32 rounded-lg bg-muted" />
        </div>
      </div>

      <div className="flex gap-1 rounded-lg border bg-muted p-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 flex-1 rounded-md bg-muted-foreground/10" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-5 w-40 rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
          </div>
          <div className="h-4 rounded bg-muted" />
          <div className="h-2 rounded-full bg-muted" />
        </CardContent>
      </Card>
    </div>
  )
}
