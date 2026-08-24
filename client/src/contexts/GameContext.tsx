import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ACHIEVEMENTS, AchievementStats, SCENARIOS, VILLAGES } from "../../../shared/gameData";

// ===== 型別定義 =====
interface VillageProgress {
  villageId: string;
  completedScenarios: string[];
  totalCorrect: number;
  totalAttempts: number;
  currentStreak: number;
  maxStreak: number;
}

interface GameState {
  playerName: string;
  villageProgress: Record<string, VillageProgress>;
  unlockedArticles: string[];
  unlockedAchievements: string[];
  geminiApiKey: string;
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

// ===== Context =====
const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(loadFromStorage);
  // Static Site 模式：遊戲進度只保存在玩家自己的裝置，不依賴後端、登入或資料庫。
  const isAuthenticated = false;
  const isSyncing = false;

  // 持久化到 localStorage
  useEffect(() => {
    saveToStorage(gameState);
  }, [gameState]);

  const setPlayerName = useCallback(
    (name: string) => {
      setGameState((prev) => ({ ...prev, playerName: name }));
    },
    []
  );

  const setGeminiApiKey = useCallback((key: string) => {
    setGameState((prev) => ({ ...prev, geminiApiKey: key }));
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
        };

        // 檢查成就
        const newlyUnlockedAchievements = checkAndUnlockAchievements(newState);
        if (newlyUnlockedAchievements.length > 0) {
          newState.unlockedAchievements = [
            ...prev.unlockedAchievements,
            ...newlyUnlockedAchievements,
          ];
        }

        return newState;
      });
    },
    [checkAndUnlockAchievements]
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
