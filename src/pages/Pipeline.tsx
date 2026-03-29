import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Plus, Phone, Mail, Calendar, User, IndianRupee, TrendingUp, Clock, StickyNote, LayoutGrid, List, Search, ArrowUp, ArrowDown, X } from "lucide-react";

interface Deal {
  id: string;
  agency: string;
  value: number;
  contact: string;
  contactEmail: string;
  contactPhone: string;
  expectedClose: string;
  accountManager: string;
  stage: string;
  probability: number;
  nextFollowUp: string;
  notes: string;
  lastActivity: string;
  activity: { date: string; text: string }[];
  leadSource?: string;
}

interface LeadSource {
  id: string;
  name: string;
  conversionRate: number;
  color: string;
}

const stages = [
  { name: "Leads", color: "blue" },
  { name: "Proposal Sent", color: "yellow" },
  { name: "Negotiating", color: "purple" },
  { name: "Closed Won", color: "green" },
  { name: "Closed Lost", color: "red" }
];

const stageColors = {
  "Leads": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", header: "bg-blue-100" },
  "Proposal Sent": { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", header: "bg-yellow-100" },
  "Negotiating": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", header: "bg-purple-100" },
  "Closed Won": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", header: "bg-green-100" },
  "Closed Lost": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", header: "bg-red-100" }
};

const sampleDeals: Deal[] = [
  {
    id: "1", agency: "BrightStar Media", value: 450000, contact: "Rahul Mehta",
    contactEmail: "rahul@brightstar.in", contactPhone: "+91 98765 43210",
    expectedClose: "2026-03-25", accountManager: "Priya Sharma", stage: "Leads",
    probability: 20, nextFollowUp: "2026-03-10", lastActivity: "2026-03-07",
    notes: "Interested in social media management package.",
    leadSource: "Google Ads",
    activity: [
      { date: "2026-03-07", text: "Initial discovery call completed" },
      { date: "2026-03-05", text: "Inbound enquiry via website" },
    ],
  },
  {
    id: "2", agency: "PixelForge Studios", value: 780000, contact: "Ananya Iyer",
    contactEmail: "ananya@pixelforge.co", contactPhone: "+91 91234 56789",
    expectedClose: "2026-04-10", accountManager: "Arjun Kapoor", stage: "Proposal Sent",
    probability: 45, nextFollowUp: "2026-03-12", lastActivity: "2026-03-06",
    notes: "Proposal sent for full-service digital campaigns. Awaiting feedback.",
    leadSource: "Website Contact Form",
    activity: [
      { date: "2026-03-06", text: "Proposal document shared via email" },
      { date: "2026-03-03", text: "Requirements gathering meeting" },
    ],
  },
  {
    id: "3", agency: "Crescendo Digital", value: 1200000, contact: "Vikram Rao",
    contactEmail: "vikram@crescendo.in", contactPhone: "+91 99887 66554",
    expectedClose: "2026-03-30", accountManager: "Priya Sharma", stage: "Negotiating",
    probability: 70, nextFollowUp: "2026-03-09", lastActivity: "2026-03-08",
    notes: "Negotiating on quarterly retainer terms. Close to finalising.",
    leadSource: "Referral",
    activity: [
      { date: "2026-03-08", text: "Counter-proposal received" },
      { date: "2026-03-05", text: "Pricing discussion call" },
      { date: "2026-03-01", text: "Proposal accepted in principle" },
    ],
  },
  {
    id: "4", agency: "Zenith Brands", value: 550000, contact: "Meera Joshi",
    contactEmail: "meera@zenithbrands.com", contactPhone: "+91 88776 55443",
    expectedClose: "2026-02-28", accountManager: "Arjun Kapoor", stage: "Closed Won",
    probability: 100, nextFollowUp: "", lastActivity: "2026-02-28",
    notes: "Deal closed. Onboarding scheduled for next week.",
    leadSource: "Phone Calls",
    activity: [
      { date: "2026-02-28", text: "Contract signed" },
      { date: "2026-02-25", text: "Final terms agreed" },
    ],
  },
  {
    id: "5", agency: "NovaAd Co.", value: 320000, contact: "Sanjay Patel",
    contactEmail: "sanjay@novaad.co", contactPhone: "+91 77665 44332",
    expectedClose: "2026-03-01", accountManager: "Priya Sharma", stage: "Closed Lost",
    probability: 0, nextFollowUp: "", lastActivity: "2026-03-01",
    notes: "Lost to competitor on pricing.",
    leadSource: "WhatsApp",
    activity: [
      { date: "2026-03-01", text: "Deal marked as lost" },
      { date: "2026-02-27", text: "Client chose competitor" },
    ],
  },
];

const accountManagers = [...new Set(sampleDeals.map((d) => d.accountManager))];
const closeMonths = [...new Set(sampleDeals.map((d) => d.expectedClose.slice(0, 7)))].sort();

const stageColor: Record<string, string> = {
  Lead: "bg-muted text-muted-foreground",
  "Proposal Sent": "bg-blue-50 text-blue-700 border-blue-200",
  Negotiating: "bg-amber-50 text-amber-700 border-amber-200",
  "Closed Won": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Closed Lost": "bg-red-50 text-red-700 border-red-200",
};

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function formatMonth(ym: string) {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1);
  return date.toLocaleString("en-IN", { month: "short", year: "numeric" });
}

type SortKey = "agency" | "value" | "stage" | "accountManager" | "expectedClose" | "lastActivity";

export default function Pipeline() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filterAM, setFilterAM] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("agency");
  const [sortAsc, setSortAsc] = useState(true);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    { id: "1", name: "Google Ads", conversionRate: 12, color: "#4285F4" },
    { id: "2", name: "Google Analytics", conversionRate: 8, color: "#FF6D00" },
    { id: "3", name: "WhatsApp", conversionRate: 22, color: "#25D366" },
    { id: "4", name: "Phone Calls", conversionRate: 18, color: "#10B981" },
    { id: "5", name: "Website Contact Form", conversionRate: 15, color: "#6366F1" },
    { id: "6", name: "Referral", conversionRate: 35, color: "#8B5CF6" },
  ]);
  const [showAddSourceDialog, setShowAddSourceDialog] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceConversionRate, setNewSourceConversionRate] = useState("");

  const filtered = useMemo(() => {
    let deals = sampleDeals;
    if (filterAM !== "all") deals = deals.filter((d) => d.accountManager === filterAM);
    if (filterMonth !== "all") deals = deals.filter((d) => d.expectedClose.startsWith(filterMonth));
    if (search.trim()) {
      const q = search.toLowerCase();
      deals = deals.filter((d) =>
        d.agency.toLowerCase().includes(q) || d.contact.toLowerCase().includes(q) || d.accountManager.toLowerCase().includes(q)
      );
    }
    return deals;
  }, [filterAM, filterMonth, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "value") cmp = a.value - b.value;
      else cmp = (a[sortKey] ?? "").localeCompare(b[sortKey] ?? "");
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortAsc]);

  const openPipeline = filtered
    .filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  const searchLower = search.toLowerCase();
  const isHighlighted = (deal: Deal) => search.trim() !== "" && (
    deal.agency.toLowerCase().includes(searchLower) || deal.contact.toLowerCase().includes(searchLower)
  );

  const handleAddLeadSource = () => {
    if (newSourceName.trim() && newSourceConversionRate.trim()) {
      const newSource: LeadSource = {
        id: Date.now().toString(),
        name: newSourceName.trim(),
        conversionRate: parseFloat(newSourceConversionRate),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      setLeadSources([...leadSources, newSource]);
      setNewSourceName("");
      setNewSourceConversionRate("");
      setShowAddSourceDialog(false);
    }
  };

  const calculateConversionRate = (fromStage: string, toStage: string) => {
    const fromDeals = filtered.filter(d => d.stage === fromStage);
    const toDeals = filtered.filter(d => d.stage === toStage);
    if (fromDeals.length === 0) return 0;
    return Math.round((toDeals.length / fromDeals.length) * 100);
  };

  const getLeadSourceData = () => {
    const sourceCount: Record<string, number> = {};
    filtered.forEach(deal => {
      if (deal.leadSource) {
        sourceCount[deal.leadSource] = (sourceCount[deal.leadSource] || 0) + 1;
      }
    });
    
    return leadSources.map(source => ({
      name: source.name,
      value: sourceCount[source.name] || 0,
      conversionRate: source.conversionRate,
      color: source.color
    })).filter(item => item.value > 0);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortAsc ? <ArrowUp className="h-3 w-3 inline ml-1" /> : <ArrowDown className="h-3 w-3 inline ml-1" />;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track and manage your sales pipeline</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 gap-1.5 ${view === "kanban" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setView("kanban")}
            >
              <LayoutGrid className="h-4 w-4" /> Board
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 gap-1.5 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" /> List
            </Button>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
            <Plus className="h-4 w-4" /> New Deal
          </Button>
        </div>
      </div>

      {/* Pipeline value & filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Open Pipeline</p>
          <p className="text-3xl font-bold text-foreground">{formatINR(openPipeline)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-52 h-9"
            />
          </div>
          <Select value={filterAM} onValueChange={setFilterAM}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="All Account Managers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Account Managers</SelectItem>
              {accountManagers.map((am) => (
                <SelectItem key={am} value={am}>{am}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="All Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {closeMonths.map((m) => (
                <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map((stage) => {
              const deals = filtered.filter((d) => d.stage === stage.name);
              const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
              const conversionRate = stage.name === "Closed Lost" ? 0 : 
                stage.name === "Closed Won" ? calculateConversionRate("Negotiating", "Closed Won") :
                stage.name === "Negotiating" ? calculateConversionRate("Proposal Sent", "Negotiating") :
                stage.name === "Proposal Sent" ? calculateConversionRate("Leads", "Proposal Sent") : 0;
              
              const colors = stageColors[stage.name];
              
              return (
                <div key={stage.name} className="min-w-[280px] flex-1 flex flex-col max-h-[calc(100vh-280px)]">
                  <div className={`${colors.header} rounded-t-lg p-3 border ${colors.border}`}>
                    <h3 className={`text-sm font-semibold ${colors.text}`}>{stage.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">{deals.length} deals</Badge>
                      <span className={`text-xs font-medium ${colors.text}`}>{formatINR(totalValue)}</span>
                    </div>
                    {conversionRate > 0 && (
                      <div className="mt-2">
                        <span className={`text-xs ${colors.text}`}>Conversion: {conversionRate}%</span>
                      </div>
                    )}
                  </div>
                  <div className={`space-y-3 overflow-y-auto flex-1 p-3 border ${colors.border} border-t-0 ${colors.bg} rounded-b-lg`}>
                    {deals.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                        No deals
                      </div>
                    )}
                    {deals.map((deal) => (
                      <Card
                        key={deal.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow border-border ${isHighlighted(deal) ? "ring-2 ring-blue-400 shadow-md" : ""}`}
                        onClick={() => setSelectedDeal(deal)}
                      >
                        <CardContent className="p-4 space-y-2.5">
                          <p className="font-semibold text-sm text-foreground leading-tight">{deal.agency}</p>
                          <p className="text-lg font-bold text-foreground">{formatINR(deal.value)}</p>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><User className="h-3 w-3" /> {deal.contact}</div>
                            <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Close: {deal.expectedClose}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {deal.leadSource && (
                              <Badge variant="secondary" className="text-[10px] font-normal">
                                {deal.leadSource}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] font-normal">{deal.accountManager}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Lead Sources Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Lead Sources</h2>
              <Dialog open={showAddSourceDialog} onOpenChange={setShowAddSourceDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
                    <Plus className="h-4 w-4" /> Add Lead Source
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Lead Source</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="source-name">Source Name</Label>
                      <Input
                        id="source-name"
                        placeholder="e.g., Instagram, Referral, Cold Outreach"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="conversion-rate">Conversion Rate (%)</Label>
                      <Input
                        id="conversion-rate"
                        type="number"
                        placeholder="e.g., 25"
                        value={newSourceConversionRate}
                        onChange={(e) => setNewSourceConversionRate(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddLeadSource} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Add Source
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddSourceDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-foreground mb-4">Lead Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getLeadSourceData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getLeadSourceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as any;
                            return (
                              <div className="bg-background border border-border rounded p-2">
                                <p className="text-sm font-medium">{data.name}</p>
                                <p className="text-xs text-muted-foreground">Leads: {data.value}</p>
                                <p className="text-xs text-muted-foreground">Conversion Rate: {data.conversionRate}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-foreground mb-4">Lead Source Details</h3>
                  <div className="space-y-3">
                    {getLeadSourceData().map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                          <span className="text-sm font-medium text-foreground">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{source.value} leads</p>
                          <p className="text-xs text-muted-foreground">{source.conversionRate}% conversion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* List View */}
      {view === "list" && (
        <Card className="border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("agency")}>Agency <SortIcon col="agency" /></TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("value")}>Deal Value <SortIcon col="value" /></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("stage")}>Stage <SortIcon col="stage" /></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("accountManager")}>Account Manager <SortIcon col="accountManager" /></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("expectedClose")}>Expected Close <SortIcon col="expectedClose" /></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("lastActivity")}>Last Activity <SortIcon col="lastActivity" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No deals found</TableCell></TableRow>
              )}
              {sorted.map((deal) => (
                <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDeal(deal)}>
                  <TableCell className="font-medium text-foreground">{deal.agency}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">{formatINR(deal.value)}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${stageColor[deal.stage]}`}>{deal.stage}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{deal.accountManager}</TableCell>
                  <TableCell className="text-muted-foreground">{deal.expectedClose}</TableCell>
                  <TableCell className="text-muted-foreground">{deal.lastActivity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Deal detail side panel */}
      <Sheet open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedDeal && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-lg">{selectedDeal.agency}</SheetTitle>
                <Badge variant="outline" className={`w-fit text-xs ${stageColor[selectedDeal.stage]}`}>{selectedDeal.stage}</Badge>
              </SheetHeader>
              <div className="space-y-5">
                <section className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-foreground"><User className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contact}</div>
                    <div className="flex items-center gap-2 text-foreground"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contactEmail}</div>
                    <div className="flex items-center gap-2 text-foreground"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contactPhone}</div>
                  </div>
                </section>
                <Separator />
                <section className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">Deal Value</p><p className="text-sm font-semibold text-foreground flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{formatINR(selectedDeal.value).replace("₹", "")}</p></div>
                  <div><p className="text-xs text-muted-foreground">Probability</p><p className="text-sm font-semibold text-foreground flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{selectedDeal.probability}%</p></div>
                  <div><p className="text-xs text-muted-foreground">Expected Close</p><p className="text-sm font-semibold text-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{selectedDeal.expectedClose}</p></div>
                  <div><p className="text-xs text-muted-foreground">Next Follow-up</p><p className="text-sm font-semibold text-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedDeal.nextFollowUp || "—"}</p></div>
                  <div className="col-span-2"><p className="text-xs text-muted-foreground">Account Manager</p><p className="text-sm font-semibold text-foreground">{selectedDeal.accountManager}</p></div>
                </section>
                <Separator />
                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1"><StickyNote className="h-3.5 w-3.5" />Notes</h4>
                  <p className="text-sm text-foreground">{selectedDeal.notes}</p>
                </section>
                <Separator />
                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Activity Log</h4>
                  <div className="space-y-3">
                    {selectedDeal.activity.map((a, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-muted-foreground text-xs whitespace-nowrap pt-0.5">{a.date}</span>
                        <span className="text-foreground">{a.text}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
