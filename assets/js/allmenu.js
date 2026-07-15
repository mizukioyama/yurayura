/**
 * ==========================================
 * Header / Footer Auto Loader
 * GitHub Pages対応
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
        throw new Error(
          `読み込み失敗: ${url} Status: ${response.status}`
        );
      }

      const html = await response.text();

      target.innerHTML = html;

    } catch (error) {
      console.error(error);

      target.innerHTML = `
        <div style="
          padding: 16px;
          color: red;
          border: 1px solid red;
          font-size: 14px;
        ">
          パーツ読み込みエラー: ${url}
        </div>
      `;
    }
  }

  /**
   * ==========================
   * Header / Footer読み込み
   * ==========================
   */

  await Promise.all([
    loadHTML(`${PARTS_PATH}header.html`, selectors.header),
    loadHTML(`${PARTS_PATH}footer.html`, selectors.footer),
  ]);

  /**
   * ==========================
   * スクロールメニュー初期化
   * Header読み込み後に実行
   * ==========================
   */

  initializeHeaderMenu();

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

  const currentPath =
    location.pathname.split("/").pop() || "index.html";

  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    /*
     * ページ内リンクには
     * is-currentを付けない
     */
    if (href.startsWith("#")) return;

    const hrefPath = href.split("#")[0];

    if (hrefPath === currentPath) {
      link.classList.add("is-current");
    }
  });

  /**
   * ==========================
   * カスタムカーソル
   * ==========================
   */

  initializeCustomCursor();

  /**
   * ==========================
   * スムースフェード表示
   * ==========================
   */

  document.body.classList.add("is-loaded");
});

/**
 * ==========================================
 * スクロールメニュー
 * ==========================================
 */

function initializeHeaderMenu() {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuLinks = document.querySelectorAll(".header-link");

  if (!header || !menuToggle) {
    console.warn("メニュー要素が見つかりません");
    return;
  }

  const mobileMedia = window.matchMedia(
    "(min-width: 320px) and (max-width: 699px)"
  );

  /**
   * メニューを閉じる
   */

  function closeMenu() {
    header.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "メニューを開く");

    document.body.classList.remove("is-menu-open");
  }

  /**
   * スクロール位置を確認
   */

  function updateHeaderState() {
    if (!mobileMedia.matches) {
      header.classList.remove("is-compact");
      closeMenu();
      return;
    }

    const hasScrolledOneView =
      window.scrollY >= window.innerHeight;

    header.classList.toggle(
      "is-compact",
      hasScrolledOneView
    );

    /*
     * 100vh未満へ戻った場合は閉じる
     */

    if (!hasScrolledOneView) {
      closeMenu();
    }
  }

  /**
   * ボタンクリック
   */

  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く"
    );

    document.body.classList.toggle(
      "is-menu-open",
      isOpen
    );
  });

  /**
   * メニューリンククリック後に閉じる
   */

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /**
   * Escキーで閉じる
   */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /**
   * スクロール・画面幅変更
   */

  window.addEventListener("scroll", updateHeaderState, {
    passive: true,
  });

  mobileMedia.addEventListener(
    "change",
    updateHeaderState
  );

  updateHeaderState();
}

/**
 * ==========================================
 * カスタムカーソル
 * ==========================================
 */

function initializeCustomCursor() {
  const cursor = document.getElementById("cursor");
  const stalker = document.getElementById("stalker");

  if (!cursor || !stalker) return;

  document.addEventListener("mousemove", (event) => {
    cursor.style.transform =
      `translate(${event.clientX}px, ${event.clientY}px) ` +
      "translate(-50%, -50%)";

    stalker.style.transform =
      `translate(${event.clientX}px, ${event.clientY}px) ` +
      "translate(-50%, -50%)";
  });

  document
    .querySelectorAll("a, button, .card__btn")
    .forEach((target) => {
      target.addEventListener("mouseenter", () => {
        stalker.classList.add("is-active");
      });

      target.addEventListener("mouseleave", () => {
        stalker.classList.remove("is-active");
      });
    });
}
