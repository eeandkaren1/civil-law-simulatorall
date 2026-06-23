/**
 * LINE 浮動聯繫按鈕
 * 固定於頁面右下角，點擊後開啟 LINE 官方帳號
 */
const LINE_URL = "https://lin.ee/spAOCZ9";

export default function LineFloatButton() {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="聯繫 LINE 官方帳號"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      style={{ backgroundColor: "#06C755" }}
    >
      {/* LINE 官方 SVG 圖示 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="28"
        height="28"
        fill="white"
        aria-hidden="true"
      >
        <path d="M20 3C10.6 3 3 9.5 3 17.5c0 5.5 3.5 10.4 8.8 13.2-.4 1.4-1.3 4.9-1.5 5.7-.2.9.3 1 .7.7.3-.2 4.9-3.3 6.9-4.6.7.1 1.4.1 2.1.1 9.4 0 17-6.5 17-14.5C37 9.5 29.4 3 20 3zm-7.5 18.5h-3c-.4 0-.8-.3-.8-.8v-8.4c0-.4.3-.8.8-.8h.8c.4 0 .8.3.8.8v7.6h2.4c.4 0 .8.3.8.8v.8c0 .5-.4.8-.8 0zm3.5 0h-.8c-.4 0-.8-.3-.8-.8v-9.2c0-.4.3-.8.8-.8h.8c.4 0 .8.3.8.8v9.2c0 .5-.4.8-.8.8zm9.2 0h-.8c-.3 0-.6-.2-.7-.4l-3.5-5.8v5.4c0 .4-.3.8-.8.8h-.8c-.4 0-.8-.3-.8-.8v-9.2c0-.4.3-.8.8-.8h.8c.3 0 .6.2.7.4l3.5 5.8v-5.4c0-.4.3-.8.8-.8h.8c.4 0 .8.3.8.8v9.2c0 .5-.4.8-.8.8zm4.8-7.6h-2.4v1.8h2.4c.4 0 .8.3.8.8v.8c0 .4-.3.8-.8.8h-2.4v1.8h2.4c.4 0 .8.3.8.8v.8c0 .4-.3.8-.8.8h-3.2c-.4 0-.8-.3-.8-.8v-9.2c0-.4.3-.8.8-.8h3.2c.4 0 .8.3.8.8v.8c0 .5-.4.8-.8.8z" />
      </svg>
    </a>
  );
}
