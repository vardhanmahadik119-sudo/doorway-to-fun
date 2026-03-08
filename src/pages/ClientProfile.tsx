import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
  Megaphone,
  ClipboardList,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-[1100px]">
        {/* Back Button & Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/clients")}
            className="mb-3 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Clients
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Client Profile
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Client ID: {id}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              Active
            </Badge>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="shadow-none border mb-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium text-foreground">—</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Primary Contact</p>
                  <p className="text-sm font-medium text-foreground">—</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">—</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">—</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="campaigns" className="gap-1.5">
              <Megaphone className="h-3.5 w-3.5" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="approvals" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card className="shadow-none border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Budget</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        No active campaigns.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="shadow-none border">
              <CardContent className="py-8">
                <p className="text-sm text-muted-foreground text-center">
                  No activity recorded.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card className="shadow-none border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        No pending approvals.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="shadow-none border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        No tasks assigned.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="shadow-none border">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClientProfile;
