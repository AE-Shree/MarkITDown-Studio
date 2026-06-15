"use client";

import { useRef } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode2,
  Image as ImageIcon,
  FileType2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type SourceCard = {
  label: string;
  icon: LucideIcon;
  top: string;
  left: string;
  z: number;
  rotate: number;
  delay: string;
  ring: string;
  text: string;
};

const SOURCE_CARDS: SourceCard[] = [
  { label: ".pdf", icon: FileText, top: "4%", left: "2%", z: 50, rotate: -8, delay: "0s", ring: "ring-rose-400/30", text: "text-rose-300" },
  { label: ".pptx", icon: Presentation, top: "2%", left: "34%", z: 70, rotate: 9, delay: "1.2s", ring: "ring-amber-400/30", text: "text-amber-300" },
  { label: ".html", icon: FileCode2, top: "34%", left: "0%", z: -10, rotate: -11, delay: "2.4s", ring: "ring-orange-400/30", text: "text-orange-300" },
  { label: ".docx", icon: FileType2, top: "62%", left: "8%", z: 20, rotate: 6, delay: "0.6s", ring: "ring-sky-400/30", text: "text-sky-300" },
  { label: ".xlsx", icon: FileSpreadsheet, top: "78%", left: "36%", z: -25, rotate: -5, delay: "1.8s", ring: "ring-emerald-400/30", text: "text-emerald-300" },
  { label: ".png", icon: ImageIcon, top: "40%", left: "36%", z: 35, rotate: 4, delay: "3s", ring: "ring-violet-400/30", text: "text-violet-300" },
];

// Connector endpoints, expressed in the same 0-100 space as the card
// percentages above, used to draw the flow lines toward the output card.
const LINES: Array<[number, number]> = [
  [10, 12],
  [44, 10],
  [8, 42],
  [18, 70],
  [46, 86],
  [46, 50],
];

const OUTPUT_TARGET: [number, number] = [78, 48];

export default function FormatStack3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    const group = groupRef.current;
    if (!stage || !group) return;

    const bounds = stage.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width; // 0..1
    const py = (event.clientY - bounds.top) / bounds.height; // 0..1

    const rotateY = (px - 0.5) * 18; // left/right tilt
    const rotateX = (0.5 - py) * 14; // up/down tilt

    group.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  function handleMouseLeave() {
    const group = groupRef.current;
    if (!group) return;
    group.style.transform = "rotateX(4deg) rotateY(-6deg)";
  }

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="stage relative h-[360px] w-full sm:h-[420px] lg:h-[460px]"
    >
      <div
        ref={groupRef}
        className="tilt-card absolute inset-0"
        style={{ transform: "rotateX(4deg) rotateY(-6deg)" }}
      >
        {/* Connector lines, drawn in the same plane as the cards */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ transform: "translateZ(0px)" }}
        >
          {LINES.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x} ${y} C ${(x + OUTPUT_TARGET[0]) / 2} ${y}, ${(x + OUTPUT_TARGET[0]) / 2} ${OUTPUT_TARGET[1]}, ${OUTPUT_TARGET[0] - 6} ${OUTPUT_TARGET[1]}`}
              fill="none"
              stroke="rgba(94, 234, 212, 0.35)"
              strokeWidth="0.35"
              className="flow-line"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>

        {/* Source format cards */}
        {SOURCE_CARDS.map(({ label, icon: Icon, top, left, z, rotate, delay, ring, text }) => (
          <div
            key={label}
            className="animate-float absolute"
            style={{ top, left, animationDelay: delay }}
          >
            <div
              className={`tilt-card glass flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl ring-1 ${ring} shadow-card sm:h-20 sm:w-20`}
              style={{ transform: `translateZ(${z}px) rotate(${rotate}deg)` }}
            >
              <Icon className={text} size={20} />
              <span className="font-mono text-[10px] text-muted sm:text-xs">{label}</span>
            </div>
          </div>
        ))}

        {/* Output card — the "one format" everything resolves to */}
        <div
          className="absolute"
          style={{ top: `${OUTPUT_TARGET[1] - 14}%`, left: `${OUTPUT_TARGET[0] - 12}%` }}
        >
          <div
            className="tilt-card glass shadow-glow flex w-44 flex-col gap-2 rounded-2xl border border-cyan/20 p-4 sm:w-56"
            style={{ transform: "translateZ(90px)" }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                <Sparkles size={16} />
              </span>
              <span className="font-display text-sm font-medium text-ink2 sm:text-base">Markdown</span>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-muted sm:text-xs">
              Headings, tables, lists &amp; links — preserved as clean <span className="text-cyan">.md</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
