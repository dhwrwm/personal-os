import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description: string | null;
  tags: string[];
  type: string;
};
function ItemCard({ title, description, tags, type }: Props) {
  return (
    <Card className="h-full border border-border/70">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <span className="rounded-full bg-muted px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {description?.trim() ? description : "No details added yet."}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ItemCard;
