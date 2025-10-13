import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertFitnessProfileSchema, type FitnessProfile, type InsertFitnessProfile } from "@shared/schema";
import { ArrowRight, User } from "lucide-react";

export default function FitnessProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading } = useQuery<FitnessProfile>({
    queryKey: ["/api/fitness-profile"],
    queryFn: () => fetch("/api/fitness-profile").then(res => res.json()),
  });

  const form = useForm<InsertFitnessProfile>({
    resolver: zodResolver(insertFitnessProfileSchema.extend({
      age: insertFitnessProfileSchema.shape.age.refine((val) => val && val > 0 && val < 150, {
        message: "Please enter a valid age",
      }),
      weight: insertFitnessProfileSchema.shape.weight.refine((val) => val && parseFloat(val.toString()) > 0, {
        message: "Please enter a valid weight",
      }),
      height: insertFitnessProfileSchema.shape.height.refine((val) => val && parseFloat(val.toString()) > 0, {
        message: "Please enter a valid height",
      }),
    })),
    defaultValues: {
      userId: user?.id || "",
      gender: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      fitnessGoal: "",
      fitnessLevel: "",
      preferences: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        userId: profile.userId,
        gender: profile.gender || "",
        age: profile.age || undefined,
        weight: profile.weight || undefined,
        height: profile.height || undefined,
        fitnessGoal: profile.fitnessGoal || "",
        fitnessLevel: profile.fitnessLevel || "",
        preferences: profile.preferences || "",
      });
    } else if (user) {
      form.setValue("userId", user.id);
    }
  }, [profile, user, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertFitnessProfile) => {
      if (profile) {
        return await apiRequest("PUT", `/api/fitness-profile/${profile.id}`, data);
      }
      return await apiRequest("POST", "/api/fitness-profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fitness-profile"] });
      toast({
        title: "Success!",
        description: "Your fitness profile has been saved.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFitnessProfile) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-profile-title">
                Fitness Profile
              </h1>
              <p className="text-muted-foreground">Tell us about yourself to get personalized recommendations</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>This helps us create the perfect workout and nutrition plan for you</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ...other fields... */}
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="70" 
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="175" 
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            data-testid="input-height"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* ...other fields... */}
                </div>
                {/* ...rest of the form... */}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
