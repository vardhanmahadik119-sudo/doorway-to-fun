import { useMemo, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Download, FileUp, Sparkles, Share2, Copy, Eye, Palette, Plus, X, Target, TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";

type DatePreset = "this_month" | "last_month" | "custom";
type ChartView = "bar" | "pie";
type AdSource = "google_ads" | "google_analytics" | "meta_ads" | "linkedin_ads" | "seo";

interface NorthStarMetric {
  target: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  isOnTrack: boolean;
}

interface ShareLink {
  id: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
}

type MetricKey =
  | "roas"
  | "ctr"
  | "cpm"
  | "reach"
  | "impressions"
  | "clicks"
  | "conversions"
  | "costPerConversion"
  | "totalSpend"
  | "organicTraffic"
  | "keywordRankings"
  | "backlinks"
  | "domainAuthority"
  | "bounceRate"
  | "pagesPerSession"
  | "averageSessionDuration"
  | "organicCtr"
  | "newUsers"
  | "goalCompletions"
  | "frequency"
  | "linkClicks"
  | "costPerResult"
  | "amountSpent"
  | "leads"
  | "costPerLead"
  | "engagementRate"
  | "pagesIndexed"
  | "averagePosition"
  | "searchImpressions"
  | "qualityScore";

type MetricDefinition = {
  key: MetricKey;
  label: string;
  aliases: string[];
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const clients = [
  { id: "brightstar", name: "BrightStar Media" },
  { id: "pixelforge", name: "PixelForge Studios" },
  { id: "zenith", name: "Zenith Brands" },
  { id: "crescendo", name: "Crescendo Digital" },
  { id: "novaad", name: "NovaAd Co." },
];

const adSources: Record<AdSource, { name: string; metrics: MetricKey[]; northStarExample: string }> = {
  google_ads: {
    name: "Google Ads",
    metrics: ["roas", "ctr", "cpm", "impressions", "clicks", "conversions", "costPerConversion", "totalSpend"],
    northStarExample: "ROAS > 3"
  },
  google_analytics: {
    name: "Google Analytics",
    metrics: ["organicTraffic", "bounceRate", "pagesPerSession", "averageSessionDuration", "conversions", "ctr"],
    northStarExample: "Bounce Rate < 40%"
  },
  meta_ads: {
    name: "Meta Ads", 
    metrics: ["reach", "impressions", "cpm", "ctr", "cpm", "roas", "clicks", "costPerConversion", "totalSpend"],
    northStarExample: "ROAS > 2.5"
  },
  linkedin_ads: {
    name: "LinkedIn Ads",
    metrics: ["impressions", "clicks", "ctr", "cpm", "conversions", "costPerConversion", "totalSpend"],
    northStarExample: "Cost per Lead < ₹500"
  },
  seo: {
    name: "SEO",
    metrics: ["organicTraffic", "keywordRankings", "bounceRate", "organicCtr", "domainAuthority", "impressions"],
    northStarExample: "Organic Traffic > 50K"
  }
};

const metricDefinitions: MetricDefinition[] = [
  { key: "roas", label: "ROAS", aliases: ["roas"], decimals: 2 },
  { key: "ctr", label: "CTR", aliases: ["ctr", "clickthroughrate"], suffix: "%", decimals: 2 },
  { key: "cpm", label: "CPM", aliases: ["cpm", "costpermille"], prefix: "$", decimals: 2 },
  { key: "reach", label: "Reach", aliases: ["reach"] },
  { key: "impressions", label: "Impressions", aliases: ["impressions", "impression"] },
  { key: "clicks", label: "Clicks", aliases: ["clicks", "click"] },
  { key: "conversions", label: "Conversions", aliases: ["conversions", "conversion"] },
  {
    key: "costPerConversion",
    label: "Cost per conversion",
    aliases: ["costperconversion", "cpcv", "cost_per_conversion"],
    prefix: "$",
    decimals: 2,
  },
  { key: "totalSpend", label: "Total spend", aliases: ["totalspend", "spend", "total_spend"], prefix: "$", decimals: 2 },
  { key: "organicTraffic", label: "Organic Traffic", aliases: ["organictraffic", "organic_traffic"] },
  { key: "keywordRankings", label: "Keyword Rankings", aliases: ["keywordrankings", "keyword_rankings", "rankings"] },
  { key: "backlinks", label: "Backlinks", aliases: ["backlinks", "backlink"] },
  { key: "domainAuthority", label: "Domain Authority", aliases: ["domainauthority", "domain_authority", "da"], decimals: 1 },
  { key: "bounceRate", label: "Bounce Rate", aliases: ["bouncerate", "bounce_rate"], suffix: "%", decimals: 2 },
  { key: "pagesPerSession", label: "Pages per Session", aliases: ["pagespersession", "pages_per_session"], decimals: 2 },
  {
    key: "averageSessionDuration",
    label: "Average Session Duration",
    aliases: ["averagesessionduration", "avgsessionduration", "average_session_duration"],
    suffix: " sec",
    decimals: 0,
  },
  { key: "organicCtr", label: "Organic CTR", aliases: ["organicctr", "organic_ctr"], suffix: "%", decimals: 2 },
  { key: "newUsers", label: "New Users", aliases: ["newusers", "new_users"] },
  { key: "goalCompletions", label: "Goal Completions", aliases: ["goalcompletions", "goal_completions"] },
  { key: "frequency", label: "Frequency", aliases: ["frequency"], decimals: 2 },
  { key: "linkClicks", label: "Link Clicks", aliases: ["linkclicks", "link_clicks"] },
  { key: "costPerResult", label: "Cost per Result", aliases: ["costperresult", "cost_per_result"], prefix: "$", decimals: 2 },
  { key: "amountSpent", label: "Amount Spent", aliases: ["amountspent", "amount_spent"], prefix: "$", decimals: 2 },
  { key: "leads", label: "Leads", aliases: ["leads", "lead"] },
  { key: "costPerLead", label: "Cost per Lead", aliases: ["costperlead", "cost_per_lead"], prefix: "$", decimals: 2 },
  { key: "engagementRate", label: "Engagement Rate", aliases: ["engagementrate", "engagement_rate"], suffix: "%", decimals: 2 },
  { key: "pagesIndexed", label: "Pages Indexed", aliases: ["pagesindexed", "pages_indexed"] },
  { key: "averagePosition", label: "Average Position", aliases: ["averageposition", "average_position"], decimals: 1 },
  { key: "searchImpressions", label: "Search Impressions", aliases: ["searchimpressions", "search_impressions"] },
  { key: "qualityScore", label: "Quality Score", aliases: ["qualityscore", "quality_score"], decimals: 1 },
];

const defaultMetricColors: Record<MetricKey, string> = {
  roas: "#2563eb",
  ctr: "#0891b2",
  cpm: "#7c3aed",
  reach: "#0d9488",
  impressions: "#6366f1",
  clicks: "#0284c7",
  conversions: "#16a34a",
  costPerConversion: "#ea580c",
  totalSpend: "#334155",
  organicTraffic: "#059669",
  keywordRankings: "#9333ea",
  backlinks: "#d97706",
  domainAuthority: "#0f766e",
  bounceRate: "#dc2626",
  pagesPerSession: "#7c2d12",
  averageSessionDuration: "#4f46e5",
  organicCtr: "#0e7490",
  newUsers: "#f59e0b",
  goalCompletions: "#10b981",
  frequency: "#8b5cf6",
  linkClicks: "#06b6d4",
  costPerResult: "#f97316",
  amountSpent: "#64748b",
  leads: "#84cc16",
  costPerLead: "#ef4444",
  engagementRate: "#a855f7",
  pagesIndexed: "#14b8a6",
  averagePosition: "#f59e0b",
  searchImpressions: "#3b82f6",
  qualityScore: "#22c55e",
};

const metricByKey = new Map(metricDefinitions.map((m) => [m.key, m]));

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const parseCsv = (raw: string): string[][] =>
  raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((entry) => entry.trim().replace(/^"|"$/g, "")));

const formatMetricValue = (metric: MetricDefinition, value: number) => {
  const decimals = metric.decimals ?? 0;
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${metric.prefix ?? ""}${formatted}${metric.suffix ?? ""}`;
};

export default function ClientReports() {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement | null>(null);

  const [clientId, setClientId] = useState<string>(clients[0].id);
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [chartView, setChartView] = useState<ChartView>("bar");
  const [selectedAdSource, setSelectedAdSource] = useState<AdSource>("google_ads");
  const [northStarMetric, setNorthStarMetric] = useState<NorthStarMetric>({
    target: "ROAS > 3",
    currentValue: 3.8,
    targetValue: 3,
    unit: "",
    isOnTrack: true
  });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [showMetricMenu, setShowMetricMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedMetricForColor, setSelectedMetricForColor] = useState<MetricKey | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(adSources.google_ads.metrics);
  const [metricValues, setMetricValues] = useState<Partial<Record<MetricKey, number>>>({
    roas: 3.8,
    ctr: 2.45,
    cpm: 14.2,
    reach: 128450,
    impressions: 342110,
    clicks: 8382,
    conversions: 412,
    costPerConversion: 11.76,
    totalSpend: 4845.92,
    organicTraffic: 54220,
    keywordRankings: 128,
    backlinks: 742,
    domainAuthority: 42.5,
    bounceRate: 46.8,
    pagesPerSession: 2.9,
    averageSessionDuration: 134,
    organicCtr: 5.7,
    newUsers: 12050,
    goalCompletions: 89,
    frequency: 3.2,
    linkClicks: 2156,
    costPerResult: 8.45,
    amountSpent: 3200.00,
    leads: 156,
    costPerLead: 450.00,
    engagementRate: 4.8,
    pagesIndexed: 2840,
    averagePosition: 12.5,
    searchImpressions: 45800,
    qualityScore: 7.2,
  });
  const [metricColors, setMetricColors] = useState<Record<MetricKey, string>>(defaultMetricColors);

  const activeClient = clients.find((client) => client.id === clientId);

  // Update selected metrics when ad source changes
  const handleAdSourceChange = (source: AdSource) => {
    setSelectedAdSource(source);
    setSelectedMetrics(adSources[source].metrics);
    // Update North Star metric to match the new ad source
    setNorthStarMetric(prev => ({
      ...prev,
      target: adSources[source].northStarExample,
      targetValue: parseFloat(adSources[source].northStarExample.match(/\d+\.?\d*/)?.[0] || "0"),
      currentValue: prev.currentValue, // Keep current value for now
      isOnTrack: prev.isOnTrack // Keep status for now
    }));
  };

  // Handle metric color change
  const handleMetricColorChange = (metricKey: MetricKey, color: string) => {
    setMetricColors(prev => ({ ...prev, [metricKey]: color }));
    setShowColorPicker(false);
    setSelectedMetricForColor(null);
  };

  // Handle metric toggle
  const toggleMetric = (metricKey: MetricKey, checked: boolean) => {
    setSelectedMetrics((prev) =>
      checked ? [...prev, metricKey] : prev.filter((key) => key !== metricKey),
    );
  };

  // Generate share link
  const generateShareLink = () => {
    const linkId = Math.random().toString(36).substring(7);
    const url = `${window.location.origin}/shared-report/${linkId}`;
    const newShareLink: ShareLink = {
      id: linkId,
      url,
      isActive: true,
      createdAt: new Date()
    };
    setShareLink(newShareLink);
    setShowShareDialog(true);
  };

  // Copy share link
  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.url);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
    }
  };

  // Generate AI summary
  const generateAISummary = async () => {
    setIsSummaryLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const summary = `Performance for ${activeClient?.name} shows ${northStarMetric.isOnTrack ? 'strong' : 'mixed'} results. The ${northStarMetric.target} metric is currently at ${northStarMetric.currentValue}${northStarMetric.unit}, which is ${northStarMetric.isOnTrack ? 'above' : 'below'} the target of ${northStarMetric.targetValue}${northStarMetric.unit}. Key recommendations include optimizing underperforming channels and focusing on high-converting segments to improve overall ROAS.`;
      setAiSummary(summary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI summary",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // North star progress data
  const northStarProgressData = useMemo(() => {
    return [
      { date: 'Week 1', value: 2.8, target: 3 },
      { date: 'Week 2', value: 3.2, target: 3 },
      { date: 'Week 3', value: 3.5, target: 3 },
      { date: 'Week 4', value: 3.8, target: 3 },
    ];
  }, []);

  const dateRangeLabel = useMemo(() => {
    if (datePreset === "this_month") return "This month";
    if (datePreset === "last_month") return "Last month";
    if (customFrom && customTo) return `${customFrom} to ${customTo}`;
    return "Custom range";
  }, [customFrom, customTo, datePreset]);

  const selectedMetricDefinitions = useMemo(
    () => selectedMetrics.map((key) => metricByKey.get(key)).filter(Boolean) as MetricDefinition[],
    [selectedMetrics],
  );

  const chartData = useMemo(
    () =>
      selectedMetricDefinitions.map((metric) => ({
        key: metric.key,
        metric: metric.label,
        value: metricValues[metric.key] ?? 0,
        color: metricColors[metric.key],
      })),
    [selectedMetricDefinitions, metricValues, metricColors],
  );

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length < 2) {
      toast({
        title: "CSV import failed",
        description: "Please upload a CSV with headers and at least one data row.",
        variant: "destructive",
      });
      return;
    }

    const headers = rows[0];
    const values = rows[1];
    const nextValues: Partial<Record<MetricKey, number>> = {};
    const detectedMetrics: MetricKey[] = [];

    headers.forEach((header, index) => {
      const normalizedHeader = normalize(header);
      const matchingMetric = metricDefinitions.find((metric) =>
        metric.aliases.some((alias) => normalize(alias) === normalizedHeader),
      );
      if (!matchingMetric) return;

      const numericValue = Number(String(values[index] ?? "0").replace(/[^0-9.-]/g, ""));
      if (Number.isNaN(numericValue)) return;

      nextValues[matchingMetric.key] = numericValue;
      detectedMetrics.push(matchingMetric.key);
    });

    if (detectedMetrics.length === 0) {
      toast({
        title: "No metric columns detected",
        description:
          "Use headers like ROAS, CTR, CPM, Reach, Impressions, Clicks, Conversions, Cost per conversion, Total spend, Organic Traffic, Keyword Rankings, Backlinks, Domain Authority, Bounce Rate, Pages per Session, Average Session Duration, or Organic CTR.",
        variant: "destructive",
      });
      return;
    }

    setMetricValues((prev) => ({ ...prev, ...nextValues }));
    setSelectedMetrics((prev) => Array.from(new Set([...prev, ...detectedMetrics])));
    toast({
      title: "CSV imported",
      description: `${detectedMetrics.length} metric column(s) mapped automatically.`,
    });

    event.target.value = "";
  };

  const handleGenerateSummary = async () => {
    const payload = {
      client: activeClient?.name ?? "Unknown client",
      dateRange: dateRangeLabel,
      metrics: selectedMetricDefinitions.map((metric) => ({
        key: metric.key,
        label: metric.label,
        value: metricValues[metric.key] ?? 0,
      })),
    };

    setIsSummaryLoading(true);
    try {
      const response = await fetch("/api/client-reports/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = (await response.json()) as { summary?: string };
      setAiSummary(data.summary ?? "No summary was returned by the API.");
    } catch {
      const fallback = `${payload.client} shows ${payload.metrics.length} tracked KPI(s) for ${payload.dateRange}, with current performance centered around ${payload.metrics
        .slice(0, 3)
        .map((m) => `${m.label}: ${m.value}`)
        .join(", ")}. Focus on optimizing spend-to-conversion efficiency and CTR momentum to improve downstream outcomes in the next reporting period.`;
      setAiSummary(fallback);
      toast({
        title: "AI summary fallback used",
        description: "Live API did not respond, so a local summary was generated.",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!reportRef.current) return;
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1300px] space-y-6">
        {/* Prominent Ad Source Selector */}
        <Card className="border-2 border-blue-200 bg-blue-50/30 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Select Ad Source</h2>
                <p className="text-sm text-blue-700">Choose the platform to analyze and generate reports for</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(adSources).map(([key, source]) => (
                  <button
                    key={key}
                    onClick={() => handleAdSourceChange(key as AdSource)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedAdSource === key
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {adSources[selectedAdSource].name} Reports
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Performance reports for {adSources[selectedAdSource].name} with AI insights and sharing capabilities
            </p>
          </div>
          <Button onClick={generateShareLink} className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
        </div>

        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Report Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
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

              <div className="space-y-2">
                <Label>Date range</Label>
                <Select value={datePreset} onValueChange={(value) => setDatePreset(value as DatePreset)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this_month">This month</SelectItem>
                    <SelectItem value="last_month">Last month</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Import data</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".csv,text/csv" onChange={handleCsvImport} className="text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chart view</Label>
              <Select value={chartView} onValueChange={(value) => setChartView(value as ChartView)}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar chart</SelectItem>
                  <SelectItem value="pie">Pie chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {datePreset === "custom" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                North Star Metric
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., ROAS > 3 or 500 conversions per month"
                  value={northStarMetric.target}
                  onChange={(e) => setNorthStarMetric(prev => ({ ...prev, target: e.target.value }))}
                  className="flex-1"
                />
                <Button variant="outline" onClick={generateAISummary} disabled={isSummaryLoading}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isSummaryLoading ? "Generating..." : "Generate Summary"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* North Star Progress Chart */}
        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              North Star Progress: {northStarMetric.target}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={northStarProgressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={northStarMetric.isOnTrack ? "#16a34a" : "#dc2626"} 
                    strokeWidth={2}
                    name="Current Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#6b7280" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {northStarMetric.isOnTrack ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">On track to meet target</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Below target - needs attention</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics Chart with Context Menu */}
        <ContextMenu>
          <ContextMenuTrigger>
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base">
                  {adSources[selectedAdSource].name} Performance Metrics
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Right-click to add/remove metrics • Right-click cards to change colors
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === "bar" ? (
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry) => (
                            <Cell key={`bar-${entry.key}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Tooltip />
                        <Pie data={chartData} dataKey="value" nameKey="metric" cx="50%" cy="50%" outerRadius={100} label>
                          {chartData.map((entry) => (
                            <Cell key={`pie-${entry.key}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Metric Cards with Right-Click Color Picker */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {selectedMetricDefinitions.map((metric) => (
                    <ContextMenu key={metric.key}>
                      <ContextMenuTrigger>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4 text-center">
                            <div 
                              className="w-3 h-3 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: metricColors[metric.key] }}
                            />
                            <p className="text-sm font-medium text-foreground">{metric.label}</p>
                            <p className="text-lg font-bold text-foreground">
                              {formatMetricValue(metric, metricValues[metric.key] ?? 0)}
                            </p>
                          </CardContent>
                        </Card>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem onClick={() => {
                          setSelectedMetricForColor(metric.key);
                          setShowColorPicker(true);
                        }}>
                          <Palette className="h-4 w-4 mr-2" />
                          Change Color
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <div className="p-2">
              <p className="text-sm font-medium mb-2">Add/Remove Metrics</p>
              <Separator className="mb-2" />
              {adSources[selectedAdSource].metrics.map((metricKey) => {
                const metric = metricByKey.get(metricKey);
                if (!metric) return null;
                const isSelected = selectedMetrics.includes(metricKey);
                return (
                  <ContextMenuItem key={metricKey} onClick={() => toggleMetric(metricKey, !isSelected)}>
                    <Checkbox checked={isSelected} className="mr-2" />
                    {metric.label}
                  </ContextMenuItem>
                );
              })}
            </div>
          </ContextMenuContent>
        </ContextMenu>

        {/* AI Summary */}
        {aiSummary && (
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base">AI Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-muted/30 p-4 text-sm text-foreground">
                {aiSummary}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareLink?.url || ""} readOnly />
                  <Button variant="outline" size="icon" onClick={copyShareLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">AdFlow CRM</h3>
                    <p className="text-sm text-muted-foreground">Client Report</p>
                    <p className="text-xs text-muted-foreground">{activeClient?.name} • {dateRangeLabel}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyShareLink} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Color Picker Dialog */}
        <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Choose Color</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {Object.values(defaultMetricColors).map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-border hover:border-primary"
                    style={{ backgroundColor: color }}
                    onClick={() => selectedMetricForColor && handleMetricColorChange(selectedMetricForColor, color)}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowColorPicker(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Client: {activeClient?.name} • Source: {adSources[selectedAdSource].name} • Date range: {dateRangeLabel}</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
