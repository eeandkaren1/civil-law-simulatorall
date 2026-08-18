# 民法鎮大冒險 - 專案 TODO

## Phase 2: 資料庫 Schema + 題目資料庫
- [x] 建立 drizzle schema（users, game_progress, question_attempts, unlocked_articles, achievements）
- [x] 執行資料庫遷移 SQL
- [x] 建立完整題目資料庫（五大編，每編 7 個情境關卡，共 35 題）
- [x] 建立法條資料庫（每題附相關法條，LAW_ARTICLES）
- [x] 建立 server/db.ts 查詢輔助函式
- [x] 建立 tRPC routers（player, progress, articles, achievements, attempts）

## Phase 3: 全域樣式 + 首頁 + 村落地圖
- [x] 設計全域 CSS 樣式（優雅精緻風格，Noto Serif TC + Noto Sans TC）
- [x] 建立首頁（遊戲介紹、角色命名、進度摘要）
- [x] 建立五大村落地圖選擇介面（總則村、債編村、物權村、親屬村、繼承村）
- [x] 建立頂部導覽列（含登入狀態）

## Phase 4: 遊戲關卡頁面
- [x] 建立關卡列表頁面（/village/:villageId）
- [x] 建立遊戲關卡頁面（/scenario/:scenarioId）
- [x] 故事情境逐行顯示動畫
- [x] 四選一選擇題互動邏輯
- [x] 答案解析 + 相關法條展示
- [x] 申論題練習（可跳過）
- [x] 關卡完成後進入下一關邏輯

## Phase 5: 法條知識庫 + 學習進度
- [x] 建立法條知識庫頁面（/knowledge）
- [x] 村落篩選功能
- [x] 關鍵字搜尋功能
- [x] 建立學習進度頁面（/progress）
- [x] 答題正確率統計
- [x] 連勝紀錄顯示
- [x] 各村落完成進度
- [x] 成就系統（初次嘗試、三連勝、法學博士等 10 個成就）

## Phase 6: 登入 + 同步 + AI 批改
- [x] Manus OAuth 登入整合（useAuth hook）
- [x] localStorage 進度暫存（未登入）
- [x] 登入後自動合併同步進度至資料庫
- [x] AI 申論批改功能（使用者提供 Gemini API Key，前端直接呼叫）
- [x] Gemini API Key 設定介面（含操作指引）
- [x] 操作指引說明（如何取得 API Key，連結至 Google AI Studio）

## Phase 7: 測試與優化
- [x] 完整遊戲流程測試（截圖確認）
- [x] 響應式設計（行動裝置）
- [x] 撰寫 Vitest 測試（20 個測試全部通過）
- [x] 儲存 Checkpoint

## 第二輪功能擴充
- [x] 生成五大村落故事情境插圖（每村14題，共70張）
- [x] 擴充五大村題目至各14題（新增35題，共70題）
- [x] 題目資料加入圖片 URL 欄位（imageUrl）
- [x] 建立 AI API Key 設定頁面（/settings）與申請教學
- [x] 遊戲關卡頁面顯示故事圖片（16:9 插圖，含 loading 狀態）
- [x] 加入 LINE 官方帳號浮動按鈕（https://lin.ee/spAOCZ9）
- [x] 修正 general-009 雙重正確答案 bug（Vitest 全部通過）
- [x] 情境圖片載入失敗加入 fallback UI（佔位圖示 + 章節標題）

## 第三輪：廣告整合 + 移除登入 + 純 localStorage
- [x] 加入 Google AdSense 腳本（ca-pub-9753491901026477）到 index.html head
- [x] 建立 client/public/ads.txt（Google AdSense 審核用）
- [x] 加入 Google Analytics G-MFXSFT8HY7 到 index.html head
- [x] 移除首頁、導覽列的登入按鈕
- [x] 移除 ScenarioPage 申論題的「登入才能使用 AI 批改」限制
- [x] 所有人直接可使用 Gemini API Key 設定（不需登入）
- [x] 首頁顯示「進度自動儲存在您的瀏覽器中」說明
- [x] 各頁面預留廣告空間（頂部 Leaderboard + 底部 banner，不遮擋內容）

## 第四輪：修正 key 錯誤 + 圖片外部圖床遷移
- [x] 修正 VillagePage 重複 key 錯誤（改用 Set 去除重複 chapter）
- [x] 將 70 張插圖壓縮（463MB -> 14MB，1280x720）並上傳至 Imgur/catbox.moe
- [x] 更新 gameData.ts 所有 70 個 imageUrl 為外部 HTTPS 網址（70 個全部成功）

## 第五輪：AdSense 合規 + 插圖 + 每月更新提示
- [x] 新增隱私權政策頁面（/privacy）
- [x] 新增關於我們頁面（/about）
- [x] 新增聯絡我們頁面（/contact），信笱導向 guaned0402@gmail.com
- [x] Footer 加入著作權文字「© 宸鑫頤意企業社所有」
- [x] 所有圖片均為 AI 生成（自有版權），所有文字為原創，無第三方版權疑慮
- [x] 修正 SPA Analytics 追蹤（App.tsx 加入 AnalyticsTracker，路由切換時自動觸發 gtag pageview）
- [x] 生成首頁主視覺插圖（台灣傳統小鎮俦瞰圖）
- [x] 生成五個村落各自的台灣插畫風格圖片（法院/市場/住宅/家庭/遺產）
- [x] 圖片整合到首頁英雄區塊與村落卡片（每張卡片頂部 h-36 圖片區）
- [x] 加入每月更新題目的低調提示（footer 上方脈動小圓點 + 文字提示）

## 第六輪：AdSense 審查合規優化
- [x] 建立法律知識文章專區頁面（/articles）與文章詳情頁（/articles/:id）
- [x] 撰寫 5 篇原創長文（每篇 1,900～2,500 字，遠超 800 字門檻）
- [x] 新增服務條款頁面（/terms）
- [x] 更新導覽列加入「法律文章」入口；SiteFooter 加入服務條款與法律文章連結
- [x] 首頁加入最新文章列表區塊（4 篇預覽）與功能介紹區塊
- [x] 移除全部 5 個頁面的空廣告佔位符（VillagePage/ScenarioPage/KnowledgePage/ProgressPage/SettingsPage）

## 第七輪：每村增加 2 題 + Open Graph 動態 meta
- [x] 每個村落各新增 2 道題目（共 10 題，總計 80 題）
- [x] 為 10 道新題目生成台灣風格情境插圖
- [x] 上傳插圖至外部圖床並更新 imageUrl
- [x] 加入文章 Open Graph 動態 meta 標籤（每篇文章分享時顯示專屬標題與摘要）

## 第八輪：新增 10 篇台灣生活法律原創文章
- [x] 新增 10 篇台灣生活法律相關原創文章（總計 20 篇）
- [x] 驗證文章 ID、分類、內容與列表／詳情頁相容
- [x] 執行 TypeScript 與測試檢查
- [x] 儲存 Checkpoint

本輪文章資料目前由 shared/articles.ts 靜態匯入，並非寫入資料庫表格；法律內容僅供一般教育參考，法規應以全國法規資料庫最新版本為準。
