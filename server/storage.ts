// Reference: javascript_database and javascript_log_in_with_replit blueprints
import {
  users,
  fitnessProfiles,
  workouts,
  healthMetrics,
  hikingSessions,
  notifications,
  type User,
  type UpsertUser,
  type FitnessProfile,
  type InsertFitnessProfile,
  type Workout,
  type InsertWorkout,
  type HealthMetric,
  type InsertHealthMetric,
  type HikingSession,
  type InsertHikingSession,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Fitness Profile operations
  getFitnessProfile(userId: string): Promise<FitnessProfile | undefined>;
  createFitnessProfile(profile: InsertFitnessProfile): Promise<FitnessProfile>;
  updateFitnessProfile(id: string, profile: Partial<InsertFitnessProfile>): Promise<FitnessProfile>;
  
  // Workout operations
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  getUpcomingWorkouts(userId: string): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<InsertWorkout>): Promise<Workout>;
  markWorkoutComplete(id: string): Promise<Workout>;
  
  // Health Metrics operations
  getHealthMetrics(userId: string): Promise<HealthMetric[]>;
  getTodayHealthMetrics(userId: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  
  // Hiking Session operations
  getHikingSessions(userId: string): Promise<HikingSession[]>;
  getRecentHikingSessions(userId: string): Promise<HikingSession[]>;
  createHikingSession(session: InsertHikingSession): Promise<HikingSession>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<Notification>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Fitness Profile operations
  async getFitnessProfile(userId: string): Promise<FitnessProfile | undefined> {
    const [profile] = await db.select().from(fitnessProfiles).where(eq(fitnessProfiles.userId, userId));
    return profile;
  }

  async createFitnessProfile(profileData: InsertFitnessProfile): Promise<FitnessProfile> {
    const [profile] = await db.insert(fitnessProfiles).values(profileData).returning();
    return profile;
  }

  async updateFitnessProfile(id: string, profileData: Partial<InsertFitnessProfile>): Promise<FitnessProfile> {
    const [profile] = await db
      .update(fitnessProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(fitnessProfiles.id, id))
      .returning();
    return profile;
  }

  // Workout operations
  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.scheduledDate));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async getUpcomingWorkouts(userId: string): Promise<Workout[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, userId), gte(workouts.scheduledDate, today)))
      .orderBy(workouts.scheduledDate)
      .limit(5);
  }

  async createWorkout(workoutData: InsertWorkout): Promise<Workout> {
    const [workout] = await db.insert(workouts).values(workoutData).returning();
    return workout;
  }

  async updateWorkout(id: string, workoutData: Partial<InsertWorkout>): Promise<Workout> {
    const [workout] = await db
      .update(workouts)
      .set(workoutData)
      .where(eq(workouts.id, id))
      .returning();
    return workout;
  }

  async markWorkoutComplete(id: string): Promise<Workout> {
    const [workout] = await db
      .update(workouts)
      .set({ completed: true })
      .where(eq(workouts.id, id))
      .returning();
    return workout;
  }

  // Health Metrics operations
  async getHealthMetrics(userId: string): Promise<HealthMetric[]> {
    return await db.select().from(healthMetrics).where(eq(healthMetrics.userId, userId)).orderBy(desc(healthMetrics.date));
  }

  async getTodayHealthMetrics(userId: string): Promise<HealthMetric[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(healthMetrics)
      .where(and(eq(healthMetrics.userId, userId), eq(healthMetrics.date, today)));
  }

  async createHealthMetric(metricData: InsertHealthMetric): Promise<HealthMetric> {
    const [metric] = await db.insert(healthMetrics).values(metricData).returning();
    return metric;
  }

  // Hiking Session operations
  async getHikingSessions(userId: string): Promise<HikingSession[]> {
    return await db.select().from(hikingSessions).where(eq(hikingSessions.userId, userId)).orderBy(desc(hikingSessions.date));
  }

  async getRecentHikingSessions(userId: string): Promise<HikingSession[]> {
    return await db.select().from(hikingSessions).where(eq(hikingSessions.userId, userId)).orderBy(desc(hikingSessions.date)).limit(3);
  }

  async createHikingSession(sessionData: InsertHikingSession): Promise<HikingSession> {
    const [session] = await db.insert(hikingSessions).values(sessionData).returning();
    return session;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async markNotificationRead(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }
}

export const storage = new DatabaseStorage();
