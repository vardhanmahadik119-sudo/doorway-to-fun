import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, AlertTriangle, FolderOpen } from "lucide-react";

const stats = [
  { label: "Active Clients", value: "24", icon: Users, change: "+3 this month" },
  { label: "Pending Approvals", value: "8", icon: Clock, change: "2 urgent" },
  { label: "Overdue Follow-ups", value: "5", icon: AlertTriangle, change: "3 this week" },
  { label: "Open Deals", value: "12", icon: FolderOpen, change: "$340K pipeline" },
];

const recentActivity = [
  { client: "Apex Media Group", action: "Contract signed", time: "12 min ago", status: "completed" },
  { client: "Bright Ads Co.", action: "Proposal sent", time: "1 hr ago", status: "pending" },
  { client: "ClearView Digital", action: "Follow-up overdue", time: "3 hrs ago", status: "overdue" },
  { client: "Delta Brands", action: "Meeting scheduled", time: "5 hrs ago", status: "upcoming" },
  { client: "Echo Campaigns", action: "Invoice paid", time: "Yesterday", status: "completed" },
  { client: "Frontier Agency", action: "Brief submitted", time: "Yesterday", status: "pending" },
  { client: "GrowthPath Inc.", action: "Campaign launched", time: "2 days ago", status: "completed" },
];

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  overdue: "bg-red-50 text-red-700",
  upcoming: "bg-blue-50 text-blue-700",
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your agency's client pipeline.
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
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="shadow-none border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Client Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.client}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.action}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap w-20 text-right">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
