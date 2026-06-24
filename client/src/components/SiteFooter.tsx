import { useLocation } from "wouter";

export default function SiteFooter() {
  const [, navigate] = useLocation();

  return (
    <>
      {/* 每月更新提示 */}
      <div className="bg-primary/5 border-t border-primary/10 py-3">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-sm text-primary/80">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></span>
            📅 題目每月定期更新，持續新增最新法律實務案例
          </span>
        </div>
      </div>

      <footer className="border-t border-border bg-card/50 py-8 text-center text-sm text-muted-foreground">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="font-medium text-foreground/80 mb-2">民法鎮大冒險 · 台灣民法互動學習平台</p>
          <div className="flex items-center justify-center gap-4 text-xs mb-3">
            <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">關於我們</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">聯絡我們</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">隱私權政策</button>
          </div>
          <p className="text-xs opacity-60">© 宸鑫頤意企業社所有 · 本平台題目僅供學習參考，不構成法律建議</p>
        </div>
      </footer>
    </>
  );
}
