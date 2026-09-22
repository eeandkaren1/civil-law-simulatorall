import { AtSign, Copy, Facebook, Heart, Instagram, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { APP_BASE_PATH, SITE_CONFIG } from "@shared/siteConfig";

type ContentShareActionsProps = {
  title: string;
  canonicalPath: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.focus();
  input.select();
  document.execCommand("copy");
  input.remove();
}

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=520");
}

/** 在SSR首屏保留互動區，掛載後才取得正式瀏覽器網址，避免水合差異。 */
export default function ContentShareActions({
  title,
  canonicalPath,
  isFavorite,
  onToggleFavorite,
}: ContentShareActionsProps) {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(`${window.location.origin}${APP_BASE_PATH}${canonicalPath}`);
  }, [canonicalPath]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`${title}｜${SITE_CONFIG.product}｜${SITE_CONFIG.brand}`);

  const handleFavorite = () => {
    onToggleFavorite();
    toast.success(isFavorite ? "已取消收藏此題" : "已收藏此題，可在本機瀏覽器保留複習清單");
  };

  const handleCopy = async (message: string) => {
    if (!shareUrl) return;
    try {
      await copyToClipboard(shareUrl);
      toast.success(message);
    } catch {
      toast.error("目前無法複製連結，請稍後再試");
    }
  };

  const shareDisabled = !shareUrl;

  return (
    <section className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-sm" aria-label="收藏與社群分享">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display font-semibold text-foreground">收藏或分享這道題</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">收藏只儲存在此瀏覽器；分享連結會直接開啟本題的獨立學習頁。</p>
        </div>
        <Button
          type="button"
          variant={isFavorite ? "default" : "outline"}
          onClick={handleFavorite}
          aria-pressed={isFavorite}
          className={isFavorite ? "gap-2 bg-rose-600 text-white hover:bg-rose-700" : "gap-2"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "已收藏" : "收藏此題"}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
        <Button type="button" size="sm" onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)} disabled={shareDisabled} className="gap-1.5 bg-[#1877F2] text-white hover:bg-[#166FE5]">
          <Facebook className="h-4 w-4" /> Facebook
        </Button>
        <Button type="button" size="sm" onClick={() => openShareWindow(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`)} disabled={shareDisabled} className="gap-1.5 bg-[#06C755] text-white hover:bg-[#05B34C]">
          <MessageCircle className="h-4 w-4" /> LINE
        </Button>
        <Button type="button" size="sm" onClick={() => openShareWindow(`https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`)} disabled={shareDisabled} className="gap-1.5 bg-foreground text-background hover:bg-foreground/85">
          <AtSign className="h-4 w-4" /> Threads
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => handleCopy("連結已複製，請開啟 Instagram 貼上分享")} disabled={shareDisabled} className="gap-1.5">
          <Instagram className="h-4 w-4" /> Instagram
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => handleCopy("題目連結已複製到剪貼簿")} disabled={shareDisabled} className="gap-1.5">
          <Copy className="h-4 w-4" /> 複製連結
        </Button>
        <span className="sr-only"><Share2 />分享此題</span>
      </div>
    </section>
  );
}
