import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SiteFooter from "@/components/SiteFooter";
import { useGame } from "@/contexts/GameContext";
import { SCENARIOS, VILLAGES } from "../../../shared/gameData";
import { ArrowLeft, CalendarDays, CheckCircle2, Circle, Play, Sparkles, Target } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function DailyChallengePage() {
  const [, navigate] = useLocation();
  const { ensureDailyChallenge, getDailyChallenge } = useGame();
  const dailyChallenge = getDailyChallenge();

  useEffect(() => {
    ensureDailyChallenge();
  }, [ensureDailyChallenge]);

  const scenarios = dailyChallenge.scenarioIds
    .map((id) => SCENARIOS.find((scenario) => scenario.id === id))
    .filter((scenario): scenario is (typeof SCENARIOS)[number] => Boolean(scenario));
  const answeredCount = Object.keys(dailyChallenge.answers).length;
  const correctCount = Object.values(dailyChallenge.answers).filter(Boolean).length;
  const nextScenario = scenarios.find((scenario) => !(scenario.id in dailyChallenge.answers));
  const isComplete = scenarios.length > 0 && answeredCount === scenarios.length;
  const formattedDate = new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${dailyChallenge.dateKey}T00:00:00`));

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> 返回
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 font-display font-semibold text-foreground">
            <CalendarDays className="h-4 w-4 text-primary" /> 每日挑戰
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <section className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3 border-amber-300 bg-white/70 text-amber-800">{formattedDate}</Badge>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">今日民法十題挑戰</h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">每天從 100 題題庫中固定抽出 10 題。今天的題組已為您保留，完成後可立即查看答題成果。</p>
            </div>
            <div className="grid min-w-48 grid-cols-2 gap-3 rounded-2xl border border-white/70 bg-white/75 p-4 text-center shadow-sm">
              <div><p className="text-2xl font-bold text-primary">{answeredCount}<span className="text-sm text-muted-foreground"> / 10</span></p><p className="mt-1 text-xs text-muted-foreground">已作答</p></div>
              <div><p className="text-2xl font-bold text-emerald-600">{correctCount}</p><p className="mt-1 text-xs text-muted-foreground">答對題數</p></div>
            </div>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/80"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${(answeredCount / 10) * 100}%` }} /></div>
          <div className="mt-5 flex flex-wrap gap-3">
            {nextScenario ? (
              <Button onClick={() => navigate(`/scenario/${nextScenario.id}?mode=daily`)} className="gap-2 bg-amber-700 text-white hover:bg-amber-800"><Play className="h-4 w-4" />{answeredCount === 0 ? "開始今日挑戰" : "繼續挑戰"}</Button>
            ) : null}
            {isComplete ? <Badge className="border-emerald-200 bg-emerald-100 px-3 py-2 text-emerald-800"><Sparkles className="mr-1 h-4 w-4" />今日挑戰完成，正確率 {Math.round((correctCount / 10) * 100)}%</Badge> : null}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-xl font-bold text-foreground">今日題目</h2><p className="mt-1 text-sm text-muted-foreground">可從尚未作答的題目繼續；已作答題目保留結果供回顧。</p></div><Target className="h-5 w-5 text-primary" /></div>
          <div className="grid gap-3 md:grid-cols-2">
            {scenarios.map((scenario, index) => {
              const answer = dailyChallenge.answers[scenario.id];
              const isAnswered = scenario.id in dailyChallenge.answers;
              const village = VILLAGES.find((item) => item.id === scenario.villageId);
              return <button key={scenario.id} onClick={() => !isAnswered && navigate(`/scenario/${scenario.id}?mode=daily`)} disabled={isAnswered} className={`rounded-2xl border p-4 text-left shadow-sm transition-all ${isAnswered ? "cursor-default border-border bg-secondary/60" : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"}`}>
                <div className="flex items-start gap-3"><div className={`mt-0.5 ${isAnswered && answer ? "text-emerald-600" : isAnswered ? "text-rose-500" : "text-primary"}`}>{isAnswered && answer ? <CheckCircle2 className="h-5 w-5" /> : isAnswered ? <Circle className="h-5 w-5" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">{index + 1}</span>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><Badge variant="outline" className="text-xs">{village?.name}</Badge><Badge variant="secondary" className="text-xs">{scenario.difficulty === "easy" ? "初級" : scenario.difficulty === "medium" ? "中級" : "高級"}</Badge></div><h3 className="mt-2 font-medium text-foreground">{index + 1}. {scenario.title}</h3><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{scenario.question}</p>{isAnswered ? <p className={`mt-2 text-xs font-medium ${answer ? "text-emerald-700" : "text-rose-600"}`}>{answer ? "答對" : "答錯，已收錄到錯題本"}</p> : null}</div></div>
              </button>;
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
