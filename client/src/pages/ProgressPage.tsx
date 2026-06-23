import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ACHIEVEMENTS, VILLAGES, SCENARIOS, getScenariosByVillage } from "../../../shared/gameData";
import { useLocation } from "wouter";
import { ArrowLeft, Trophy, Target, Flame, BookOpen, Star, CheckCircle2 } from "lucide-react";

const VILLAGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  general: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
  obligation: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  property: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  family: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  inheritance: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
};

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const { gameState, getVillageProgress, getOverallStats } = useGame();

  const stats = getOverallStats();
  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
      : 0;

  const unlockedAchievements = gameState.unlockedAchievements;

  return (
    <div className="min-h-screen game-bg">
      {/* 頂部 */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-display font-semibold text-foreground">學習進度</span>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* 玩家資訊 */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              🧑‍⚖️
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {gameState.playerName || "未命名冒險者"}
              </h1>
              <p className="text-sm text-muted-foreground">
                民法鎮冒險者 · 已解鎖 {unlockedAchievements.length} 個成就
              </p>
            </div>
          </div>
        </div>

        {/* 整體統計 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: <Target className="w-5 h-5 text-primary" />,
              value: stats.totalAttempts,
              label: "已答題數",
              color: "text-primary",
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
              value: `${accuracy}%`,
              label: "答題正確率",
              color: "text-emerald-600",
            },
            {
              icon: <Flame className="w-5 h-5 text-amber-500" />,
              value: stats.maxStreak,
              label: "最高連勝",
              color: "text-amber-500",
            },
            {
              icon: <BookOpen className="w-5 h-5 text-violet-600" />,
              value: gameState.unlockedArticles.length,
              label: "解鎖法條",
              color: "text-violet-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-card rounded-2xl border border-border p-4 shadow-sm text-center"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* 各村落進度 */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
            <span>🗺️</span> 各村落進度
          </h2>
          <div className="space-y-4">
            {VILLAGES.map((village) => {
              const vp = getVillageProgress(village.id);
              const villageScenarios = getScenariosByVillage(village.id);
              const completedCount = vp.completedScenarios.length;
              const totalCount = villageScenarios.length;
              const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const colors = VILLAGE_COLORS[village.id] ?? VILLAGE_COLORS.general;
              const isCompleted = completedCount === totalCount && totalCount > 0;
              const villageAccuracy =
                vp.totalAttempts > 0
                  ? Math.round((vp.totalCorrect / vp.totalAttempts) * 100)
                  : 0;

              return (
                <div
                  key={village.id}
                  className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{village.icon}</span>
                      <span className={`font-medium ${colors.text}`}>{village.name}</span>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                          ✓ 完成
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {completedCount} / {totalCount}
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-1.5 mb-2" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {vp.totalAttempts > 0 ? (
                      <>
                        <span>正確率 {villageAccuracy}%</span>
                        <span>最高連勝 {vp.maxStreak}</span>
                        {vp.currentStreak > 0 && (
                          <span className="text-amber-600">🔥 {vp.currentStreak} 連勝</span>
                        )}
                      </>
                    ) : (
                      <span>尚未開始</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 成就系統 */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            成就徽章
            <Badge variant="secondary" className="text-xs ml-auto">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl border p-4 flex items-center gap-3 transition-all ${
                    isUnlocked
                      ? "bg-amber-50 border-amber-200"
                      : "bg-secondary border-border opacity-60"
                  }`}
                >
                  <div
                    className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isUnlocked ? "bg-amber-100" : "bg-muted"
                    }`}
                  >
                    {isUnlocked ? achievement.icon : "🔒"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-medium text-sm ${isUnlocked ? "text-amber-800" : "text-muted-foreground"}`}>
                        {achievement.title}
                      </span>
                      {isUnlocked && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 全部題目完成提示 */}
        {stats.completedScenarios.length === SCENARIOS.length && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-display text-xl font-bold text-amber-800 mb-2">
              恭喜！你已完成所有關卡！
            </h3>
            <p className="text-amber-700 text-sm">
              你已通過民法鎮大冒險的所有挑戰，成為真正的法學博士！
            </p>
          </div>
        )}

        {/* 廣告區 */}
        <div className="flex justify-center items-center py-6 mt-4">
          <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", maxWidth: "728px", height: "90px" }}
            data-ad-client="ca-pub-9753491901026477"
            data-ad-slot="auto"
            data-ad-format="horizontal"
            data-full-width-responsive="true"></ins>
        </div>
      </main>
    </div>
  );
}
