import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Pipeline from "./pages/Pipeline";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import ClientReports from "./pages/ClientReports";
import Settings from "./pages/Settings";
import SharedReport from "./pages/SharedReport";
import ClientLeadInbox from "./pages/ClientLeadInbox";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/client-reports" element={<ClientReports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/client-lead-inbox" element={<ClientLeadInbox />} />
          <Route path="/shared-report/:id" element={<SharedReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
