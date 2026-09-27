import { useEffect, useState } from "react";

const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function Header() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header className="relative flex items-center justify-between overflow-hidden border-b border-border px-6 py-3">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
      <div className="hidden w-64 items-center gap-4 text-xs text-muted-foreground lg:flex">
        <span className="rounded border border-border px-2 py-1">系统运行 132 天</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          数据实时
        </span>
      </div>

      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-[0.18em] text-foreground glow-text lg:text-3xl">
          智慧园区三维可视化平台
        </h1>
        <p className="mt-0.5 text-[11px] tracking-[0.35em] text-muted-foreground">
          SMART CAMPUS DIGITAL TWIN CENTER
        </p>
      </div>

      <div className="w-64 text-right">
        {now ? (
          <>
            <p className="numeric text-lg text-primary">
              {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {now.getFullYear()}-{pad(now.getMonth() + 1)}-{pad(now.getDate())}{" "}
              {WEEK[now.getDay()]}
            </p>
          </>
        ) : (
          <p className="numeric text-lg text-primary">--:--:--</p>
        )}
      </div>
    </header>
  );
}
