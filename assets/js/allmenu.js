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

      target.innerHTML = await response.text();
    } catch (error) {
      console.error(error);

      target.innerHTML = `
        <div class="parts-load-error">
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
   * 各機能の初期化
   * ==========================
   */

  initializeHeaderMenu();
  initializeCurrentYear();
  initializeCurrentPage();
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
 * ヘッダーメニュー
 * ==========================================
 */

function initializeHeaderMenu() {
  const header = document.querySelector(".header");
  const menuToggle = header?.querySelector(".menu-toggle");

  if (!header || !menuToggle) {
    console.warn("メニュー要素が見つかりません");
    return;
  }

  const menuLinks = header.querySelectorAll(".header-link");

  let animationFrameId = null;

  /**
   * ==========================
   * 背景スクロール状態を更新
   * ==========================
   */

  function setScrollLock(isLocked) {
    document.documentElement.classList.toggle(
      "is-menu-open",
      isLocked
    );

    document.body.classList.toggle(
      "is-menu-open",
      isLocked
    );
  }

  /**
   * ==========================
   * メニュー開閉状態を更新
   * ==========================
   */

  function setMenuState(isOpen) {
    /*
     * 縮小状態でない場合は開かない
     */

    const shouldOpen =
      isOpen && header.classList.contains("is-compact");

    header.classList.toggle("is-open", shouldOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      shouldOpen
        ? "メニューを閉じる"
        : "メニューを開く"
    );

    setScrollLock(shouldOpen);
  }

  /**
   * ==========================
   * メニューを閉じる
   * ==========================
   */

  function closeMenu() {
    setMenuState(false);
  }

  /**
   * ==========================
   * ヘッダー表示状態を更新
   * ==========================
   */

  function updateHeaderState() {
    /*
     * メニューを開いている間は
     * スクロール判定を変更しない
     */

    if (header.classList.contains("is-open")) {
      return;
    }

    /*
     * 画面の高さの半分を超えたら縮小
     * PC・スマホ共通
     */

    const compactThreshold =
      window.innerHeight * 0.9;

    const shouldCompact =
      window.scrollY >= compactThreshold;

    header.classList.toggle(
      "is-compact",
      shouldCompact
    );

    /*
     * 縮小位置より上へ戻った場合
     */

    if (!shouldCompact) {
      closeMenu();
    }
  }

  /**
   * ==========================
   * スクロール処理を軽量化
   * ==========================
   */

  function requestHeaderUpdate() {
    if (animationFrameId !== null) {
      return;
    }

    animationFrameId = requestAnimationFrame(() => {
      updateHeaderState();
      animationFrameId = null;
    });
  }

  /**
   * ==========================
   * メニューボタン
   * ==========================
   */

  menuToggle.addEventListener("click", (event) => {
    /*
     * aタグで作成されている場合も
     * href="#"によるトップ移動を防ぐ
     */

    event.preventDefault();

    const isOpen =
      !header.classList.contains("is-open");

    setMenuState(isOpen);
  });

  /**
   * ==========================
   * メニューリンク
   * ==========================
   */

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /**
   * ==========================
   * Escキー
   * ==========================
   */

  document.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      !header.classList.contains("is-open")
    ) {
      return;
    }

    closeMenu();
    menuToggle.focus();
  });

  /**
   * ==========================
   * スクロール
   * ==========================
   */

  window.addEventListener(
    "scroll",
    requestHeaderUpdate,
    {
      passive: true,
    }
  );

  /**
   * ==========================
   * 画面サイズ変更
   * ==========================
   */

  window.addEventListener(
    "resize",
    requestHeaderUpdate,
    {
      passive: true,
    }
  );

  /**
   * ==========================
   * 初期状態
   * ==========================
   */

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "メニューを開く"
  );

  /*
   * ページ再読み込み時も
   * 現在のスクロール位置を反映
   */

  updateHeaderState();
}

/**
 * ==========================================
 * 現在年 自動更新
 * ==========================================
 */

function initializeCurrentYear() {
  const year = document.querySelector("#js-year");

  if (!year) return;

  year.textContent = new Date().getFullYear();
}

/**
 * ==========================================
 * 現在ページ active付与
 * ==========================================
 */

function initializeCurrentPage() {
  const currentPath = normalizePath(location.pathname);

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) {
      return;
    }

    try {
      const linkURL = new URL(href, location.href);

      /*
       * 外部リンクを除外
       */

      if (linkURL.origin !== location.origin) {
        return;
      }

      const linkPath = normalizePath(linkURL.pathname);

      link.classList.toggle(
        "is-current",
        linkPath === currentPath
      );
    } catch (error) {
      console.warn(`無効なリンクです: ${href}`, error);
    }
  });
}

/**
 * ==========================================
 * パスを比較用に統一
 * ==========================================
 */

function normalizePath(pathname) {
  let normalizedPath = pathname.replace(/\/+$/, "");

  normalizedPath = normalizedPath.replace(
    /\/index\.html$/,
    ""
  );

  return normalizedPath || "/";
}

/**
 * ==========================================
 * カスタムカーソル
 * ==========================================
 */

function initializeCustomCursor() {
  /**
   * マウス操作がない端末では実行しない
   */

  const canUseCustomCursor = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  if (!canUseCustomCursor.matches) {
    return;
  }

  const cursor = document.getElementById("cursor");
  const stalker = document.getElementById("stalker");

  if (!cursor || !stalker) {
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let animationFrameId = null;

  /**
   * ==========================
   * カーソル位置を反映
   * ==========================
   */

  function updateCursorPosition() {
    const transform =
      `translate(${mouseX}px, ${mouseY}px) ` +
      "translate(-50%, -50%)";

    cursor.style.transform = transform;
    stalker.style.transform = transform;

    animationFrameId = null;
  }

  /**
   * ==========================
   * カーソル移動
   * ==========================
   */

  document.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (animationFrameId !== null) {
        return;
      }

      animationFrameId =
        requestAnimationFrame(updateCursorPosition);
    },
    {
      passive: true,
    }
  );

  /**
   * ==========================
   * リンク・ボタンへのホバー
   * ==========================
   */

  document
    .querySelectorAll("a, button, .card__btn")
    .forEach((target) => {
      target.addEventListener("pointerenter", () => {
        stalker.classList.add("is-active");
      });

      target.addEventListener("pointerleave", () => {
        stalker.classList.remove("is-active");
      });
    });
}
