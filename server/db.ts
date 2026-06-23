import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  InsertUser,
  achievements,
  gameProgress,
  questionAttempts,
  unlockedArticles,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);

    if (existing.length > 0) {
      const updateSet: Record<string, unknown> = {};
      if (user.name !== undefined) updateSet.name = user.name ?? null;
      if (user.email !== undefined) updateSet.email = user.email ?? null;
      if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod ?? null;
      if (user.lastSignedIn !== undefined) updateSet.lastSignedIn = user.lastSignedIn;
      if (user.role !== undefined) updateSet.role = user.role;
      updateSet.updatedAt = new Date();
      if (Object.keys(updateSet).length > 0) {
        await db.update(users).set(updateSet).where(eq(users.openId, user.openId));
      }
    } else {
      const values: InsertUser = {
        openId: user.openId,
        name: user.name ?? null,
        email: user.email ?? null,
        loginMethod: user.loginMethod ?? null,
        lastSignedIn: user.lastSignedIn ?? new Date(),
        role: user.openId === ENV.ownerOpenId ? "admin" : (user.role ?? "user"),
      };
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePlayerName(userId: number, playerName: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ playerName, updatedAt: new Date() }).where(eq(users.id, userId));
}

// ===== 遊戲進度 =====
export async function getGameProgressByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(gameProgress).where(eq(gameProgress.userId, userId));
}

export async function getGameProgressByVillage(userId: number, villageId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(gameProgress)
    .where(and(eq(gameProgress.userId, userId), eq(gameProgress.villageId, villageId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertGameProgress(
  userId: number,
  villageId: string,
  data: {
    completedScenarios?: string[];
    totalCorrect?: number;
    totalAttempts?: number;
    currentStreak?: number;
    maxStreak?: number;
  }
) {
  const db = await getDb();
  if (!db) return;

  const existing = await getGameProgressByVillage(userId, villageId);
  if (existing) {
    await db
      .update(gameProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(gameProgress.userId, userId), eq(gameProgress.villageId, villageId)));
  } else {
    await db.insert(gameProgress).values({
      userId,
      villageId,
      completedScenarios: data.completedScenarios ?? [],
      totalCorrect: data.totalCorrect ?? 0,
      totalAttempts: data.totalAttempts ?? 0,
      currentStreak: data.currentStreak ?? 0,
      maxStreak: data.maxStreak ?? 0,
    });
  }
}

// ===== 答題紀錄 =====
export async function recordQuestionAttempt(
  userId: number,
  scenarioId: string,
  isCorrect: boolean,
  selectedChoice?: number,
  essayAnswer?: string,
  essayFeedback?: string
) {
  const db = await getDb();
  if (!db) return;
  await db.insert(questionAttempts).values({
    userId,
    scenarioId,
    isCorrect,
    selectedChoice,
    essayAnswer,
    essayFeedback,
  });
}

export async function getQuestionAttemptsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questionAttempts).where(eq(questionAttempts.userId, userId));
}

// ===== 解鎖法條 =====
export async function getUnlockedArticlesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(unlockedArticles).where(eq(unlockedArticles.userId, userId));
}

export async function unlockArticle(userId: number, articleId: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(unlockedArticles)
    .where(and(eq(unlockedArticles.userId, userId), eq(unlockedArticles.articleId, articleId)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(unlockedArticles).values({ userId, articleId });
  }
}

// ===== 成就 =====
export async function getAchievementsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(achievements).where(eq(achievements.userId, userId));
}

export async function unlockAchievement(userId: number, achievementId: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(achievements)
    .where(and(eq(achievements.userId, userId), eq(achievements.achievementId, achievementId)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(achievements).values({ userId, achievementId });
  }
}

// ===== 全局統計 =====
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const allProgress = await getGameProgressByUser(userId);
  const allAchievements = await getAchievementsByUser(userId);
  const allUnlocked = await getUnlockedArticlesByUser(userId);

  const totalCorrect = allProgress.reduce((sum, p) => sum + (p.totalCorrect ?? 0), 0);
  const totalAttempts = allProgress.reduce((sum, p) => sum + (p.totalAttempts ?? 0), 0);
  const maxStreak = Math.max(0, ...allProgress.map((p) => p.maxStreak ?? 0));
  const currentStreak = allProgress.reduce((max, p) => Math.max(max, p.currentStreak ?? 0), 0);

  const completedVillages = allProgress
    .filter((p) => {
      const completed = (p.completedScenarios as string[]) ?? [];
      return completed.length > 0;
    })
    .map((p) => p.villageId);

  const completedScenarios = allProgress.flatMap(
    (p) => (p.completedScenarios as string[]) ?? []
  );

  return {
    totalCorrect,
    totalAttempts,
    maxStreak,
    currentStreak,
    completedVillages,
    completedScenarios,
    unlockedArticles: allUnlocked.map((a) => a.articleId),
    achievements: allAchievements.map((a) => a.achievementId),
  };
}
