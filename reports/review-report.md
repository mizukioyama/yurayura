# Review report

## Scope

- Target: `index.html` の Concept セクション内テキスト全体と、Conceptテキストのレスポンシブ表示ルール
- Non-target: Concept以外のCSS、アニメーション、フォーム、FAQ、その他の本文・構造
- Recovery copy: `backups/index.html.before-concept-20260909.html`

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

Conceptセクション内の見出しと本文を全幅で横書き・左寄せに変更しました。フォントサイズは4つの幅帯ごとに `clamp(12px, …, 14px)` を適用し、最大14px・最小12pxでレスポンシブ対応しています。

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Concept本文の一致 | PASS | ブラウザDOMで指定文と完全一致 |
| `br` 構造 | PASS | Concept内11個、無効タグ0個、全て `pc-br` |
| HTMLのブラウザ解釈 | PASS | localhostで `document.readyState=complete`、対象要素を取得 |
| Tidy構文確認 | PASS / 注意あり | 対象変更箇所に新規エラーなし。既存HTML5要素等の警告は Known Issues に記録 |
| 全幅テキスト表示 | PASS | Concept見出し・本文とも `writing-mode: horizontal-tb`、左寄せ |
| ブレイクポイント | PASS | 〜375、376〜480、481〜1335、1336〜の4帯を確認 |
| フォントサイズ | PASS | 320px:12.4px、375px:13.5px、390px:13.9px、480px以上:最大14px |
| レスポンシブ表示 | PASS | 320〜1440pxでページ横はみ出しなし |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| 差分範囲 | PASS | 実装差分は `assets/css/main.css` のConceptテキストルールとレビュー資料のみ。HTML本文は未変更 |

## Judgment

実装・構文解釈・レスポンシブ表示の確認結果に問題はありません。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。
