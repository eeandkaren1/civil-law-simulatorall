import { SITE_CONFIG } from "@shared/siteConfig";
import { useLocation } from "wouter";

export default function SiteFooter() {
  const [, navigate] = useLocation();

  return (
    <>
      <div className="bg-primary/5 border-t border-primary/10 py-3">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-primary/80">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
            📅 題目每月定期更新，持續新增最新法律實務案例
          </span>
        </div>
      </div>

      <footer className="border-t border-border bg-card/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="font-medium text-foreground/80 mb-2">{SITE_CONFIG.product} · {SITE_CONFIG.brand} · 台灣民法互動學習平台</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs mb-3">
            <button onClick={() => navigate("/daily-challenge")} className="hover:text-primary transition-colors">每日挑戰</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/wrong-notebook")} className="hover:text-primary transition-colors">錯題本</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/question-explorer")} className="hover:text-primary transition-colors">題目探索</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">關於我們</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">聯絡我們</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">隱私權政策</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">服務條款</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/articles")} className="hover:text-primary transition-colors">法律文章</button>
          </div>
          <p className="text-xs opacity-60">{SITE_CONFIG.copyright} · 本平台題目僅供學習參考，不構成法律建議</p>
        </div>
      </footer>
    </>
  );
}
