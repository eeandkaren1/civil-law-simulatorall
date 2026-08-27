# 民法鎮大冒險：網站架構與可索引性稽核

## 結論

本網站**已有實質且結構化的內容資產**。題庫並不是將 200 題寫死在同一個網頁：每題都有獨立 `Scenario` 資料紀錄、唯一 ID、對應法條、故事、四個選項、逐項解釋、申論題與提示；前端以 `/scenario/:scenarioId` 路由載入單一題目，例如 `/scenario/inheritance-040`。五個村落則以 `/village/:villageId` 形成 40 題的主題索引。文章亦已有 `/articles/:id` 的個別網址。

但現況仍是 **React SPA 殼層輸出**：伺服器對任何網址都回傳幾乎空白的 `index.html`，題目與文章須待瀏覽器執行 JavaScript 後才產生。雖然 Google 能夠渲染 JavaScript，伺服器端渲染或預先渲染仍能讓使用者與爬蟲更快取得正文；其他搜尋服務與社群預覽工具亦不一定執行 JavaScript。[1]

| 面向 | 現況 | 判斷 | 本輪調整方向 |
|---|---|---|---|
| 題目資料 | 200 個結構化 `Scenario` 記錄，按五村與批次模組維護 | 可長期擴充、可供網站與App共用 | 保留資料模型，補出內容索引層 |
| 題目網址 | `/scenario/:scenarioId` 已存在 | **每題已是單獨路由** | 以SSR讓網址初始HTML含完整題目文本與專屬中繼資料 |
| 村落與文章 | 村落與文章詳情皆有路由 | 有主題式內容集群雛形 | 讓清單、文章與題目以標準連結彼此串連 |
| HTML輸出 | 所有網址回傳SPA殼層；題目資訊沒有出現在原始HTML | 主要索引障礙 | 建立SSR雙入口與每路由標題、描述、canonical、OG資料 |
| 內部連結 | 多數公開入口以 `button` 搭配 JavaScript 導頁 | 對爬取與語意化不理想 | 改為包含描述文字的 `<a href>` 連結 [2] |
| 搜尋基礎設施 | 無網站地圖、robots 指引與資料化SEO驗證 | 無法主動列出 200 題內容URL | 由相同題庫資料動態產生 `/sitemap.xml` 並加入 `robots.txt` [3] |
| 法條文本 | 發現早期資料中的第12、13條仍有舊版表述 | 上線前應避免錯誤可索引內容 | 已以法務部資料庫重新核對，並排入修正 |

## 建議的長期內容架構

網站應保留「互動闖關」為體驗層，並以同一份題庫建立「內容出版」層。每一題的正規網址應是可索引的教學頁，包含生活情境、法律問題、四個選項、正確觀念、法條說明、申論練習、同村前後題與相關文章連結。遊戲作答進度仍留在瀏覽器本機，不能成為內容展示與索引的前提。

資料層方面，`Scenario`、`LawArticle`、`Article` 應維持為前端可讀、後端可提供的共用領域模型；未來推出App時，由同一來源提供 API 或內容版本資料，不應再複製一份題庫。內容編輯流程則應加入「草稿、法源連結、最後核對日、發布狀態、SEO摘要」等欄位，將目前嚴格的官方條文核對程序變成可稽核的營運工作流。

## 本輪技術實作範圍

本輪將把 SPA 改為可直接輸出正文的 SSR 架構，並新增題目索引頁、標準內部連結、路由級SEO標籤、JSON-LD、`robots.txt` 與資料驅動的 `sitemap.xml`。`/progress`、`/settings`、`/daily-challenge`、`/wrong-notebook` 和 `/question-explorer` 屬個人化或工具型頁面，將維持可使用但不納入主要索引。

正式上線前仍需要設定唯一的正式網域作為 `CANONICAL_ORIGIN`。Google 建議網站地圖使用完整絕對網址，並只列出希望被收錄的正規網址；因此不應使用目前的暫時預覽網址。[3]

## 參考資料

[1]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics "Google Search Central：JavaScript SEO 基礎"
[2]: https://developers.google.com/search/docs/crawling-indexing/links-crawlable "Google Search Central：可爬取連結最佳實務"
[3]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap "Google Search Central：建立與提交網站地圖"
