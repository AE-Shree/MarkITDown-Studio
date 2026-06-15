"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, FileStack } from "lucide-react";

interface DropzoneProps {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Dropzone({ files, onAdd, onRemove, disabled }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      if (event.dataTransfer.files?.length) {
        onAdd(Array.from(event.dataTransfer.files));
      }
    },
    [onAdd, disabled]
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`gradient-border glass relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-center transition-colors ${
          isDragging ? "bg-surface2/60" : "hover:bg-surface2/40"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files?.length) onAdd(Array.from(e.target.files));
            e.target.value = "";
          }}
        />
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
          <UploadCloud size={22} />
        </span>
        <div>
          <p className="font-display text-base font-medium text-ink2 sm:text-lg">
            Drop files here, or click to browse
          </p>
          <p className="mt-1 font-mono text-xs text-muted">
            PDF, DOCX, PPTX, XLSX, HTML, CSV, images, audio, ZIP &amp; more — stack as many as you like
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="glass rounded-2xl p-3">
          <div className="mb-2 flex items-center gap-2 px-1 font-mono text-xs uppercase tracking-wider text-muted">
            <FileStack size={14} />
            <span>{files.length} file{files.length === 1 ? "" : "s"} queued</span>
          </div>
          <ul className="flex flex-col gap-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-surface2/60"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-body text-sm text-ink2">{file.name}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted">{formatBytes(file.size)}</span>
                </div>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                  }}
                  className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink2 disabled:opacity-50"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
