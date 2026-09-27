import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  title,
  extra,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  extra?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("panel panel-corners flex flex-col", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3.5 w-[3px] rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
          <h2 className="font-display text-[15px] font-semibold tracking-wide text-foreground">
            {title}
          </h2>
        </div>
        {extra ? (
          <span className="text-[11px] tracking-wide text-muted-foreground">{extra}</span>
        ) : null}
      </header>
      <div className={cn("min-h-0 flex-1 px-4 py-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  unit,
  delta,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
}) {
  return (
    <div className="panel px-3 py-2.5">
      <p className="text-[11px] tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="numeric glow-text text-2xl font-bold text-primary">{value}</span>
        {unit ? <span className="text-[11px] text-muted-foreground">{unit}</span> : null}
      </p>
      {delta ? <p className="mt-0.5 text-[11px] text-accent">{delta}</p> : null}
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  tone = "primary",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "primary" | "accent" | "warning" | "muted";
}) {
  const toneClass = {
    primary: "bg-primary",
    accent: "bg-accent",
    warning: "bg-warning",
    muted: "bg-muted-foreground",
  }[tone];

  return (
    <div className="py-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="numeric text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", toneClass)}
          style={{ width: `${Math.round((value / max) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function AreaTrend({ data }: { data: { h: string; v: number }[] }) {
  const w = 320;
  const h = 110;
  const max = Math.max(...data.map((d) => d.v)) * 1.15;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.v / max) * h;
    return `${x},${y}`;
  });

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h + 16}`} className="h-[132px] w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={0}
            x2={w}
            y1={h * g}
            y2={h * g}
            stroke="var(--color-grid)"
            strokeWidth={1}
          />
        ))}
        <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill="url(#trendFill)" />
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        {data
          .filter((_, i) => i % 2 === 0)
          .map((d) => (
            <span key={d.h}>{d.h}:00</span>
          ))}
      </div>
    </div>
  );
}
