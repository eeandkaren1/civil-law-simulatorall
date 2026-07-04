import { useParams, useLocation } from "wouter";
import { ARTICLES } from "../../../shared/articles";
import SiteFooter from "@/components/SiteFooter";
import { ArrowLeft, Clock, Tag, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, type ReactElement } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  "民法入門": "bg-violet-100 text-violet-700",
  "契約法": "bg-amber-100 text-amber-700",
  "物權法": "bg-emerald-100 text-emerald-700",
  "繼承法": "bg-rose-100 text-rose-700",
  "使用指南": "bg-sky-100 text-sky-700",
};

// 簡易 Markdown 渲染（支援標題、粗體、表格、水平線、段落）
function renderMarkdown(content: string): ReactElement[] {
  const lines = content.split("\n");
  const elements: ReactElement[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2 標題
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-foreground mt-8 mb-3 pb-2 border-b border-border">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3 標題
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-foreground mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // 水平線
    if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="my-6 border-border" />);
      i++;
      continue;
    }

    // 表格
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split("|").filter(Boolean).map(s => s.trim());
      const rows = tableLines.slice(2).map(row =>
        row.split("|").filter(Boolean).map(s => s.trim())
      );
      elements.push(
        <div key={key++} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {headers.map((h, idx) => (
                  <th key={idx} className="border border-border px-3 py-2 text-left font-semibold text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ridx) => (
                <tr key={ridx} className={ridx % 2 === 0 ? "" : "bg-muted/30"}>
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="border border-border px-3 py-2 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 一般段落（含粗體）
    const renderInline = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return <span key={idx}>{part}</span>;
      });
    };

    elements.push(
      <p key={key++} className="text-muted-foreground leading-relaxed mb-4">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const article = ARTICLES.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">找不到此文章</p>
          <button onClick={() => navigate("/articles")} className="text-primary hover:underline">
            返回文章列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 頂部導覽 */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate("/articles")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回文章列表
          </button>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-sm text-muted-foreground truncate">{article.title}</span>
        </div>
      </header>

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10">
        {/* 文章頭部 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-700"}`}>
              {article.category}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              約 {article.readTime} 分鐘閱讀
            </span>
            <span className="text-xs text-muted-foreground">{article.date}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3 leading-tight">
            {article.title}
          </h1>

          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            {article.subtitle}
          </p>

          <div className="flex flex-wrap gap-1.5 items-center">
            <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
            {article.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <hr className="border-border mb-8" />

        {/* 文章內容 */}
        <div className="prose-content">
          {renderMarkdown(article.content)}
        </div>

        {/* 文章底部 CTA */}
        <div className="mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-1">學以致用：前往情境練習</p>
              <p className="text-sm text-muted-foreground mb-3">
                閱讀文章後，透過民法鎮大冒險的情境題目練習，將知識轉化為真正的法律判斷能力。
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-sm font-medium text-primary hover:underline"
              >
                開始情境練習 →
              </button>
            </div>
          </div>
        </div>

        {/* 其他文章推薦 */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-foreground mb-4">其他推薦文章</h3>
          <div className="space-y-3">
            {ARTICLES.filter(a => a.id !== article.id).slice(0, 3).map(a => (
              <button
                key={a.id}
                onClick={() => navigate(`/articles/${a.id}`)}
                className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[a.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {a.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {a.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
