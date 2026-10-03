import type { RecentItem } from "~/lib/recent";
import { typeLabels } from "~/lib/qr/types";
import { cn } from "~/lib/utils";

interface RecentListProps {
  items: RecentItem[];
  onRestore: (item: RecentItem) => void;
  onClear: () => void;
  layout: "strip" | "grid";
}

export function RecentList({
  items,
  onRestore,
  onClear,
  layout,
}: RecentListProps): React.ReactNode {
  if (items.length === 0) {
    return layout === "grid" ? (
      <p className="py-10 text-center text-[13px] text-subtle">Codes you download show up here.</p>
    ) : null;
  }
  return (
    <section aria-label="Recent codes" className="grid gap-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-muted-foreground">Recent</h2>
        <button
          type="button"
          onClick={onClear}
          className="rounded text-[12px] text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          Clear
        </button>
      </div>
      <ul
        className={cn(
          layout === "strip"
            ? "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
            : "grid grid-cols-3 gap-2",
        )}
      >
        {items.map((item) => (
          <li key={item.id} className={cn(layout === "strip" && "shrink-0")}>
            <button
              type="button"
              onClick={() => onRestore(item)}
              title={item.label || typeLabels[item.state.type]}
              className={cn(
                "group grid w-full gap-1.5 rounded-lg p-1.5 text-left ring-1 ring-border transition outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                layout === "strip" && "w-20",
              )}
            >
              <img
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`}
                alt=""
                className="aspect-square w-full rounded-md bg-white object-contain"
              />
              <span className="truncate px-0.5 text-[11px] text-muted-foreground group-hover:text-foreground">
                {item.label || typeLabels[item.state.type]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
