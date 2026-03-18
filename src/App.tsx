import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/react";
import { useEffect } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientProfile from "./pages/ClientProfile";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/auth");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
};

const RootRedirect = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return <Navigate to={isSignedIn ? "/dashboard" : "/auth"} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    <Route path="/auth" element={<Auth />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients"
      element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients/:id"
      element={
        <ProtectedRoute>
          <ClientProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/deals"
      element={
        <ProtectedRoute>
          <Deals />
        </ProtectedRoute>
      }
    />
    <Route
      path="/tasks"
      element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  if (!clerkPubKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Configuration Required</h1>
          <p className="text-muted-foreground">Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClerkProvider 
            publishableKey={clerkPubKey}
            afterSignOutUrl="/auth"
          >
            <AppRoutes />
          </ClerkProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
