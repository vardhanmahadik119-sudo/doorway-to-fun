import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Phone, Mail, Calendar, User, IndianRupee, TrendingUp, Clock, StickyNote } from "lucide-react";

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
  activity: { date: string; text: string }[];
}

const stages = ["Lead", "Proposal Sent", "Negotiating", "Closed Won", "Closed Lost"];

const sampleDeals: Deal[] = [
  {
    id: "1",
    agency: "BrightStar Media",
    value: 450000,
    contact: "Rahul Mehta",
    contactEmail: "rahul@brightstar.in",
    contactPhone: "+91 98765 43210",
    expectedClose: "2026-03-25",
    accountManager: "Priya Sharma",
    stage: "Lead",
    probability: 20,
    nextFollowUp: "2026-03-10",
    notes: "Interested in social media management package.",
    activity: [
      { date: "2026-03-07", text: "Initial discovery call completed" },
      { date: "2026-03-05", text: "Inbound enquiry via website" },
    ],
  },
  {
    id: "2",
    agency: "PixelForge Studios",
    value: 780000,
    contact: "Ananya Iyer",
    contactEmail: "ananya@pixelforge.co",
    contactPhone: "+91 91234 56789",
    expectedClose: "2026-04-10",
    accountManager: "Arjun Kapoor",
    stage: "Proposal Sent",
    probability: 45,
    nextFollowUp: "2026-03-12",
    notes: "Proposal sent for full-service digital campaigns. Awaiting feedback.",
    activity: [
      { date: "2026-03-06", text: "Proposal document shared via email" },
      { date: "2026-03-03", text: "Requirements gathering meeting" },
    ],
  },
  {
    id: "3",
    agency: "Crescendo Digital",
    value: 1200000,
    contact: "Vikram Rao",
    contactEmail: "vikram@crescendo.in",
    contactPhone: "+91 99887 66554",
    expectedClose: "2026-03-30",
    accountManager: "Priya Sharma",
    stage: "Negotiating",
    probability: 70,
    nextFollowUp: "2026-03-09",
    notes: "Negotiating on quarterly retainer terms. Close to finalising.",
    activity: [
      { date: "2026-03-08", text: "Counter-proposal received" },
      { date: "2026-03-05", text: "Pricing discussion call" },
      { date: "2026-03-01", text: "Proposal accepted in principle" },
    ],
  },
  {
    id: "4",
    agency: "Zenith Brands",
    value: 550000,
    contact: "Meera Joshi",
    contactEmail: "meera@zenithbrands.com",
    contactPhone: "+91 88776 55443",
    expectedClose: "2026-02-28",
    accountManager: "Arjun Kapoor",
    stage: "Closed Won",
    probability: 100,
    nextFollowUp: "",
    notes: "Deal closed. Onboarding scheduled for next week.",
    activity: [
      { date: "2026-02-28", text: "Contract signed" },
      { date: "2026-02-25", text: "Final terms agreed" },
    ],
  },
  {
    id: "5",
    agency: "NovaAd Co.",
    value: 320000,
    contact: "Sanjay Patel",
    contactEmail: "sanjay@novaad.co",
    contactPhone: "+91 77665 44332",
    expectedClose: "2026-03-01",
    accountManager: "Priya Sharma",
    stage: "Closed Lost",
    probability: 0,
    nextFollowUp: "",
    notes: "Lost to competitor on pricing.",
    activity: [
      { date: "2026-03-01", text: "Deal marked as lost" },
      { date: "2026-02-27", text: "Client chose competitor" },
    ],
  },
];

const accountManagers = [...new Set(sampleDeals.map((d) => d.accountManager))];

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

export default function Deals() {
  const [filterAM, setFilterAM] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filtered = filterAM === "all" ? sampleDeals : sampleDeals.filter((d) => d.accountManager === filterAM);

  const openPipeline = filtered
    .filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage))
    .reduce((s, d) => s + d.value, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Deals Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Track and manage your sales pipeline</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 self-start">
          <Plus className="h-4 w-4" /> New Deal
        </Button>
      </div>

      {/* Pipeline value & filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Open Pipeline</p>
          <p className="text-3xl font-bold text-foreground">{formatINR(openPipeline)}</p>
        </div>
        <Select value={filterAM} onValueChange={setFilterAM}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All Account Managers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Account Managers</SelectItem>
            {accountManagers.map((am) => (
              <SelectItem key={am} value={am}>{am}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const deals = filtered.filter((d) => d.stage === stage);
          return (
            <div key={stage} className="min-w-[260px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                <Badge variant="secondary" className="text-xs">{deals.length}</Badge>
              </div>
              <div className="space-y-3">
                {deals.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    No deals
                  </div>
                )}
                {deals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-border"
                    onClick={() => setSelectedDeal(deal)}
                  >
                    <CardContent className="p-4 space-y-2.5">
                      <p className="font-semibold text-sm text-foreground leading-tight">{deal.agency}</p>
                      <p className="text-lg font-bold text-foreground">{formatINR(deal.value)}</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" /> {deal.contact}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> Close: {deal.expectedClose}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {deal.accountManager}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal detail side panel */}
      <Sheet open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedDeal && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-lg">{selectedDeal.agency}</SheetTitle>
                <Badge variant="outline" className={`w-fit text-xs ${stageColor[selectedDeal.stage]}`}>
                  {selectedDeal.stage}
                </Badge>
              </SheetHeader>

              <div className="space-y-5">
                {/* Contact info */}
                <section className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-foreground"><User className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contact}</div>
                    <div className="flex items-center gap-2 text-foreground"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contactEmail}</div>
                    <div className="flex items-center gap-2 text-foreground"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedDeal.contactPhone}</div>
                  </div>
                </section>

                <Separator />

                {/* Deal info */}
                <section className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Deal Value</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{formatINR(selectedDeal.value).replace("₹", "")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Probability</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" />{selectedDeal.probability}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Close</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{selectedDeal.expectedClose}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Follow-up</p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedDeal.nextFollowUp || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Account Manager</p>
                    <p className="text-sm font-semibold text-foreground">{selectedDeal.accountManager}</p>
                  </div>
                </section>

                <Separator />

                {/* Notes */}
                <section>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1"><StickyNote className="h-3.5 w-3.5" />Notes</h4>
                  <p className="text-sm text-foreground">{selectedDeal.notes}</p>
                </section>

                <Separator />

                {/* Activity log */}
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
