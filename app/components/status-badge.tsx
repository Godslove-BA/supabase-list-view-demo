import { cn } from "../lib/cn";

export type StatusTone = "paid" | "pending" | "failed" | "neutral" | "info";

const TONES: Record<StatusTone, string> = {
  paid:
    "text-[hsl(153.1deg_60.2%_52.7%)] bg-[hsl(153.1deg_60.2%_52.7%/0.10)] ring-[hsl(153.1deg_60.2%_52.7%/0.25)]",
  pending:
    "text-[hsl(38.9deg_100%_57.1%)] bg-[hsl(38.9deg_100%_57.1%/0.10)] ring-[hsl(38.9deg_100%_57.1%/0.25)]",
  failed:
    "text-[hsl(10.2deg_77.9%_53.9%)] bg-[hsl(10.2deg_77.9%_53.9%/0.10)] ring-[hsl(10.2deg_77.9%_53.9%/0.25)]",
  info: "text-[hsl(217deg_91%_70%)] bg-[hsl(217deg_91%_60%/0.10)] ring-[hsl(217deg_91%_60%/0.25)]",
  neutral:
    "text-[var(--color-fg-light)] bg-[var(--color-surface-200)] ring-[var(--color-border)]",
};

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-[1px] text-[11px] font-medium ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
