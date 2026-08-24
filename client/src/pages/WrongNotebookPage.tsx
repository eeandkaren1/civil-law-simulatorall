import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SiteFooter from "@/components/SiteFooter";
import { useGame } from "@/contexts/GameContext";
import { SCENARIOS, VILLAGES } from "../../../shared/gameData";
import { ArrowLeft, BookMarked, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function WrongNotebookPage() {
  const [, navigate] = useLocation();
  const { gameState, removeWrongScenario } = useGame();
  const wrongScenarios = gameState.wrongScenarioIds
    .map((id) => SCENARIOS.find((scenario) => scenario.id === id))
    .filter((scenario): scenario is (typeof SCENARIOS)[number] => Boolean(scenario));

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm"><div className="container mx-auto flex h-14 max-w-5xl items-center gap-3 px-4"><Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />返回</Button><div className="h-4 w-px bg-border" /><span className="font-display font-semibold text-foreground">錯題本</span><Badge variant="secondary" className="ml-auto">{wrongScenarios.length} 題待複習</Badge></div></header>
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-rose-800"><BookMarked className="h-5 w-5" /><h1 className="font-display text-2xl font-bold">把錯題變成理解</h1></div><p className="mt-2 text-sm leading-relaxed text-rose-700">每次答錯的題目都會自動保留在這裡。複習完成後，您可手動將題目從錯題本移除。</p></div>{wrongScenarios.length > 0 ? <Button onClick={() => navigate(`/scenario/${wrongScenarios[0].id}`)} className="gap-2 bg-rose-700 text-white hover:bg-rose-800"><RotateCcw className="h-4 w-4" />開始複習</Button> : null}</div></section>
        {wrongScenarios.length === 0 ? <section className="mt-8 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/70 px-6 py-14 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h2 className="mt-4 font-display text-xl font-bold text-emerald-900">目前沒有待複習的錯題</h2><p className="mt-2 text-sm text-emerald-700">繼續挑戰各村落與每日測驗，遇到需要再加強的題目會自動收錄在此。</p><Button className="mt-5" onClick={() => navigate("/daily-challenge")}>前往每日挑戰</Button></section> : <section className="mt-8 space-y-3">{wrongScenarios.map((scenario) => { const village = VILLAGES.find((item) => item.id === scenario.villageId); return <article key={scenario.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{village?.name}</Badge><Badge variant="secondary">{scenario.difficulty === "easy" ? "初級" : scenario.difficulty === "medium" ? "中級" : "高級"}</Badge><span className="text-xs text-muted-foreground">{scenario.legalBasis}</span></div><h2 className="mt-3 font-display text-lg font-bold text-foreground">{scenario.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{scenario.question}</p></div><div className="flex shrink-0 gap-2"><Button size="sm" onClick={() => navigate(`/scenario/${scenario.id}`)} className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" />複習</Button><Button size="sm" variant="outline" onClick={() => removeWrongScenario(scenario.id)} className="gap-1.5 text-muted-foreground"><Trash2 className="h-3.5 w-3.5" />移除</Button></div></div></article>; })}</section>}
      </main>
      <SiteFooter />
    </div>
  );
}
