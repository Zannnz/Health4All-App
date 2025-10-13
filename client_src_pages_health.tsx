import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertHealthMetricSchema, type HealthMetric, type InsertHealthMetric } from "@shared/schema";
import { Heart, Activity, Footprints, Flame, Plus, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HealthPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: metrics, isLoading } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics"],
  });

  const form = useForm<InsertHealthMetric>({
    resolver: zodResolver(insertHealthMetricSchema),
    defaultValues: {
      userId: user?.id || "",
      date: new Date().toISOString().split('T')[0],
      heartRatePre: undefined,
      heartRatePost: undefined,
      steps: undefined,
      caloriesBurned: undefined,
      workoutId: null,
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertHealthMetric) => {
      return await apiRequest("POST", "/api/health-metrics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/today"] });
      toast({
        title: "Success!",
        description: "Health data logged successfully.",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHealthMetric) => {
    mutation.mutate({
      ...data,
      userId: user?.id || "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-health-title">
              Health Metrics
            </h1>
            <p className="text-muted-foreground mt-1">Track your daily health data</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-log-health">
                <Plus className="w-4 h-4 mr-2" />
                Log Health Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Health Metrics</DialogTitle>
                <DialogDescription>Record your daily health data</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} data-testid="input-health-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heartRatePre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heart Rate (Pre-Workout)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="70" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-heart-rate-pre"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">bpm</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heartRatePost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heart Rate (Post-Workout)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="140" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-heart-rate-post"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">bpm</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="steps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steps</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="10000" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-steps"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="caloriesBurned"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories Burned</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="500" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-calories"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">kcal</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How did you feel today?"
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-health-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-health">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending} data-testid="button-save-health">
                      {mutation.isPending ? "Saving..." : "Save Metrics"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading health data...</p>
          </div>
        ) : metrics && metrics.length > 0 ? (
          <div className="space-y-4">
            {metrics.map((metric) => (
              <Card key={metric.id} className="hover-elevate" data-testid={`card-metric-${metric.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-foreground" data-testid={`text-metric-date-${metric.id}`}>
                          {metric.date}
                        </h3>
                        {metric.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{metric.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {metric.heartRatePre && (
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-chart-3" />
                          <div>
                            <p className="text-xs text-muted-foreground">Pre HR</p>
                            <p className="font-mono font-semibold text-foreground">{metric.heartRatePre}</p>
                          </div>
                        </div>
                      )}
                      {metric.heartRatePost && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-chart-2" />
                          <div>
                            <p className="text-xs text-muted-foreground">Post HR</p>
                            <p className="font-mono font-semibold text-foreground">{metric.heartRatePost}</p>
                          </div>
                        </div>
                      )}
                      {metric.steps && (
                        <div className="flex items-center gap-2">
                          <Footprints className="w-4 h-4 text-chart-1" />
                          <div>
                            <p className="text-xs text-muted-foreground">Steps</p>
                            <p className="font-mono font-semibold text-foreground">{metric.steps.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                      {metric.caloriesBurned && (
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-chart-4" />
                          <div>
                            <p className="text-xs text-muted-foreground">Calories</p>
                            <p className="font-mono font-semibold text-foreground">{metric.caloriesBurned}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No health data yet</h3>
              <p className="text-muted-foreground mb-6">Start tracking your health metrics to monitor your progress</p>
              <Button onClick={() => setOpen(true)} data-testid="button-log-first-health">
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
