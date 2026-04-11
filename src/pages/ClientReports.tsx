import { useMemo, useState } from "react";
import { format, subDays, eachDayOfInterval, eachWeekOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
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
  PieChart as PieChartIcon,
  IndianRupee,
  Zap,
  Trophy,
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

const clientFunnelData: Record<string, { stage: string; count: number; color: string }[]> = {
  brightline: [
    { stage: "Total Leads", count: 180, color: "#3b82f6" },
    { stage: "Contacted",   count: 124, color: "#8b5cf6" },
    { stage: "Qualified",   count: 68,  color: "#f59e0b" },
    { stage: "Proposal",    count: 32,  color: "#f97316" },
    { stage: "Won",         count: 14,  color: "#10b981" },
  ],
  vertex: [
    { stage: "Total Leads", count: 120, color: "#3b82f6" },
    { stage: "Contacted",   count: 85,  color: "#8b5cf6" },
    { stage: "Qualified",   count: 45,  color: "#f59e0b" },
    { stage: "Proposal",    count: 20,  color: "#f97316" },
    { stage: "Won",         count: 9,   color: "#10b981" },
  ],
  northwind: [
    { stage: "Total Leads", count: 100, color: "#3b82f6" },
    { stage: "Contacted",   count: 70,  color: "#8b5cf6" },
    { stage: "Qualified",   count: 38,  color: "#f59e0b" },
    { stage: "Proposal",    count: 16,  color: "#f97316" },
    { stage: "Won",         count: 7,   color: "#10b981" },
  ],
  harbor: [
    { stage: "Total Leads", count: 160, color: "#3b82f6" },
    { stage: "Contacted",   count: 112, color: "#8b5cf6" },
    { stage: "Qualified",   count: 60,  color: "#f59e0b" },
    { stage: "Proposal",    count: 24,  color: "#f97316" },
    { stage: "Won",         count: 11,  color: "#10b981" },
  ],
  bluepeak: [
    { stage: "Total Leads", count: 220, color: "#3b82f6" },
    { stage: "Contacted",   count: 158, color: "#8b5cf6" },
    { stage: "Qualified",   count: 88,  color: "#f59e0b" },
    { stage: "Proposal",    count: 38,  color: "#f97316" },
    { stage: "Won",         count: 18,  color: "#10b981" },
  ],
};

const clientRevenueData: Record<string, { closedDeals: number; revenue: number }> = {
  brightline: { closedDeals: 14, revenue: 2100000 },
  vertex:     { closedDeals: 9,  revenue: 1440000 },
  northwind:  { closedDeals: 7,  revenue: 980000  },
  harbor:     { closedDeals: 11, revenue: 1650000 },
  bluepeak:   { closedDeals: 18, revenue: 3240000 },
};

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

  const { closedDeals, revenue } = useMemo(
    () => clientRevenueData[selectedClientId] ?? { closedDeals: 0, revenue: 0 },
    [selectedClientId],
  );

  const roas = useMemo(
    () => (totalSpend > 0 ? revenue / totalSpend : 0),
    [revenue, totalSpend],
  );

  const funnelData = useMemo(
    () => clientFunnelData[selectedClientId] ?? clientFunnelData["brightline"],
    [selectedClientId],
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

        {/* Hero KPIs — Revenue & ROAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full">
                  <IndianRupee className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {closedDeals} deals closed
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue Generated</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{formatInr(revenue)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                <span className="text-xs text-emerald-600">+18% vs last period</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">From won deals in Client Lead Inbox</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                  Return on Ad Spend
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">ROAS</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{roas.toFixed(1)}x</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">+0.4x vs last period</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Revenue ÷ Ad Spend · {platformLabel(selectedPlatform)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Supporting KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Total Spend</h3>
              <p className="text-xl font-bold text-gray-900 tabular-nums">
                {selectedPlatform === "overall" ? formatInr(totalSpend) : formatInr(platformData.totalSpend)}
              </p>
              <div className="flex items-center justify-center mt-1.5">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Total Leads</h3>
              <p className="text-xl font-bold text-gray-900 tabular-nums">
                {selectedPlatform === "overall" ? totalLeads.toLocaleString() : platformData.totalLeads.toLocaleString()}
              </p>
              <div className="flex items-center justify-center mt-1.5">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-3">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Cost Per Lead</h3>
              <p className="text-xl font-bold text-gray-900 tabular-nums">{formatInr(avgCPL)}</p>
              <div className="flex items-center justify-center mt-1.5">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-3%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mx-auto mb-3">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">Closed Deals</h3>
              <p className="text-xl font-bold text-gray-900 tabular-nums">{closedDeals}</p>
              <div className="flex items-center justify-center mt-1.5">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+2 vs last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Funnel */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Lead Funnel</CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Lead-to-deal conversion · {selectedClient.name}</p>
                </div>
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
                          `CPL: ${formatInr(avgCPL)}\n` +
                          `Revenue: ${formatInr(revenue)}\n` +
                          `ROAS: ${roas.toFixed(1)}x\n\n` +
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
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {funnelData.map((item, i) => {
                  const prev = i > 0 ? funnelData[i - 1].count : item.count;
                  const convPct = i > 0 ? Math.round((item.count / prev) * 100) : 100;
                  const widthPct = Math.round((item.count / funnelData[0].count) * 100);
                  return (
                    <div key={item.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{item.count}</span>
                          {i > 0 && (
                            <span className="text-xs text-gray-400 tabular-nums w-14 text-right">
                              {convPct}% conv.
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-7 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className="h-full rounded-md flex items-center px-2.5 transition-all duration-500"
                          style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                        >
                          {widthPct > 15 && (
                            <span className="text-xs font-semibold text-white">{widthPct}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Lead → Deal Rate</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.round((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Revenue / Deal</p>
                  <p className="text-xl font-bold text-gray-900">
                    {closedDeals > 0 ? formatInr(Math.round(revenue / closedDeals)) : "—"}
                  </p>
                </div>
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
