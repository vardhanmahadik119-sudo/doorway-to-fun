import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  List,
  LayoutGrid,
  X,
  TrendingUp,
  Phone,
  MapPin,
  Clock,
  CircleDot,
  IndianRupee,
  User,
  MessageSquare,
  CheckSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost" | "junk";
type Platform = "all" | "meta" | "google" | "linkedin" | "seo" | "whatsapp";
type HealthStatus = "Healthy" | "At Risk" | "Critical";

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  status: LeadStatus;
  platform: Exclude<Platform, "all">;
  adName: string;
  assignedTo: string | null;
  estimatedValue: number | null;
  timeAgo: string;
  notes: string;
  activity: { text: string; time: string; icon: "lead" | "whatsapp" | "call" | "note" }[];
}

interface ClientData {
  id: string;
  name: string;
  platforms: Exclude<Platform, "all">[];
  health: HealthStatus;
  leads: Lead[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLIENTS: ClientData[] = [
  {
    id: "brightstar",
    name: "BrightStar Media",
    platforms: ["meta", "google", "seo"],
    health: "Healthy",
    leads: [
      { id: "l1", name: "Ravi Kumar", phone: "+91 98765 43210", city: "Mumbai", status: "new", platform: "meta", adName: "2BHK Interior Package", assignedTo: "Priya", estimatedValue: null, timeAgo: "2m ago", notes: "", activity: [{ text: "Lead received via Meta Ads", time: "2:34pm", icon: "lead" }, { text: "WhatsApp alert sent to Priya", time: "2:34pm", icon: "whatsapp" }] },
      { id: "l2", name: "Sneha Patil", phone: "+91 87654 32109", city: "Pune", status: "contacted", platform: "meta", adName: "2BHK Interior Package", assignedTo: "Priya", estimatedValue: 45000, timeAgo: "1h ago", notes: "Called once, will call back tomorrow", activity: [{ text: "Lead received via Meta Ads", time: "11:20am", icon: "lead" }, { text: "Called by Priya — no answer", time: "11:45am", icon: "call" }] },
      { id: "l3", name: "Amit Shah", phone: "+91 76543 21098", city: "Ahmedabad", status: "qualified", platform: "google", adName: "Home Renovation - Search", assignedTo: "Rahul", estimatedValue: 80000, timeAgo: "3h ago", notes: "Very interested, budget confirmed ₹80k", activity: [{ text: "Lead received via Google Ads", time: "9:15am", icon: "lead" }, { text: "Called by Rahul — qualified", time: "10:00am", icon: "call" }] },
      { id: "l4", name: "Meera Joshi", phone: "+91 65432 10987", city: "Mumbai", status: "proposal", platform: "meta", adName: "Premium Package", assignedTo: "Priya", estimatedValue: 120000, timeAgo: "1d ago", notes: "Proposal sent via email", activity: [{ text: "Lead received via Meta Ads", time: "Yesterday 3pm", icon: "lead" }, { text: "Proposal sent by Priya", time: "Yesterday 5pm", icon: "note" }] },
      { id: "l5", name: "Karan Patel", phone: "+91 54321 09876", city: "Surat", status: "won", platform: "google", adName: "Home Renovation - Search", assignedTo: "Rahul", estimatedValue: 65000, timeAgo: "2d ago", notes: "Closed! Project starts next week", activity: [{ text: "Lead received via Google Ads", time: "2d ago 10am", icon: "lead" }, { text: "Deal closed by Rahul", time: "2d ago 4pm", icon: "call" }] },
      { id: "l6", name: "Divya Nair", phone: "+91 43210 98765", city: "Bangalore", status: "new", platform: "seo", adName: "Organic — Interior Design", assignedTo: null, estimatedValue: null, timeAgo: "5m ago", notes: "", activity: [{ text: "Lead received via SEO", time: "2:31pm", icon: "lead" }] },
      { id: "l7", name: "Suresh Menon", phone: "+91 32109 87654", city: "Chennai", status: "new", platform: "meta", adName: "2BHK Interior Package", assignedTo: null, estimatedValue: null, timeAgo: "8m ago", notes: "", activity: [{ text: "Lead received via Meta Ads", time: "2:28pm", icon: "lead" }] },
      { id: "l8", name: "Pooja Iyer", phone: "+91 21098 76543", city: "Mumbai", status: "contacted", platform: "google", adName: "Home Renovation - Display", assignedTo: "Priya", estimatedValue: null, timeAgo: "2h ago", notes: "", activity: [{ text: "Lead received via Google Ads", time: "12:30pm", icon: "lead" }, { text: "Called by Priya — interested", time: "1:00pm", icon: "call" }] },
    ],
  },
  {
    id: "zenith",
    name: "Zenith Brands",
    platforms: ["google", "seo"],
    health: "At Risk",
    leads: [
      { id: "l9", name: "Arjun Sharma", phone: "+91 90876 54321", city: "Delhi", status: "new", platform: "google", adName: "Brand Campaign Q2", assignedTo: "Rahul", estimatedValue: null, timeAgo: "15m ago", notes: "", activity: [{ text: "Lead received via Google Ads", time: "2:21pm", icon: "lead" }] },
      { id: "l10", name: "Nisha Kapoor", phone: "+91 89765 43210", city: "Noida", status: "qualified", platform: "seo", adName: "Organic — Brand", assignedTo: "Ananya", estimatedValue: 55000, timeAgo: "4h ago", notes: "Good budget, decision next week", activity: [{ text: "Lead received via SEO", time: "10am", icon: "lead" }, { text: "Called by Ananya — qualified", time: "11am", icon: "call" }] },
      { id: "l11", name: "Vikram Singh", phone: "+91 78654 32109", city: "Gurgaon", status: "contacted", platform: "google", adName: "Brand Campaign Q2", assignedTo: "Rahul", estimatedValue: null, timeAgo: "6h ago", notes: "", activity: [{ text: "Lead received via Google Ads", time: "8am", icon: "lead" }] },
    ],
  },
  {
    id: "pixelforge",
    name: "PixelForge Studios",
    platforms: ["meta", "linkedin"],
    health: "Healthy",
    leads: [
      { id: "l12", name: "Rohan Desai", phone: "+91 77654 32108", city: "Hyderabad", status: "new", platform: "meta", adName: "Studio Package - Meta", assignedTo: null, estimatedValue: null, timeAgo: "20m ago", notes: "", activity: [{ text: "Lead received via Meta Ads", time: "2:16pm", icon: "lead" }] },
      { id: "l13", name: "Kavya Reddy", phone: "+91 66543 21097", city: "Hyderabad", status: "proposal", platform: "linkedin", adName: "B2B Studio Services", assignedTo: "Ananya", estimatedValue: 200000, timeAgo: "1d ago", notes: "Corporate client, big budget", activity: [{ text: "Lead received via LinkedIn", time: "Yesterday 10am", icon: "lead" }, { text: "Proposal sent by Ananya", time: "Yesterday 3pm", icon: "note" }] },
      { id: "l14", name: "Aditya Kumar", phone: "+91 55432 10986", city: "Bangalore", status: "new", platform: "meta", adName: "Studio Package - Meta", assignedTo: null, estimatedValue: null, timeAgo: "35m ago", notes: "", activity: [{ text: "Lead received via Meta Ads", time: "2:01pm", icon: "lead" }] },
      { id: "l15", name: "Sanya Patel", phone: "+91 44321 09875", city: "Mumbai", status: "won", platform: "linkedin", adName: "B2B Studio Services", assignedTo: "Ananya", estimatedValue: 150000, timeAgo: "3d ago", notes: "Closed!", activity: [{ text: "Lead received via LinkedIn", time: "3d ago", icon: "lead" }, { text: "Deal closed by Ananya", time: "2d ago", icon: "call" }] },
    ],
  },
  {
    id: "novaad",
    name: "NovaAd Co.",
    platforms: ["meta", "seo"],
    health: "Healthy",
    leads: [
      { id: "l16", name: "Prerna Gupta", phone: "+91 33210 98764", city: "Jaipur", status: "qualified", platform: "meta", adName: "NovaAd - Lead Gen", assignedTo: "Priya", estimatedValue: 35000, timeAgo: "5h ago", notes: "Ready to sign", activity: [{ text: "Lead received via Meta Ads", time: "9am", icon: "lead" }, { text: "Called by Priya — qualified", time: "9:30am", icon: "call" }] },
      { id: "l17", name: "Manish Tiwari", phone: "+91 22109 87653", city: "Lucknow", status: "contacted", platform: "seo", adName: "Organic", assignedTo: "Rahul", estimatedValue: null, timeAgo: "7h ago", notes: "", activity: [{ text: "Lead received via SEO", time: "7am", icon: "lead" }] },
    ],
  },
  {
    id: "crescendo",
    name: "Crescendo Digital",
    platforms: ["meta", "linkedin"],
    health: "Critical",
    leads: [
      { id: "l18", name: "Tanvi Bhatt", phone: "+91 11098 76542", city: "Mumbai", status: "new", platform: "meta", adName: "Crescendo - Awareness", assignedTo: null, estimatedValue: null, timeAgo: "3h ago", notes: "", activity: [{ text: "Lead received via Meta Ads", time: "11am", icon: "lead" }] },
      { id: "l19", name: "Nitin Jain", phone: "+91 09876 54321", city: "Indore", status: "junk", platform: "linkedin", adName: "B2B Campaign", assignedTo: "Rahul", estimatedValue: null, timeAgo: "1d ago", notes: "Wrong number, not interested", activity: [{ text: "Lead received via LinkedIn", time: "Yesterday", icon: "lead" }, { text: "Marked junk by Rahul", time: "Yesterday", icon: "call" }] },
    ],
  },
];

const EMPLOYEES = ["Priya", "Rahul", "Ananya", "Deepika"];

const STAGE_ORDER: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost", "junk"];

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  new:       { label: "New",       bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-500" },
  contacted: { label: "Contacted", bg: "bg-orange-50",  text: "text-orange-600", dot: "bg-orange-400" },
  qualified: { label: "Qualified", bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500" },
  proposal:  { label: "Proposal",  bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-500" },
  won:       { label: "Won",       bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
  lost:      { label: "Lost",      bg: "bg-gray-100",   text: "text-gray-500",   dot: "bg-gray-400" },
  junk:      { label: "Junk",      bg: "bg-gray-100",   text: "text-gray-400",   dot: "bg-gray-300" },
};

const PLATFORM_CONFIG: Record<Exclude<Platform, "all">, { label: string; color: string; dot: string }> = {
  meta:      { label: "Meta Ads",  color: "text-blue-600",   dot: "bg-blue-500" },
  google:    { label: "Google Ads",color: "text-red-500",    dot: "bg-red-400" },
  linkedin:  { label: "LinkedIn",  color: "text-indigo-600", dot: "bg-indigo-500" },
  seo:       { label: "SEO",       color: "text-green-600",  dot: "bg-green-500" },
  whatsapp:  { label: "WhatsApp",  color: "text-emerald-600",dot: "bg-emerald-500" },
};

const HEALTH_CONFIG: Record<HealthStatus, { bg: string; text: string; border: string }> = {
  "Healthy":  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "At Risk":  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  "Critical": { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const countByStatus = (leads: Lead[], status: LeadStatus) => leads.filter(l => l.status === status).length;
const countNew = (leads: Lead[]) => leads.filter(l => l.status === "new").length;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function PlatformTag({ platform }: { platform: Exclude<Platform, "all"> }) {
  const c = PLATFORM_CONFIG[platform];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.color}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Lead Detail Panel ────────────────────────────────────────────────────────

function LeadPanel({
  lead,
  onClose,
  onUpdate,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Lead>) => void;
}) {
  const [note, setNote] = useState("");

  const handleSaveNote = () => {
    if (!note.trim()) return;
    onUpdate(lead.id, {
      activity: [
        ...lead.activity,
        { text: `Note added: "${note.trim()}"`, time: "Just now", icon: "note" as const },
      ],
    });
    setNote("");
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <PlatformTag platform={lead.platform} />
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500">{lead.adName}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Phone className="h-4 w-4 text-gray-400" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />
              {lead.city}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-500">
              <Clock className="h-4 w-4 text-gray-400" />
              Came in {lead.timeAgo}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Stage */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stage</p>
            <div className="flex gap-1 mb-3">
              {(["new","contacted","qualified","proposal","won"] as LeadStatus[]).map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full cursor-pointer transition-colors ${
                    STAGE_ORDER.indexOf(lead.status) >= i ? STATUS_CONFIG[s].dot : "bg-gray-100"
                  }`}
                  onClick={() => onUpdate(lead.id, { status: s })}
                />
              ))}
            </div>
            <Select value={lead.status} onValueChange={(v) => onUpdate(lead.id, { status: v as LeadStatus })}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_ORDER.map(s => (
                  <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Value */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estimated Value</p>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="number"
                placeholder="Enter deal value"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lead.estimatedValue ?? ""}
                onChange={(e) => onUpdate(lead.id, { estimatedValue: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            {lead.estimatedValue && (
              <p className="text-xs text-gray-500 mt-1">{formatInr(lead.estimatedValue)}</p>
            )}
          </div>

          {/* Assigned To */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assigned To</p>
            <Select
              value={lead.assignedTo ?? "unassigned"}
              onValueChange={(v) => onUpdate(lead.id, { assignedTo: v === "unassigned" ? null : v })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Activity */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Activity</p>
            <div className="space-y-3">
              {lead.activity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    a.icon === "lead"     ? "bg-blue-50" :
                    a.icon === "whatsapp" ? "bg-green-50" :
                    a.icon === "call"     ? "bg-orange-50" : "bg-gray-50"
                  }`}>
                    {a.icon === "lead"     && <CircleDot className="h-3 w-3 text-blue-500" />}
                    {a.icon === "whatsapp" && <MessageSquare className="h-3 w-3 text-green-500" />}
                    {a.icon === "call"     && <Phone className="h-3 w-3 text-orange-500" />}
                    {a.icon === "note"     && <CheckSquare className="h-3 w-3 text-gray-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Add Note */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add Note</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type a note..."
              className="min-h-[80px] text-sm resize-none"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleSaveNote} disabled={!note.trim()} className="flex-1">
                Save Note
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Log Call
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5">
                <CheckSquare className="h-3.5 w-3.5" />
                Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientLeadInbox() {
  const [clientsData, setClientsData] = useState<ClientData[]>(CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const selectedClient = clientsData.find(c => c.id === selectedClientId) ?? null;

  const updateLead = (leadId: string, patch: Partial<Lead>) => {
    setClientsData(prev =>
      prev.map(client => ({
        ...client,
        leads: client.leads.map(lead =>
          lead.id === leadId ? { ...lead, ...patch } : lead
        ),
      }))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, ...patch } : prev);
    }
  };

  const filteredLeads = (selectedClient?.leads ?? []).filter(lead => {
    if (selectedPlatform !== "all" && lead.platform !== selectedPlatform) return false;
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned" && lead.assignedTo !== null) return false;
      if (assigneeFilter !== "unassigned" && lead.assignedTo !== assigneeFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!lead.name.toLowerCase().includes(q) && !lead.phone.includes(q) && !lead.city.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const platformLeads = (platform: Platform) =>
    (selectedClient?.leads ?? []).filter(l => platform === "all" || l.platform === platform);

  const pipelineValue = filteredLeads
    .filter(l => l.estimatedValue)
    .reduce((s, l) => s + (l.estimatedValue ?? 0), 0);

  // ── Screen 1: Client Grid ──────────────────────────────────────────────────
  if (!selectedClientId) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] space-y-6 pb-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Client Lead Inbox</h1>
            <p className="text-sm text-gray-500 mt-0.5">Select a client to view and manage their leads</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientsData.map(client => {
              const newCount = countNew(client.leads);
              const h = HEALTH_CONFIG[client.health];
              return (
                <Card
                  key={client.id}
                  onClick={() => { setSelectedClientId(client.id); setSelectedPlatform("all"); }}
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {client.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {client.platforms.map(p => (
                            <span key={p} className={`inline-flex items-center gap-1 text-xs font-medium ${PLATFORM_CONFIG[p].color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${PLATFORM_CONFIG[p].dot}`} />
                              {PLATFORM_CONFIG[p].label}
                            </span>
                          ))}
                        </div>
                      </div>
                      {newCount > 0 && (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex-shrink-0">
                          {newCount}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{client.leads.length}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-red-500">{newCount}</p>
                        <p className="text-xs text-gray-500">New</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-emerald-600">{countByStatus(client.leads, "won")}</p>
                        <p className="text-xs text-gray-500">Won</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${h.bg} ${h.text} ${h.border}`}>
                        {client.health}
                      </span>
                      <span className="text-xs text-gray-400">
                        Last lead: {client.leads.sort((a, b) => 0)[0]?.timeAgo ?? "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ── Screen 2+3: Client Detail ──────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-[1400px] space-y-5 pb-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedClientId(null); setSelectedLead(null); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Client Lead Inbox
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-900">{selectedClient!.name}</span>
        </div>

        {/* Summary Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedClient!.name}</h2>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Lead overview across all platforms</p>
              </div>
              {pipelineValue > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Pipeline value</p>
                  <p className="text-xl font-bold text-gray-900">{formatInr(pipelineValue)}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([
                { label: "Total",     value: selectedClient!.leads.length, color: "text-gray-900" },
                { label: "New",       value: countNew(selectedClient!.leads), color: "text-red-500" },
                { label: "Contacted", value: countByStatus(selectedClient!.leads, "contacted"), color: "text-orange-500" },
                { label: "Qualified", value: countByStatus(selectedClient!.leads, "qualified"), color: "text-green-600" },
                { label: "Won",       value: countByStatus(selectedClient!.leads, "won"), color: "text-emerald-600" },
              ] as { label: string; value: number; color: string }[]).map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", ...selectedClient!.platforms] as Platform[]).map(p => {
            const count = platformLeads(p).length;
            const newC = platformLeads(p).filter(l => l.status === "new").length;
            const isActive = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p !== "all" && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : PLATFORM_CONFIG[p as Exclude<Platform,"all">].dot}`} />
                )}
                {p === "all" ? "All Platforms" : PLATFORM_CONFIG[p as Exclude<Platform,"all">].label}
                <span className={`text-xs font-semibold ml-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>{count}</span>
                {newC > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {newC}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters + View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as LeadStatus | "all")}>
              <SelectTrigger className="h-9 w-36 text-sm bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STAGE_ORDER.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="h-9 w-40 text-sm bg-white">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {EMPLOYEES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "kanban" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </button>
          </div>
        </div>

        {/* ── List View ──────────────────────────────────────────────────────── */}
        {viewMode === "list" && (
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-5 font-medium text-gray-500 text-xs uppercase tracking-wide">Lead</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Platform</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Assigned</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Value</th>
                    <th className="text-right py-3 px-5 font-medium text-gray-500 text-xs uppercase tracking-wide">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No leads found</td>
                    </tr>
                  )}
                  {filteredLeads.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{lead.phone} · {lead.city}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <PlatformTag platform={lead.platform} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {lead.assignedTo ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">{lead.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {lead.estimatedValue
                          ? <span className="font-medium text-gray-900">{formatInr(lead.estimatedValue)}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-gray-400">{lead.timeAgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredLeads.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  Showing {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
                  {pipelineValue > 0 && ` · Pipeline: ${formatInr(pipelineValue)}`}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* ── Kanban View ────────────────────────────────────────────────────── */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-2">
            {(["new","contacted","qualified","proposal","won"] as LeadStatus[]).map(stage => {
              const stageLeads = filteredLeads.filter(l => l.status === stage);
              const c = STATUS_CONFIG[stage];
              return (
                <div key={stage} className="min-w-[180px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{c.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900 leading-tight">{lead.name}</p>
                        <div className="mt-1.5">
                          <PlatformTag platform={lead.platform} />
                        </div>
                        {lead.estimatedValue && (
                          <p className="text-xs font-semibold text-gray-700 mt-1.5">{formatInr(lead.estimatedValue)}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          {lead.assignedTo ? (
                            <span className="text-xs text-gray-500">{lead.assignedTo}</span>
                          ) : (
                            <span className="text-xs text-orange-400 font-medium">Unassigned</span>
                          )}
                          <span className="text-xs text-gray-300">{lead.timeAgo}</span>
                        </div>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-300">No leads</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <LeadPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={updateLead}
        />
      )}
    </DashboardLayout>
  );
}
