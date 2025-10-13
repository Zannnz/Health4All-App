import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertWorkoutSchema, type Workout, type InsertWorkout } from "@shared/schema";
import { Calendar, Plus, Dumbbell, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function WorkoutsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const form = useForm<InsertWorkout>({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      userId: user?.id || "",
      name: "",
      type: "",
      description: "",
      exercises: "",
      duration: undefined,
      scheduledDate: "",
      completed: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWorkout) => {
      return await apiRequest("POST", "/api/workouts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Success!",
        description: "Workout added to your schedule.",
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

  const markCompleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("PATCH", `/api/workouts/${id}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Great job!",
        description: "Workout marked as complete.",
      });
    },
  });

  const onSubmit = (data: InsertWorkout) => {
    mutation.mutate({
      ...data,
      userId: user?.id || "",
    });
  };

  const getWorkoutColor = (type: string) => {
    if (type.includes("chest")) return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    if (type.includes("leg")) return "bg-chart-3/10 text-chart-3 border-chart-3/20";
    if (type.includes("back")) return "bg-chart-4/10 text-chart-4 border-chart-4/20";
    if (type.includes("cardio")) return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    if (type.includes("rest")) return "bg-muted text-muted-foreground border-muted";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-workouts-title">
              Workout Planner
            </h1>
            <p className="text-muted-foreground mt-1">Plan and track your training schedule</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-workout">
                <Plus className="w-4 h-4 mr-2" />
                Add Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Workout</DialogTitle>
                <DialogDescription>Add a new workout to your training plan</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Morning Chest Session" {...field} data-testid="input-workout-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger data-testid="select-workout-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="chest">Chest Day</SelectItem>
                              <SelectItem value="legs">Leg Day</SelectItem>
                              <SelectItem value="back">Back Day</SelectItem>
                              <SelectItem value="arms">Arms</SelectItem>
                              <SelectItem value="cardio">Cardio</SelectItem>
                              <SelectItem value="full_body">Full Body</SelectItem>
                              <SelectItem value="rest">Rest Day</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="60" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              data-testid="input-workout-duration"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ""} data-testid="input-workout-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Workout details or notes..."
                            {...field}
                            value={field.value || ""}
                            data-testid="textarea-workout-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-workout">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending} data-testid="button-save-workout">
                      {mutation.isPending ? "Saving..." : "Save Workout"}
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
            <p className="mt-4 text-muted-foreground">Loading workouts...</p>
          </div>
        ) : workouts && workouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className={`hover-elevate ${workout.completed ? 'opacity-75' : ''}`} data-testid={`card-workout-${workout.id}`}>
                <CardHeader className="space-y-0 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid={`text-workout-title-${workout.id}`}>
                        {workout.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{workout.scheduledDate}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getWorkoutColor(workout.type)}`}>
                      {workout.type}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {workout.description && (
                    <p className="text-sm text-muted-foreground mb-4">{workout.description}</p>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{workout.duration} min</span>
                    </div>
                    {!workout.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markCompleteMutation.mutate(workout.id)}
                        disabled={markCompleteMutation.isPending}
                        data-testid={`button-complete-${workout.id}`}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    {workout.completed && (
                      <div className="flex items-center gap-1 text-sm text-chart-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No workouts yet</h3>
              <p className="text-muted-foreground mb-6">Start planning your fitness journey by adding your first workout</p>
              <Button onClick={() => setOpen(true)} data-testid="button-add-first-workout">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
