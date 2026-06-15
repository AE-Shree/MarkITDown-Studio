"use client";

import { useState } from "react";
import { Copy, Check, Download, AlertTriangle, FileCheck2, ChevronDown } from "lucide-react";
import type { ConversionResult } from "@/lib/api";

function toMarkdownFilename(original: string): string {
  const dot = original.lastIndexOf(".");
  const base = dot > 0 ? original.slice(0, dot) : original;
  return `${base}.md`;
}

export default function ResultPanel({ result }: { result: ConversionResult }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  async function handleCopy() {
    if (!result.markdown) return;
    await navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (!result.markdown) return;
    const blob = new Blob([result.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = toMarkdownFilename(result.filename);
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass shadow-card overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              result.success ? "bg-cyan/10 text-cyan" : "bg-rose-400/10 text-rose-300"
            }`}
          >
            {result.success ? <FileCheck2 size={16} /> : <AlertTriangle size={16} />}
          </span>
          <div className="min-w-0">
            <p className="truncate font-body text-sm font-medium text-ink2">{result.filename}</p>
            <p className="font-mono text-[11px] text-muted">
              {result.success
                ? `${result.char_count.toLocaleString()} chars · ${result.duration_ms} ms`
                : "Conversion failed"}
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-line">
          {result.success ? (
            <>
              <div className="flex items-center justify-end gap-2 px-4 py-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-cyan/30 hover:text-cyan"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-cyan/30 hover:text-cyan"
                >
                  <Download size={12} />
                  .md
                </button>
              </div>
              <pre className="thin-scroll max-h-72 overflow-auto px-4 pb-4 font-mono text-[12px] leading-relaxed text-ink2/90">
                {result.markdown}
              </pre>
            </>
          ) : (
            <p className="px-4 py-3 font-mono text-[12px] leading-relaxed text-rose-300">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
