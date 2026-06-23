import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  serial,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  playerName: varchar("playerName", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 遊戲進度（每個村落的整體進度）
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  villageId: varchar("villageId", { length: 32 }).notNull(),
  completedScenarios: json("completedScenarios").$type<string[]>().default([]),
  totalCorrect: integer("totalCorrect").default(0).notNull(),
  totalAttempts: integer("totalAttempts").default(0).notNull(),
  currentStreak: integer("currentStreak").default(0).notNull(),
  maxStreak: integer("maxStreak").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = typeof gameProgress.$inferInsert;

// 每題答題紀錄
export const questionAttempts = pgTable("question_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  selectedChoice: integer("selectedChoice"),
  essayAnswer: text("essayAnswer"),
  essayFeedback: text("essayFeedback"),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type QuestionAttempt = typeof questionAttempts.$inferSelect;
export type InsertQuestionAttempt = typeof questionAttempts.$inferInsert;

// 已解鎖法條
export const unlockedArticles = pgTable("unlocked_articles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  articleId: varchar("articleId", { length: 32 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UnlockedArticle = typeof unlockedArticles.$inferSelect;
export type InsertUnlockedArticle = typeof unlockedArticles.$inferInsert;

// 成就紀錄
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  achievementId: varchar("achievementId", { length: 64 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
