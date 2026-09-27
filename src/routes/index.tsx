import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/campus/Header";
import { CampusModelClient, CesiumSceneClient } from "@/components/campus/ClientVisual";
import { AreaTrend, BarRow, Panel, StatTile } from "@/components/campus/panels";
import {
  accessFlow,
  alarms,
  buildings,
  energyTrend,
  totals,
} from "@/lib/campus-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "智慧园区三维可视化平台 | 数字孪生指挥中心" },
      {
        name: "description",
        content:
          "基于 Cesium 真实影像与 Three.js 模型的园区三维可视化大屏,实时呈现人流、能耗、告警与楼宇运行状态。",
      },
      { property: "og:title", content: "智慧园区三维可视化平台" },
      {
        property: "og:description",
        content: "真实影像三维地球 + 园区楼宇模型,实时监测人流、能耗与告警。",
      },
    ],
  }),
  component: Dashboard,
});

const LEVEL_STYLE: Record<string, string> = {
  严重: "border-destructive/60 text-destructive",
  警告: "border-warning/60 text-warning",
  提示: "border-primary/50 text-primary",
};

function Dashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = buildings.find((b) => b.id === selectedId) ?? null;
  const maxFlow = Math.max(...accessFlow.map((a) => a.value));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="grid flex-1 gap-3 p-3 xl:grid-cols-[320px_minmax(0,1fr)_320px] 2xl:grid-cols-[360px_minmax(0,1fr)_360px]">
        {/* 左列 */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="在园人数" value={totals.people.toLocaleString()} unit="人" delta="↑ 6.4% 同比昨日" />
            <StatTile label="今日能耗" value={(totals.energy / 1000).toFixed(1)} unit="MWh" delta="↓ 2.1% 环比" />
            <StatTile label="平均入驻率" value={`${totals.occupancy}`} unit="%" />
            <StatTile label="在线设备" value={`${totals.online}`} unit={`/ ${totals.devices}`} />
          </div>

          <Panel title="能耗趋势" extra="近 24 小时 · kWh">
            <AreaTrend data={energyTrend} />
          </Panel>

          <Panel title="出入统计" extra="今日累计" className="flex-1">
            {accessFlow.map((a) => (
              <BarRow key={a.label} label={a.label} value={a.value} max={maxFlow} tone={a.tone} />
            ))}
          </Panel>
        </div>

        {/* 中列:三维地球 */}
        <div className="flex min-h-[520px] flex-col gap-3">
          <section className="panel panel-corners relative min-h-[420px] flex-1 overflow-hidden">
            <CesiumSceneClient selectedId={selectedId} onSelect={setSelectedId} />
            <div className="pointer-events-none absolute left-4 top-4 rounded border border-border bg-background/70 px-3 py-2 backdrop-blur">
              <p className="font-display text-sm tracking-wide text-primary">张江科学城 · 创新园区</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                真实卫星影像底图 · 点击楼宇查看详情
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 flex gap-3 text-[11px] text-muted-foreground">
              {[
                { c: "bg-primary", t: "运行正常" },
                { c: "bg-warning", t: "需关注" },
                { c: "bg-destructive", t: "告警" },
              ].map((l) => (
                <span key={l.t} className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-sm", l.c)} />
                  {l.t}
                </span>
              ))}
            </div>
            {selectedId ? (
              <button
                onClick={() => setSelectedId(null)}
                className="absolute right-4 top-4 rounded border border-border bg-background/70 px-3 py-1.5 text-xs text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
              >
                返回全景
              </button>
            ) : null}
          </section>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]">
            <Panel title="楼宇清单" extra={`${buildings.length} 栋`} bodyClassName="p-0">
              <div className="max-h-[220px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-secondary/60 text-muted-foreground backdrop-blur">
                    <tr>
                      {["楼栋", "类型", "在场", "入驻率", "状态"].map((h) => (
                        <th key={h} className="px-4 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {buildings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className={cn(
                          "cursor-pointer border-t border-border/50 transition-colors hover:bg-primary/10",
                          selectedId === b.id && "bg-primary/15",
                        )}
                      >
                        <td className="px-4 py-2 text-foreground">{b.name}</td>
                        <td className="px-4 py-2 text-muted-foreground">{b.type}</td>
                        <td className="numeric px-4 py-2">{b.people}</td>
                        <td className="numeric px-4 py-2">{b.occupancy}%</td>
                        <td className="px-4 py-2">
                          <span
                            className={cn(
                              "rounded border px-1.5 py-0.5 text-[10px]",
                              b.status === "alarm"
                                ? "border-destructive/60 text-destructive"
                                : b.status === "warning"
                                  ? "border-warning/60 text-warning"
                                  : "border-primary/50 text-primary",
                            )}
                          >
                            {b.status === "alarm" ? "告警" : b.status === "warning" ? "关注" : "正常"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="楼宇详情" extra={selected ? selected.id : "未选中"}>
              {selected ? (
                <dl className="space-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">名称</dt>
                    <dd className="mt-0.5 text-sm text-foreground">{selected.name}</dd>
                  </div>
                  {[
                    ["楼层", `${selected.floors} F`],
                    ["在场人数", `${selected.people} 人`],
                    ["今日能耗", `${selected.energy.toLocaleString()} kWh`],
                    ["入驻率", `${selected.occupancy}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-t border-border/40 pt-1.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="numeric text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  在三维地球或园区模型中点击任意楼宇,即可查看该栋的运行指标。
                </p>
              )}
            </Panel>
          </div>
        </div>

        {/* 右列 */}
        <div className="flex flex-col gap-3">
          <Panel
            title="园区楼宇模型"
            extra="可拖拽旋转"
            className="min-h-[300px] flex-1"
            bodyClassName="relative p-0"
          >
            <CampusModelClient selectedId={selectedId} onSelect={setSelectedId} />
          </Panel>

          <Panel title="实时告警" extra="今日 5 条" className="flex-1">
            <ul className="space-y-2">
              {alarms.map((a) => (
                <li
                  key={a.id}
                  className="rounded border border-border/60 bg-secondary/25 px-3 py-2 transition-colors hover:border-primary/60"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px]",
                        LEVEL_STYLE[a.level],
                      )}
                    >
                      {a.level}
                    </span>
                    <span className="numeric text-[11px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground">{a.text}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {a.id} · 区域 {a.area}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </main>
    </div>
  );
}
