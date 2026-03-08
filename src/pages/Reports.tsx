import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
} from "recharts";
import {
  IndianRupee, FileText, AlertTriangle, TrendingUp, Users, CheckCircle2, Clock, UserX,
} from "lucide-react";

type DateRange = "this_week" | "this_month" | "this_quarter" | "custom";

// ── Mock data ──────────────────────────────────────────────────────────────

const revenueMonthly = [
  { month: "Oct", revenue: 820000 },
  { month: "Nov", revenue: 960000 },
  { month: "Dec", revenue: 1100000 },
  { month: "Jan", revenue: 880000 },
  { month: "Feb", revenue: 1250000 },
  { month: "Mar", revenue: 740000 },
];

const funnelData = [
  { stage: "Lead", value: 42, fill: "hsl(222, 47%, 30%)" },
  { stage: "Proposal", value: 28, fill: "hsl(222, 47%, 40%)" },
  { stage: "Negotiating", value: 18, fill: "hsl(222, 47%, 50%)" },
  { stage: "Closed Won", value: 12, fill: "hsl(150, 50%, 40%)" },
  { stage: "Closed Lost", value: 6, fill: "hsl(0, 60%, 50%)" },
];

const teamPerformance = [
  { name: "Priya Sharma", completed: 18, overdue: 2, interactions: 34 },
  { name: "Arjun Kapoor", completed: 14, overdue: 5, interactions: 22 },
  { name: "Meera Patel", completed: 22, overdue: 1, interactions: 41 },
  { name: "Rohan Gupta", completed: 10, overdue: 7, interactions: 15 },
];

const clientActivity = [
  { name: "BrightStar Media", lastActivity: "2026-03-05", daysAgo: 3, retainer: "₹1,20,000" },
  { name: "PixelForge Studios", lastActivity: "2026-02-01", daysAgo: 35, retainer: "₹85,000" },
  { name: "Zenith Brands", lastActivity: "2026-03-07", daysAgo: 1, retainer: "₹2,00,000" },
  { name: "Crescendo Digital", lastActivity: "2026-01-28", daysAgo: 39, retainer: "₹65,000" },
  { name: "NovaAd Co.", lastActivity: "2026-02-04", daysAgo: 32, retainer: "₹1,10,000" },
  { name: "Apex Marketing", lastActivity: "2026-03-06", daysAgo: 2, retainer: "₹1,50,000" },
  { name: "Lunar Creatives", lastActivity: "2026-01-20", daysAgo: 47, retainer: "₹45,000" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const SummaryCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) => (
  <Card className="border-border">
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent || "bg-muted"}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

// ── Component ──────────────────────────────────────────────────────────────

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange>("this_month");

  const totalCollected = 4750000;
  const totalInvoiced = 5800000;
  const totalOverdue = 1050000;

  const totalDeals = funnelData.reduce((s, d) => s + d.value, 0);
  const pipelineValue = 28500000;
  const conversionRate = ((funnelData.find((d) => d.stage === "Closed Won")?.value ?? 0) / totalDeals * 100).toFixed(1);

  const churnRisk = useMemo(() => clientActivity.filter((c) => c.daysAgo >= 30), []);

  const dateLabel: Record<DateRange, string> = {
    this_week: "This Week",
    this_month: "This Month",
    this_quarter: "This Quarter",
    custom: "Custom Range",
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Performance overview &amp; analytics</p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_quarter">This Quarter</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Section 1: Revenue ─────────────────────────────────────────── */}
      <Card className="border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" /> Revenue Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
              label="Total Collected"
              value={fmt(totalCollected)}
              accent="bg-emerald-50"
            />
            <SummaryCard
              icon={<FileText className="h-5 w-5 text-blue-600" />}
              label="Total Invoiced"
              value={fmt(totalInvoiced)}
              accent="bg-blue-50"
            />
            <SummaryCard
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
              label="Total Overdue"
              value={fmt(totalOverdue)}
              accent="bg-red-50"
            />
          </div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Monthly Revenue (Last 6 Months)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueMonthly} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Bar dataKey="revenue" fill="hsl(222, 47%, 25%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Deal Pipeline ───────────────────────────────────── */}
      <Card className="border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" /> Deal Pipeline Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
              label="Total Deals"
              value={String(totalDeals)}
              accent="bg-muted"
            />
            <SummaryCard
              icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
              label="Pipeline Value"
              value={fmt(pipelineValue)}
              accent="bg-emerald-50"
            />
            <SummaryCard
              icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />}
              label="Conversion Rate"
              value={`${conversionRate}%`}
              accent="bg-blue-50"
            />
          </div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Deals by Stage</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)", fontSize: 13 }} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  {funnelData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                  <LabelList position="right" fill="hsl(220, 9%, 46%)" fontSize={12} dataKey="stage" />
                  <LabelList position="center" fill="#fff" fontSize={13} fontWeight={600} dataKey="value" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Team Performance ────────────────────────────────── */}
      <Card className="border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" /> Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Team Member</TableHead>
                <TableHead className="text-center">Tasks Completed</TableHead>
                <TableHead className="text-center">Overdue</TableHead>
                <TableHead className="text-center">Client Interactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamPerformance.map((m) => (
                <TableRow key={m.name}>
                  <TableCell className="pl-6 font-medium text-foreground">{m.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">{m.completed}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`border-0 ${m.overdue > 3 ? "bg-red-50 text-red-700" : "bg-muted text-muted-foreground"}`}>{m.overdue}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{m.interactions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Section 4: Client Activity ─────────────────────────────────── */}
      <Card className="border-border mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <UserX className="h-4 w-4 text-muted-foreground" /> Client Activity
            {churnRisk.length > 0 && (
              <Badge variant="outline" className="ml-2 text-amber-700 border-amber-300 bg-amber-50 text-[10px]">
                {churnRisk.length} churn risk
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Client</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Monthly Retainer</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientActivity
                .sort((a, b) => b.daysAgo - a.daysAgo)
                .map((c) => {
                  const atRisk = c.daysAgo >= 30;
                  return (
                    <TableRow key={c.name} className={atRisk ? "bg-amber-50/50" : ""}>
                      <TableCell className={`pl-6 font-medium ${atRisk ? "text-amber-800" : "text-foreground"}`}>
                        {c.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{c.lastActivity}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{c.retainer}</TableCell>
                      <TableCell className="text-right pr-6">
                        {atRisk ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[10px]">
                            <Clock className="h-3 w-3 mr-1" /> {c.daysAgo}d inactive
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0 text-[10px]">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
