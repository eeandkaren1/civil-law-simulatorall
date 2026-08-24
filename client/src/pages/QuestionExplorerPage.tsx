import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteFooter from "@/components/SiteFooter";
import { LAW_ARTICLES, SCENARIOS, VILLAGES } from "../../../shared/gameData";
import { DifficultyFilter, filterScenarios } from "../../../shared/learningTools";
import { ArrowLeft, BookOpen, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

const difficultyLabels: Record<DifficultyFilter, string> = {
  all: "全部難度",
  easy: "初級",
  medium: "中級",
  hard: "高級",
};

const difficultyStyles: Record<string, string> = {
  easy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  hard: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function QuestionExplorerPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [villageId, setVillageId] = useState("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [articleId, setArticleId] = useState("all");

  const articles = useMemo(() => {
    const seen = new Set<string>();
    return LAW_ARTICLES.filter((article) => {
      if (seen.has(article.id)) return false;
      seen.add(article.id);
      return true;
    });
  }, []);
  const filteredScenarios = useMemo(() => filterScenarios(SCENARIOS, { query, villageId, difficulty, articleId }), [query, villageId, difficulty, articleId]);
  const resetFilters = () => { setQuery(""); setVillageId("all"); setDifficulty("all"); setArticleId("all"); };

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm"><div className="container mx-auto flex h-14 max-w-6xl items-center gap-3 px-4"><Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />返回</Button><div className="h-4 w-px bg-border" /><span className="font-display font-semibold text-foreground">題目探索</span><Badge variant="secondary" className="ml-auto">共 {SCENARIOS.length} 題</Badge></div></header>
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-primary"><Search className="h-5 w-5" /><span className="text-sm font-semibold">題庫搜尋</span></div><h1 className="mt-2 font-display text-3xl font-bold text-foreground">找到想練習的民法主題</h1><p className="mt-2 text-sm text-muted-foreground">可依生活關鍵字、村落、難易度或特定法條，從所有題目中精準篩選。</p></div><Badge className="w-fit border-sky-200 bg-white/80 px-3 py-2 text-sky-800"><Filter className="mr-1 h-4 w-4" />符合條件 {filteredScenarios.length} 題</Badge></div></section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="grid gap-3 lg:grid-cols-4"><div className="relative lg:col-span-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋題名、情境、法條或標籤…" className="pl-9" /></div><label className="sr-only" htmlFor="village-filter">村落</label><select id="village-filter" value={villageId} onChange={(event) => setVillageId(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"><option value="all">全部村落</option>{VILLAGES.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}</select><label className="sr-only" htmlFor="difficulty-filter">難易度</label><select id="difficulty-filter" value={difficulty} onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)} className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground">{Object.entries(difficultyLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="mt-3 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="article-filter">法條</label><select id="article-filter" value={articleId} onChange={(event) => setArticleId(event.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground"><option value="all">全部相關法條</option>{articles.map((article) => <option key={article.id} value={article.id}>{article.number}｜{article.title}</option>)}</select><Button variant="outline" onClick={resetFilters} className="gap-1.5"><SlidersHorizontal className="h-4 w-4" />清除篩選</Button></div></section>

        <section className="mt-6"><div className="mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /><h2 className="font-display text-xl font-bold text-foreground">篩選結果</h2></div>{filteredScenarios.length === 0 ? <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center"><Search className="mx-auto h-10 w-10 text-muted-foreground/50" /><h2 className="mt-4 font-display text-xl font-bold text-foreground">找不到符合條件的題目</h2><p className="mt-2 text-sm text-muted-foreground">試著減少關鍵字或重設篩選條件。</p><Button variant="outline" className="mt-5" onClick={resetFilters}>重設篩選</Button></div> : <div className="grid gap-4 md:grid-cols-2">{filteredScenarios.map((scenario) => { const village = VILLAGES.find((item) => item.id === scenario.villageId); return <article key={scenario.id} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="text-xs">{village?.name}</Badge><Badge variant="outline" className={`text-xs ${difficultyStyles[scenario.difficulty]}`}>{difficultyLabels[scenario.difficulty]}</Badge><span className="ml-auto text-xs text-muted-foreground">{scenario.chapter}</span></div><h3 className="mt-3 font-display text-lg font-bold text-foreground">{scenario.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{scenario.question}</p><div className="mt-4 flex flex-wrap gap-1.5">{scenario.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">#{tag}</span>)}</div><div className="mt-4 border-t border-border pt-3"><p className="line-clamp-1 text-xs text-primary">{scenario.legalBasis}</p><Button size="sm" className="mt-3 w-full" onClick={() => navigate(`/scenario/${scenario.id}`)}>開始練習</Button></div></article>; })}</div>}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
