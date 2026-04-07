import { useMemo, useState } from "react";
import { format, subDays, eachDayOfInterval, eachWeekOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Line,
  ComposedChart,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  FileText,
  Save,
  Upload,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

type DatePreset = "last_7_days" | "this_month" | "last_month" | "custom";
type Platform = "overall" | "meta_ads" | "google_ads" | "google_analytics" | "seo" | "linkedin_ads";
type Client = {
  id: string;
  name: string;
  totalSpend: number;
  totalLeads: number;
  cpl: number;
};

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatNumber = (n: number): string =>
  new Intl.NumberFormat("en-IN").format(n);

const clients: Client[] = [
  { id: "brightline", name: "Brightline Foods", totalSpend: 450000, totalLeads: 180, cpl: 2500 },
  { id: "vertex", name: "Vertex Labs", totalSpend: 320000, totalLeads: 120, cpl: 2667 },
  { id: "northwind", name: "Northwind Media", totalSpend: 300000, totalLeads: 100, cpl: 3000 },
  { id: "harbor", name: "Harbor & Co.", totalSpend: 420000, totalLeads: 160, cpl: 2625 },
  { id: "bluepeak", name: "Blue Peak Fintech", totalSpend: 550000, totalLeads: 220, cpl: 2500 },
];

const platformSpendData = [
  { name: "Meta Ads", value: 45, fill: "#1877f2" },
  { name: "Google Ads", value: 30, fill: "#4285f4" },
  { name: "LinkedIn Ads", value: 10, fill: "#0077b5" },
  { name: "SEO", value: 8, fill: "#10b981" },
  { name: "Google Analytics", value: 7, fill: "#6b7280" },
];

const platformPerformanceData: Record<Platform, {
  totalSpend: number; totalLeads: number; cpl: number;
  reach?: number; clicks?: number; conversions?: number; sessions?: number;
  organicClicks?: number; engagementRate?: number; qualityScore?: number;
  roas?: number; bounceRate?: number; topKeywordPosition?: number;
  domainAuthority?: number; costPerLead?: number; goalCompletions?: number; cpc?: number;
}> = {
  overall: { totalSpend: 450000, totalLeads: 180, cpl: 2500 },
  meta_ads: { totalSpend: 202500, totalLeads: 81, cpl: 2500, reach: 2450000, engagementRate: 2.8, roas: 3.8 },
  google_ads: { totalSpend: 135000, totalLeads: 54, cpl: 2500, clicks: 5400, conversions: 54, qualityScore: 7.2, roas: 4.1, cpc: 25 },
  google_analytics: { totalSpend: 0, totalLeads: 45, cpl: 0, sessions: 45000, bounceRate: 42, goalCompletions: 23 },
  seo: { totalSpend: 36000, totalLeads: 27, cpl: 1333, organicClicks: 27000, topKeywordPosition: 3, domainAuthority: 45 },
  linkedin_ads: { totalSpend: 45000, totalLeads: 18, cpl: 2500, clicks: 1800, engagementRate: 2.8, costPerLead: 2500 },
};

const platformLeadsData: Record<Platform, { date: string; leads: number; spend: number; lastMonthLeads?: number }[]> = {
  overall: [
    { date: "Mon", leads: 24, spend: 45000, lastMonthLeads: 20 },
    { date: "Tue", leads: 32, spend: 52000, lastMonthLeads: 28 },
    { date: "Wed", leads: 18, spend: 38000, lastMonthLeads: 15 },
    { date: "Thu", leads: 28, spend: 48000, lastMonthLeads: 24 },
    { date: "Fri", leads: 35, spend: 55000, lastMonthLeads: 30 },
    { date: "Sat", leads: 22, spend: 42000, lastMonthLeads: 18 },
    { date: "Sun", leads: 15, spend: 35000, lastMonthLeads: 12 },
  ],
  meta_ads: [
    { date: "Mon", leads: 12, spend: 20250, lastMonthLeads: 10 },
    { date: "Tue", leads: 16, spend: 23400, lastMonthLeads: 14 },
    { date: "Wed", leads: 9, spend: 17100, lastMonthLeads: 7 },
    { date: "Thu", leads: 14, spend: 21600, lastMonthLeads: 12 },
    { date: "Fri", leads: 18, spend: 24750, lastMonthLeads: 15 },
    { date: "Sat", leads: 11, spend: 18900, lastMonthLeads: 9 },
    { date: "Sun", leads: 7, spend: 15750, lastMonthLeads: 5 },
  ],
  google_ads: [
    { date: "Mon", leads: 8, spend: 13500, lastMonthLeads: 6 },
    { date: "Tue", leads: 11, spend: 15600, lastMonthLeads: 9 },
    { date: "Wed", leads: 6, spend: 11400, lastMonthLeads: 5 },
    { date: "Thu", leads: 9, spend: 14400, lastMonthLeads: 7 },
    { date: "Fri", leads: 11, spend: 16500, lastMonthLeads: 9 },
    { date: "Sat", leads: 7, spend: 12600, lastMonthLeads: 5 },
    { date: "Sun", leads: 5, spend: 10500, lastMonthLeads: 4 },
  ],
  google_analytics: [
    { date: "Mon", leads: 6, spend: 0, lastMonthLeads: 5 },
    { date: "Tue", leads: 8, spend: 0, lastMonthLeads: 6 },
    { date: "Wed", leads: 4, spend: 0, lastMonthLeads: 3 },
    { date: "Thu", leads: 6, spend: 0, lastMonthLeads: 5 },
    { date: "Fri", leads: 8, spend: 0, lastMonthLeads: 6 },
    { date: "Sat", leads: 5, spend: 0, lastMonthLeads: 4 },
    { date: "Sun", leads: 3, spend: 0, lastMonthLeads: 2 },
  ],
  seo: [
    { date: "Mon", leads: 4, spend: 3600, lastMonthLeads: 3 },
    { date: "Tue", leads: 5, spend: 4500, lastMonthLeads: 4 },
    { date: "Wed", leads: 3, spend: 2700, lastMonthLeads: 2 },
    { date: "Thu", leads: 4, spend: 3600, lastMonthLeads: 3 },
    { date: "Fri", leads: 5, spend: 4500, lastMonthLeads: 4 },
    { date: "Sat", leads: 3, spend: 2700, lastMonthLeads: 2 },
    { date: "Sun", leads: 2, spend: 1800, lastMonthLeads: 1 },
  ],
  linkedin_ads: [
    { date: "Mon", leads: 3, spend: 4500, lastMonthLeads: 2 },
    { date: "Tue", leads: 4, spend: 6000, lastMonthLeads: 3 },
    { date: "Wed", leads: 2, spend: 3000, lastMonthLeads: 1 },
    { date: "Thu", leads: 3, spend: 4500, lastMonthLeads: 2 },
    { date: "Fri", leads: 4, spend: 6000, lastMonthLeads: 3 },
    { date: "Sat", leads: 2, spend: 3000, lastMonthLeads: 1 },
    { date: "Sun", leads: 1, spend: 1500, lastMonthLeads: 0 },
  ],
};

const campaignLeaderboardData: Record<string, { name: string; spend: number; leads: number; cpl: number }[]> = {
  meta_ads: [
    { name: "Festive Sale Campaign", spend: 85000, leads: 245, cpl: 347 },
    { name: "Product Launch Ads", spend: 62000, leads: 189, cpl: 328 },
    { name: "Retargeting Campaign", spend: 48000, leads: 142, cpl: 338 },
    { name: "Brand Awareness Q1", spend: 35000, leads: 98, cpl: 357 },
  ],
  google_ads: [
    { name: "Search Campaign - Q1", spend: 92000, leads: 312, cpl: 295 },
    { name: "Display Network", spend: 58000, leads: 198, cpl: 293 },
    { name: "YouTube Ads", spend: 35000, leads: 98, cpl: 357 },
    { name: "Shopping Campaign", spend: 28000, leads: 85, cpl: 329 },
  ],
  linkedin_ads: [
    { name: "Lead Gen Forms", spend: 45000, leads: 89, cpl: 506 },
    { name: "Sponsored Content", spend: 32000, leads: 61, cpl: 525 },
    { name: "Thought Leadership", spend: 28000, leads: 52, cpl: 538 },
  ],
};

function buildLeadsData(preset: DatePreset, custom: DateRange | undefined): { date: string; leads: number; spend: number }[] {
  const today = new Date();
  if (preset === "last_7_days") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
      date: label,
      leads: 15 + Math.floor(Math.random() * 25),
      spend: 30000 + Math.floor(Math.random() * 30000),
    }));
  }
  if (preset === "this_month") {
    return ["W1", "W2", "W3", "W4"].map((label) => ({
      date: label,
      leads: 80 + Math.floor(Math.random() * 120),
      spend: 150000 + Math.floor(Math.random() * 200000),
    }));
  }
  if (preset === "last_month") {
    return ["W1", "W2", "W3", "W4"].map((label) => ({
      date: label,
      leads: 70 + Math.floor(Math.random() * 100),
      spend: 120000 + Math.floor(Math.random() * 180000),
    }));
  }
  const from = custom?.from ?? subDays(today, 14);
  const to = custom?.to ?? today;
  const days = eachDayOfInterval({ start: from, end: to });
  if (days.length <= 14) {
    return days.map((d) => ({
      date: format(d, "d MMM"),
      leads: 10 + Math.floor(Math.random() * 30),
      spend: 25000 + Math.floor(Math.random() * 35000),
    }));
  }
  const weeks = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 });
  return weeks.map((w) => ({
    date: format(w, "d MMM"),
    leads: 60 + Math.floor(Math.random() * 140),
    spend: 100000 + Math.floor(Math.random() * 250000),
  }));
}

const ClientReports = () => {
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0].id);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("overall");
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  const [customDate] = useState<DateRange | undefined>(() => ({
    from: subDays(new Date(), 14),
    to: new Date(),
  }));
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [platformCommentary, setPlatformCommentary] = useState<Record<string, Record<string, string>>>(() => ({
    brightline: {
      overall: "Overall performance is strong with consistent lead generation across all platforms.",
      meta_ads: "Meta Ads showing excellent ROAS with festive campaigns performing well.",
      google_ads: "Google Ads maintaining steady CTR with good conversion rates.",
      google_analytics: "Website traffic stable with good goal completion rates.",
      seo: "Organic traffic growing steadily with keyword improvements.",
      linkedin_ads: "LinkedIn campaigns generating quality B2B leads effectively.",
    },
    vertex: {
      overall: "Multi-platform approach delivering diversified lead sources.",
      meta_ads: "Meta campaigns need optimization for better frequency.",
      google_ads: "Search campaigns outperforming display ads significantly.",
      google_analytics: "User engagement metrics showing positive trends.",
      seo: "Technical SEO improvements driving organic growth.",
      linkedin_ads: "Professional audience responding well to targeted content.",
    },
    northwind: {
      overall: "Balanced performance across paid and organic channels.",
      meta_ads: "Retargeting campaigns showing strong ROI.",
      google_ads: "Quality score improvements reducing CPC costs.",
      google_analytics: "Bounce rate reduction indicating better user experience.",
      seo: "Content marketing strategy driving organic visibility.",
      linkedin_ads: "Lead generation forms performing above benchmarks.",
    },
    harbor: {
      overall: "Consistent performance with room for optimization.",
      meta_ads: "A/B testing revealing better creative approaches.",
      google_ads: "Remarketing campaigns boosting overall conversion rates.",
      google_analytics: "Mobile traffic growth indicating responsive design success.",
      seo: "Local SEO improvements driving geographic targeting.",
      linkedin_ads: "Account-based marketing showing promising results.",
    },
    bluepeak: {
      overall: "High-performing campaigns across all platforms.",
      meta_ads: "Video ads driving exceptional engagement rates.",
      google_ads: "Competitive bidding strategy maintaining top positions.",
      google_analytics: "Conversion funnel optimization showing clear results.",
      seo: "Technical SEO audit delivering significant improvements.",
      linkedin_ads: "Thought leadership content establishing brand authority.",
    },
  }));

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || clients[0],
    [selectedClientId],
  );

  const platformData = useMemo(() => platformPerformanceData[selectedPlatform], [selectedPlatform]);
  const currentLeadsData = useMemo(() => platformLeadsData[selectedPlatform], [selectedPlatform]);
  const leadsData = useMemo(() => buildLeadsData(datePreset, customDate), [datePreset, customDate]);
  const currentAgencyNote = useMemo(
    () => platformCommentary[selectedClientId]?.[selectedPlatform] || "",
    [selectedClientId, selectedPlatform, platformCommentary],
  );

  const totalSpend = useMemo(
    () =>
      selectedPlatform === "overall"
        ? leadsData.reduce((sum, day) => sum + day.spend, 0)
        : currentLeadsData.reduce((sum, day) => sum + day.spend, 0),
    [leadsData, currentLeadsData, selectedPlatform],
  );

  const totalLeads = useMemo(
    () =>
      selectedPlatform === "overall"
        ? leadsData.reduce((sum, day) => sum + day.leads, 0)
        : currentLeadsData.reduce((sum, day) => sum + day.leads, 0),
    [leadsData, currentLeadsData, selectedPlatform],
  );

  const avgCPL = useMemo(
    () =>
      selectedPlatform === "overall" ? (totalLeads > 0 ? totalSpend / totalLeads : 0) : platformData.cpl,
    [totalSpend, totalLeads, selectedPlatform, platformData.cpl],
  );

  const handleSaveNote = () => {
    toast({
      title: "Agency Note Saved",
      description: `Commentary for ${selectedClient.name} — ${selectedPlatform.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())} has been saved.`,
    });
  };

  const handleCommentaryChange = (value: string) => {
    setPlatformCommentary((prev) => ({
      ...prev,
      [selectedClientId]: { ...prev[selectedClientId], [selectedPlatform]: value },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "Report Uploaded", description: `${file.name} has been uploaded and processed.` });
    }
  };

  const platformLabel = (p: string) => p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Client Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Per-client platform performance, spend analytics, and agency commentary.
          </p>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Select Client</label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Select Platform</label>
                <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as Platform)}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall">Overall</SelectItem>
                    <SelectItem value="meta_ads">Meta Ads</SelectItem>
                    <SelectItem value="google_ads">Google Ads</SelectItem>
                    <SelectItem value="google_analytics">Google Analytics</SelectItem>
                    <SelectItem value="seo">SEO</SelectItem>
                    <SelectItem value="linkedin_ads">LinkedIn Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Date Range</label>
                <Select value={datePreset} onValueChange={(v) => setDatePreset(v as DatePreset)}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                    <SelectItem value="this_month">This Month</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <label className="cursor-pointer w-full">
                  <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
                  <Button variant="outline" className="gap-2 w-full" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Upload Report
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Spend */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Spend</h3>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {selectedPlatform === "overall" ? formatInr(totalSpend) : formatInr(platformData.totalSpend)}
              </p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12% vs last period</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{platformLabel(selectedPlatform)}</div>
            </CardContent>
          </Card>

          {/* Total Leads */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Leads</h3>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {selectedPlatform === "overall" ? totalLeads.toLocaleString() : platformData.totalLeads.toLocaleString()}
              </p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+8% vs last period</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{platformLabel(selectedPlatform)}</div>
            </CardContent>
          </Card>

          {/* CPL */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Cost Per Lead (CPL)</h3>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatInr(avgCPL)}</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-3% vs last period</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{platformLabel(selectedPlatform)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads Performance */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Leads Performance
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                    className="gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    {showComparison ? "Hide" : "Show"} Comparison
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob(
                        [
                          `${selectedClient.name} — ${platformLabel(selectedPlatform)} Report\n\n` +
                            `Generated: ${new Date().toLocaleDateString()}\n` +
                            `Total Spend: ${formatInr(totalSpend)}\n` +
                            `Total Leads: ${totalLeads}\n` +
                            `CPL: ${formatInr(avgCPL)}\n\n` +
                            `Agency Commentary:\n${currentAgencyNote}\n`,
                        ],
                        { type: "text/plain" },
                      );
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${selectedClient.id}-${selectedPlatform}-report.txt`;
                      a.click();
                    }}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={selectedPlatform === "overall" ? leadsData : currentLeadsData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "leads" ? `${value} leads` : formatInr(value),
                        name === "leads" ? "Leads" : "Spend",
                      ]}
                    />
                    <Bar dataKey="leads" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={48} />
                    {showComparison && (
                      <Line
                        type="monotone"
                        dataKey="lastMonthLeads"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#9ca3af", r: 3 }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Leads: {totalLeads.toLocaleString()}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  +{Math.max(0, Math.round(((totalLeads - 100) / 100) * 100))}% growth
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Budget Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-purple-600" />
                Budget Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformSpendData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
                    >
                      {platformSpendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {platformSpendData.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.fill }} />
                      <span className="text-gray-700">{platform.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform-Specific Metrics */}
        {selectedPlatform !== "overall" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Platform Metrics — {platformLabel(selectedPlatform)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {selectedPlatform === "meta_ads" && (
                  <>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.reach!)}</div><div className="text-sm text-gray-600">Reach</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.engagementRate}%</div><div className="text-sm text-gray-600">Engagement Rate</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.roas}x</div><div className="text-sm text-gray-600">ROAS</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.totalLeads)}</div><div className="text-sm text-gray-600">Total Leads</div></div>
                  </>
                )}
                {selectedPlatform === "google_ads" && (
                  <>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.clicks!)}</div><div className="text-sm text-gray-600">Clicks</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatInr(platformData.cpc!)}</div><div className="text-sm text-gray-600">CPC</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.conversions!)}</div><div className="text-sm text-gray-600">Conversions</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.roas}x</div><div className="text-sm text-gray-600">ROAS</div></div>
                  </>
                )}
                {selectedPlatform === "google_analytics" && (
                  <>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.sessions!)}</div><div className="text-sm text-gray-600">Sessions</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.bounceRate}%</div><div className="text-sm text-gray-600">Bounce Rate</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.goalCompletions!)}</div><div className="text-sm text-gray-600">Goal Completions</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.totalLeads)}</div><div className="text-sm text-gray-600">Total Leads</div></div>
                  </>
                )}
                {selectedPlatform === "seo" && (
                  <>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.organicClicks!)}</div><div className="text-sm text-gray-600">Organic Clicks</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">#{platformData.topKeywordPosition}</div><div className="text-sm text-gray-600">Top Position</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.domainAuthority}</div><div className="text-sm text-gray-600">Domain Authority</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.totalLeads)}</div><div className="text-sm text-gray-600">Total Leads</div></div>
                  </>
                )}
                {selectedPlatform === "linkedin_ads" && (
                  <>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.clicks!)}</div><div className="text-sm text-gray-600">Clicks</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{platformData.engagementRate}%</div><div className="text-sm text-gray-600">Engagement Rate</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatInr(platformData.costPerLead!)}</div><div className="text-sm text-gray-600">Cost per Lead</div></div>
                    <div className="text-center"><div className="text-2xl font-bold">{formatNumber(platformData.totalLeads)}</div><div className="text-sm text-gray-600">Total Leads</div></div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign Leaderboard */}
        {(selectedPlatform === "meta_ads" || selectedPlatform === "google_ads" || selectedPlatform === "linkedin_ads") && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Campaign Leaderboard — {platformLabel(selectedPlatform)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign Name</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Spend</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Leads</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">CPL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignLeaderboardData[selectedPlatform]?.map((campaign, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                        <td className="py-3 px-4 text-right">{formatInr(campaign.spend)}</td>
                        <td className="py-3 px-4 text-right">{formatNumber(campaign.leads)}</td>
                        <td className="py-3 px-4 text-right">{formatInr(campaign.cpl)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agency Commentary */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-600" />
              Agency Commentary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={currentAgencyNote}
                onChange={(e) => handleCommentaryChange(e.target.value)}
                placeholder={`Add insights for ${selectedClient.name} — ${platformLabel(selectedPlatform)}...`}
                className="min-h-[100px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Saved per client and platform combination.</p>
                <Button onClick={handleSaveNote} size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer summary */}
        <Card className="border-0 shadow-sm bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{selectedClient.name}</h4>
                <p className="text-sm text-gray-600">
                  Performance insights for {datePreset === "this_month" ? "this month" : datePreset.replace("_", " ")}
                </p>
              </div>
              <Badge variant="outline" className="bg-white">
                {selectedClient.totalLeads} leads this period
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientReports;
