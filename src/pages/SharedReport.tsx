import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

// This would typically come from URL params or API
interface SharedReportData {
  clientName: string;
  dateRange: string;
  adSource: string;
  northStarMetric: {
    target: string;
    currentValue: number;
    targetValue: number;
    isOnTrack: boolean;
  };
  metrics: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  aiSummary: string;
  progressData: Array<{ date: string; value: number; target: number }>;
}

// Mock data - in real app this would come from API/database
const mockReportData: SharedReportData = {
  clientName: "BrightStar Media",
  dateRange: "This Month",
  adSource: "Google Ads",
  northStarMetric: {
    target: "ROAS > 3",
    currentValue: 3.8,
    targetValue: 3,
    isOnTrack: true
  },
  metrics: [
    { label: "ROAS", value: 3.8, color: "#2563eb" },
    { label: "CTR", value: 2.45, color: "#0891b2" },
    { label: "Conversions", value: 412, color: "#16a34a" },
    { label: "Total Spend", value: 4845.92, color: "#334155" }
  ],
  aiSummary: "Performance for BrightStar Media shows strong results. The ROAS > 3 metric is currently at 3.8, which is above the target of 3. Key recommendations include optimizing underperforming channels and focusing on high-converting segments to improve overall ROAS.",
  progressData: [
    { date: 'Week 1', value: 2.8, target: 3 },
    { date: 'Week 2', value: 3.2, target: 3 },
    { date: 'Week 3', value: 3.5, target: 3 },
    { date: 'Week 4', value: 3.8, target: 3 },
  ]
};

export default function SharedReport() {
  const reportData = mockReportData; // In real app, this would be fetched based on URL params

  const formatMetricValue = (label: string, value: number) => {
    if (label === "ROAS" || label === "CTR") return `${value.toFixed(2)}${label === "CTR" ? "%" : ""}`;
    if (label === "Total Spend") return `$${value.toFixed(2)}`;
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AdFlow CRM</h1>
                <p className="text-sm text-gray-500">Client Performance Report</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{reportData.clientName}</p>
              <p className="text-sm text-gray-500">{reportData.dateRange}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* North Star Progress */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              North Star Progress: {reportData.northStarMetric.target}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData.progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={reportData.northStarMetric.isOnTrack ? "#16a34a" : "#dc2626"} 
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
              {reportData.northStarMetric.isOnTrack ? (
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

        {/* Performance Metrics */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              {reportData.adSource} Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.metrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {reportData.metrics.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {reportData.metrics.map((metric, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div 
                      className="w-3 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: metric.color }}
                    />
                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatMetricValue(metric.label, metric.value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        {reportData.aiSummary && (
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">AI Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-gray-50 p-4 text-sm text-gray-700">
                {reportData.aiSummary}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-8 border-t">
          <p>Generated by AdFlow CRM • {new Date().toLocaleDateString()}</p>
          <p className="mt-1">This is a read-only shared report</p>
        </div>
      </div>
    </div>
  );
}
