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
import {
  Users,
  FolderOpen,
  Clock,
  AlertTriangle,
  CircleDot,
  FileText,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

const stats = [
  { label: "Active Clients", value: "0", icon: Users },
  { label: "Open Deals", value: "0", icon: FolderOpen },
  { label: "Pending Approvals", value: "0", icon: Clock },
  { label: "Overdue Tasks", value: "0", icon: AlertTriangle },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-[1400px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your agency's pipeline and priorities.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid: Left + Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Priorities */}
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Today's Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overdue Follow-ups */}
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Overdue Follow-ups
                    </h3>
                    <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-md">
                      No overdue follow-ups.
                    </p>
                  </div>

                  {/* Pending Approvals */}
                  <div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Pending Approvals
                    </h3>
                    <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-md">
                      No pending approvals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Health Table */}
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Client Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Account Manager</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm text-muted-foreground py-8"
                      >
                        No clients yet.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Team Activity Feed */}
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No recent activity.
                </p>
              </CardContent>
            </Card>

            {/* Revenue Snapshot */}
            <Card className="shadow-none border">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Revenue Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Invoices Sent</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      $0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Paid</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      $0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Overdue</span>
                    </div>
                    <span className="text-sm font-medium text-destructive">
                      $0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
