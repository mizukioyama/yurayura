# Review report

## Scope

- Target: Concept、Artists、Contact、FAQ、Access の見出し・本文、フォーム文言、ヘッダー／フッター文字、Artistsスライドショーの外部ギャラリーリンク、gallery.htmlのカードレイアウト
- Non-target: Artists以外のHTML本文・構造、フォーム送信処理、既存の背景アニメーション・FAQ動作・ボタン実装
- Recovery copy: `backups/` 内の作業前コピー（commit対象外）

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

対象範囲の見出し・本文・FAQ・Access・フォーム文言を横書き・左寄せに統一しました。本文は `--responsive-copy-size`、見出し・UI文字は見出し用の `clamp()` を使用しています。h1、h2、h3、小見出し、モーダル、送信ボタン、ヘッダー／フッター文字まで、画面幅に応じて最小値・最大値の間で変化します。

指定URLはこの環境から取得できなかったため、リポジトリ内の `gallery.html` と `assets/css/works-list.css` を参照し、ギャラリーページを「見出し・説明文・画像付きカード一覧」の構成にしています。Artistsの背景画像非表示は維持し、`index.html` の既存スライドショー構造は変更していません。

フォームの問い合わせ種別4項目は、既存のHTML順序を維持したまま `contact-check-grid` を2列のCSS Gridへ変更し、列・行位置も明示して2段で表示するようにしました。フォームCSSにはキャッシュバスターを付け、古いレイアウトの残存を防いでいます。フォーム送信処理とチェックボックス検証は変更していません。

FVを除く全`section`（body内各セクション）の左右Paddingを44pxに統一しました。FVは既存レイアウトを維持するため左右0pxとし、ArtistsのスライドショーとView背景の相殺値も44pxへ同期しています。

Q&Aの`.faq-box`内側10pxを解除し、Contact・Q&A・Accessの内容左右位置を揃えました。

FAQの`faq.js`を、確実な初期化・開閉状態の同期・`aria-expanded`/`aria-controls`設定に対応させました。「期間と場所と時間」「アクセス」などの外側の分類は通常の見出しとし、回答内の「展示期間」「発送について」「領収書について」などをアコーディオンにしました。質問順は展示概要、アクセス、販売作品・グッズ、購入、主催者の自然な順に整理しました。

外側の見出しは元のFAQ質問と同じ背景画像・内側の境界表現を維持しました。

FV以外の全`section`は固定の`100vh`を解除して`height: auto; min-height: 0`とし、内容量と既存paddingに応じた自然な高さにしました。FVだけは`height: 100vh; min-height: 100vh`を維持しています。

スマホ幅ではFV以外の上下paddingを`clamp(72px, calc(7vw + 48px), 96px)`に調整し、従来の120〜128px相当の余白による過度な縦長化を抑えました。

Concept/Artistsはさらに上下paddingをデスクトップで`clamp(56px, calc(3vw + 32px), 80px)`、スマホで`clamp(48px, calc(5vw + 32px), 72px)`に調整しました。Artistsの`artists-bg.webp`背景コンテナは非表示にし、既存スライドショーを表示しています。

Conceptは展示コンセプトに合わせ、上記共通値より大幅に広い上下paddingをデスクトップで`clamp(112px, calc(6vw + 80px), 176px)`、スマホで`clamp(96px, calc(8vw + 80px), 160px)`に設定しました。

未反映対策として、`index.html`の`main.css`読み込みに`v=20260909-slider-external-gallery`を付け、ブラウザキャッシュで旧CSSが残らないようにしました。

Footerのリンククラスを`header-link`から`footer-link`へ分離し、Headerと同じ文字間隔（PC`0.8rem`、スマホ`0.2rem`）を明示しました。`menu-style.css`にもキャッシュバスターを付けています。

ギャラリーページのカードは `figure.card__img` と `card__body` を持ち、`works-list.css` の `grid-template-columns` で3列・2列・1列へ切り替えます。深緑背景を持つ既存のViewボタンは維持します。

`gallery.html` を実際の作家紹介ページとして整備し、4作品の画像カードと `#mizuki-01`〜`#mizuki-04` のアンカーを追加しました。Artistsの既存スライド内Mizukiカード4件とViewボタンは、指定された `https://mizukioyama.github.io/website/gallery.html` へリンクします。

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
| Artistsスライダー | PASS | `memberSlider`/`memberTrack`と既存`slide.js`を維持。Mizukiカード4件のリンク先だけ指定URLへ変更 |
| gallery.html | PASS | 作家見出し、説明文、4作品カード、`#mizuki-01`〜`#mizuki-04`を確認。全画像ファイルが存在 |
| Mizuki / Viewリンク | PASS | indexの4カードとViewボタンが`https://mizukioyama.github.io/website/gallery.html`を指定 |
| Viewボタン背景幅 | PASS | 既存の深緑背景・fluid指定・レスポンシブ幅ルールは変更していない |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| FAQアコーディオン | PASS | 外側の分類は`.faq-heading`、回答内の`.faq-sub-question`をJSで開閉し、`is-open`とARIA状態を同期。同時に複数項目を開かない |
| セクション高さ | PASS | FV以外は`height:auto; min-height:0`、FVは`100vh`。既存のpadding・コンテンツ構造は維持 |
| スマホsection高さ | PASS | 320〜699pxでFV以外の上下paddingを72〜96pxへレスポンシブ調整。FVは100vhのまま |
| Concept/Artists高さと背景 | PASS | 両sectionの上下paddingを個別に縮小し、Artists背景画像だけを非表示。スライドショーを維持 |
| CSS反映 | PASS | `main.css?v=20260909-slider-external-gallery`で最新CSSを読み込む設定を確認 |
| Header/Footer文字間隔 | PASS | Footerリンクを`footer-link`へ統一し、Headerと同じPC/スマホの`letter-spacing`を適用 |
| フォームチェックボックス | PASS | 320/390/699/700/1024pxで問い合わせ種別4項目が2列2段。HTML順序、選択状態、必須検証は維持 |
| FVを除く全section左右Padding | PASS | 320/390/699/700/1024/1440pxでConcept/Artists/Contact/FAQ/Accessの左右44px、FVは左右0px。bodyの横スクロールなし |
| Contact・Q&A・Accessの左右余白 | PASS | Q&Aの`.faq-box`内側paddingを0pxにし、3セクションの内容位置を統一 |
| 差分範囲 | PASS | 今回の追加差分は `index.html` のArtistsリンク、`gallery.html` の作家紹介ページ化、レビュー資料、作業前バックアップ。フォーム・FAQ・既存JSは変更なし |

## Judgment

実装・構文確認に問題はありません。外部参照URLは取得できなかったため、ローカルの参照ファイルを基準に実装しました。ブラウザ実機での最終表示確認は未実施です。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。
