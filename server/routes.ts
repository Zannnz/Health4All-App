// Reference: javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertFitnessProfileSchema,
  insertWorkoutSchema,
  insertHealthMetricSchema,
  insertHikingSessionSchema,
  insertNotificationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Fitness Profile routes
  app.get('/api/fitness-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getFitnessProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching fitness profile:", error);
      res.status(500).json({ message: "Failed to fetch fitness profile" });
    }
  });

  app.post('/api/fitness-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFitnessProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createFitnessProfile(data);
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating fitness profile:", error);
      res.status(400).json({ message: error.message || "Failed to create fitness profile" });
    }
  });

  app.put('/api/fitness-profile/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const profile = await storage.updateFitnessProfile(id, data);
      res.json(profile);
    } catch (error: any) {
      console.error("Error updating fitness profile:", error);
      res.status(400).json({ message: error.message || "Failed to update fitness profile" });
    }
  });

  // Workout routes
  app.get('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutsList = await storage.getWorkouts(userId);
      res.json(workoutsList);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get('/api/workouts/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutsList = await storage.getUpcomingWorkouts(userId);
      res.json(workoutsList);
    } catch (error) {
      console.error("Error fetching upcoming workouts:", error);
      res.status(500).json({ message: "Failed to fetch upcoming workouts" });
    }
  });

  app.post('/api/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWorkoutSchema.parse({ ...req.body, userId });
      const workout = await storage.createWorkout(data);
      res.json(workout);
    } catch (error: any) {
      console.error("Error creating workout:", error);
      res.status(400).json({ message: error.message || "Failed to create workout" });
    }
  });

  app.patch('/api/workouts/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const workout = await storage.markWorkoutComplete(id);
      res.json(workout);
    } catch (error) {
      console.error("Error marking workout complete:", error);
      res.status(500).json({ message: "Failed to mark workout complete" });
    }
  });

  // Health Metrics routes
  app.get('/api/health-metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getHealthMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.get('/api/health-metrics/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getTodayHealthMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching today's health metrics:", error);
      res.status(500).json({ message: "Failed to fetch today's health metrics" });
    }
  });

  app.post('/api/health-metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertHealthMetricSchema.parse({ ...req.body, userId });
      const metric = await storage.createHealthMetric(data);
      res.json(metric);
    } catch (error: any) {
      console.error("Error creating health metric:", error);
      res.status(400).json({ message: error.message || "Failed to create health metric" });
    }
  });

  // Hiking Session routes
  app.get('/api/hiking', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getHikingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching hiking sessions:", error);
      res.status(500).json({ message: "Failed to fetch hiking sessions" });
    }
  });

  app.get('/api/hiking/recent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getRecentHikingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching recent hiking sessions:", error);
      res.status(500).json({ message: "Failed to fetch recent hiking sessions" });
    }
  });

  app.post('/api/hiking', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertHikingSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createHikingSession(data);
      res.json(session);
    } catch (error: any) {
      console.error("Error creating hiking session:", error);
      res.status(400).json({ message: error.message || "Failed to create hiking session" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationsList = await storage.getNotifications(userId);
      res.json(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/unread', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notificationsList = await storage.getUnreadNotifications(userId);
      res.json(notificationsList);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ message: "Failed to fetch unread notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertNotificationSchema.parse({ ...req.body, userId });
      const notification = await storage.createNotification(data);
      res.json(notification);
    } catch (error: any) {
      console.error("Error creating notification:", error);
      res.status(400).json({ message: error.message || "Failed to create notification" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationRead(id);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification read:", error);
      res.status(500).json({ message: "Failed to mark notification read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
