import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  date,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fitness profile for each user
export const fitnessProfiles = pgTable("fitness_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gender: varchar("gender", { length: 20 }),
  age: integer("age"),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  height: decimal("height", { precision: 5, scale: 2 }), // in cm
  fitnessGoal: varchar("fitness_goal", { length: 50 }), // weight_loss, muscle_gain, endurance, general_health
  fitnessLevel: varchar("fitness_level", { length: 20 }), // beginner, intermediate, advanced
  preferences: text("preferences"), // JSON string for additional preferences
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workout plans
export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // chest, legs, back, arms, cardio, rest, full_body
  description: text("description"),
  exercises: text("exercises"), // JSON string array of exercises
  duration: integer("duration"), // in minutes
  scheduledDate: date("scheduled_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health metrics tracking
export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  heartRatePre: integer("heart_rate_pre"), // beats per minute
  heartRatePost: integer("heart_rate_post"), // beats per minute
  steps: integer("steps"),
  caloriesBurned: integer("calories_burned"),
  workoutId: varchar("workout_id").references(() => workouts.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hiking sessions
export const hikingSessions = pgTable("hiking_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  distance: decimal("distance", { precision: 6, scale: 2 }), // in km
  elevationGain: decimal("elevation_gain", { precision: 6, scale: 2 }), // in meters
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  routeName: varchar("route_name", { length: 200 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications/Reminders
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // workout_reminder, motivational, achievement
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  fitnessProfile: one(fitnessProfiles, {
    fields: [users.id],
    references: [fitnessProfiles.userId],
  }),
  workouts: many(workouts),
  healthMetrics: many(healthMetrics),
  hikingSessions: many(hikingSessions),
  notifications: many(notifications),
}));

export const fitnessProfilesRelations = relations(fitnessProfiles, ({ one }) => ({
  user: one(users, {
    fields: [fitnessProfiles.userId],
    references: [users.id],
  }),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
  healthMetrics: many(healthMetrics),
}));

export const healthMetricsRelations = relations(healthMetrics, ({ one }) => ({
  user: one(users, {
    fields: [healthMetrics.userId],
    references: [users.id],
  }),
  workout: one(workouts, {
    fields: [healthMetrics.workoutId],
    references: [workouts.id],
  }),
}));

export const hikingSessionsRelations = relations(hikingSessions, ({ one }) => ({
  user: one(users, {
    fields: [hikingSessions.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertFitnessProfileSchema = createInsertSchema(fitnessProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertHikingSessionSchema = createInsertSchema(hikingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertFitnessProfile = z.infer<typeof insertFitnessProfileSchema>;
export type FitnessProfile = typeof fitnessProfiles.$inferSelect;

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertHikingSession = z.infer<typeof insertHikingSessionSchema>;
export type HikingSession = typeof hikingSessions.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
