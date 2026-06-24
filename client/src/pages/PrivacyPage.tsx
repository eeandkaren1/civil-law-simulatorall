import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
          <p className="text-sm text-muted-foreground mb-8">最後更新日期：2025 年 6 月</p>

          <p className="leading-relaxed mb-6">
            歡迎使用「民法鎮大冒險」（以下簡稱「本平台」），本平台由宸鑫頤意企業社（以下簡稱「我們」）營運。
            我們重視您的隱私，本政策說明我們如何收集、使用及保護您在使用本平台時所產生的資訊。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">一、收集的資訊</h2>
          <p className="leading-relaxed mb-4">
            本平台採用純前端架構，所有遊戲進度（冒險者名稱、答題紀錄、成就解鎖）均儲存於您自己裝置的瀏覽器本地儲存空間（localStorage），
            不會上傳至任何伺服器。我們不會主動收集您的個人識別資訊。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">二、第三方服務</h2>
          <p className="leading-relaxed mb-3">本平台使用以下第三方服務，這些服務可能依其各自的隱私政策收集相關資料：</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Google Analytics（分析工具）：</strong>用於統計網站流量與使用行為（如頁面瀏覽次數、停留時間）。
              Google 可能依其
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
                隱私權政策
              </a>
              收集匿名化的使用資料。
            </li>
            <li>
              <strong>Google AdSense（廣告服務）：</strong>本平台顯示 Google AdSense 廣告。Google 可能使用 Cookie
              根據您過去對本平台及其他網站的訪問情況向您投放廣告。您可至
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
                Google 廣告設定
              </a>
              管理個人化廣告偏好。
            </li>
            <li>
              <strong>Google Gemini API（AI 批改功能）：</strong>若您選擇使用申論題 AI 批改功能，您需自行提供
              Google Gemini API 金鑰，您的申論題答案將透過您的 API 金鑰直接傳送至 Google Gemini 服務進行分析。
              本平台不會儲存您的 API 金鑰或申論題內容。
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-3">三、Cookie 的使用</h2>
          <p className="leading-relaxed mb-4">
            本平台本身不使用 Cookie 追蹤使用者。然而，Google Analytics 及 Google AdSense 等第三方服務可能在您的裝置上設置 Cookie，
            以提供廣告投放及流量分析功能。您可透過瀏覽器設定管理或拒絕 Cookie。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">四、資料安全</h2>
          <p className="leading-relaxed mb-4">
            由於本平台不收集或儲存使用者個人資料，資料安全風險極低。您的遊戲進度僅存於您自己的裝置，
            清除瀏覽器快取將導致進度遺失，請自行注意。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">五、兒童隱私</h2>
          <p className="leading-relaxed mb-4">
            本平台內容以成人法律學習為主要目的，我們不會刻意收集未成年人的個人資訊。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">六、政策更新</h2>
          <p className="leading-relaxed mb-4">
            我們保留隨時修改本隱私權政策的權利。政策更新後將於本頁面公告，請定期查閱。
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-3">七、聯絡我們</h2>
          <p className="leading-relaxed mb-4">
            如您對本隱私權政策有任何疑問，歡迎透過電子郵件聯繫我們：
            <a href="mailto:guaned0402@gmail.com" className="text-primary underline ml-1">
              guaned0402@gmail.com
            </a>
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
