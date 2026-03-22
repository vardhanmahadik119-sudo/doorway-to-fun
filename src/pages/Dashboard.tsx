import { useMemo, useState } from "react";
import { format, subDays, subMonths, eachDayOfInterval, eachWeekOfInterval, startOfMonth, endOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  LineChart as LineChartIcon,
  BarChart3,
  Filter,
  LayoutGrid,
  CalendarRange,
} from "lucide-react";

type DatePreset = "week" | "month" | "quarter" | "custom";

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatInrCompact = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: n >= 100000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);

/* ─── Revenue: invoice summaries by preset (₹) ─── */
const invoiceSummaryByPreset: Record<
  Exclude<DatePreset, "custom">,
  { sent: number; paid: number; overdue: number }
> = {
  week: { sent: 8_40_000, paid: 6_15_000, overdue: 1_25_000 },
  month: { sent: 42_80_000, paid: 35_20_000, overdue: 4_35_000 },
  quarter: { sent: 1_18_50_000, paid: 98_40_000, overdue: 12_60_000 },
};

function scaleInvoiceSummary(
  base: { sent: number; paid: number; overdue: number },
  factor: number,
) {
  const f = Math.max(0.15, Math.min(2.5, factor));
  return {
    sent: Math.round(base.sent * f),
    paid: Math.round(base.paid * f),
    overdue: Math.round(base.overdue * f),
  };
}

function buildRevenuePoints(
  preset: DatePreset,
  custom: DateRange | undefined,
): { label: string; revenue: number }[] {
  const today = new Date();

  if (preset === "week") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
      label,
      revenue: 65_000 + i * 18_000 + (i % 3) * 12_000,
    }));
  }

  if (preset === "month") {
    return ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      revenue: 8_20_000 + i * 95_000 + (i % 2) * 40_000,
    }));
  }

  if (preset === "quarter") {
    return ["Jan", "Feb", "Mar"].map((label, i) => ({
      label,
      revenue: 36_00_000 + i * 4_20_000,
    }));
  }

  const from = custom?.from ?? subDays(today, 14);
  const to = custom?.to ?? today;
  const days = eachDayOfInterval({ start: from, end: to });
  if (days.length <= 14) {
    return days.map((d, i) => ({
      label: format(d, "d MMM"),
      revenue: 72_000 + (i * 11_700) % 95_000 + (i % 4) * 8_000,
    }));
  }
  const weeks = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 });
  return weeks.map((w, i) => ({
    label: format(w, "d MMM"),
    revenue: 4_80_000 + i * 62_000 + (i % 3) * 35_000,
  }));
}

function revenueTrendUp(series: { revenue: number }[]): boolean {
  if (series.length < 2) return true;
  const mid = Math.floor(series.length / 2);
  const a = series.slice(0, mid);
  const b = series.slice(mid);
  const avgA = a.reduce((s, p) => s + p.revenue, 0) / a.length;
  const avgB = b.reduce((s, p) => s + p.revenue, 0) / b.length;
  return avgB >= avgA;
}

function customRangeFactor(from: Date, to: Date): number {
  const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000));
  return days / 30;
}

/* ─── Pipeline ─── */
const pipelineStages = [
  {
    key: "lead",
    label: "Lead",
    count: 18,
    value: 42_50_000,
    conversionNext: 61,
    funnelFill: "#1e3a5f",
  },
  {
    key: "proposal",
    label: "Proposal Sent",
    count: 11,
    value: 38_20_000,
    conversionNext: 58,
    funnelFill: "#2563eb",
  },
  {
    key: "negotiating",
    label: "Negotiating",
    count: 7,
    value: 31_60_000,
    conversionNext: 64,
    funnelFill: "#3b82f6",
  },
  {
    key: "won",
    label: "Closed Won",
    count: 5,
    value: 24_80_000,
    conversionNext: null as number | null,
    funnelFill: "#16a34a",
  },
  {
    key: "lost",
    label: "Closed Lost",
    count: 4,
    value: 9_40_000,
    conversionNext: null,
    funnelFill: "#94a3b8",
  },
] as const;

type StageKey = (typeof pipelineStages)[number]["key"];

const kanbanDeals: { id: string; name: string; value: number; stage: StageKey }[] = [
  { id: "d1", name: "Brightline Foods — H2 retainer", value: 18_50_000, stage: "negotiating" },
  { id: "d2", name: "Vertex Labs — performance", value: 12_40_000, stage: "proposal" },
  { id: "d3", name: "Northwind — brand refresh", value: 8_90_000, stage: "lead" },
  { id: "d4", name: "Harbor & Co. — launch sprint", value: 6_20_000, stage: "lead" },
  { id: "d5", name: "Monsoon Digital — always-on", value: 22_00_000, stage: "won" },
  { id: "d6", name: "Catalyst Sports — TV + digital", value: 15_60_000, stage: "proposal" },
  { id: "d7", name: "Pixel Grove — social package", value: 4_80_000, stage: "lead" },
  { id: "d8", name: "Blue Peak — fintech compliance", value: 28_00_000, stage: "negotiating" },
  { id: "d9", name: "Oak Street — local retail", value: 3_20_000, stage: "lost" },
  { id: "d10", name: "Silverline — event series", value: 5_50_000, stage: "lost" },
  { id: "d11", name: "Coastal Media — podcast", value: 2_90_000, stage: "proposal" },
  { id: "d12", name: "Urban Rail Ads — OOH", value: 9_10_000, stage: "lead" },
  { id: "d13", name: "Helix Bio — webinar funnel", value: 7_70_000, stage: "negotiating" },
  { id: "d14", name: "Metro Finance — content", value: 11_20_000, stage: "won" },
  { id: "d15", name: "Studio 9 — pilot", value: 1_80_000, stage: "lost" },
];

const funnelChartData = pipelineStages.map((s) => ({
  name: s.label,
  value: s.count,
  fill: s.funnelFill,
}));

/* ─── Client health: task stats & retention by preset ─── */
const healthMetricsByPreset: Record<
  Exclude<DatePreset, "custom">,
  { retention: number; churn: number }
> = {
  week: { retention: 96.2, churn: 3.8 },
  month: { retention: 93.5, churn: 6.5 },
  quarter: { retention: 91.0, churn: 9.0 },
};

const clientTaskRowsByPreset: Record<
  Exclude<DatePreset, "custom">,
  { client: string; accountManager: string; completed: number; pending: number }[]
> = {
  week: [
    { client: "Brightline Foods", accountManager: "Alex Kim", completed: 14, pending: 2 },
    { client: "Vertex Labs", accountManager: "Jordan Lee", completed: 6, pending: 8 },
    { client: "Northwind Media", accountManager: "Sam Rivera", completed: 11, pending: 3 },
    { client: "Harbor & Co.", accountManager: "Alex Kim", completed: 9, pending: 4 },
    { client: "Blue Peak Fintech", accountManager: "Alex Kim", completed: 16, pending: 1 },
    { client: "Oak Street Retail", accountManager: "Jordan Lee", completed: 3, pending: 11 },
    { client: "Silverline Hospitality", accountManager: "Jordan Lee", completed: 1, pending: 6 },
    { client: "Pixel Grove Studios", accountManager: "Sam Rivera", completed: 10, pending: 2 },
  ],
  month: [
    { client: "Brightline Foods", accountManager: "Alex Kim", completed: 52, pending: 6 },
    { client: "Vertex Labs", accountManager: "Jordan Lee", completed: 38, pending: 14 },
    { client: "Northwind Media", accountManager: "Sam Rivera", completed: 44, pending: 9 },
    { client: "Harbor & Co.", accountManager: "Alex Kim", completed: 41, pending: 7 },
    { client: "Blue Peak Fintech", accountManager: "Alex Kim", completed: 58, pending: 4 },
    { client: "Oak Street Retail", accountManager: "Jordan Lee", completed: 22, pending: 28 },
    { client: "Silverline Hospitality", accountManager: "Jordan Lee", completed: 8, pending: 19 },
    { client: "Pixel Grove Studios", accountManager: "Sam Rivera", completed: 47, pending: 5 },
    { client: "Monsoon Digital", accountManager: "Sam Rivera", completed: 51, pending: 3 },
    { client: "Catalyst Sports", accountManager: "Alex Kim", completed: 49, pending: 5 },
  ],
  quarter: [
    { client: "Brightline Foods", accountManager: "Alex Kim", completed: 156, pending: 12 },
    { client: "Vertex Labs", accountManager: "Jordan Lee", completed: 118, pending: 32 },
    { client: "Northwind Media", accountManager: "Sam Rivera", completed: 142, pending: 18 },
    { client: "Harbor & Co.", accountManager: "Alex Kim", completed: 128, pending: 15 },
    { client: "Blue Peak Fintech", accountManager: "Alex Kim", completed: 168, pending: 9 },
    { client: "Oak Street Retail", accountManager: "Jordan Lee", completed: 64, pending: 58 },
    { client: "Silverline Hospitality", accountManager: "Jordan Lee", completed: 24, pending: 48 },
    { client: "Pixel Grove Studios", accountManager: "Sam Rivera", completed: 139, pending: 11 },
    { client: "Monsoon Digital", accountManager: "Sam Rivera", completed: 151, pending: 8 },
    { client: "Catalyst Sports", accountManager: "Alex Kim", completed: 148, pending: 10 },
  ],
};

function interpolateTasks(
  rows: { client: string; accountManager: string; completed: number; pending: number }[],
  factor: number,
) {
  const f = Math.max(0.25, Math.min(3, factor));
  return rows.map((r) => ({
    ...r,
    completed: Math.max(0, Math.round(r.completed * f)),
    pending: Math.max(0, Math.round(r.pending * f)),
  }));
}

function completionRate(completed: number, pending: number): number {
  const t = completed + pending;
  if (t === 0) return 1;
  return completed / t;
}

type HealthLabel = "Healthy" | "At risk" | "Churned";

function healthFromRate(rate: number): HealthLabel {
  if (rate >= 0.75) return "Healthy";
  if (rate >= 0.4) return "At risk";
  return "Churned";
}

const healthBadgeClass: Record<HealthLabel, string> = {
  Healthy: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "At risk": "bg-amber-50 text-amber-900 border-amber-200",
  Churned: "bg-red-50 text-red-800 border-red-200",
};

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background px-2.5 py-1.5 text-xs shadow-md">
      <span className="font-medium tabular-nums">{formatInr(payload[0].value)}</span>
    </div>
  );
};

const Dashboard = () => {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [revenuePreset, setRevenuePreset] = useState<DatePreset>("month");
  const [revenueCustom, setRevenueCustom] = useState<DateRange | undefined>(() => ({
    from: subDays(new Date(), 14),
    to: new Date(),
  }));

  const [pipelineView, setPipelineView] = useState<"funnel" | "kanban">("funnel");

  const [healthPreset, setHealthPreset] = useState<DatePreset>("month");
  const [healthCustom, setHealthCustom] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(new Date()),
  }));

  const revenueSeries = useMemo(
    () => buildRevenuePoints(revenuePreset, revenueCustom),
    [revenuePreset, revenueCustom],
  );

  const trendUp = useMemo(() => revenueTrendUp(revenueSeries), [revenueSeries]);
  const chartColor = trendUp ? "#16a34a" : "#dc2626";

  const invoiceSummary = useMemo(() => {
    if (revenuePreset === "custom" && revenueCustom?.from && revenueCustom?.to) {
      const f = customRangeFactor(revenueCustom.from, revenueCustom.to);
      return scaleInvoiceSummary(invoiceSummaryByPreset.month, f);
    }
    if (revenuePreset === "custom") return invoiceSummaryByPreset.month;
    return invoiceSummaryByPreset[revenuePreset];
  }, [revenuePreset, revenueCustom]);

  const healthRows = useMemo(() => {
    if (healthPreset === "custom" && healthCustom?.from && healthCustom?.to) {
      const days = Math.max(
        1,
        Math.ceil((healthCustom.to.getTime() - healthCustom.from.getTime()) / 86400000),
      );
      const f = days / 30;
      return interpolateTasks(clientTaskRowsByPreset.month, f);
    }
    if (healthPreset === "custom") return clientTaskRowsByPreset.month;
    return clientTaskRowsByPreset[healthPreset];
  }, [healthPreset, healthCustom]);

  const healthKpis = useMemo(() => {
    if (healthPreset === "custom" && healthCustom?.from && healthCustom?.to) {
      const f = customRangeFactor(healthCustom.from, healthCustom.to);
      const base = healthMetricsByPreset.month;
      const churn = Math.min(22, Math.max(2, base.churn * (0.88 + Math.min(f, 1.2) * 0.06)));
      return { retention: Math.round((100 - churn) * 10) / 10, churn: Math.round(churn * 10) / 10 };
    }
    if (healthPreset === "custom") return healthMetricsByPreset.month;
    return healthMetricsByPreset[healthPreset];
  }, [healthPreset, healthCustom]);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-10 pb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Founder dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AdFlow CRM — revenue, pipeline, and client health at a glance.
          </p>
        </div>

        {/* ── Section 1: Revenue ── */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Revenue
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <ToggleGroup
                type="single"
                value={chartType}
                onValueChange={(v) => v && setChartType(v as "line" | "bar")}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <ToggleGroupItem value="line" aria-label="Line chart" className="gap-1.5 px-3">
                  <LineChartIcon className="h-3.5 w-3.5" />
                  Line
                </ToggleGroupItem>
                <ToggleGroupItem value="bar" aria-label="Bar chart" className="gap-1.5 px-3">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Bar
                </ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={revenuePreset}
                onValueChange={(v) => v && setRevenuePreset(v as DatePreset)}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <ToggleGroupItem value="week" className="text-xs sm:text-sm">
                  This week
                </ToggleGroupItem>
                <ToggleGroupItem value="month" className="text-xs sm:text-sm">
                  This month
                </ToggleGroupItem>
                <ToggleGroupItem value="quarter" className="text-xs sm:text-sm">
                  This quarter
                </ToggleGroupItem>
                <ToggleGroupItem value="custom" className="text-xs sm:text-sm">
                  Custom
                </ToggleGroupItem>
              </ToggleGroup>
              {revenuePreset === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <CalendarRange className="h-3.5 w-3.5" />
                      {revenueCustom?.from && revenueCustom?.to
                        ? `${format(revenueCustom.from, "d MMM")} – ${format(revenueCustom.to, "d MMM yyyy")}`
                        : "Select range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={revenueCustom}
                      onSelect={setRevenueCustom}
                      defaultMonth={revenueCustom?.from}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <Card className="shadow-none border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex h-2 w-2 rounded-full",
                    trendUp ? "bg-emerald-500" : "bg-red-500",
                  )}
                />
                {trendUp ? "Revenue trending up" : "Revenue trending down"} — chart uses{" "}
                {trendUp ? "green" : "red"} for the series.
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatInrCompact(Number(v))}
                        width={72}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartColor}
                        strokeWidth={2}
                        dot={{ fill: chartColor, r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatInrCompact(Number(v))}
                        width={72}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="revenue" fill={chartColor} radius={[4, 4, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-6">
                {(
                  [
                    { label: "Invoices sent", value: invoiceSummary.sent },
                    { label: "Invoices paid", value: invoiceSummary.paid },
                    { label: "Invoices overdue", value: invoiceSummary.overdue },
                  ] as const
                ).map((card) => (
                  <div
                    key={card.label}
                    className="rounded-lg border bg-muted/30 px-4 py-3 flex flex-col gap-1"
                  >
                    <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                    <span className="text-lg font-semibold tabular-nums tracking-tight">
                      {formatInr(card.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Section 2: Pipeline ── */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Pipeline overview
            </h2>
            <ToggleGroup
              type="single"
              value={pipelineView}
              onValueChange={(v) => v && setPipelineView(v as "funnel" | "kanban")}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="funnel" className="gap-1.5 px-3">
                <Filter className="h-3.5 w-3.5" />
                Funnel
              </ToggleGroupItem>
              <ToggleGroupItem value="kanban" className="gap-1.5 px-3">
                <LayoutGrid className="h-3.5 w-3.5" />
                Kanban
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {pipelineView === "funnel" ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <Card className="shadow-none border lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Deal funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart margin={{ top: 16, right: 48, bottom: 16, left: 16 }}>
                        <Tooltip
                          formatter={(value: number) => [`${value} deals`, "Count"]}
                          labelFormatter={(name) => name}
                        />
                        <Funnel dataKey="value" data={funnelChartData} isAnimationActive>
                          <LabelList
                            position="right"
                            fill="hsl(var(--foreground))"
                            stroke="none"
                            fontSize={11}
                            formatter={(v: number) => `${v}`}
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-none border lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Stages & conversion</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stage</TableHead>
                        <TableHead className="text-right">Deals</TableHead>
                        <TableHead className="text-right">Total value</TableHead>
                        <TableHead className="text-right">To next stage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pipelineStages.map((s, i) => (
                        <TableRow key={s.key}>
                          <TableCell className="font-medium">{s.label}</TableCell>
                          <TableCell className="text-right tabular-nums">{s.count}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatInr(s.value)}</TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">
                            {s.conversionNext != null && pipelineStages[i + 1]
                              ? `${s.conversionNext}% → ${pipelineStages[i + 1].label}`
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              {pipelineStages.map((stage) => {
                const deals = kanbanDeals.filter((d) => d.stage === stage.key);
                return (
                  <Card key={stage.key} className="shadow-none border flex flex-col min-h-[280px]">
                    <CardHeader className="pb-2 space-y-1">
                      <CardTitle className="text-sm font-semibold leading-tight">{stage.label}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {deals.length} deals · {formatInr(deals.reduce((s, d) => s + d.value, 0))}
                      </p>
                      {stage.conversionNext != null && (
                        <p className="text-[11px] text-muted-foreground">
                          {stage.conversionNext}% move to next stage
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2 overflow-y-auto max-h-[220px] pt-0">
                      {deals.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">No deals</p>
                      ) : (
                        deals.map((d) => (
                          <div
                            key={d.id}
                            className="rounded-md border bg-background px-2.5 py-2 text-xs"
                          >
                            <p className="font-medium text-foreground leading-snug">{d.name}</p>
                            <p className="text-muted-foreground mt-1 tabular-nums">{formatInr(d.value)}</p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Section 3: Client health ── */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Client health
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <ToggleGroup
                type="single"
                value={healthPreset}
                onValueChange={(v) => v && setHealthPreset(v as DatePreset)}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="week" className="text-xs sm:text-sm">
                  This week
                </ToggleGroupItem>
                <ToggleGroupItem value="month" className="text-xs sm:text-sm">
                  This month
                </ToggleGroupItem>
                <ToggleGroupItem value="quarter" className="text-xs sm:text-sm">
                  This quarter
                </ToggleGroupItem>
                <ToggleGroupItem value="custom" className="text-xs sm:text-sm">
                  Custom
                </ToggleGroupItem>
              </ToggleGroup>
              {healthPreset === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <CalendarRange className="h-3.5 w-3.5" />
                      {healthCustom?.from && healthCustom?.to
                        ? `${format(healthCustom.from, "d MMM")} – ${format(healthCustom.to, "d MMM yyyy")}`
                        : "Select range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={healthCustom}
                      onSelect={setHealthCustom}
                      defaultMonth={healthCustom?.from}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-none border">
              <CardContent className="pt-6 pb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Client retention rate
                </p>
                <p className="text-4xl font-semibold tracking-tight text-foreground mt-2 tabular-nums">
                  {healthKpis.retention}%
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none border">
              <CardContent className="pt-6 pb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Churn rate
                </p>
                <p className="text-4xl font-semibold tracking-tight text-foreground mt-2 tabular-nums">
                  {healthKpis.churn}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-none border">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-semibold">Tasks by client</CardTitle>
              <p className="text-xs text-muted-foreground font-normal">
                Health is derived from task completion rate for the selected period.
              </p>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Account manager</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead>Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthRows.map((row) => {
                    const rate = completionRate(row.completed, row.pending);
                    const health = healthFromRate(rate);
                    return (
                      <TableRow key={row.client}>
                        <TableCell className="font-medium">{row.client}</TableCell>
                        <TableCell className="text-muted-foreground">{row.accountManager}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.completed}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.pending}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] font-normal", healthBadgeClass[health])}>
                            {health}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
