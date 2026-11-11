import type { RecentItem } from "~/lib/recent";
import { typeLabels } from "~/lib/qr/types";

interface RecentListProps {
  items: RecentItem[];
  onRestore: (item: RecentItem) => void;
  onClear: () => void;
}

export function RecentList({ items, onRestore, onClear }: RecentListProps): React.ReactNode {
  if (items.length === 0) return null;
  return (
    <section aria-label="Recent codes">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[13px] text-muted-foreground">Recent</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear
        </button>
      </div>
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 lg:mx-0 lg:px-0.5">
        {items.map((item) => {
          const label = item.label || typeLabels[item.state.type];
          return (
            <li key={item.id} className="shrink-0 animate-in duration-300 fade-in zoom-in-90">
              <button
                type="button"
                onClick={() => onRestore(item)}
                title={label}
                aria-label={label}
                className="press block size-16 overflow-hidden rounded-[10px] bg-white p-1 ring-1 ring-border hover:ring-muted-foreground/40"
              >
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.svg)}`}
                  alt=""
                  className="size-full object-contain"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
