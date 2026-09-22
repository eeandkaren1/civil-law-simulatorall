import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@shared/siteConfig";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Button>
          <span className="font-display font-semibold text-foreground">隱私權政策</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-10">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm prose prose-sm max-w-none text-foreground">
          <h1 className="text-2xl font-display font-bold mb-2">隱私權政策</h1>
          <p className="text-sm text-muted-foreground mb-8">最後更新日期：2026 年 9 月</p>

          <p className="leading-relaxed mb-6">
            歡迎使用「{SITE_CONFIG.product}」（以下簡稱「本平台」），本平台由 {SITE_CONFIG.brand}（以下簡稱「我們」）營運。
            我們重視您的隱私，本政策說明我們如何處理您使用本平台時產生的資訊。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">一、收集的資訊</h2>
          <p className="leading-relaxed mb-4">
            本平台採用純前端架構。冒險者名稱、答題紀錄、成就、錯題本、收藏與每日挑戰均儲存在您裝置的瀏覽器本機儲存空間（localStorage），不會同步至本平台的伺服器。我們不會主動收集您的個人識別資訊。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">二、第三方服務</h2>
          <p className="leading-relaxed mb-3">本平台使用以下第三方服務；這些服務可能依其各自的隱私政策處理相關資料：</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Google Analytics（分析工具）：</strong>用於統計網站流量與使用行為。Google 可能依其<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">隱私權政策</a>處理匿名化使用資料。</li>
            <li><strong>Google AdSense（廣告服務）：</strong>Google 可能使用 Cookie 依訪問情況投放廣告。您可至<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Google 廣告設定</a>管理個人化廣告偏好。</li>
            <li><strong>Google Gemini API（AI 批改）：</strong>若您啟用申論題 AI 批改，需自行提供 Gemini API 金鑰。題目答案會直接由您的瀏覽器傳送到 Google Gemini；本平台不會接收或保存 API 金鑰及申論內容。</li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-3">三、Cookie 的使用</h2>
          <p className="leading-relaxed mb-4">本平台不以 Cookie 保存學習進度；Google Analytics 與 Google AdSense 等第三方服務可能在您的裝置上設定 Cookie，以提供流量分析及廣告服務。您可透過瀏覽器設定管理或拒絕 Cookie。</p>

          <h2 className="text-lg font-semibold mt-8 mb-3">四、資料安全</h2>
          <p className="leading-relaxed mb-4">您的遊戲進度與 Gemini API 金鑰只存在目前瀏覽器的 localStorage。清除瀏覽資料、使用無痕模式或更換裝置都可能導致這些本機資料遺失，請自行妥善保存。</p>

          <h2 className="text-lg font-semibold mt-8 mb-3">五、兒童隱私</h2>
          <p className="leading-relaxed mb-4">本平台以成人法律學習為主要目的，我們不會刻意收集未成年人的個人資訊。</p>

          <h2 className="text-lg font-semibold mt-8 mb-3">六、政策更新</h2>
          <p className="leading-relaxed mb-4">我們保留更新本政策的權利。更新後將於本頁公告，請定期查閱。</p>

          <h2 className="text-lg font-semibold mt-8 mb-3">七、聯絡我們</h2>
          <p className="leading-relaxed mb-4">如對本政策有任何疑問，請以電子郵件聯絡：<a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-primary underline ml-1">{SITE_CONFIG.contactEmail}</a></p>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-6 text-center text-sm text-muted-foreground">
        <p>{SITE_CONFIG.product} · {SITE_CONFIG.brand} · 台灣民法互動學習平台</p>
        <p className="text-xs mt-1 opacity-60">{SITE_CONFIG.copyright} · 本平台題目僅供學習參考，不構成法律建議</p>
      </footer>
    </div>
  );
}
