import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getArticleById, SCENARIOS } from "../../../shared/gameData";
import { useLocation, useParams } from "wouter";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, XCircle, Lightbulb, Sparkles, SkipForward, Key, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

type GamePhase = "story" | "question" | "result" | "essay";

const VILLAGE_COLORS: Record<string, string> = {
  general: "text-violet-700 bg-violet-50 border-violet-200",
  obligation: "text-amber-700 bg-amber-50 border-amber-200",
  property: "text-emerald-700 bg-emerald-50 border-emerald-200",
  family: "text-rose-700 bg-rose-50 border-rose-200",
  inheritance: "text-orange-700 bg-orange-50 border-orange-200",
};

export default function ScenarioPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [, navigate] = useLocation();
  const { gameState, recordAnswer, isScenarioCompleted } = useGame();
  const { isAuthenticated } = useAuth();

  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const [phase, setPhase] = useState<GamePhase>("story");
  const [visibleLines, setVisibleLines] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [essayText, setEssayText] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isGradingEssay, setIsGradingEssay] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(gameState.geminiApiKey || "");
  const storyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setGeminiApiKey } = useGame();

  useEffect(() => {
    if (!scenario) return;
    setPhase("story");
    setVisibleLines(0);
    setSelectedChoice(null);
    setIsCorrect(null);
    setEssayText("");
    setAiFeedback("");
  }, [scenarioId]);

  // 故事逐行顯示
  useEffect(() => {
    if (phase !== "story" || !scenario) return;
    if (visibleLines >= scenario.story.length) return;

    storyTimerRef.current = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 800);

    return () => {
      if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    };
  }, [phase, visibleLines, scenario]);

  if (!scenario) {
    return (
      <div className="min-h-screen game-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到此關卡</p>
          <Button onClick={() => navigate("/")}>返回首頁</Button>
        </div>
      </div>
    );
  }

  const colors = VILLAGE_COLORS[scenario.villageId] ?? VILLAGE_COLORS.general;
  const relatedArticles = scenario.relatedArticles.map((id) => getArticleById(id)).filter(Boolean);

  const handleChoiceSelect = (choiceId: number) => {
    if (selectedChoice !== null) return;
    const choice = scenario.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    setIsCorrect(choice.isCorrect);
    setPhase("result");

    recordAnswer(
      scenario.villageId,
      scenario.id,
      choice.isCorrect,
      scenario.relatedArticles
    );

    if (choice.isCorrect) {
      toast.success("答對了！🎉", { duration: 2000 });
    } else {
      toast.error("答錯了，看看解析吧", { duration: 2000 });
    }
  };

  const handleGradeEssay = async () => {
    const apiKey = gameState.geminiApiKey || apiKeyInput;
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast.error("請先設定 Gemini API Key");
      return;
    }

    if (!essayText.trim()) {
      toast.error("請先輸入申論答案");
      return;
    }

    setIsGradingEssay(true);
    try {
      const prompt = `你是一位台灣民法的法學教授，請批改以下申論題答案。

【題目】
${scenario.essayPrompt}

【提示】
${scenario.essayHint}

【學生答案】
${essayText}

請從以下幾個面向給予批改：
1. **法條引用**：是否正確引用相關法條
2. **論述結構**：論述是否清晰有條理
3. **法律概念**：對法律概念的理解是否正確
4. **實務應用**：是否能將法條應用到實際情境
5. **改進建議**：具體的改進方向

請以繁體中文回覆，格式清晰，並給予整體評分（優/良/可/待加強）。`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "API 呼叫失敗");
      }

      const data = await response.json();
      const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (feedback) {
        setAiFeedback(feedback);
        toast.success("批改完成！");
      } else {
        throw new Error("無法取得批改結果");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "批改失敗，請確認 API Key 是否正確";
      toast.error(message);
    } finally {
      setIsGradingEssay(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      toast.error("請輸入有效的 API Key");
      return;
    }
    setGeminiApiKey(apiKeyInput.trim());
    setShowApiKeyInput(false);
    toast.success("API Key 已儲存");
  };

  const handleSkipToNext = () => {
    const currentIndex = SCENARIOS.findIndex((s) => s.id === scenario.id);
    const nextInVillage = SCENARIOS.slice(currentIndex + 1).find(
      (s) => s.villageId === scenario.villageId
    );
    if (nextInVillage) {
      navigate(`/scenario/${nextInVillage.id}`);
    } else {
      navigate(`/village/${scenario.villageId}`);
    }
  };

  return (
    <div className="min-h-screen game-bg">
      {/* 頂部 */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/village/${scenario.villageId}`)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge variant="outline" className={`text-xs shrink-0 ${colors}`}>
              {scenario.chapter}
            </Badge>
            <span className="font-medium text-foreground truncate text-sm">
              {scenario.title}
            </span>
          </div>
          {isScenarioCompleted(scenario.id) && (
            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 shrink-0">
              已完成
            </Badge>
          )}
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* ===== 故事情境 ===== */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📖</span>
            <h2 className="font-display font-semibold text-foreground">情境故事</h2>
          </div>
          <div className="space-y-3">
            {scenario.story.map((line, index) => (
              <p
                key={index}
                className={`text-foreground leading-relaxed story-line transition-opacity duration-500 ${
                  index < visibleLines ? "opacity-100" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {line}
              </p>
            ))}
          </div>
          {visibleLines < scenario.story.length && (
            <button
              onClick={() => setVisibleLines(scenario.story.length)}
              className="mt-4 text-sm text-primary hover:underline"
            >
              顯示全部故事 →
            </button>
          )}
          {visibleLines >= scenario.story.length && phase === "story" && (
            <div className="mt-5 pt-4 border-t border-border">
              <Button
                onClick={() => setPhase("question")}
                className="w-full bg-primary hover:bg-primary/90 gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                開始作答
              </Button>
            </div>
          )}
        </section>

        {/* ===== 選擇題 ===== */}
        {(phase === "question" || phase === "result") && (
          <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">❓</span>
              <h2 className="font-display font-semibold text-foreground">法律問題</h2>
            </div>
            <p className="text-foreground font-medium mb-5 leading-relaxed">
              {scenario.question}
            </p>
            <div className="space-y-3">
              {scenario.choices.map((choice, index) => {
                const isSelected = selectedChoice === choice.id;
                const showResult = phase === "result";
                let choiceStyle = "bg-secondary border-border hover:bg-accent hover:border-accent-foreground/20";

                if (showResult) {
                  if (choice.isCorrect) {
                    choiceStyle = "bg-emerald-50 border-emerald-300 correct-answer";
                  } else if (isSelected && !choice.isCorrect) {
                    choiceStyle = "bg-red-50 border-red-300 wrong-answer";
                  } else {
                    choiceStyle = "bg-secondary border-border opacity-60";
                  }
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.id)}
                    disabled={phase === "result"}
                    className={`choice-item w-full text-left rounded-xl border p-4 transition-all duration-200 ${choiceStyle} ${
                      phase === "question" ? "cursor-pointer" : "cursor-default"
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="flex-1">
                        <p className="text-foreground text-sm leading-relaxed">{choice.text}</p>
                        {showResult && (
                          <div className="mt-2 flex items-start gap-1.5">
                            {choice.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            ) : null}
                            {(choice.isCorrect || isSelected) && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {choice.explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== 答題結果與法條 ===== */}
        {phase === "result" && (
          <>
            {/* 結果摘要 */}
            <section
              className={`rounded-2xl border p-5 shadow-sm ${
                isCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-display font-semibold ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                  {isCorrect ? "答對了！太棒了！" : "答錯了，繼續加油！"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isCorrect
                  ? "你對這個法律概念有正確的理解。繼續閱讀相關法條，加深印象！"
                  : "不要氣餒！閱讀下方的法條解析，了解正確的法律概念。"}
              </p>
            </section>

            {/* 相關法條 */}
            {relatedArticles.length > 0 && (
              <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-semibold text-foreground">相關法條</h2>
                  <Badge variant="secondary" className="text-xs ml-auto">已解鎖</Badge>
                </div>
                <div className="space-y-4">
                  {relatedArticles.map((article) => article && (
                    <div key={article.id} className="article-card rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <Badge variant="outline" className={`text-xs ${colors}`}>
                            第 {article.number} 條
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-sm mb-1">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {article.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 申論題 */}
            <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="font-display font-semibold text-foreground">申論練習</h2>
                <Badge variant="outline" className="text-xs ml-auto text-muted-foreground">可跳過</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                深化理解，練習法律論述能力
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-amber-800 mb-1">📝 申論題目</p>
                <p className="text-sm text-amber-900">{scenario.essayPrompt}</p>
              </div>

              <div className="bg-secondary rounded-xl p-3 mb-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">💡 作答提示</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{scenario.essayHint}</p>
              </div>

              <Textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="在此輸入你的申論答案..."
                className="min-h-[120px] bg-input border-border resize-none mb-3"
              />

              {/* AI 批改區域 */}
              {!isAuthenticated ? (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    登入帳號後可使用 AI 申論批改功能
                  </p>
                  <Button
                    size="sm"
                    onClick={() => window.location.href = getLoginUrl()}
                    className="gap-1.5"
                  >
                    登入使用 AI 批改
                  </Button>
                </div>
              ) : (
                <>
                  {showApiKeyInput || !gameState.geminiApiKey ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-800">設定 Gemini API Key</p>
                      </div>
                      <p className="text-xs text-blue-700 mb-3 leading-relaxed">
                        AI 批改功能使用您自己的 Google Gemini API 額度，不會向您收取額外費用。
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 underline inline-flex items-center gap-0.5"
                        >
                          點此取得免費 API Key
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder="貼上你的 Gemini API Key..."
                          className="flex-1 text-sm bg-white border-blue-200"
                        />
                        <Button size="sm" onClick={handleSaveApiKey} className="shrink-0">
                          儲存
                        </Button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        📌 如何取得：前往 Google AI Studio → 建立 API 金鑰 → 複製貼上
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        已設定 Gemini API Key
                      </div>
                      <button
                        onClick={() => setShowApiKeyInput(true)}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        更換
                      </button>
                    </div>
                  )}

                  <Button
                    onClick={handleGradeEssay}
                    disabled={isGradingEssay || !essayText.trim()}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 mb-3"
                  >
                    {isGradingEssay ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AI 批改中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI 智慧批改
                      </>
                    )}
                  </Button>
                </>
              )}

              {/* AI 批改結果 */}
              {aiFeedback && (
                <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-xl p-5 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-medium text-violet-800">AI 批改結果</span>
                  </div>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {aiFeedback}
                  </div>
                </div>
              )}
            </section>

            {/* 下一步按鈕 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/village/${scenario.villageId}`)}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                返回村落
              </Button>
              <Button
                onClick={handleSkipToNext}
                className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              >
                下一關
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        {/* 故事階段的跳過按鈕 */}
        {phase === "story" && visibleLines < scenario.story.length && (
          <div className="text-center">
            <button
              onClick={() => {
                setVisibleLines(scenario.story.length);
              }}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 mx-auto"
            >
              <SkipForward className="w-4 h-4" />
              跳過故事，直接作答
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
