import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calendar, Award, Target, Activity } from "lucide-react";
import type { HealthMetric, Workout, HikingSession } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function ProgressPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  const { data: metrics } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics"],
  });

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: hikes } = useQuery<HikingSession[]>({
    queryKey: ["/api/hiking"],
  });

  // Calculate stats
  const completedWorkouts = workouts?.filter(w => w.completed).length || 0;
  const totalWorkouts = workouts?.length || 0;
  const totalHikes = hikes?.length || 0;
  const totalCalories = metrics?.reduce((sum, m) => sum + (m.caloriesBurned || 0), 0) || 0;
  const totalSteps = metrics?.reduce((sum, m) => sum + (m.steps || 0), 0) || 0;
  const avgHeartRate = metrics?.length 
    ? Math.round(metrics.reduce((sum, m) => sum + (m.heartRatePost || m.heartRatePre || 0), 0) / metrics.length)
    : 0;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const caloriesChartData = last7Days.map(date => {
    const dayMetrics = metrics?.filter(m => m.date === date) || [];
    const calories = dayMetrics.reduce((sum, m) => sum + (m.caloriesBurned || 0), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories,
    };
  });

  const stepsChartData = last7Days.map(date => {
    const dayMetrics = metrics?.filter(m => m.date === date) || [];
    const steps = dayMetrics.reduce((sum, m) => sum + (m.steps || 0), 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      steps,
    };
  });

  const workoutTypesData = workouts?.reduce((acc, workout) => {
    const type = workout.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const workoutTypeChartData = Object.entries(workoutTypesData || {}).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-progress-title">
            Progress Reports
          </h1>
          <p className="text-muted-foreground mt-1">Track your fitness journey and achievements</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover-elevate" data-testid="card-total-workouts">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Workouts Completed</CardTitle>
              <Activity className="w-5 h-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-workouts-count">
                {completedWorkouts}/{totalWorkouts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-total-hikes">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hiking Adventures</CardTitle>
              <Target className="w-5 h-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-hikes-count">
                {totalHikes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total hikes</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-total-calories">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories Burned</CardTitle>
              <TrendingUp className="w-5 h-5 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-total-calories">
                {totalCalories.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total kcal</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-total-steps">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Steps</CardTitle>
              <Award className="w-5 h-5 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-total-steps">
                {totalSteps.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Steps taken</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="calories" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3" data-testid="tabs-progress">
            <TabsTrigger value="calories" data-testid="tab-calories">Calories</TabsTrigger>
            <TabsTrigger value="steps" data-testid="tab-steps">Steps</TabsTrigger>
            <TabsTrigger value="workouts" data-testid="tab-workouts">Workouts</TabsTrigger>
          </TabsList>

          <TabsContent value="calories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-chart-2" />
                  Calories Burned - Last 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caloriesChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                      <YAxis className="text-xs text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Bar dataKey="calories" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-chart-1" />
                  Steps - Last 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stepsChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs text-muted-foreground" />
                      <YAxis className="text-xs text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="steps" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-chart-3" />
                  Workout Distribution by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutTypeChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs text-muted-foreground" />
                      <YAxis dataKey="type" type="category" className="text-xs text-muted-foreground" width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-chart-4" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedWorkouts >= 5 && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                  <div className="w-12 h-12 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-chart-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Workout Warrior</h3>
                    <p className="text-sm text-muted-foreground">Completed 5+ workouts</p>
                  </div>
                </div>
              )}
              {totalSteps >= 50000 && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <div className="w-12 h-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Step Master</h3>
                    <p className="text-sm text-muted-foreground">Walked 50,000+ steps</p>
                  </div>
                </div>
              )}
              {totalHikes >= 3 && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
                  <div className="w-12 h-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-chart-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Mountain Explorer</h3>
                    <p className="text-sm text-muted-foreground">Completed 3+ hikes</p>
                  </div>
                </div>
              )}
              {completedWorkouts === 0 && totalSteps < 50000 && totalHikes === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Complete workouts and track your progress to unlock achievements!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
