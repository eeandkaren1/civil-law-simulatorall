import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getVillageById, getScenariosByVillage } from "../../../shared/gameData";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, CheckCircle2, Circle, Lock, Star } from "lucide-react";

const VILLAGE_COLORS: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  general: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", headerBg: "bg-violet-600" },
  obligation: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", headerBg: "bg-amber-600" },
  property: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", headerBg: "bg-emerald-600" },
  family: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", headerBg: "bg-rose-600" },
  inheritance: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", headerBg: "bg-orange-600" },
};

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: "入門", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { label: "進階", color: "bg-amber-100 text-amber-700 border-amber-200" },
  hard: { label: "挑戰", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

export default function VillagePage() {
  const { villageId } = useParams<{ villageId: string }>();
  const [, navigate] = useLocation();
  const { getVillageProgress, isScenarioCompleted } = useGame();

  const village = getVillageById(villageId ?? "");
  const scenarios = getScenariosByVillage(villageId ?? "");
  const vp = getVillageProgress(villageId ?? "");
  const colors = VILLAGE_COLORS[villageId ?? ""] ?? VILLAGE_COLORS.general;

  if (!village) {
    return (
      <div className="min-h-screen game-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到此村落</p>
          <Button onClick={() => navigate("/")}>返回首頁</Button>
        </div>
      </div>
    );
  }

  const completedCount = vp.completedScenarios.length;
  const totalCount = scenarios.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen game-bg">
      {/* 頂部 */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
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
          <span className="font-display font-semibold text-foreground">{village.name}</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {/* 村落標題 */}
        <div className={`rounded-2xl ${colors.bg} ${colors.border} border p-6 mb-8 shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className={`font-display text-3xl font-bold ${colors.text} mb-2`}>
                {village.name}
              </h1>
              <p className="text-muted-foreground mb-4">{village.description}</p>
              <div className="flex flex-wrap gap-2">
                {scenarios.slice(0, 4).map((s) => (
                  <Badge key={s.chapter} variant="secondary" className="text-xs">
                    {s.chapter}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-5xl ml-4">{village.icon}</div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">完成進度</span>
              <span className={`font-medium ${colors.text}`}>
                {completedCount} / {totalCount} 關卡
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />
            {vp.totalAttempts > 0 && (
              <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                <span>正確率 {Math.round((vp.totalCorrect / vp.totalAttempts) * 100)}%</span>
                <span>最高連勝 {vp.maxStreak}</span>
                {vp.currentStreak > 0 && (
                  <span className="text-amber-600">🔥 目前 {vp.currentStreak} 連勝</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 關卡列表 */}
        <div className="space-y-3">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">
            關卡列表
          </h2>
          {scenarios.map((scenario, index) => {
            const completed = isScenarioCompleted(scenario.id);
            const diff = DIFFICULTY_LABELS[scenario.difficulty] ?? DIFFICULTY_LABELS.easy;

            return (
              <button
                key={scenario.id}
                onClick={() => navigate(`/scenario/${scenario.id}`)}
                className={`w-full text-left rounded-xl border p-4 shadow-sm transition-all village-card
                  ${completed
                    ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    : "bg-card border-border hover:bg-secondary"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${diff.color}`}
                      >
                        {diff.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                        {scenario.chapter}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-foreground truncate">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                      {scenario.story[0]}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {completed && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {completed ? "再挑戰" : "開始"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
