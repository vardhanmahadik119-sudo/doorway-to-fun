import { useState } from "react";
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
  Legend,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Filter,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Apr", revenue: 1850000, target: 2000000 },
  { month: "May", revenue: 2100000, target: 2100000 },
  { month: "Jun", revenue: 1980000, target: 2200000 },
  { month: "Jul", revenue: 2350000, target: 2300000 },
  { month: "Aug", revenue: 2600000, target: 2400000 },
  { month: "Sep", revenue: 2450000, target: 2500000 },
  { month: "Oct", revenue: 2800000, target: 2600000 },
  { month: "Nov", revenue: 3100000, target: 2800000 },
  { month: "Dec", revenue: 3350000, target: 3000000 },
  { month: "Jan", revenue: 3200000, target: 3200000 },
  { month: "Feb", revenue: 3580000, target: 3400000 },
  { month: "Mar", revenue: 4280000, target: 3600000 },
];

const invoiceStats = [
  { label: "Invoices Sent", amount: 4280000, icon: IndianRupee, color: "blue", trend: "+18%", trendUp: true },
  { label: "Invoices Paid", amount: 3520000, icon: CheckCircle2, color: "green", trend: "+22%", trendUp: true },
  { label: "Invoices Overdue", amount: 435000, icon: AlertCircle, color: "red", trend: "-5%", trendUp: false },
];

const pipelineStages = [
  { name: "Lead", deals: 18, value: 4250000, conversion: 61, fill: "#3b82f6" },
  { name: "Proposal Sent", deals: 11, value: 2600000, conversion: 72, fill: "#8b5cf6" },
  { name: "Negotiating", deals: 8, value: 1875000, conversion: 75, fill: "#f59e0b" },
  { name: "Closed Won", deals: 6, value: 1410000, conversion: null, fill: "#10b981" },
  { name: "Closed Lost", deals: 4, value: 940000, conversion: null, fill: "#ef4444" },
];

const clientHealthData = [
  {
    name: "BrightStar Media",
    manager: "Priya Sharma",
    completed: 24,
    pending: 3,
    health: "Healthy" as const,
  },
  {
    name: "PixelForge Studios",
    manager: "Rahul Mehta",
    completed: 18,
    pending: 7,
    health: "At Risk" as const,
  },
  {
    name: "Zenith Brands",
    manager: "Ananya Iyer",
    completed: 31,
    pending: 2,
    health: "Healthy" as const,
  },
  {
    name: "Crescendo Digital",
    manager: "Vikram Nair",
    completed: 9,
    pending: 12,
    health: "Critical" as const,
  },
  {
    name: "NovaAd Co.",
    manager: "Deepika Rao",
    completed: 22,
    pending: 4,
    health: "Healthy" as const,
  },
];

const kanbanDeals: Record<string, { client: string; value: number }[]> = {
  Lead: [
    { client: "Apex Ventures", value: 850000 },
    { client: "SkyLine Corp", value: 620000 },
    { client: "Orbit Media", value: 480000 },
  ],
  "Proposal Sent": [
    { client: "BrightStar Media", value: 940000 },
    { client: "Fusion Labs", value: 720000 },
  ],
  Negotiating: [
    { client: "Zenith Brands", value: 1100000 },
    { client: "NovaTech", value: 775000 },
  ],
  "Closed Won": [
    { client: "PixelForge Studios", value: 550000 },
    { client: "ClearPath Inc.", value: 860000 },
  ],
  "Closed Lost": [
    { client: "Meridian Co.", value: 430000 },
    { client: "BluePeak Fintech", value: 510000 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

const formatInrFull = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const healthConfig = {
  Healthy: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "At Risk": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const kanbanColors: Record<string, string> = {
  Lead: "#3b82f6",
  "Proposal Sent": "#8b5cf6",
  Negotiating: "#f59e0b",
  "Closed Won": "#10b981",
  "Closed Lost": "#ef4444",
};

type DateFilter = "week" | "month" | "quarter" | "custom";
type ChartType = "line" | "bar";
type PipelineView = "funnel" | "kanban";

// ─── Component ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [pipelineView, setPipelineView] = useState<PipelineView>("funnel");

  const funnelData = pipelineStages.map((s) => ({
    value: s.deals,
    name: s.name,
    fill: s.fill,
  }));

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-8 pb-12">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Founder dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Revenue, pipeline, and client health at a glance</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chart toggle */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setChartType("line")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  chartType === "line" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  chartType === "bar" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Bar
              </button>
            </div>

            {/* Date filters */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
              {(["week", "month", "quarter"] as DateFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                    dateFilter === f ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f === "week" ? "This week" : f === "month" ? "This month" : "This quarter"}
                </button>
              ))}
              <button
                onClick={() => setDateFilter("custom")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1 ${
                  dateFilter === "custom" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-3 w-3" />
                Custom
              </button>
            </div>
          </div>
        </div>

        {/* ── Revenue chart ──────────────────────────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">Revenue overview</CardTitle>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 mr-3">Actual</span>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500">Target</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatInr(v)}
                    />
                    <Tooltip formatter={(v: number) => [formatInrFull(v)]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#d1d5db"
                      strokeWidth={1.5}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Target"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatInr(v)}
                    />
                    <Tooltip formatter={(v: number) => [formatInrFull(v)]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} name="Revenue" />
                    <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={36} name="Target" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Invoice stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              {invoiceStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${
                      stat.color === "blue"
                        ? "bg-blue-50"
                        : stat.color === "green"
                          ? "bg-emerald-50"
                          : "bg-red-50"
                    }`}
                  >
                    <stat.icon
                      className={`h-5 w-5 ${
                        stat.color === "blue"
                          ? "text-blue-600"
                          : stat.color === "green"
                            ? "text-emerald-600"
                            : "text-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">{formatInrFull(stat.amount)}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {stat.trendUp ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {stat.trend} vs last period
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Pipeline overview ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Pipeline overview</h2>
              <p className="text-sm text-gray-500">Deal stages and conversion rates</p>
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => setPipelineView("funnel")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pipelineView === "funnel" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                Funnel
              </button>
              <button
                onClick={() => setPipelineView("kanban")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pipelineView === "kanban" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Kanban
              </button>
            </div>
          </div>

          {pipelineView === "funnel" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funnel chart */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Deal funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value} deals`, name]}
                        />
                        <Funnel dataKey="value" data={funnelData} isAnimationActive>
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                          <LabelList
                            position="right"
                            fill="#374151"
                            stroke="none"
                            dataKey="name"
                            style={{ fontSize: 12, fontWeight: 500 }}
                          />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline table */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">Stage breakdown</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2.5 px-6 font-medium text-gray-500 text-xs uppercase tracking-wide">
                          Stage
                        </th>
                        <th className="text-right py-2.5 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">
                          Deals
                        </th>
                        <th className="text-right py-2.5 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">
                          Total Value
                        </th>
                        <th className="text-right py-2.5 px-6 font-medium text-gray-500 text-xs uppercase tracking-wide">
                          Conversion
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipelineStages.map((stage, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-2.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.fill }} />
                              <span className="font-medium text-gray-900">{stage.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-700">{stage.deals}</td>
                          <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                            {formatInrFull(stage.value)}
                          </td>
                          <td className="py-3 px-6 text-right">
                            {stage.conversion != null ? (
                              <span className="text-gray-700 font-medium">{stage.conversion}% →</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Kanban board */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
              {Object.entries(kanbanDeals).map(([stage, deals]) => (
                <div key={stage} className="min-w-[180px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: kanbanColors[stage] }}
                    />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stage}</span>
                    <span className="ml-auto text-xs text-gray-400 font-medium">{deals.length}</span>
                  </div>
                  <div className="space-y-2">
                    {deals.map((deal, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900 leading-tight">{deal.client}</p>
                        <p className="text-xs text-gray-500 mt-1 tabular-nums">{formatInrFull(deal.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Client health ──────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Client health</h2>
              <p className="text-sm text-gray-500">Retention, churn, and task status per client</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xl font-bold text-gray-900">93.5%</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Retention rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-xl font-bold text-gray-900">6.5%</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Churn rate</p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Account Manager
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      <div className="flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Completed
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        Pending
                      </div>
                    </th>
                    <th className="text-right py-3 px-6 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientHealthData.map((client, i) => {
                    const cfg = healthConfig[client.health];
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Users className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium text-gray-900">{client.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{client.manager}</td>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <span className="text-gray-900 font-medium">{client.completed}</span>
                          <span className="text-gray-400 ml-1">tasks</span>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums">
                          <span className={client.pending > 8 ? "text-red-600 font-medium" : "text-gray-900 font-medium"}>
                            {client.pending}
                          </span>
                          <span className="text-gray-400 ml-1">tasks</span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {client.health}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
