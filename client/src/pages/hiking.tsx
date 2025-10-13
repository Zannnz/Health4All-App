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
import { insertHikingSessionSchema, type HikingSession, type InsertHikingSession } from "@shared/schema";
import { Mountain, TrendingUp, MapPin, Clock, Flame, Plus, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HikingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: sessions, isLoading } = useQuery<HikingSession[]>({
    queryKey: ["/api/hiking"],
  });

  const form = useForm<InsertHikingSession>({
    resolver: zodResolver(insertHikingSessionSchema),
    defaultValues: {
      userId: user?.id || "",
      date: new Date().toISOString().split('T')[0],
      distance: undefined,
      elevationGain: undefined,
      duration: undefined,
      caloriesBurned: undefined,
      routeName: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertHikingSession) => {
      return await apiRequest("POST", "/api/hiking", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hiking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hiking/recent"] });
      toast({
        title: "Success!",
        description: "Hiking session logged successfully.",
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

  const onSubmit = (data: InsertHikingSession) => {
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
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-hiking-title">
              Hiking Adventures
            </h1>
            <p className="text-muted-foreground mt-1">Track your outdoor adventures and elevation gains</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-log-hike">
                <Plus className="w-4 h-4 mr-2" />
                Log Hike
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Hiking Session</DialogTitle>
                <DialogDescription>Record your hiking adventure details</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="routeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mountain Peak Trail" {...field} value={field.value || ""} data-testid="input-route-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} data-testid="input-hike-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="5.5" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || undefined)}
                              data-testid="input-distance"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">km</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="elevationGain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Elevation Gain</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="350" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || undefined)}
                              data-testid="input-elevation"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">meters</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="90" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-duration"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">minutes</FormDescription>
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
                              placeholder="450" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-hike-calories"
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
                            placeholder="Trail conditions, weather, highlights..."
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-hike-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-hike">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending} data-testid="button-save-hike">
                      {mutation.isPending ? "Saving..." : "Save Session"}
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
            <p className="mt-4 text-muted-foreground">Loading hiking sessions...</p>
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="hover-elevate" data-testid={`card-hike-${session.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2" data-testid={`text-hike-name-${session.id}`}>
                        <MapPin className="w-5 h-5 text-chart-4" />
                        {session.routeName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{session.date}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                      <Mountain className="w-6 h-6 text-chart-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {session.distance && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="font-mono font-semibold text-foreground">{session.distance} km</p>
                        </div>
                      </div>
                    )}
                    {session.elevationGain && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Elevation</p>
                          <p className="font-mono font-semibold text-foreground">{session.elevationGain} m</p>
                        </div>
                      </div>
                    )}
                    {session.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-mono font-semibold text-foreground">{session.duration} min</p>
                        </div>
                      </div>
                    )}
                    {session.caloriesBurned && (
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-mono font-semibold text-foreground">{session.caloriesBurned} kcal</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {session.notes && (
                    <p className="text-sm text-muted-foreground border-t border-border pt-4">
                      {session.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Mountain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No hiking sessions yet</h3>
              <p className="text-muted-foreground mb-6">Start tracking your outdoor adventures and elevation gains</p>
              <Button onClick={() => setOpen(true)} data-testid="button-log-first-hike">
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Hike
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
