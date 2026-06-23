import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  playerName: varchar("playerName", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 遊戲進度（每個村落的整體進度）
export const gameProgress = mysqlTable("game_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  villageId: varchar("villageId", { length: 32 }).notNull(),
  completedScenarios: json("completedScenarios").$type<string[]>().default([]),
  totalCorrect: int("totalCorrect").default(0).notNull(),
  totalAttempts: int("totalAttempts").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  maxStreak: int("maxStreak").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = typeof gameProgress.$inferInsert;

// 每題答題紀錄
export const questionAttempts = mysqlTable("question_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  selectedChoice: int("selectedChoice"),
  essayAnswer: text("essayAnswer"),
  essayFeedback: text("essayFeedback"),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type QuestionAttempt = typeof questionAttempts.$inferSelect;
export type InsertQuestionAttempt = typeof questionAttempts.$inferInsert;

// 已解鎖法條
export const unlockedArticles = mysqlTable("unlocked_articles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: varchar("articleId", { length: 32 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UnlockedArticle = typeof unlockedArticles.$inferSelect;
export type InsertUnlockedArticle = typeof unlockedArticles.$inferInsert;

// 成就紀錄
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: varchar("achievementId", { length: 64 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
