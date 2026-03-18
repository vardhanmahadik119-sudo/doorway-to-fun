import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/react";
import { useEffect, Suspense, lazy } from "react";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const Deals = lazy(() => import("./pages/Deals"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Reports = lazy(() => import("./pages/Reports"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
    <Route 
      path="/auth" 
      element={
        <Suspense fallback={<LoadingFallback />}>
          <Auth />
        </Suspense>
      } 
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Clients />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/clients/:id"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <ClientProfile />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/deals"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Deals />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/tasks"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Tasks />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route
      path="/reports"
      element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <Reports />
          </Suspense>
        </ProtectedRoute>
      }
    />
    <Route 
      path="*" 
      element={
        <Suspense fallback={<LoadingFallback />}>
          <NotFound />
        </Suspense>
      } 
    />
  </Routes>
);

const App = () => (
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

export default App;
