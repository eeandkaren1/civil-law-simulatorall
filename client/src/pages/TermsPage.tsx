import SiteFooter from "@/components/SiteFooter";
import { SITE_CONFIG } from "@shared/siteConfig";
import { ArrowLeft, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />返回首頁
          </button>
          <span className="text-muted-foreground/40">|</span>
          <span className="font-medium text-foreground">服務條款</span>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>
          <div><h1 className="text-2xl font-display font-bold text-foreground">服務條款</h1><p className="text-sm text-muted-foreground">最後更新：2026 年 9 月 22 日</p></div>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section><h2 className="text-lg font-semibold text-foreground mb-3">一、服務說明</h2><p>{SITE_CONFIG.product}（以下簡稱「本服務」）由 {SITE_CONFIG.brand} 營運，提供台灣民法知識的互動式學習平台。本服務包含情境式選擇題、申論題練習，以及使用者自備 Gemini API 金鑰的 AI 批改功能。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">二、使用者責任</h2><p className="mb-3">使用本服務，即表示您同意遵守以下規範：</p><ul className="list-disc list-inside space-y-2 ml-2"><li>不得以任何方式干擾或破壞本服務的正常運作</li><li>不得嘗試未經授權存取本服務的系統或資料</li><li>不得將本服務內容用於商業目的，除非事先取得書面授權</li><li>不得散布、複製或修改本服務的題目內容及插圖</li></ul></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">三、免責聲明</h2><p className="mb-3">本服務的法律知識內容僅供教育學習，不構成法律建議。法律規定可能隨時修訂；實際法律問題應諮詢具有執照的律師。</p><p>{SITE_CONFIG.brand} 不對因使用本服務內容而產生的任何直接或間接損失負責。使用者應自行判斷內容是否適用於其具體情況。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">四、AI 批改功能</h2><p className="mb-3">AI 申論批改需要使用者自行提供 Google Gemini API 金鑰。金鑰只保存在使用者自己的瀏覽器中，{SITE_CONFIG.brand} 不會收集、保存或提供 Gemini API 額度。</p><p>AI 批改結果僅供參考，不代表法律上的正確答案。使用者應以批判性思維評估 AI 的評分與建議，並在必要時諮詢專業法律意見。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">五、智慧財產權</h2><p>本服務的內容，包括題目文字、情境故事、插圖、介面設計及程式碼，均受著作權法保護，為 {SITE_CONFIG.brand} 所有。未經書面授權，不得複製、散布、修改或以任何方式使用本服務內容。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">六、服務變更與終止</h2><p>{SITE_CONFIG.brand} 保留修改、暫停或終止本服務，以及更新本服務條款的權利。更新後的條款將公布於本頁面，繼續使用本服務即表示您同意接受修改後的條款。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">七、準據法與管轄</h2><p>本服務條款依中華民國法律解釋及適用。因本服務條款或本服務所生之爭議，雙方同意以台灣台北地方法院為第一審管轄法院。</p></section>
          <section><h2 className="text-lg font-semibold text-foreground mb-3">八、聯絡方式</h2><p>如對本服務條款有任何疑問，請透過電子郵件聯絡：<a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-primary hover:underline ml-1">{SITE_CONFIG.contactEmail}</a></p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
