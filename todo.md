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
