import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/contexts/GameContext";
import { VILLAGES, SCENARIOS, getScenariosByVillage } from "../../../shared/gameData";
import { useState } from "react";
import { useLocation } from "wouter";
import { BookOpen, Trophy, Map, User, Sparkles, ChevronRight, Key } from "lucide-react";
import { toast } from "sonner";

const VILLAGE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  general: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", icon: "⚖️" },
  obligation: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "🤝" },
  property: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "🏠" },
  family: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", icon: "👨‍👩‍👧" },
  inheritance: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "📜" },
};

export default function Home() {
  const { gameState, setPlayerName, getVillageProgress, getOverallStats } = useGame();
  const [nameInput, setNameInput] = useState(gameState.playerName || "");
  const [, navigate] = useLocation();

  const stats = getOverallStats();
  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
      : 0;

  const handleStartAdventure = () => {
    const name = nameInput.trim();
    if (!name) {
      toast.error("請輸入冒險者名字！");
      return;
    }
    setPlayerName(name);
    toast.success(`歡迎，${name}！準備好開始冒險了嗎？`);
  };

  const handleVillageClick = (villageId: string) => {
    if (!gameState.playerName) {
      toast.error("請先設定冒險者名字！");
      return;
    }
    navigate(`/village/${villageId}`);
  };

  return (
    <div className="min-h-screen game-bg">
      {/* 頂部導航 */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏘️</span>
            <span className="font-display font-semibold text-foreground text-lg tracking-wide">
              民法鎮大冒險
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!gameState.playerName) { toast.error("請先設定冒險者名字！"); return; }
                navigate("/knowledge");
              }}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">法條庫</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!gameState.playerName) { toast.error("請先設定冒險者名字！"); return; }
                navigate("/progress");
              }}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">進度</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">AI 設定</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* 頂部橫幅廣告區（728x90 Leaderboard，僅桌機顯示） */}
      <div className="hidden md:flex justify-center items-center py-3 bg-card/50 border-b border-border min-h-[100px]">
        <ins className="adsbygoogle"
          style={{ display: "block", width: "728px", height: "90px" }}
          data-ad-client="ca-pub-9753491901026477"
          data-ad-slot="auto"
          data-ad-format="horizontal"
          data-full-width-responsive="false"></ins>
      </div>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* 英雄區塊 */}
        <section className="text-center mb-12 pt-4">
          <div className="text-6xl mb-4">🏘️</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3 tracking-wide">
            民法鎮大冒險
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            用故事讀懂民法，守護自己的權益
          </p>
          <p className="text-sm text-muted-foreground/70">
            涵蓋台灣民法五大編 · 選擇題 + 申論題 · AI 智慧批改
          </p>
        </section>

        {/* 角色命名區塊 */}
        <section className="max-w-md mx-auto mb-10">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">
                {gameState.playerName ? `歡迎回來，${gameState.playerName}！` : "冒險者，請告訴我你的名字"}
              </h2>
            </div>
            <div className="flex gap-2">
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartAdventure()}
                placeholder="輸入你的名字..."
                className="flex-1 bg-input border-border focus-visible:ring-primary"
                maxLength={20}
              />
              <Button
                onClick={handleStartAdventure}
                className="bg-primary hover:bg-primary/90 gap-1.5 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {gameState.playerName ? "更新" : "出發！"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              📱 遊戲進度自動儲存在您的瀏覽器中
            </p>
          </div>
        </section>

        {/* 整體進度摘要（有進度才顯示） */}
        {stats.totalAttempts > 0 && (
          <section className="max-w-3xl mx-auto mb-10">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="font-display font-semibold text-foreground">學習進度摘要</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.totalAttempts}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">已答題數</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground mt-0.5">答題正確率</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">{stats.maxStreak}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">最高連勝</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {stats.completedScenarios.length}/{SCENARIOS.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">完成關卡</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 村落地圖 */}
        <section className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-xl text-foreground">選擇你的村落</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VILLAGES.map((village) => {
              const vp = getVillageProgress(village.id);
              const villageScenarios = getScenariosByVillage(village.id);
              const completedCount = vp.completedScenarios.length;
              const totalCount = villageScenarios.length;
              const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              const colors = VILLAGE_COLORS[village.id] ?? VILLAGE_COLORS.general;
              const isCompleted = completedCount === totalCount && totalCount > 0;

              return (
                <button
                  key={village.id}
                  onClick={() => handleVillageClick(village.id)}
                  className={`village-card text-left rounded-2xl border p-5 shadow-sm cursor-pointer ${colors.bg} ${colors.border} hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl">{colors.icon}</div>
                    <div className="flex items-center gap-1">
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                          已完成
                        </Badge>
                      )}
                      <ChevronRight className={`w-4 h-4 ${colors.text} opacity-60`} />
                    </div>
                  </div>
                  <h3 className={`font-display font-semibold text-lg mb-1 ${colors.text}`}>
                    {village.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {village.description}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>進度</span>
                      <span>{completedCount}/{totalCount}</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCompleted ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                  {completedCount > 0 && vp.totalAttempts > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      正確率 {Math.round((vp.totalCorrect / vp.totalAttempts) * 100)}%
                      {vp.currentStreak > 0 && (
                        <span className="ml-2 text-amber-600">🔥 {vp.currentStreak} 連勝</span>
                      )}
                    </div>
                  )}
                  <div className="mt-2">
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {completedCount === 0 ? "開始挑戰" : completedCount === totalCount ? "重新挑戰" : "繼續挑戰"} →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 功能介紹 */}
        <section className="max-w-5xl mx-auto mt-16 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📖",
                title: "沉浸式故事情境",
                desc: "每道題目都有真實生活情境，讓你在故事中自然學習民法知識",
              },
              {
                icon: "🤖",
                title: "AI 申論批改",
                desc: "使用自己的 Gemini API 額度，獲得個人化的申論題批改與建議",
              },
              {
                icon: "🏆",
                title: "成就與進度追蹤",
                desc: "解鎖法條知識庫、獲得成就徽章，追蹤你的學習成長軌跡",
              },
            ].map((feat) => (
              <div key={feat.title} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center">
                <div className="text-3xl mb-3">{feat.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 底部廣告區（響應式） */}
        <div className="flex justify-center items-center py-6 mt-4">
          <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", maxWidth: "728px", height: "90px" }}
            data-ad-client="ca-pub-9753491901026477"
            data-ad-slot="auto"
            data-ad-format="horizontal"
            data-full-width-responsive="true"></ins>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-6 text-center text-sm text-muted-foreground">
        <p>民法鎮大冒險 · 台灣民法互動學習平台</p>
        <p className="text-xs mt-1 opacity-60">本平台題目僅供學習參考，不構成法律建議</p>
      </footer>
    </div>
  );
}
