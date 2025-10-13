import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Footprints, Flame, Calendar, Mountain, TrendingUp, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { HealthMetric, Workout, HikingSession } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: todayMetrics } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics/today"],
  });

  const { data: upcomingWorkouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/upcoming"],
  });

  const { data: recentHikes } = useQuery<HikingSession[]>({
    queryKey: ["/api/hiking/recent"],
  });

  const todayData = todayMetrics?.[0];
  const steps = todayData?.steps || 0;
  const calories = todayData?.caloriesBurned || 0;
  const heartRate = todayData?.heartRatePost || todayData?.heartRatePre || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                Welcome back, {user?.firstName || "there"}
              </h1>
              <p className="text-muted-foreground mt-1">Let's crush your goals today</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Today's Stats */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4" data-testid="text-stats-heading">
            Today's Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-elevate" data-testid="card-stat-steps">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Steps</CardTitle>
                <Footprints className="w-5 h-5 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-steps-count">
                  {steps.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Keep moving!</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-stat-calories">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
                <Flame className="w-5 h-5 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-calories-count">
                  {calories}
                </div>
                <p className="text-xs text-muted-foreground mt-1">kcal today</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-stat-heartrate">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
                <Heart className="w-5 h-5 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-heartrate-value">
                  {heartRate}
                </div>
                <p className="text-xs text-muted-foreground mt-1">bpm</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4" data-testid="text-actions-heading">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/workouts">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-action-workout">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Start Workout</h3>
                      <p className="text-sm text-muted-foreground">Plan your session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/health">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-action-health">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-chart-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Log Health Data</h3>
                      <p className="text-sm text-muted-foreground">Track metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/hiking">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-action-hiking">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                      <Mountain className="w-6 h-6 text-chart-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Track Hike</h3>
                      <p className="text-sm text-muted-foreground">Adventure mode</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-workouts-heading">
              Upcoming Workouts
            </h2>
            <Link href="/workouts">
              <Button variant="outline" size="sm" data-testid="button-view-all-workouts">
                View All
              </Button>
            </Link>
          </div>
          {upcomingWorkouts && upcomingWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingWorkouts.slice(0, 2).map((workout) => (
                <Card key={workout.id} className="hover-elevate" data-testid={`card-workout-${workout.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {workout.scheduledDate}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground" data-testid={`text-workout-name-${workout.id}`}>
                          {workout.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {workout.type} • {workout.duration} min
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workout.type.includes('chest') ? 'bg-chart-2/10 text-chart-2' :
                        workout.type.includes('leg') ? 'bg-chart-3/10 text-chart-3' :
                        workout.type.includes('rest') ? 'bg-muted text-muted-foreground' :
                        'bg-chart-1/10 text-chart-1'
                      }`}>
                        {workout.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming workouts scheduled</p>
                <Link href="/workouts">
                  <Button className="mt-4" data-testid="button-plan-workout">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan Your First Workout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress Link */}
        <Link href="/progress">
          <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-view-progress">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">View Progress Reports</h3>
                    <p className="text-sm text-muted-foreground">See your weekly & monthly progress</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" data-testid="button-arrow-progress">
                  <Plus className="w-5 h-5 rotate-45" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
