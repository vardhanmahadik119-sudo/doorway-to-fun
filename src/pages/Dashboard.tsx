import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, AlertTriangle, FolderOpen } from "lucide-react";

const stats = [
  { label: "Active Clients", value: "0", icon: Users },
  { label: "Pending Approvals", value: "0", icon: Clock },
  { label: "Overdue Follow-ups", value: "0", icon: AlertTriangle },
  { label: "Open Deals", value: "0", icon: FolderOpen },
];

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
