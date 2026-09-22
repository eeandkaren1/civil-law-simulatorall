import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ACHIEVEMENTS, AchievementStats, SCENARIOS, VILLAGES } from "../../../shared/gameData";
import {
  addUniqueWrongScenarioId,
  createDailyChallengeScenarioIds,
  getLocalDateKey,
  toggleFavoriteScenarioId,
} from "../../../shared/learningTools";

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
  /** The player's own Gemini key; stored only in this browser's localStorage. */
  geminiApiKey: string;
  wrongScenarioIds: string[];
  favoriteScenarioIds: string[];
  dailyChallenge: DailyChallengeState;
}

interface GameContextType {
  gameState: GameState;
  setPlayerName: (name: string) => void;
  recordAnswer: (villageId: string, scenarioId: string, isCorrect: boolean, articleIds: string[]) => void;
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
  toggleFavoriteScenario: (scenarioId: string) => void;
  isScenarioFavorited: (scenarioId: string) => boolean;
}

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
  favoriteScenarioIds: [],
  dailyChallenge: { dateKey: "", scenarioIds: [], answers: {} },
};

const STORAGE_KEY = "civil_law_game_state";

function loadFromStorage(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultGameState, ...JSON.parse(raw) };
  } catch {
    // Corrupted local state should not prevent the game from loading.
  }
  return defaultGameState;
}

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private browsing or when quota is exceeded.
  }
}

function buildDailyChallenge(dateKey = getLocalDateKey()): DailyChallengeState {
  return {
    dateKey,
    scenarioIds: createDailyChallengeScenarioIds(SCENARIOS, dateKey),
    answers: {},
  };
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Keep the initial client render deterministic; individual state loads after mounting.
  useEffect(() => {
    setGameState(loadFromStorage());
    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (hasLoadedStorage) saveToStorage(gameState);
  }, [gameState, hasLoadedStorage]);

  const setPlayerName = useCallback((name: string) => {
    setGameState((previous) => ({ ...previous, playerName: name }));
  }, []);

  const setGeminiApiKey = useCallback((key: string) => {
    setGameState((previous) => ({ ...previous, geminiApiKey: key }));
  }, []);

  const getDailyChallenge = useCallback((): DailyChallengeState => {
    const today = getLocalDateKey();
    return gameState.dailyChallenge.dateKey === today
      ? gameState.dailyChallenge
      : buildDailyChallenge(today);
  }, [gameState.dailyChallenge]);

  const ensureDailyChallenge = useCallback(() => {
    const today = getLocalDateKey();
    setGameState((previous) => {
      if (previous.dailyChallenge.dateKey === today && previous.dailyChallenge.scenarioIds.length > 0) {
        return previous;
      }
      return { ...previous, dailyChallenge: buildDailyChallenge(today) };
    });
  }, []);

  const recordDailyChallengeAnswer = useCallback((scenarioId: string, isCorrect: boolean) => {
    const today = getLocalDateKey();
    setGameState((previous) => {
      const dailyChallenge = previous.dailyChallenge.dateKey === today
        ? previous.dailyChallenge
        : buildDailyChallenge(today);
      if (!dailyChallenge.scenarioIds.includes(scenarioId) || scenarioId in dailyChallenge.answers) {
        return previous;
      }
      return {
        ...previous,
        dailyChallenge: {
          ...dailyChallenge,
          answers: { ...dailyChallenge.answers, [scenarioId]: isCorrect },
        },
      };
    });
  }, []);

  const removeWrongScenario = useCallback((scenarioId: string) => {
    setGameState((previous) => ({
      ...previous,
      wrongScenarioIds: previous.wrongScenarioIds.filter((id) => id !== scenarioId),
    }));
  }, []);

  const toggleFavoriteScenario = useCallback((scenarioId: string) => {
    setGameState((previous) => ({
      ...previous,
      favoriteScenarioIds: toggleFavoriteScenarioId(previous.favoriteScenarioIds, scenarioId),
    }));
  }, []);

  const isScenarioFavorited = useCallback(
    (scenarioId: string) => gameState.favoriteScenarioIds.includes(scenarioId),
    [gameState.favoriteScenarioIds],
  );

  const getVillageProgress = useCallback(
    (villageId: string): VillageProgress => gameState.villageProgress[villageId] ?? defaultVillageProgress(villageId),
    [gameState.villageProgress],
  );

  const isScenarioCompleted = useCallback(
    (scenarioId: string): boolean => Object.values(gameState.villageProgress).some((progress) => progress.completedScenarios.includes(scenarioId)),
    [gameState.villageProgress],
  );

  const getOverallStats = useCallback(() => {
    const allProgress = Object.values(gameState.villageProgress);
    const totalCorrect = allProgress.reduce((sum, progress) => sum + progress.totalCorrect, 0);
    const totalAttempts = allProgress.reduce((sum, progress) => sum + progress.totalAttempts, 0);
    const maxStreak = Math.max(0, ...allProgress.map((progress) => progress.maxStreak));
    const completedScenarios = allProgress.flatMap((progress) => progress.completedScenarios);
    const completedVillages = VILLAGES.filter((village) => {
      const villageScenarios = SCENARIOS.filter((scenario) => scenario.villageId === village.id);
      const progress = gameState.villageProgress[village.id];
      return Boolean(progress && villageScenarios.every((scenario) => progress.completedScenarios.includes(scenario.id)));
    }).map((village) => village.id);
    return { totalCorrect, totalAttempts, maxStreak, completedScenarios, completedVillages };
  }, [gameState.villageProgress]);

  const checkAndUnlockAchievements = useCallback((state: GameState) => {
    const allProgress = Object.values(state.villageProgress);
    const completedScenarios = allProgress.flatMap((progress) => progress.completedScenarios);
    const completedVillages = VILLAGES.filter((village) => {
      const villageScenarios = SCENARIOS.filter((scenario) => scenario.villageId === village.id);
      const progress = state.villageProgress[village.id];
      return Boolean(progress && villageScenarios.every((scenario) => progress.completedScenarios.includes(scenario.id)));
    }).map((village) => village.id);
    const stats: AchievementStats = {
      totalAttempts: allProgress.reduce((sum, progress) => sum + progress.totalAttempts, 0),
      totalCorrect: allProgress.reduce((sum, progress) => sum + progress.totalCorrect, 0),
      currentStreak: Math.max(0, ...allProgress.map((progress) => progress.currentStreak)),
      maxStreak: Math.max(0, ...allProgress.map((progress) => progress.maxStreak)),
      completedVillages,
      completedScenarios,
      unlockedArticles: state.unlockedArticles,
    };
    return ACHIEVEMENTS
      .filter((achievement) => !state.unlockedAchievements.includes(achievement.id) && achievement.condition(stats))
      .map((achievement) => achievement.id);
  }, []);

  const recordAnswer = useCallback((villageId: string, scenarioId: string, isCorrect: boolean, articleIds: string[]) => {
    setGameState((previous) => {
      const progress = previous.villageProgress[villageId] ?? defaultVillageProgress(villageId);
      const currentStreak = isCorrect ? progress.currentStreak + 1 : 0;
      const completedScenarios = progress.completedScenarios.includes(scenarioId)
        ? progress.completedScenarios
        : [...progress.completedScenarios, scenarioId];
      const updatedProgress: VillageProgress = {
        ...progress,
        completedScenarios,
        totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
        totalAttempts: progress.totalAttempts + 1,
        currentStreak,
        maxStreak: Math.max(progress.maxStreak, currentStreak),
      };
      const updatedState: GameState = {
        ...previous,
        villageProgress: { ...previous.villageProgress, [villageId]: updatedProgress },
        unlockedArticles: Array.from(new Set([...previous.unlockedArticles, ...articleIds])),
        wrongScenarioIds: isCorrect
          ? previous.wrongScenarioIds
          : addUniqueWrongScenarioId(previous.wrongScenarioIds, scenarioId),
      };
      const newAchievementIds = checkAndUnlockAchievements(updatedState);
      if (newAchievementIds.length > 0) {
        updatedState.unlockedAchievements = [...previous.unlockedAchievements, ...newAchievementIds];
      }
      return updatedState;
    });
  }, [checkAndUnlockAchievements]);

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
        toggleFavoriteScenario,
        isScenarioFavorited,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
