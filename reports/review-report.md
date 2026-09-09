# Review report

## Scope

- Target: Concept、Artists、Contact、FAQ、Access の見出し・本文、フォーム文言、ヘッダー／フッター文字、Artistsスライドショーの表示幅
- Non-target: HTML本文・構造、画像、フォーム送信処理、アニメーションの動作・定義
- Recovery copy: `backups/` 内の作業前コピー（commit対象外）

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

対象範囲の見出し・本文・FAQ・Access・フォーム文言を横書き・左寄せに統一しました。本文は `--responsive-copy-size`、見出し・UI文字は見出し用の `clamp()` を使用しています。h1、h2、h3、小見出し、モーダル、送信ボタン、ヘッダー／フッター文字まで、画面幅に応じて最小値・最大値の間で変化します。Artistsの本文幅がスライダーの内部幅に引っ張られないよう、セクション内幅も補正しました。

Artistsのスライドショー表示領域は `width: 100vw` とし、セクション内の余白を越えて画面幅に揃えました。無限ループ用の `.member-track` の内部幅と既存アニメーションは変更していません。

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Concept本文の一致 | PASS | ブラウザDOMで指定文と完全一致 |
| `br` 構造 | PASS | Concept内11個、無効タグ0個、全て `pc-br` |
| HTMLのブラウザ解釈 | PASS | localhostで `document.readyState=complete`、対象要素を取得 |
| Tidy構文確認 | PASS / 注意あり | 対象変更箇所に新規エラーなし。既存HTML5要素等の警告は Known Issues に記録 |
| 対象テキスト表示 | PASS | Concept、Artists、Contact、FAQ、Access、フォーム文言が `writing-mode: horizontal-tb`、左寄せ |
| 見出しサイズ | PASS | h1、h2、h3、小見出しが `clamp()` の計算値で表示 |
| ブレイクポイント | PASS | 〜375、376〜480、481〜1335、1336〜の4帯を確認 |
| フォントサイズ | PASS | 本文320px:12.4px、390px:13.9px、480px以上:最大14px。h2は18〜28px、h3は14〜20pxの範囲 |
| レスポンシブ表示 | PASS | 320〜1440pxでページ横はみ出しなし |
| スライドショー幅 | PASS | 320〜1440pxで表示領域が各viewport幅、内部トラックは無限ループ幅を維持 |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| 差分範囲 | PASS | 実装差分は `assets/css/main.css`、`assets/css/form.css`、`assets/css/menu-style.css` の文字サイズルール、レビュー資料のみ。HTML本文は未変更 |

## Judgment

実装・構文解釈・レスポンシブ表示の確認結果に問題はありません。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。
