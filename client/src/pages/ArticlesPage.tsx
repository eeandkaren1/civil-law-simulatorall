import { useState } from "react";
import { useLocation } from "wouter";
import { ARTICLES } from "../../../shared/articles";
import SiteFooter from "@/components/SiteFooter";
import { BookOpen, ChevronRight, ArrowLeft, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORY_COLORS: Record<string, string> = {
  "民法入門": "bg-violet-100 text-violet-700 border-violet-200",
  "契約法": "bg-amber-100 text-amber-700 border-amber-200",
  "物權法": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "繼承法": "bg-rose-100 text-rose-700 border-rose-200",
  "使用指南": "bg-sky-100 text-sky-700 border-sky-200",
};

const ALL_CATEGORIES = ["全部", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

export default function ArticlesPage() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  // 篩選邏輯
  const filteredArticles = ARTICLES.filter(article => {
    const matchCategory = selectedCategory === "全部" || article.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchSearch = !query ||
      article.title.toLowerCase().includes(query) ||
      article.subtitle.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query)) ||
      article.category.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("全部");
  };

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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            原創法律知識文章
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            法律知識專區
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            深入淺出的台灣民法解析，從日常生活情境出發，幫助你建立紮實的法律素養。
          </p>
        </div>

        {/* 搜尋列 */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜尋文章標題、關鍵字或標籤..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 分類標籤篩選 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            const colorClass = cat === "全部"
              ? isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              : isActive
                ? (CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-700") + " border font-semibold"
                : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground";

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm border font-medium transition-all ${colorClass}`}
              >
                {cat}
                {cat !== "全部" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {ARTICLES.filter(a => a.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 搜尋結果提示 */}
        {(searchQuery || selectedCategory !== "全部") && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              找到 <span className="font-semibold text-foreground">{filteredArticles.length}</span> 篇文章
              {searchQuery && <span>（關鍵字：「{searchQuery}」）</span>}
              {selectedCategory !== "全部" && <span>（分類：{selectedCategory}）</span>}
            </p>
            <button
              onClick={clearSearch}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              清除篩選
            </button>
          </div>
        )}

        {/* 文章列表 */}
        {filteredArticles.length > 0 ? (
          <div className="space-y-5">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/articles/${article.id}`)}
                className="group bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        {article.category}
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
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={e => {
                            e.stopPropagation();
                            setSearchQuery(tag);
                          }}
                        >
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
        ) : (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">找不到符合條件的文章</p>
            <button onClick={clearSearch} className="text-sm text-primary hover:underline">
              清除篩選條件
            </button>
          </div>
        )}

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
