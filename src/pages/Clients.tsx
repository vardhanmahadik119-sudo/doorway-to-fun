import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

type ClientStatus = "active" | "at-risk" | "churned";

interface Client {
  id: string;
  name: string;
  primaryContact: string;
  accountManager: string;
  status: ClientStatus;
  monthlyValue: number;
  lastActivity: string;
}

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  "at-risk": {
    label: "At Risk",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  churned: {
    label: "Churned",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const clients: Client[] = [
  {
    id: "brightline-foods",
    name: "Brightline Foods",
    primaryContact: "Priya Nair (CMO)",
    accountManager: "Alex Kim",
    status: "active",
    monthlyValue: 485000,
    lastActivity: "2h ago",
  },
  {
    id: "vertex-labs",
    name: "Vertex Labs",
    primaryContact: "Rahul Mehta",
    accountManager: "Jordan Lee",
    status: "at-risk",
    monthlyValue: 320000,
    lastActivity: "6d ago",
  },
  {
    id: "northwind-media",
    name: "Northwind Media",
    primaryContact: "Ananya Desai",
    accountManager: "Sam Rivera",
    status: "active",
    monthlyValue: 275000,
    lastActivity: "1d ago",
  },
  {
    id: "harbor-co",
    name: "Harbor & Co.",
    primaryContact: "Vikram Singh",
    accountManager: "Alex Kim",
    status: "active",
    monthlyValue: 198000,
    lastActivity: "3h ago",
  },
  {
    id: "oak-street-retail",
    name: "Oak Street Retail",
    primaryContact: "Meera Iyer",
    accountManager: "Jordan Lee",
    status: "at-risk",
    monthlyValue: 156000,
    lastActivity: "12d ago",
  },
  {
    id: "monsoon-digital",
    name: "Monsoon Digital",
    primaryContact: "Arjun Kapoor",
    accountManager: "Sam Rivera",
    status: "active",
    monthlyValue: 412000,
    lastActivity: "5h ago",
  },
  {
    id: "catalyst-sports",
    name: "Catalyst Sports",
    primaryContact: "Neha Sharma",
    accountManager: "Alex Kim",
    status: "active",
    monthlyValue: 640000,
    lastActivity: "Yesterday",
  },
  {
    id: "silverline-hospitality",
    name: "Silverline Hospitality",
    primaryContact: "Karan Malhotra",
    accountManager: "Jordan Lee",
    status: "churned",
    monthlyValue: 0,
    lastActivity: "45d ago",
  },
  {
    id: "pixel-grove",
    name: "Pixel Grove Studios",
    primaryContact: "Sana Khan",
    accountManager: "Sam Rivera",
    status: "active",
    monthlyValue: 225000,
    lastActivity: "4d ago",
  },
  {
    id: "blue-peak-fintech",
    name: "Blue Peak Fintech",
    primaryContact: "Dev Patel",
    accountManager: "Alex Kim",
    status: "active",
    monthlyValue: 890000,
    lastActivity: "30m ago",
  },
];

const Clients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContact.toLowerCase().includes(search.toLowerCase()) ||
      c.accountManager.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <DashboardLayout>
      <div className="max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Clients
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your agency's client accounts.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Client Table */}
        <Card className="shadow-none border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Account Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Monthly Value</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-muted-foreground py-12"
                    >
                      No clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((client) => (
                    <TableRow
                      key={client.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      <TableCell className="font-medium text-foreground">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.primaryContact}</TableCell>
                      <TableCell>{client.accountManager}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusConfig[client.status].className}
                        >
                          {statusConfig[client.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(client.monthlyValue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.lastActivity}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
