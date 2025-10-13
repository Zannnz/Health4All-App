import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import FitnessProfile from "@/pages/fitness-profile";
import Workouts from "@/pages/workouts";
import Health from "@/pages/health";
import Hiking from "@/pages/hiking";
import Progress from "@/pages/progress";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" element={<Landing />} />
        <Route element={<NotFound />} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<FitnessProfile />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/health" element={<Health />} />
      <Route path="/hiking" element={<Hiking />} />
      <Route path="/progress" element={<Progress />} />
      <Route element={<NotFound />} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
