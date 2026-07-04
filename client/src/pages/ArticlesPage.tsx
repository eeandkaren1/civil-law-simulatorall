import { useLocation } from "wouter";
import { ARTICLES } from "../../../shared/articles";
import SiteFooter from "@/components/SiteFooter";
import { BookOpen, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORY_COLORS: Record<string, string> = {
  "民法入門": "bg-violet-100 text-violet-700",
  "契約法": "bg-amber-100 text-amber-700",
  "物權法": "bg-emerald-100 text-emerald-700",
  "繼承法": "bg-rose-100 text-rose-700",
  "使用指南": "bg-sky-100 text-sky-700",
};

export default function ArticlesPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 頂部導覽 */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </button>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-medium text-foreground">法律知識專區</span>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10">
        {/* 頁首 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            原創法律知識文章
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            法律知識專區
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            深入淺出的台灣民法解析，從日常生活情境出發，幫助你建立紮實的法律素養。每篇文章均由專業角度撰寫，結合實務案例與法條說明。
          </p>
        </div>

        {/* 文章列表 */}
        <div className="space-y-5">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="group bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      約 {article.readTime} 分鐘閱讀
                    </span>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {article.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </article>
          ))}
        </div>

        {/* 底部說明 */}
        <div className="mt-10 p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground">
            本專區文章每月持續更新，涵蓋台灣民法最新實務發展與生活化案例解析。
            <br />
            閱讀文章後，歡迎前往各村落進行情境練習，將知識轉化為實際能力。
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            前往民法鎮大冒險 →
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
