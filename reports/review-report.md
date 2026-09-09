# Review report

## Scope

- Target: `index.html` の Concept セクション本文と、Concept本文のモバイル表示ルール
- Non-target: Concept以外のCSS、アニメーション、フォーム、FAQ、その他の本文・構造
- Recovery copy: `backups/index.html.before-concept-20260909.html`

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

スマホで縦方向が長くなりすぎないよう、既存のモバイル用Concept本文だけを `height: 60vh` に変更し、320px幅でも列が切れないよう `line-height: 2` を追加しました。デスクトップ側の値は変更していません。

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Concept本文の一致 | PASS | ブラウザDOMで指定文と完全一致 |
| `br` 構造 | PASS | Concept内11個、無効タグ0個、全て `pc-br` |
| HTMLのブラウザ解釈 | PASS | localhostで `document.readyState=complete`、対象要素を取得 |
| Tidy構文確認 | PASS / 注意あり | 対象変更箇所に新規エラーなし。既存HTML5要素等の警告は Known Issues に記録 |
| スマホ表示 | PASS | 390x844で本文高さ506px、320x568で本文高さ341px、両方とも `writing-mode: vertical-rl` と横はみ出しなし |
| デスクトップ表示 | PASS | 1440x900、`writing-mode: vertical-rl`、ページ横はみ出しなし |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| 差分範囲 | PASS | 実装差分は `index.html` のConcept本文と `assets/css/main.css` のConceptモバイルルールのみ |

## Judgment

実装・構文解釈・レスポンシブ表示の確認結果に問題はありません。commit / push 対象は `index.html` と本レポート一式です。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。
