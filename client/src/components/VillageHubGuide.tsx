import { BookMarked, BookOpenText, Heart, LibraryBig, Route, Scale } from "lucide-react";
import { Link } from "wouter";
import type { Scenario } from "../../../shared/gameData";
import type { VillageGuide } from "../../../shared/villageGuides";
import { getScenarioPath } from "../../../shared/gameRoutes";

type VillageHubGuideProps = {
  guide: VillageGuide;
  favoriteScenarios: Scenario[];
  accentClassName: string;
};

export default function VillageHubGuide({ guide, favoriteScenarios, accentClassName }: VillageHubGuideProps) {
  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="village-guide-heading">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-xl p-2 ${accentClassName}`}><Route className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">主題學習樞紐</p>
          <h2 id="village-guide-heading" className="font-display text-xl font-semibold text-foreground">{guide.villageName}導讀：從概念到情境練習</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.learningGoal} 本村目前收錄 {guide.totalScenarios} 道題目，內容會隨新題與法條複核自動更新。</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-secondary/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><LibraryBig className="h-4 w-4 text-primary" />本村核心章節</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {guide.chapters.slice(0, 6).map((chapter) => <span key={chapter.name} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">{chapter.name} · {chapter.count}題</span>)}
          </div>
        </div>

        <div className="rounded-xl bg-secondary/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Scale className="h-4 w-4 text-primary" />常用法條重點</div>
          <ul className="mt-3 space-y-2 text-sm">
            {guide.keyLawArticles.map((article) => <li key={article.id} className="text-muted-foreground"><strong className="text-foreground">{article.number}</strong> {article.title}</li>)}
          </ul>
        </div>

        <div className="rounded-xl bg-secondary/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><BookOpenText className="h-4 w-4 text-primary" />延伸閱讀</div>
          <ul className="mt-3 space-y-2 text-sm">
            {guide.recommendedArticles.map((article) => <li key={article.id}><Link href={`/articles/${article.id}`} className="text-primary underline-offset-2 hover:underline">{article.title}</Link></li>)}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><BookMarked className="h-4 w-4 text-primary" />循序練習：各難度先從一題開始</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {guide.featuredScenarios.map((scenario) => <Link key={scenario.id} href={getScenarioPath(scenario.id)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"><span className="mr-1.5 text-muted-foreground">{scenario.difficulty === "easy" ? "入門" : scenario.difficulty === "medium" ? "進階" : "挑戰"}</span>{scenario.title}</Link>)}
        </div>
      </div>

      {favoriteScenarios.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Heart className="h-4 w-4 fill-rose-500 text-rose-500" />本村收藏</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {favoriteScenarios.map((scenario) => <Link key={scenario.id} href={getScenarioPath(scenario.id)} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 transition-colors hover:bg-rose-100">{scenario.title}</Link>)}
          </div>
        </div>
      )}
    </section>
  );
}
