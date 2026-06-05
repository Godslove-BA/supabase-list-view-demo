"use client";

import { Sparkles } from "lucide-react";
import { QuickStartSnippet } from "./quick-start-snippet";
import { Surface } from "./surface";

const SUBSCRIBE_SNIPPET = `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const channel = supabase
  .channel('room:lobby')
  .on('broadcast', { event: 'message' }, ({ payload }) => {
    console.log('Received:', payload)
  })
  .subscribe()

// Broadcast a message from anywhere in your app
await channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { text: 'Hello from realtime!' },
})`;

const STEPS = [
  {
    n: 1,
    title: "Broadcast messages",
    body: "Send messages to a channel from your client application or database via triggers.",
    cta: "Create a trigger",
  },
  {
    n: 2,
    title: "Write policies",
    body: "Set up Row Level Security policies to control who can see messages within a channel.",
    cta: "Write a policy",
  },
  {
    n: 3,
    title: "Subscribe to a channel",
    body: "Receive realtime messages in your application by listening to a channel.",
    cta: "Docs",
  },
];

export function RealtimeSurface() {
  const intro = (
    <div className="text-center mb-8">
      <div className="mb-3 flex justify-center">
        <div className="h-9 w-9 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-200)] flex items-center justify-center text-[var(--color-brand)]">
          <Sparkles size={18} strokeWidth={1.6} />
        </div>
      </div>
      <h3 className="text-[18px] font-medium text-[var(--color-fg)] mb-1">
        Create realtime experiences
      </h3>
      <p className="text-[13px] text-[var(--color-fg-light)] mb-4">
        Send your first realtime message from your database, application code or edge function
      </p>
      <button
        type="button"
        className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-200)] px-2.5 text-[12px] text-[var(--color-fg)] hover:bg-[var(--color-surface-300)] transition-colors"
      >
        <Sparkles size={11} className="text-[var(--color-brand)]" />
        Set up realtime for me
      </button>
    </div>
  );

  const stepsCard = (
    <div className="w-full max-w-[800px] grid grid-cols-1 sm:grid-cols-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-100)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
      {STEPS.map((step) => (
        <div key={step.n} className="flex flex-col h-full p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] shrink-0 font-mono text-[var(--color-fg-light)] w-6 h-6 bg-[var(--color-surface-200)] border border-[var(--color-border)] flex items-center justify-center rounded-md">
              {step.n}
            </span>
            <h4 className="text-[13px] font-medium text-[var(--color-fg)]">
              {step.title}
            </h4>
          </div>
          <p className="text-[12px] text-[var(--color-fg-light)] mb-4 flex-1">
            {step.body}
          </p>
          <button
            type="button"
            className="inline-flex h-6 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface-200)] px-2 text-[11px] text-[var(--color-fg)] hover:bg-[var(--color-surface-300)] transition-colors"
          >
            {step.cta}
          </button>
        </div>
      ))}
    </div>
  );

  const before = (
    <div className="w-full flex flex-col items-center">
      {intro}
      {stepsCard}
    </div>
  );

  const after = (
    <div className="w-full flex flex-col items-center">
      {intro}
      {stepsCard}
      <div className="mt-6 w-full max-w-[800px]">
        <QuickStartSnippet
          caption="Or paste this into your app to subscribe + broadcast on a channel:"
          snippet={SUBSCRIBE_SNIPPET}
          language="js"
          className="max-w-full"
        />
      </div>
    </div>
  );

  return (
    <Surface
      title="Realtime · First-time landing"
      location="Realtime → Inspector"
      sourcePath="apps/studio/components/interfaces/Realtime/Inspector/EmptyRealtime.tsx"
      before={before}
      after={after}
    />
  );
}
