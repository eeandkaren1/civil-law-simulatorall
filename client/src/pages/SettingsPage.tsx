import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SiteFooter from "@/components/SiteFooter";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  ArrowLeft,
  Key,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Info,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { gameState, setGeminiApiKey } = useGame();
  const [apiKeyInput, setApiKeyInput] = useState(gameState.geminiApiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const hasApiKey = !!gameState.geminiApiKey;

  const handleSave = () => {
    if (!apiKeyInput.trim()) {
      toast.error("請輸入有效的 API Key");
      return;
    }
    if (!apiKeyInput.trim().startsWith("AI")) {
      toast.error("API Key 格式不正確，應以 'AI' 開頭");
      return;
    }
    setGeminiApiKey(apiKeyInput.trim());
    toast.success("Gemini API Key 已儲存！現在可以使用 AI 申論批改功能了");
  };

  const handleClear = () => {
    setGeminiApiKey("");
    setApiKeyInput("");
    toast.success("API Key 已清除");
  };

  const steps = [
    {
      number: 1,
      title: "前往 Google AI Studio",
      description: "開啟瀏覽器，前往 Google AI Studio 官方網站",
      detail: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Google AI Studio 是 Google 提供的免費 AI 開發平台，您可以在此取得 Gemini API Key。
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            前往 Google AI Studio
          </a>
          <p className="text-xs text-muted-foreground">
            ⚠️ 需要 Google 帳號才能登入，請確保您已登入 Google 帳號。
          </p>
        </div>
      ),
    },
    {
      number: 2,
      title: "登入 Google 帳號",
      description: "使用您的 Google 帳號登入 AI Studio",
      detail: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>若尚未登入，點擊右上角的「Sign in」按鈕，使用您的 Google 帳號登入。</p>
          <p>如果您沒有 Google 帳號，可以免費申請一個。</p>
        </div>
      ),
    },
    {
      number: 3,
      title: "建立 API 金鑰",
      description: "在 API Keys 頁面建立新的 API 金鑰",
      detail: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>進入 AI Studio 後，您應該會看到「API Keys」頁面（或點擊左側選單的「Get API key」）。</p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>點擊「Create API key」按鈕</li>
            <li>選擇一個 Google Cloud 專案（或建立新專案）</li>
            <li>點擊「Create API key in existing project」</li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <p className="text-amber-800 text-xs">
              💡 Gemini API 提供免費方案，每分鐘最多 15 次請求，每天最多 1,500 次請求，對於學習使用完全足夠！
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      title: "複製 API 金鑰",
      description: "複製生成的 API 金鑰",
      detail: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>API 金鑰生成後，會顯示在頁面上。</p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>點擊金鑰旁的複製按鈕（或直接選取後複製）</li>
            <li>金鑰格式通常以「AIza」開頭，長度約 39 個字元</li>
          </ol>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-red-800 text-xs">
              🔒 請妥善保管您的 API Key，不要分享給他人。本平台僅將 API Key 儲存在您的瀏覽器本地，不會上傳至伺服器。
            </p>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: "貼上並儲存",
      description: "將 API 金鑰貼上到下方輸入框並儲存",
      detail: (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>回到本頁面，將複製的 API Key 貼上到下方的輸入框中，然後點擊「儲存 API Key」按鈕。</p>
          <p>儲存成功後，您就可以在每道題目的申論練習區使用 AI 批改功能了！</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen game-bg">
      {/* 頂部導覽 */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首頁
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground text-sm">AI 批改設定</span>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* 說明卡片 */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-display font-bold text-blue-900 text-lg mb-2">
                什麼是 Gemini API Key？
              </h1>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                本平台的 AI 申論批改功能，使用 Google Gemini AI 來分析您的答案並提供詳細回饋。
                為了保護您的隱私並避免額外費用，<strong>AI 批改直接在您的瀏覽器中執行</strong>，
                使用您自己的 Google Gemini API 額度。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-white text-blue-700 border-blue-300">
                  ✅ 完全免費（有免費額度）
                </Badge>
                <Badge variant="outline" className="text-xs bg-white text-blue-700 border-blue-300">
                  🔒 資料不上傳伺服器
                </Badge>
                <Badge variant="outline" className="text-xs bg-white text-blue-700 border-blue-300">
                  🚀 即時 AI 批改
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* 目前狀態 */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            目前設定狀態
          </h2>

          {hasApiKey ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">已設定 Gemini API Key</span>
              </div>
              <p className="text-sm text-emerald-700">
                您已可以使用 AI 申論批改功能。前往任一題目的申論練習區，即可使用 AI 批改。
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">尚未設定 API Key</span>
              </div>
              <p className="text-sm text-amber-700">
                請依照下方教學取得並設定 Gemini API Key，即可啟用 AI 申論批改功能。
              </p>
            </div>
          )}

          {/* API Key 輸入 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Gemini API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="貼上你的 Gemini API Key（以 AIza 開頭）"
                  className="pr-10 bg-input border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button onClick={handleSave} className="shrink-0 gap-1.5">
                <Key className="w-4 h-4" />
                儲存
              </Button>
            </div>
            {hasApiKey && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清除已儲存的 API Key
              </button>
            )}
            <p className="text-xs text-muted-foreground">
              🔒 API Key 僅儲存在您的瀏覽器本地（localStorage），不會傳送至任何伺服器。
            </p>
          </div>
        </section>

        {/* 取得教學 */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="text-xl">📚</span>
            如何取得 Gemini API Key？
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            依照以下步驟，約 3 分鐘即可完成設定：
          </p>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveStep(activeStep === step.number ? null : step.number)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      activeStep === step.number ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeStep === step.number && (
                  <div className="px-4 pb-4 pt-1 border-t border-border bg-secondary/30">
                    {step.detail}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-secondary rounded-xl">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>常見問題：</strong>如果遇到「API key not valid」錯誤，請確認您複製的金鑰完整無誤。
              如果遇到「Quota exceeded」錯誤，表示今日免費額度已用完，明天再試即可。
              如有其他問題，歡迎透過右下角的 LINE 按鈕聯繫我們。
            </p>
          </div>
        </section>

        {/* 快速連結 */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">快速連結</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-sm">🔑</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Google AI Studio</p>
                <p className="text-xs text-muted-foreground">取得 API Key</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </a>
            <a
              href="https://ai.google.dev/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Gemini API 定價</p>
                <p className="text-xs text-muted-foreground">了解免費額度</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </a>
          </div>
        </section>

        {/* 廣告區 */}
        <div className="flex justify-center items-center py-6 mt-4">
          <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", maxWidth: "728px", height: "90px" }}
            data-ad-client="ca-pub-9753491901026477"
            data-ad-slot="auto"
            data-ad-format="horizontal"
            data-full-width-responsive="true"></ins>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
