import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen game-bg">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Button>
          <span className="font-display font-semibold text-foreground">聯絡我們</span>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-10">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm mb-6 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">聯絡我們</h1>
          <p className="text-muted-foreground text-lg">
            有任何問題、建議或合作洽詢，歡迎隨時與我們聯繫
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 電子郵件 */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground">電子郵件</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              如有題目內容建議、錯誤回報或其他問題，請來信告知，我們將盡快回覆。
            </p>
            <a
              href="mailto:guaned0402@gmail.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              guaned0402@gmail.com
            </a>
          </div>

          {/* LINE 官方帳號 */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="font-semibold text-foreground">LINE 官方帳號</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              加入我們的 LINE 官方帳號，獲得最新消息、每月題目更新通知及法律小知識。
            </p>
            <a
              href="https://lin.ee/spAOCZ9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              加入 LINE 官方帳號
            </a>
          </div>
        </div>

        {/* 常見問題 */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">常見問題</h2>
          <div className="space-y-5">
            {[
              {
                q: "遊戲進度消失了怎麼辦？",
                a: "本平台的遊戲進度儲存在您的瀏覽器本地空間（localStorage）。若您清除了瀏覽器快取、使用無痕模式，或更換了裝置，進度將無法保留。建議定期截圖記錄您的學習成果。",
              },
              {
                q: "AI 批改功能如何使用？",
                a: "請至頂部導覽列的「AI 設定」頁面，依照教學申請 Google Gemini API 金鑰並填入即可。API 金鑰僅儲存在您的瀏覽器中，不會上傳至我們的伺服器。",
              },
              {
                q: "題目內容有誤，如何回報？",
                a: "請來信至 guaned0402@gmail.com，說明題目編號（如 general-003）及您認為有誤的部分，我們將盡快確認並修正。",
              },
              {
                q: "題目多久更新一次？",
                a: "我們每月定期更新題目內容，新增最新法律實務案例及修法動態，確保學習內容與時俱進。",
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-border pb-5 last:border-0 last:pb-0">
                <h3 className="font-medium text-foreground mb-2">Q：{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">A：{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-6 text-center text-sm text-muted-foreground">
        <p>民法鎮大冒險 · 台灣民法互動學習平台</p>
        <p className="text-xs mt-1 opacity-60">© 宸鑫頤意企業社所有 · 本平台題目僅供學習參考，不構成法律建議</p>
      </footer>
    </div>
  );
}
