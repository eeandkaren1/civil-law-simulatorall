import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LAW_ARTICLES, VILLAGES } from "../../../shared/gameData";
import SiteFooter from "@/components/SiteFooter";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { ArrowLeft, Search, BookOpen, Lock } from "lucide-react";

const VILLAGE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  general: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  obligation: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700 border-amber-200" },
  property: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  family: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-700 border-rose-200" },
  inheritance: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-100 text-orange-700 border-orange-200" },
};

export default function KnowledgePage() {
  const [, navigate] = useLocation();
  const { gameState } = useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [showLockedOnly, setShowLockedOnly] = useState(false);

  const unlockedArticleIds = gameState.unlockedArticles;

  const filteredArticles = useMemo(() => {
    return LAW_ARTICLES.filter((article) => {
      const matchesVillage = selectedVillage === "all" || article.villageId === selectedVillage;
      const matchesSearch =
        !searchQuery ||
        article.title.includes(searchQuery) ||
        article.content.includes(searchQuery) ||
        article.number.includes(searchQuery) ||
        article.chapter.includes(searchQuery);
      const isUnlocked = unlockedArticleIds.includes(article.id);
      const matchesLock = showLockedOnly ? !isUnlocked : true;
      return matchesVillage && matchesSearch && matchesLock;
    });
  }, [searchQuery, selectedVillage, showLockedOnly, unlockedArticleIds]);

  const unlockedCount = LAW_ARTICLES.filter((a) => unlockedArticleIds.includes(a.id)).length;

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
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">法條知識庫</span>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              已解鎖 {unlockedCount} / {LAW_ARTICLES.length} 條
            </Badge>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* 搜尋與篩選 */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋法條號碼、標題或內容..."
                className="pl-9 bg-input border-border"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setSelectedVillage("all")}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                selectedVillage === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              全部
            </button>
            {VILLAGES.map((v) => {
              const colors = VILLAGE_COLORS[v.id] ?? VILLAGE_COLORS.general;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVillage(v.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedVillage === v.id
                      ? `${colors.bg} ${colors.border} ${colors.text} font-medium`
                      : "bg-secondary border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {v.icon} {v.name}
                </button>
              );
            })}
            <button
              onClick={() => setShowLockedOnly(!showLockedOnly)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${
                showLockedOnly
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-secondary border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              <Lock className="w-3 h-3" />
              {showLockedOnly ? "顯示未解鎖" : "顯示未解鎖"}
            </button>
          </div>
        </div>

        {/* 統計 */}
        {unlockedCount === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-amber-800 font-medium mb-1">尚未解鎖任何法條</p>
            <p className="text-sm text-amber-700">
              完成各村落的關卡題目，即可解鎖對應的法條知識！
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/")}
              className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
            >
              前往挑戰關卡
            </Button>
          </div>
        )}

        {/* 法條列表 */}
        <div className="space-y-3">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>找不到符合條件的法條</p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isUnlocked = unlockedArticleIds.includes(article.id);
              const colors = VILLAGE_COLORS[article.villageId] ?? VILLAGE_COLORS.general;
              const village = VILLAGES.find((v) => v.id === article.villageId);

              return (
                <div
                  key={article.id}
                  className={`rounded-xl border p-4 shadow-sm transition-all ${
                    isUnlocked
                      ? `${colors.bg} ${colors.border}`
                      : "bg-secondary border-border opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {isUnlocked ? (
                        <BookOpen className={`w-4 h-4 ${colors.text}`} />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant="outline" className={`text-xs ${isUnlocked ? colors.badge : ""}`}>
                          第 {article.number} 條
                        </Badge>
                        <span className={`text-xs ${isUnlocked ? colors.text : "text-muted-foreground"} font-medium`}>
                          {article.title}
                        </span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {village?.icon} {village?.name}
                        </Badge>
                      </div>
                      {isUnlocked ? (
                        <p className="text-sm text-foreground leading-relaxed">
                          {article.content}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          完成「{village?.name}」的相關關卡即可解鎖此法條
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">{article.chapter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>
      <SiteFooter />
    </div>
  );
}
