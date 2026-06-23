import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getGameProgressByUser,
  getUnlockedArticlesByUser,
  getAchievementsByUser,
  getUserStats,
  updatePlayerName,
  upsertGameProgress,
  recordQuestionAttempt,
  unlockArticle,
  unlockAchievement,
} from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== 玩家設定 =====
  player: router({
    updateName: protectedProcedure
      .input(z.object({ playerName: z.string().min(1).max(20) }))
      .mutation(async ({ ctx, input }) => {
        await updatePlayerName(ctx.user.id, input.playerName);
        return { success: true };
      }),
  }),

  // ===== 遊戲進度 =====
  progress: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return getGameProgressByUser(ctx.user.id);
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      return getUserStats(ctx.user.id);
    }),

    syncFromLocal: protectedProcedure
      .input(
        z.object({
          villageProgress: z.array(
            z.object({
              villageId: z.string(),
              completedScenarios: z.array(z.string()),
              totalCorrect: z.number(),
              totalAttempts: z.number(),
              currentStreak: z.number(),
              maxStreak: z.number(),
            })
          ),
          unlockedArticleIds: z.array(z.string()),
          achievementIds: z.array(z.string()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // 同步村落進度
        for (const vp of input.villageProgress) {
          await upsertGameProgress(ctx.user.id, vp.villageId, {
            completedScenarios: vp.completedScenarios,
            totalCorrect: vp.totalCorrect,
            totalAttempts: vp.totalAttempts,
            currentStreak: vp.currentStreak,
            maxStreak: vp.maxStreak,
          });
        }
        // 同步解鎖法條
        for (const articleId of input.unlockedArticleIds) {
          await unlockArticle(ctx.user.id, articleId);
        }
        // 同步成就
        for (const achievementId of input.achievementIds) {
          await unlockAchievement(ctx.user.id, achievementId);
        }
        return { success: true };
      }),

    saveVillageProgress: protectedProcedure
      .input(
        z.object({
          villageId: z.string(),
          completedScenarios: z.array(z.string()),
          totalCorrect: z.number(),
          totalAttempts: z.number(),
          currentStreak: z.number(),
          maxStreak: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertGameProgress(ctx.user.id, input.villageId, {
          completedScenarios: input.completedScenarios,
          totalCorrect: input.totalCorrect,
          totalAttempts: input.totalAttempts,
          currentStreak: input.currentStreak,
          maxStreak: input.maxStreak,
        });
        return { success: true };
      }),
  }),

  // ===== 答題紀錄 =====
  attempts: router({
    record: protectedProcedure
      .input(
        z.object({
          scenarioId: z.string(),
          isCorrect: z.boolean(),
          selectedChoice: z.number().optional(),
          essayAnswer: z.string().optional(),
          essayFeedback: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await recordQuestionAttempt(
          ctx.user.id,
          input.scenarioId,
          input.isCorrect,
          input.selectedChoice,
          input.essayAnswer,
          input.essayFeedback
        );
        return { success: true };
      }),
  }),

  // ===== 法條 =====
  articles: router({
    getUnlocked: protectedProcedure.query(async ({ ctx }) => {
      const rows = await getUnlockedArticlesByUser(ctx.user.id);
      return rows.map((r) => r.articleId);
    }),

    unlock: protectedProcedure
      .input(z.object({ articleIds: z.array(z.string()) }))
      .mutation(async ({ ctx, input }) => {
        for (const id of input.articleIds) {
          await unlockArticle(ctx.user.id, id);
        }
        return { success: true };
      }),
  }),

  // ===== 成就 =====
  achievements: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      const rows = await getAchievementsByUser(ctx.user.id);
      return rows.map((r) => r.achievementId);
    }),

    unlock: protectedProcedure
      .input(z.object({ achievementId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await unlockAchievement(ctx.user.id, input.achievementId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
