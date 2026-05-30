/**
 * ==========================================
 * Header / Footer Auto Loader
 * GitHub Pages対応 完全版
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", async () => {

   /**
    * ==========================
    * 設定
    * ==========================
    */

   const PARTS_PATH = "./assets/parts/";

   const selectors = {
      header: "#js-header",
      footer: "#js-footer",
   };

   /**
    * ==========================
    * HTML読み込み関数
    * ==========================
    */

   async function loadHTML(url, targetSelector) {

      const target = document.querySelector(targetSelector);

      if (!target) {
         console.warn(`要素が見つかりません: ${targetSelector}`);
         return;
      }

      try {

         const response = await fetch(url);

         if (!response.ok) {
            throw new Error(`
               読み込み失敗:
               ${url}
               Status: ${response.status}
            `);
         }

         const html = await response.text();

         target.innerHTML = html;

      } catch (error) {

         console.error(error);

         target.innerHTML = `
            <div style="
               padding:16px;
               color:red;
               border:1px solid red;
               font-size:14px;
            ">
               パーツ読み込みエラー:
               ${url}
            </div>
         `;
      }
   }

   /**
    * ==========================
    * Header / Footer 読み込み
    * ==========================
    */

   await Promise.all([
      loadHTML(`${PARTS_PATH}header.html`, selectors.header),
      loadHTML(`${PARTS_PATH}footer.html`, selectors.footer),
   ]);

   /**
    * ==========================
    * 現在年 自動更新
    * ==========================
    */

   const year = document.querySelector("#js-year");

   if (year) {
      year.textContent = new Date().getFullYear();
   }

   /**
    * ==========================
    * 現在ページ active付与
    * ==========================
    */

   const currentPath = location.pathname.split("/").pop();

   const links = document.querySelectorAll("a");

   links.forEach(link => {

      const href = link.getAttribute("href");

      if (!href) return;

      if (
         href.includes(currentPath) ||
         (currentPath === "" && href.includes("index.html"))
      ) {
         link.classList.add("is-current");
      }
   });

   /**
    * ==========================
    * スムースフェード表示
    * ==========================
    */

   document.body.classList.add("is-loaded");

});



      const year = document.getElementById("js-year");
      if (year) year.textContent = new Date().getFullYear();

      const cursor = document.getElementById("cursor");
      const stalker = document.getElementById("stalker");
      if (cursor && stalker) {
         document.addEventListener("mousemove", (event) => {
            cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
            stalker.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
         });

         document.querySelectorAll("a, button, .card__btn").forEach((target) => {
            target.addEventListener("mouseenter", () => stalker.classList.add("is-active"));
            target.addEventListener("mouseleave", () => stalker.classList.remove("is-active"));
         });
      }