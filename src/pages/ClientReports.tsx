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
  Download,
  Save,
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

  const generateReport = () => {
    const dateLabel =
      datePreset === "last_7_days" ? "Last 7 Days"
      : datePreset === "this_month" ? "This Month"
      : datePreset === "last_month" ? "Last Month"
      : "Custom Range";

    const wonRate = Math.round((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100);
    const qualRate = Math.round((funnelData[2].count / funnelData[0].count) * 100);
    const perf = roas >= 4 ? "exceptional" : roas >= 3 ? "strong" : roas >= 2 ? "solid" : "developing";

    const aiSummary =
      `${selectedClient.name} delivered ${perf} results this period with a ROAS of ${roas.toFixed(1)}x, generating ${formatInr(revenue)} in confirmed revenue from ${closedDeals} closed deals. ` +
      `Out of ${funnelData[0].count} total leads, ${wonRate}% converted to closed deals and ${qualRate}% reached the qualified stage — ` +
      `${qualRate >= 50 ? "a strong qualification rate indicating good lead-to-ad fit" : "an area with room for improvement through tighter audience targeting"}. ` +
      `Cost per lead came in at ${formatInr(avgCPL)}, ${avgCPL < 2500 ? "demonstrating efficient acquisition cost across campaigns" : "with room to optimise targeting and creative for better efficiency"}. ` +
      `${roas >= 3 ? "The overall return on ad spend reflects strong campaign health and clear value delivery." : "Incremental improvements to creative strategy and audience segmentation are recommended to strengthen pipeline conversion in the next period."}`;

    const funnelHtml = funnelData.map((item, i) => {
      const prev = i > 0 ? funnelData[i - 1].count : item.count;
      const convPct = i > 0 ? Math.round((item.count / prev) * 100) : null;
      const widthPct = Math.round((item.count / funnelData[0].count) * 100);
      return `
        <div style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <span style="font-size:13px;font-weight:500;color:#374151;">${item.stage}</span>
            ${convPct !== null ? `<span style="font-size:11px;color:#9ca3af;">${convPct}% from prev</span>` : ""}
          </div>
          <div style="height:26px;background:#f3f4f6;border-radius:6px;overflow:hidden;">
            <div style="width:${widthPct}%;height:100%;background:${item.color};border-radius:6px;display:flex;align-items:center;padding:0 10px;">
              <span style="font-size:12px;font-weight:600;color:white;">${item.count}</span>
            </div>
          </div>
        </div>`;
    }).join("");

    const budgetHtml = platformSpendData.map(p => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f9fafb;font-size:13px;">
        <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.fill};margin-right:8px;"></span>${p.name}</span>
        <span style="font-weight:600;">${p.value}%</span>
      </div>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${selectedClient.name} — Campaign Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111827;padding:48px;max-width:960px;margin:0 auto;}
    @media print{body{padding:24px;}.no-print{display:none!important;}}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:28px;border-bottom:2px solid #e5e7eb;}
    .brand{font-size:13px;font-weight:700;color:#6366f1;letter-spacing:.06em;}
    .client-name{font-size:28px;font-weight:700;color:#111827;margin-top:6px;}
    .meta{font-size:13px;color:#6b7280;margin-top:4px;}
    .section-title{font-size:14px;font-weight:600;color:#374151;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f3f4f6;text-transform:uppercase;letter-spacing:.04em;}
    .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
    .hero-card{border-radius:12px;padding:22px;}
    .hero-green{background:linear-gradient(135deg,#ecfdf5,#fff);border:1px solid #d1fae5;}
    .hero-blue{background:linear-gradient(135deg,#eff6ff,#fff);border:1px solid #dbeafe;}
    .hero-label{font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
    .hero-value{font-size:30px;font-weight:700;}
    .hero-sub{font-size:11px;color:#9ca3af;margin-top:5px;}
    .stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:32px;}
    .stat-card{border:1px solid #f3f4f6;border-radius:8px;padding:14px;text-align:center;}
    .stat-label{font-size:11px;color:#9ca3af;margin-bottom:4px;}
    .stat-value{font-size:19px;font-weight:700;color:#111827;}
    .ai-box{background:#f0f9ff;border-left:4px solid #3b82f6;border-radius:0 10px 10px 0;padding:20px 22px;margin-bottom:32px;}
    .ai-label{font-size:11px;font-weight:700;color:#3b82f6;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
    .ai-text{font-size:13px;line-height:1.75;color:#374151;}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px;}
    .box{border:1px solid #f3f4f6;border-radius:10px;padding:20px;}
    .funnel-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;}
    .fsub-label{font-size:11px;color:#9ca3af;margin-bottom:3px;}
    .fsub-value{font-size:20px;font-weight:700;color:#111827;}
    .commentary-box{border:1px solid #f3f4f6;border-radius:10px;padding:20px;margin-bottom:32px;}
    .commentary-text{font-size:13px;line-height:1.75;color:#374151;white-space:pre-wrap;}
    .footer{text-align:center;font-size:11px;color:#9ca3af;padding-top:24px;border-top:1px solid #f3f4f6;}
    .print-btn{position:fixed;bottom:28px;right:28px;background:#111827;color:white;border:none;padding:13px 22px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2);}
    .print-btn:hover{background:#1f2937;}
  </style>
</head>
<body>

<div class="header">
  <div>
    <div class="brand">⚡ ADFLOW CRM</div>
    <div class="client-name">${selectedClient.name}</div>
    <div class="meta">${platformLabel(selectedPlatform)} &nbsp;·&nbsp; ${dateLabel} &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:12px;color:#6b7280;font-weight:500;">Campaign Performance Report</div>
    <div style="font-size:11px;color:#9ca3af;margin-top:4px;">Generated ${new Date().toLocaleString()}</div>
  </div>
</div>

<div class="section-title">Key Performance Indicators</div>
<div class="hero-grid">
  <div class="hero-card hero-green">
    <div class="hero-label">Total Revenue Generated</div>
    <div class="hero-value" style="color:#059669;">${formatInr(revenue)}</div>
    <div class="hero-sub">${closedDeals} deals closed &nbsp;·&nbsp; from won leads</div>
  </div>
  <div class="hero-card hero-blue">
    <div class="hero-label">ROAS</div>
    <div class="hero-value" style="color:#2563eb;">${roas.toFixed(1)}x</div>
    <div class="hero-sub">Revenue ÷ Ad Spend &nbsp;·&nbsp; ${platformLabel(selectedPlatform)}</div>
  </div>
</div>
<div class="stat-grid">
  <div class="stat-card"><div class="stat-label">Total Spend</div><div class="stat-value">${formatInr(totalSpend)}</div></div>
  <div class="stat-card"><div class="stat-label">Total Leads</div><div class="stat-value">${totalLeads}</div></div>
  <div class="stat-card"><div class="stat-label">Cost Per Lead</div><div class="stat-value">${formatInr(avgCPL)}</div></div>
  <div class="stat-card"><div class="stat-label">Closed Deals</div><div class="stat-value">${closedDeals}</div></div>
</div>

<div class="section-title">AI-Generated Summary</div>
<div class="ai-box">
  <div class="ai-label">✨ AdFlow AI Analysis</div>
  <div class="ai-text">${aiSummary}</div>
</div>

<div class="two-col">
  <div class="box">
    <div class="section-title" style="margin-bottom:14px;">Lead Funnel</div>
    ${funnelHtml}
    <div class="funnel-summary">
      <div><div class="fsub-label">Lead → Deal Rate</div><div class="fsub-value">${wonRate}%</div></div>
      <div><div class="fsub-label">Avg Revenue / Deal</div><div class="fsub-value">${closedDeals > 0 ? formatInr(Math.round(revenue / closedDeals)) : "—"}</div></div>
    </div>
  </div>
  <div class="box">
    <div class="section-title" style="margin-bottom:14px;">Budget Distribution</div>
    ${budgetHtml}
  </div>
</div>

${currentAgencyNote ? `
<div class="section-title">Agency Commentary</div>
<div class="commentary-box">
  <div class="commentary-text">${currentAgencyNote}</div>
</div>` : ""}

<div class="footer">Generated by AdFlow CRM &nbsp;·&nbsp; ${selectedClient.name} &nbsp;·&nbsp; ${new Date().getFullYear()}</div>

<button class="print-btn no-print" onclick="window.print()">🖨&nbsp; Print / Save as PDF</button>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const platformLabel = (p: string) => p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-8 pb-10">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Client Reports</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Per-client platform performance, spend analytics, and agency commentary.
              </p>
            </div>
            <Button onClick={generateReport} className="gap-2 bg-gray-900 hover:bg-gray-800 text-white">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {i > 0 && (
                          <span className="text-xs text-gray-400 tabular-nums">
                            {convPct}% from prev
                          </span>
                        )}
                      </div>
                      <div className="h-7 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className="h-full rounded-md flex items-center px-2.5 transition-all duration-500"
                          style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                        >
                          <span className="text-xs font-semibold text-white">{item.count}</span>
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
