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
import { Plus, Phone, Mail, Calendar, User, IndianRupee, TrendingUp, Clock, StickyNote, LayoutGrid, List, Search, ArrowUp, ArrowDown } from "lucide-react";

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
}

const stages = ["Lead", "Proposal Sent", "Negotiating", "Closed Won", "Closed Lost"];

const sampleDeals: Deal[] = [
  {
    id: "1", agency: "BrightStar Media", value: 450000, contact: "Rahul Mehta",
    contactEmail: "rahul@brightstar.in", contactPhone: "+91 98765 43210",
    expectedClose: "2026-03-25", accountManager: "Priya Sharma", stage: "Lead",
    probability: 20, nextFollowUp: "2026-03-10", lastActivity: "2026-03-07",
    notes: "Interested in social media management package.",
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

export default function Deals() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [filterAM, setFilterAM] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("agency");
  const [sortAsc, setSortAsc] = useState(true);

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
          <h1 className="text-2xl font-semibold text-foreground">Deals Pipeline</h1>
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
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const deals = filtered.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="min-w-[260px] flex-1 flex flex-col max-h-[calc(100vh-280px)]">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                  <Badge variant="secondary" className="text-xs">{deals.length}</Badge>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
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
                        <Badge variant="outline" className="text-[10px] font-normal">{deal.accountManager}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
