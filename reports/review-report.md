# Review report

## Scope

- Target: Concept、Artists、Contact、FAQ、Access の見出し・本文、フォーム文言、ヘッダー／フッター文字、Artistsスライドショーとカード上ボタン背景の表示幅
- Non-target: HTML本文・構造、画像、フォーム送信処理、アニメーションの動作・定義
- Recovery copy: `backups/` 内の作業前コピー（commit対象外）

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

対象範囲の見出し・本文・FAQ・Access・フォーム文言を横書き・左寄せに統一しました。本文は `--responsive-copy-size`、見出し・UI文字は見出し用の `clamp()` を使用しています。h1、h2、h3、小見出し、モーダル、送信ボタン、ヘッダー／フッター文字まで、画面幅に応じて最小値・最大値の間で変化します。Artistsの本文幅がスライダーの内部幅に引っ張られないよう、セクション内幅も補正しました。

Artistsのスライドショー表示領域は基本を `width: 100%` とし、スマホでは親セクションの左右 `40px` paddingを `--artists-side-padding` で相殺して画面幅に揃えました。さらに各 `.card` を `flex-basis: 100%`、トラックのgapを `0` とし、1枚のスライドを画面幅いっぱいに揃えました。無限ループ用のトラックと既存アニメーションは維持し、ループ幅のgap計算もCSSの実値から取得するよう同期しています。

Artistsのカード上`Mizuki`ボタン背景はカード幅100%、左右0に揃えました。`-View`ボタンは`fluid`属性をJSの監視対象に含め、Shadow DOM内でも背景ラッパーの幅を直接レスポンシブ適用しています。深緑背景を持つ親`.section__btn`は利用可能領域の`width: 100%`に戻し、`padding-inline`でボタンだけをスマホ最大280px、PCでは `clamp(480px, 36vw, 520px)` の480〜520px程度に調整しています。Galleryの既存ボタンには `fluid` を付けず、固定幅を維持しています。

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
| スライドショー幅 | PASS | 320/375/390/480/768/1336/1440pxで親paddingを含めた表示領域が `left: 0`〜`right: viewport`、トラック・1枚のカードも各viewport幅。bodyの横スクロールなし、内部トラックの無限ループを維持 |
| ボタン背景幅 | PASS | 深緑背景の親`.section__btn`は各利用可能領域の100%。390pxでは親310px、左右15px padding、host・Shadow DOM内wrapper280px。700/1024/1336/1440/1600pxでは親がviewport幅、paddingでhost・wrapperを480〜520pxに調整。カード上`Mizuki`ボタンはカードと同じ幅、Galleryのmdボタンは従来どおり280px |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| 差分範囲 | PASS | 実装差分は `assets/css/main.css` のスライダー・カード上ボタン・Viewボタン幅と親padding補正、`assets/js/slide.js` のgap同期、`assets/js/liquid-button.js` のfluid幅対応、indexのViewボタン属性、既存の文字サイズルール、レビュー資料のみ |

## Judgment

実装・構文解釈・レスポンシブ表示の確認結果に問題はありません。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。
