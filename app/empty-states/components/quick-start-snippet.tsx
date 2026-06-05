"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";

type Language = "js" | "ts" | "sql" | "bash";

interface QuickStartSnippetProps {
  /** Optional caption rendered above the snippet (e.g. "Or via SQL:"). */
  caption?: string;
  /** The snippet body. */
  snippet: string;
  /** Syntax-highlight language. */
  language: Language;
  /** Wrapper className. */
  className?: string;
}

/**
 * QuickStartSnippet — a paste-ready code snippet block that turns an empty
 * state from purely instructional copy into something a first-time user can
 * actually run in seconds.
 *
 * In Studio this wraps the canonical `CodeBlock` from `ui-patterns`. In this
 * prototype we hand-roll a minimal lookalike (plain monospace + a hand-tuned
 * keyword/string/comment highlighter) so reviewers don't have to spin up the
 * Studio dev stack to see the design intent.
 */
export function QuickStartSnippet({
  caption,
  snippet,
  language,
  className,
}: QuickStartSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked (insecure context, permissions). Silently noop.
    }
  };

  return (
    <div className={cn("w-full max-w-[640px] mt-1", className)}>
      {caption ? (
        <p className="text-[var(--color-fg-light)] text-xs mb-1.5 text-left">
          {caption}
        </p>
      ) : null}
      <div className="group relative rounded-md border border-[var(--color-border)] bg-[var(--color-surface-100)] overflow-hidden">
        <div className="flex h-7 items-center justify-between border-b border-[var(--color-border-muted)] bg-[var(--color-surface-200)] px-2.5">
          <span className="text-[10px] uppercase tracking-wide text-[var(--color-fg-lighter)] font-mono">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy snippet"}
            className={cn(
              "inline-flex h-5 items-center gap-1 rounded px-1.5 text-[10px] transition-colors",
              "text-[var(--color-fg-light)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-300)]"
            )}
          >
            {copied ? (
              <>
                <Check size={11} className="text-[var(--color-brand)]" />
                <span className="text-[var(--color-brand)]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto p-3 text-[11.5px] leading-[1.55] font-mono text-[var(--color-fg)] whitespace-pre">
          <code
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: highlight(snippet.trim(), language) }}
          />
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Minimal, hand-tuned syntax highlighter                            */
/*                                                                    */
/*  Studio uses react-syntax-highlighter; here we just want comments  */
/*  / strings / keywords visually distinguishable so the snippet      */
/*  reads as code rather than a paragraph. Tokenised left-to-right    */
/*  so nothing nests.                                                 */
/* ------------------------------------------------------------------ */

const KEYWORDS: Record<Language, string[]> = {
  js: [
    "import", "from", "const", "let", "var", "await", "async", "function",
    "return", "if", "else", "new", "export", "default",
  ],
  ts: [
    "import", "from", "const", "let", "var", "await", "async", "function",
    "return", "if", "else", "new", "export", "default", "type", "interface",
  ],
  sql: [
    "create", "policy", "on", "for", "to", "using", "with", "check",
    "select", "insert", "update", "delete", "from", "where", "and", "or",
  ],
  bash: ["echo", "export", "if", "then", "fi", "for", "do", "done"],
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(src: string, language: Language): string {
  const keywords = KEYWORDS[language] ?? [];
  // Build one combined regex per render. Order matters: comments first
  // (so they don't get inner-highlighted), then strings, then keywords.
  const tokens: Array<{ regex: RegExp; cls: string }> = [
    // line comments
    {
      regex: language === "sql" ? /--[^\n]*/g : /\/\/[^\n]*/g,
      cls: "tok-comment",
    },
    // single & double quoted strings + template literals
    { regex: /'[^'\n]*'/g, cls: "tok-string" },
    { regex: /"[^"\n]*"/g, cls: "tok-string" },
    { regex: /`[^`]*`/g, cls: "tok-string" },
  ];

  const out: string[] = [];
  let i = 0;

  while (i < src.length) {
    let matched = false;
    for (const { regex, cls } of tokens) {
      regex.lastIndex = i;
      const m = regex.exec(src);
      if (m && m.index === i) {
        out.push(`<span class="${cls}">${escapeHtml(m[0])}</span>`);
        i = m.index + m[0].length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Try to match a word; check against keyword set
    const wordMatch = /[A-Za-z_][A-Za-z0-9_]*/.exec(src.slice(i));
    if (wordMatch && wordMatch.index === 0) {
      const word = wordMatch[0];
      // SQL is case-insensitive for keywords
      const cmp = language === "sql" ? word.toLowerCase() : word;
      if (keywords.includes(cmp)) {
        out.push(`<span class="tok-keyword">${escapeHtml(word)}</span>`);
      } else {
        out.push(escapeHtml(word));
      }
      i += word.length;
      continue;
    }

    // numeric literal
    const numMatch = /\d+(?:\.\d+)?/.exec(src.slice(i));
    if (numMatch && numMatch.index === 0) {
      out.push(`<span class="tok-number">${escapeHtml(numMatch[0])}</span>`);
      i += numMatch[0].length;
      continue;
    }

    // single character (operator, whitespace, punctuation)
    out.push(escapeHtml(src[i]));
    i += 1;
  }

  return out.join("");
}
