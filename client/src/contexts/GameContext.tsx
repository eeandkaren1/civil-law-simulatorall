import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ACHIEVEMENTS, AchievementStats, SCENARIOS, VILLAGES } from "../../../shared/gameData";
import {
  addUniqueWrongScenarioId,
  createDailyChallengeScenarioIds,
  getLocalDateKey,
} from "../../../shared/learningTools";
import { trpc } from "../lib/trpc";
import { useAuth } from "../_core/hooks/useAuth";

// ===== 型別定義 =====
interface VillageProgress {
  villageId: string;
  completedScenarios: string[];
  totalCorrect: number;
  totalAttempts: number;
  currentStreak: number;
  maxStreak: number;
}

export interface DailyChallengeState {
  dateKey: string;
  scenarioIds: string[];
  answers: Record<string, boolean>;
}

interface GameState {
  playerName: string;
  villageProgress: Record<string, VillageProgress>;
  unlockedArticles: string[];
  unlockedAchievements: string[];
  geminiApiKey: string;
  wrongScenarioIds: string[];
  dailyChallenge: DailyChallengeState;
}

interface GameContextType {
  gameState: GameState;
  setPlayerName: (name: string) => void;
  recordAnswer: (
    villageId: string,
    scenarioId: string,
    isCorrect: boolean,
    articleIds: string[]
  ) => void;
  getVillageProgress: (villageId: string) => VillageProgress;
  getOverallStats: () => {
    totalCorrect: number;
    totalAttempts: number;
    maxStreak: number;
    completedScenarios: string[];
    completedVillages: string[];
  };
  isScenarioCompleted: (scenarioId: string) => boolean;
  setGeminiApiKey: (key: string) => void;
  getDailyChallenge: () => DailyChallengeState;
  ensureDailyChallenge: () => void;
  recordDailyChallengeAnswer: (scenarioId: string, isCorrect: boolean) => void;
  removeWrongScenario: (scenarioId: string) => void;
  isSyncing: boolean;
}

// ===== 預設值 =====
const defaultVillageProgress = (villageId: string): VillageProgress => ({
  villageId,
  completedScenarios: [],
  totalCorrect: 0,
  totalAttempts: 0,
  currentStreak: 0,
  maxStreak: 0,
});

const defaultGameState: GameState = {
  playerName: "",
  villageProgress: {},
  unlockedArticles: [],
  unlockedAchievements: [],
  geminiApiKey: "",
  wrongScenarioIds: [],
  dailyChallenge: { dateKey: "", scenarioIds: [], answers: {} },
};

const STORAGE_KEY = "civil_law_game_state";

function loadFromStorage(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultGameState, ...parsed };
    }
  } catch {}
  return defaultGameState;
}

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function buildDailyChallenge(dateKey = getLocalDateKey()): DailyChallengeState {
  return {
    dateKey,
    scenarioIds: createDailyChallengeScenarioIds(SCENARIOS, dateKey),
    answers: {},
  };
}

// ===== Context =====
const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(loadFromStorage);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const syncFromLocal = trpc.progress.syncFromLocal.useMutation();
  const updatePlayerNameMutation = trpc.player.updateName.useMutation();
  const unlockArticlesMutation = trpc.articles.unlock.useMutation();
  const unlockAchievementMutation = trpc.achievements.unlock.useMutation();
  const saveVillageProgressMutation = trpc.progress.saveVillageProgress.useMutation();

  // 雲端資料查詢（登入後才啟用）
  const cloudProgressQuery = trpc.progress.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const cloudArticlesQuery = trpc.articles.getUnlocked.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
  const cloudAchievementsQuery = trpc.achievements.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  // 登入後：先把本地進度上傳，再把雲端資料載回合併
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const state = loadFromStorage();

    // 上傳本地進度到雲端
    const hasLocalData =
      Object.keys(state.villageProgress).length > 0 ||
      state.unlockedArticles.length > 0;
    if (hasLocalData) {
      setIsSyncing(true);
      syncFromLocal
        .mutateAsync({
          villageProgress: Object.values(state.villageProgress),
          unlockedArticleIds: state.unlockedArticles,
          achievementIds: state.unlockedAchievements,
        })
        .finally(() => setIsSyncing(false));
    }

    // 同步玩家名稱
    if (state.playerName) {
      updatePlayerNameMutation.mutate({ playerName: state.playerName });
    }
  }, [isAuthenticated, user?.id]);

  // 雲端資料載回後，與本地進度合併
  useEffect(() => {
    if (!isAuthenticated) return;
    const cloudProgress = cloudProgressQuery.data;
    const cloudArticles = cloudArticlesQuery.data;
    const cloudAchievements = cloudAchievementsQuery.data;
    if (!cloudProgress && !cloudArticles && !cloudAchievements) return;

    setGameState((prev) => {
      let merged = { ...prev };

      // 合併村落進度（取本地與雲端的較大值）
      if (cloudProgress && cloudProgress.length > 0) {
        const mergedVillageProgress = { ...prev.villageProgress };
        for (const cp of cloudProgress) {
          const local = prev.villageProgress[cp.villageId];
          const cloudScenarios: string[] = cp.completedScenarios ?? [];
          if (!local) {
            mergedVillageProgress[cp.villageId] = {
              villageId: cp.villageId,
              completedScenarios: cloudScenarios,
              totalCorrect: cp.totalCorrect,
              totalAttempts: cp.totalAttempts,
              currentStreak: cp.currentStreak,
              maxStreak: cp.maxStreak,
            };
          } else {
            const mergedScenarios = Array.from(
              new Set([...local.completedScenarios, ...cloudScenarios])
            );
            mergedVillageProgress[cp.villageId] = {
              villageId: cp.villageId,
              completedScenarios: mergedScenarios,
              totalCorrect: Math.max(local.totalCorrect, cp.totalCorrect),
              totalAttempts: Math.max(local.totalAttempts, cp.totalAttempts),
              currentStreak: Math.max(local.currentStreak, cp.currentStreak),
              maxStreak: Math.max(local.maxStreak, cp.maxStreak),
            };
          }
        }
        merged = { ...merged, villageProgress: mergedVillageProgress };
      }

      // 合併解鎖法條
      if (cloudArticles && cloudArticles.length > 0) {
        const mergedArticles = Array.from(
          new Set([...prev.unlockedArticles, ...cloudArticles])
        );
        merged = { ...merged, unlockedArticles: mergedArticles };
      }

      // 合併成就
      if (cloudAchievements && cloudAchievements.length > 0) {
        const mergedAchievements = Array.from(
          new Set([...prev.unlockedAchievements, ...cloudAchievements])
        );
        merged = { ...merged, unlockedAchievements: mergedAchievements };
      }

      return merged;
    });
  }, [
    isAuthenticated,
    cloudProgressQuery.data,
    cloudArticlesQuery.data,
    cloudAchievementsQuery.data,
  ]);

  // 持久化到 localStorage
  useEffect(() => {
    saveToStorage(gameState);
  }, [gameState]);

  const setPlayerName = useCallback(
    (name: string) => {
      setGameState((prev) => ({ ...prev, playerName: name }));
      if (isAuthenticated) {
        updatePlayerNameMutation.mutate({ playerName: name });
      }
    },
    [isAuthenticated]
  );

  const setGeminiApiKey = useCallback((key: string) => {
    setGameState((prev) => ({ ...prev, geminiApiKey: key }));
  }, []);

  const getDailyChallenge = useCallback((): DailyChallengeState => {
    const today = getLocalDateKey();
    return gameState.dailyChallenge.dateKey === today
      ? gameState.dailyChallenge
      : buildDailyChallenge(today);
  }, [gameState.dailyChallenge]);

  const ensureDailyChallenge = useCallback(() => {
    const today = getLocalDateKey();
    setGameState((prev) => {
      if (prev.dailyChallenge.dateKey === today && prev.dailyChallenge.scenarioIds.length > 0) {
        return prev;
      }
      return { ...prev, dailyChallenge: buildDailyChallenge(today) };
    });
  }, []);

  const recordDailyChallengeAnswer = useCallback((scenarioId: string, isCorrect: boolean) => {
    const today = getLocalDateKey();
    setGameState((prev) => {
      const dailyChallenge = prev.dailyChallenge.dateKey === today
        ? prev.dailyChallenge
        : buildDailyChallenge(today);
      if (!dailyChallenge.scenarioIds.includes(scenarioId) || scenarioId in dailyChallenge.answers) {
        return prev;
      }
      return {
        ...prev,
        dailyChallenge: {
          ...dailyChallenge,
          answers: { ...dailyChallenge.answers, [scenarioId]: isCorrect },
        },
      };
    });
  }, []);

  const removeWrongScenario = useCallback((scenarioId: string) => {
    setGameState((prev) => ({
      ...prev,
      wrongScenarioIds: prev.wrongScenarioIds.filter((id) => id !== scenarioId),
    }));
  }, []);

  const getVillageProgress = useCallback(
    (villageId: string): VillageProgress => {
      return gameState.villageProgress[villageId] ?? defaultVillageProgress(villageId);
    },
    [gameState.villageProgress]
  );

  const isScenarioCompleted = useCallback(
    (scenarioId: string): boolean => {
      return Object.values(gameState.villageProgress).some((vp) =>
        vp.completedScenarios.includes(scenarioId)
      );
    },
    [gameState.villageProgress]
  );

  const getOverallStats = useCallback(() => {
    const allProgress = Object.values(gameState.villageProgress);
    const totalCorrect = allProgress.reduce((s, p) => s + p.totalCorrect, 0);
    const totalAttempts = allProgress.reduce((s, p) => s + p.totalAttempts, 0);
    const maxStreak = Math.max(0, ...allProgress.map((p) => p.maxStreak));
    const completedScenarios = allProgress.flatMap((p) => p.completedScenarios);
    const completedVillages = VILLAGES.filter((v) => {
      const villageScenarios = SCENARIOS.filter((s) => s.villageId === v.id);
      const vp = gameState.villageProgress[v.id];
      if (!vp) return false;
      return villageScenarios.every((s) => vp.completedScenarios.includes(s.id));
    }).map((v) => v.id);
    return { totalCorrect, totalAttempts, maxStreak, completedScenarios, completedVillages };
  }, [gameState.villageProgress]);

  const checkAndUnlockAchievements = useCallback(
    (newState: GameState) => {
      const allProgress = Object.values(newState.villageProgress);
      const totalCorrect = allProgress.reduce((s, p) => s + p.totalCorrect, 0);
      const totalAttempts = allProgress.reduce((s, p) => s + p.totalAttempts, 0);
      const maxStreak = Math.max(0, ...allProgress.map((p) => p.maxStreak));
      const completedScenarios = allProgress.flatMap((p) => p.completedScenarios);
      const completedVillages = VILLAGES.filter((v) => {
        const villageScenarios = SCENARIOS.filter((s) => s.villageId === v.id);
        const vp = newState.villageProgress[v.id];
        if (!vp) return false;
        return villageScenarios.every((s) => vp.completedScenarios.includes(s.id));
      }).map((v) => v.id);

      const stats: AchievementStats = {
        totalAttempts,
        totalCorrect,
        currentStreak: Math.max(0, ...allProgress.map((p) => p.currentStreak)),
        maxStreak,
        completedVillages,
        completedScenarios,
        unlockedArticles: newState.unlockedArticles,
      };

      const newlyUnlocked: string[] = [];
      for (const achievement of ACHIEVEMENTS) {
        if (
          !newState.unlockedAchievements.includes(achievement.id) &&
          achievement.condition(stats)
        ) {
          newlyUnlocked.push(achievement.id);
        }
      }
      return newlyUnlocked;
    },
    []
  );

  const recordAnswer = useCallback(
    (villageId: string, scenarioId: string, isCorrect: boolean, articleIds: string[]) => {
      setGameState((prev) => {
        const vp = prev.villageProgress[villageId] ?? defaultVillageProgress(villageId);
        const newStreak = isCorrect ? vp.currentStreak + 1 : 0;
        const newMaxStreak = Math.max(vp.maxStreak, newStreak);
        const newCompleted = vp.completedScenarios.includes(scenarioId)
          ? vp.completedScenarios
          : [...vp.completedScenarios, scenarioId];

        const updatedVp: VillageProgress = {
          ...vp,
          completedScenarios: newCompleted,
          totalCorrect: vp.totalCorrect + (isCorrect ? 1 : 0),
          totalAttempts: vp.totalAttempts + 1,
          currentStreak: newStreak,
          maxStreak: newMaxStreak,
        };

        // 解鎖法條
        const newUnlocked = Array.from(new Set([...prev.unlockedArticles, ...articleIds]));

        const newState: GameState = {
          ...prev,
          villageProgress: { ...prev.villageProgress, [villageId]: updatedVp },
          unlockedArticles: newUnlocked,
          wrongScenarioIds: isCorrect
            ? prev.wrongScenarioIds
            : addUniqueWrongScenarioId(prev.wrongScenarioIds, scenarioId),
        };

        // 檢查成就
        const newlyUnlockedAchievements = checkAndUnlockAchievements(newState);
        if (newlyUnlockedAchievements.length > 0) {
          newState.unlockedAchievements = [
            ...prev.unlockedAchievements,
            ...newlyUnlockedAchievements,
          ];
          if (isAuthenticated) {
            for (const achId of newlyUnlockedAchievements) {
              unlockAchievementMutation.mutate({ achievementId: achId });
            }
          }
        }

        // 雲端同步
        if (isAuthenticated) {
          saveVillageProgressMutation.mutate({
            villageId,
            completedScenarios: updatedVp.completedScenarios,
            totalCorrect: updatedVp.totalCorrect,
            totalAttempts: updatedVp.totalAttempts,
            currentStreak: updatedVp.currentStreak,
            maxStreak: updatedVp.maxStreak,
          });
          if (articleIds.length > 0) {
            unlockArticlesMutation.mutate({ articleIds });
          }
        }

        return newState;
      });
    },
    [isAuthenticated]
  );

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPlayerName,
        recordAnswer,
        getVillageProgress,
        getOverallStats,
        isScenarioCompleted,
        setGeminiApiKey,
        getDailyChallenge,
        ensureDailyChallenge,
        recordDailyChallengeAnswer,
        removeWrongScenario,
        isSyncing,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
