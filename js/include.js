document.addEventListener("DOMContentLoaded", () => {
  /**
   * 外部HTMLファイルを読み込んで指定要素に挿入する関数
   * @param {string} elementId - 挿入先の要素のID
   * @param {string} filePath - 読み込むHTMLファイルのパス
   */
  const includeHTML = async (elementId, filePath) => {
    const targetElement = document.getElementById(elementId);
    
    // 挿入先の要素が存在するか確認（nullエラー防止）
    if (!targetElement) {
      console.warn(`IDが '${elementId}' の要素が見つかりません`);
      return;
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }
      const htmlText = await response.text();
      targetElement.innerHTML = htmlText;
      
      // フッターが読み込まれた後に年の表示を更新する
      if (elementId === "footer-placeholder") {
        updateYear();
      }
    } catch (error) {
      console.error(`${filePath} の読み込みに失敗しました:`, error);
    }
  };

  /**
   * フッターの著作権年を自動更新する関数
   */
  const updateYear = () => {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  // 各ページの指定位置にヘッダーとフッターを読み込む
  includeHTML("header-placeholder", "header.html");
  includeHTML("footer-placeholder", "footer.html");

  /**
   * カスタムカーソルの動作処理
   */
  const initCustomCursor = () => {
    const cursor = document.getElementById("cursor");
    const stalker = document.getElementById("stalker");

    // カーソル要素が存在するか確認（PCのみ等でのエラー回避）
    if (!cursor || !stalker) return;

    // マウス移動時にカーソルを追従させる
    document.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      stalker.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });

    // リンクホバー時のアクションを動的に適用するため、MutationObserverを使用
    // （ヘッダーなどの非同期読み込みにも対応）
    const applyHoverEffect = () => {
      const linkElements = document.querySelectorAll("a, button, .menu-list, .img-btn");
      linkElements.forEach((link) => {
        // 多重登録を防ぐため、一度削除してから追加
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    const handleMouseEnter = () => stalker.classList.add("is-active");
    const handleMouseLeave = () => stalker.classList.remove("is-active");

    // 初回適用
    applyHoverEffect();

    // 非同期で追加された要素にも適用するための監視
    const observer = new MutationObserver(applyHoverEffect);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  initCustomCursor();
});
