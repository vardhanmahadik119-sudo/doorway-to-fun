import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
  IndianRupee,
  PhoneCall,
  SendHorizonal,
  ListPlus,
  Circle,
  Clock,
  CalendarDays,
  FileText,
  MessageSquare,
} from "lucide-react";

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[1100px]">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/clients")}
          className="mb-4 -ml-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clients
        </Button>

        {/* ── Header Card ── */}
        <Card className="shadow-none border mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Logo placeholder */}
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-muted-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                      Client #{id}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Advertising &amp; Media
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>Contact: —</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>—</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>—</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>AM: —</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-sm font-medium text-foreground">
                  <IndianRupee className="h-3.5 w-3.5" />
                  ₹0 / month
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <Separator className="my-4" />
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-1.5">
                <PhoneCall className="h-3.5 w-3.5" />
                Log Call
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <SendHorizonal className="h-3.5 w-3.5" />
                Send Approval
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ListPlus className="h-3.5 w-3.5" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1 — Active Campaigns */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                No active campaigns.
              </p>
            </CardContent>
          </Card>

          {/* 2 — Pending Approvals */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                No pending approvals.
              </p>
            </CardContent>
          </Card>

          {/* 3 — Open Tasks */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Open Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      No open tasks.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 4 — Activity Log */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                No activity recorded.
              </p>
            </CardContent>
          </Card>

          {/* 5 — Invoices & Payments */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Invoice &amp; Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 6 — Notes */}
          <Card className="shadow-none border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add a note about this client..."
                className="resize-none min-h-[80px]"
              />
              <Button size="sm" variant="outline">
                Save Note
              </Button>
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                No notes yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientProfile;
