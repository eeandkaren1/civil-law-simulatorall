import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale, BookOpen, Sparkles, Heart } from "lucide-react";

export default function AboutPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Button>
          <span className="font-display font-semibold text-foreground">關於我們</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-10">
        {/* 主標題卡片 */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6 text-center">
          <div className="text-5xl mb-4">🏘️</div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">民法鎮大冒險</h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            讓法律不再枯燥乏味，用故事帶你走進台灣民法的世界
          </p>
        </div>

        {/* 宗旨說明 */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-display font-semibold text-foreground">我們的初衷</h2>
          </div>
          <p className="text-foreground leading-relaxed mb-4">
            「法律」對許多人來說，是一個充滿艱澀條文、令人望而生畏的領域。
            厚重的法典、抽象的法律概念，讓大多數人在真正需要保護自己的時候，卻不知道從何下手。
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            民法鎮大冒險的誕生，正是為了打破這道高牆。
          </p>
          <p className="text-foreground leading-relaxed">
            我們相信，法律知識應該是每個人都能輕鬆掌握的生活工具，而不是法律人的專利。
            透過貼近台灣日常生活的故事情境——市場買菜、租屋糾紛、繼承遺產——
            讓你在遊戲中自然而然地學會如何用民法保護自己的權益。
          </p>
        </div>

        {/* 三大特色 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">故事情境學習</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              每道題目都有真實的台灣生活情境，讓你在故事中自然吸收法律知識，不再死背條文
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">涵蓋民法五大編</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              從總則、債編、物權、親屬到繼承，系統性涵蓋台灣民法的核心知識架構
            </p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI 智慧批改</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              申論題提供 AI 個人化批改與建議，幫助你深化理解，不只是選出正確答案
            </p>
          </div>
        </div>

        {/* 關於宸鑫頤意企業社 */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">關於宸鑫頤意企業社</h2>
          <p className="text-foreground leading-relaxed mb-4">
            宸鑫頤意企業社致力於開發具有社會價值的數位學習工具，希望透過科技的力量，
            讓更多人能夠輕鬆獲取重要的生活知識。
          </p>
          <p className="text-foreground leading-relaxed">
            民法鎮大冒險是我們推廣法律教育的第一步。我們每月定期更新題目內容，
            確保學習素材與時俱進，持續為使用者提供最新、最實用的民法學習體驗。
          </p>
        </div>

        {/* 免責聲明 */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-amber-800 mb-2">⚠️ 免責聲明</h2>
          <p className="text-sm text-amber-700 leading-relaxed">
            本平台所有題目及法條說明僅供學習參考之用，不構成正式法律建議。
            如您面臨實際法律問題，請諮詢具執照之律師或法律專業人士。
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-6 text-center text-sm text-muted-foreground">
        <p>民法鎮大冒險 · 台灣民法互動學習平台</p>
        <p className="text-xs mt-1 opacity-60">© 宸鑫頤意企業社所有 · 本平台題目僅供學習參考，不構成法律建議</p>
      </footer>
    </div>
  );
}
