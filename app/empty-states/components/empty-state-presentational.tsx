import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface EmptyStatePresentationalProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Studio's `EmptyStatePresentational` look-and-feel — dashed-border surface,
 * centered icon + heading + description, slot for primary CTA + (in After
 * mode) the QuickStartSnippet beneath it.
 */
export function EmptyStatePresentational({
  icon: Icon,
  title,
  description,
  className,
  children,
}: EmptyStatePresentationalProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[720px] mx-auto rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-100)] px-8 py-10 flex flex-col items-center text-center gap-2",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-200)] text-[var(--color-fg-light)] mb-1">
        <Icon size={20} strokeWidth={1.6} />
      </div>
      <h3 className="text-[15px] font-medium text-[var(--color-fg)]">{title}</h3>
      <p className="max-w-[440px] text-[13px] text-[var(--color-fg-light)]">
        {description}
      </p>
      {children ? (
        <div className="mt-3 flex w-full flex-col items-center gap-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}
