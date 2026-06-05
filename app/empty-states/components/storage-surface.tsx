"use client";

import { BarChart3, FolderPlus, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { EmptyStatePresentational } from "./empty-state-presentational";
import { QuickStartSnippet } from "./quick-start-snippet";
import { Surface } from "./surface";

type BucketType = "files" | "analytics" | "vectors";

// Verbatim copy from supabase/supabase
// apps/studio/components/interfaces/Storage/Storage.constants.ts
const BUCKET_TYPES = {
  files: {
    label: "Files",
    article: "a",
    singularName: "file",
    valueProp: "Store images, videos, documents, and any other file type.",
    icon: FolderPlus,
  },
  analytics: {
    label: "Analytics",
    article: "an",
    singularName: "analytics",
    valueProp: "Store large datasets for analytics and reporting.",
    icon: BarChart3,
  },
  vectors: {
    label: "Vectors",
    article: "a",
    singularName: "vectors",
    valueProp: "Store, index, and query your vector embeddings at scale.",
    icon: Sparkles,
  },
} as const;

const FILES_SNIPPET = `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { data, error } = await supabase
  .storage
  .from('your-bucket')
  .upload('hello.txt', file)`;

const ANALYTICS_SNIPPET = `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Run an Iceberg-compatible analytics query against your bucket
const { data, error } = await supabase
  .from('your-bucket.your-table')
  .select('*')
  .limit(10)`;

const VECTORS_SNIPPET = `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Search your vector bucket for the K nearest neighbours of an embedding
const { data, error } = await supabase
  .schema('vectors')
  .from('your-bucket')
  .select('id, content')
  .limit(10)`;

const SNIPPETS: Record<BucketType, { caption: string; snippet: string }> = {
  files: {
    caption: "Or upload your first file from your app:",
    snippet: FILES_SNIPPET,
  },
  analytics: {
    caption: "Or query an analytics bucket from your app:",
    snippet: ANALYTICS_SNIPPET,
  },
  vectors: {
    caption: "Or query a vector bucket from your app:",
    snippet: VECTORS_SNIPPET,
  },
};

export function StorageSurface() {
  const [bucketType, setBucketType] = useState<BucketType>("files");
  const config = BUCKET_TYPES[bucketType];
  const quickStart = SNIPPETS[bucketType];

  const before = (
    <EmptyStatePresentational
      icon={config.icon}
      title={`Create ${config.article} ${config.singularName} bucket`}
      description={config.valueProp}
    >
      <CreateBucketButton />
    </EmptyStatePresentational>
  );

  const after = (
    <EmptyStatePresentational
      icon={config.icon}
      title={`Create ${config.article} ${config.singularName} bucket`}
      description={config.valueProp}
    >
      <CreateBucketButton />
      <QuickStartSnippet
        caption={quickStart.caption}
        snippet={quickStart.snippet}
        language="js"
      />
    </EmptyStatePresentational>
  );

  return (
    <Surface
      title="Storage · Empty bucket"
      location="Storage → New bucket"
      sourcePath="apps/studio/components/interfaces/Storage/EmptyBucketState.tsx"
      variantToggle={<BucketTypeToggle value={bucketType} onChange={setBucketType} />}
      before={before}
      after={after}
    />
  );
}

function CreateBucketButton() {
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-300)] px-2.5 text-[12px] text-[var(--color-fg)] hover:bg-[var(--color-surface-400)] transition-colors"
    >
      <Plus size={12} />
      Create bucket
    </button>
  );
}

function BucketTypeToggle({
  value,
  onChange,
}: {
  value: BucketType;
  onChange: (v: BucketType) => void;
}) {
  const types: BucketType[] = ["files", "analytics", "vectors"];
  return (
    <>
      <span className="text-[11px] uppercase tracking-wide text-[var(--color-fg-lighter)]">
        bucket type
      </span>
      <div className="inline-flex h-6 items-center overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-100)] text-[11px]">
        {types.map((t, i) => {
          const isActive = value === t;
          return (
            <div key={t} className="flex h-full items-center">
              {i > 0 ? (
                <span className="h-full w-px bg-[var(--color-border)]" />
              ) : null}
              <button
                onClick={() => onChange(t)}
                className={cn(
                  "px-2 h-full",
                  isActive
                    ? "bg-[var(--color-surface-300)] text-[var(--color-fg)]"
                    : "text-[var(--color-fg-light)] hover:text-[var(--color-fg)]"
                )}
              >
                {BUCKET_TYPES[t].label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
