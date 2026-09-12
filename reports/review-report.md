# Review report

## Top section layout update (2026-09-12)

TopページのConcept／Artistsセクションを、既存の文章・画像・スライダー構造・アニメーションを維持したまま調整しました。

### Changes

- `assets/css/top-sections.css` を追加し、`body.top-page` のTopページだけに適用
- Conceptを見出しと本文の2列構成にし、左寄せに偏っていた余白を整理
- Conceptの `Conceptを読む` 導線を本文側に配置
- Artistsの見出し・紹介文を中央に揃え、作品カードを中央の読みやすい幅に整理
- 作品カードの作家名ボタンを全体覆いから小さなラベルへ変更し、作品画像を見える状態に復元
- Viewボタンをカード幅に合わせた最大520px（スマホ最大280px）へ調整
- `slide.js`、既存画像、Gallery、共通ヘッダー／フッターは変更なし

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| 差分空白 | PASS | `git diff --check` |
| JavaScript構文 | PASS | `node --check assets/js/slide.js` |
| Top導線 | PASS | ローカルブラウザAXツリーでConcept導線とGallery導線を確認 |
| Concept配置 | PASS | ローカルブラウザで見出し・本文・導線の2列配置を確認 |
| Artists配置 | PASS | ローカルブラウザで中央寄せ見出し・紹介文・作品画像を確認 |
| 既存ページ保全 | PASS | Top専用CSSとして適用し、Concept／GalleryのCSS・JSは未変更 |

### Review judgment

今回の変更はTopの2セクションに限定した表示調整です。公開後はGitHub PagesのTopをスマートフォン実機でも最終確認してください。

### Public verification update (2026-09-12)

- GitHub Pagesの公開Topをキャッシュ更新URLで再読込し、TopのConcept導線を確認
- 公開ブラウザでArtistsの見出し・紹介文の中央寄せ、作品画像、カード幅内のViewボタンを確認
- 公開ブラウザでTOP / CONCEPT / GALLERYのナビゲーションと既存Galleryリンクを確認
- `git ls-remote origin HEAD` は `5b7e1cd4621c6f1528be1c4658adc2eba607c8e5` と一致

## Current task update (2026-09-12)

既存Topのトーンを維持したConceptページを新規作成し、Topからの導線と3ページ共通ナビを追加しました。既存Galleryの作品一覧、フォーム、FAQ、背景アニメーション、既存画像は変更していません。

### Implemented

- `concept.html` と `assets/css/concept.css` を追加
- Topと同じ紙質背景、霧・揺らぎ演出、縦組み見出し、フォント、余白感、レスポンシブ設計を再利用
- 既存作品画像 `202337.webp` / `202402.webp` をConcept内の視覚要素として使用
- TopのConceptセクションに `Conceptを読む` 導線を追加
- 共通パーツとGalleryのナビを `TOP / CONCEPT / GALLERY` に統一
- 既存ファイルは編集前に `backups/` へ退避

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| JavaScript構文 | PASS | `node --check` で既存アニメーション・メニューJSを確認 |
| 差分空白 | PASS | `git diff --check` |
| Concept DOM | PASS | ローカルブラウザで見出し、本文、画像2点、Gallery導線を確認 |
| Top導線 | PASS | TopのConceptセクション内に `Conceptを読む` を確認 |
| Gallery保全 | PASS | ローカルブラウザで4作品、カテゴリ、ページネーション、3ページナビを確認 |
| レスポンシブCSS | PASS | 480px以下の専用レイアウトと既存clamp設計を確認 |
| 公開先 | PASS | `origin` は `https://github.com/mizukioyama/yurayura.git`、push前HEADを確認 |

### Review judgment

実装とローカル表示確認は完了しています。公開後はGitHub Pagesの `concept.html` とTop/Galleryのナビを実機で最終確認してください。

## Publication update (2026-09-12)

- Commit: `e3ebc34` (`Add dedicated yurayura concept page`)
- Remote: `origin/main` を確認済み
- Public URL: `https://mizukioyama.github.io/yurayura/concept.html`
- Public HTTP response: 200
- 公開ブラウザでConcept本文、作品画像2点、Gallery導線、Top / Concept / Galleryナビを確認

## Clarification update (2026-09-12)

- Conceptページのh2見出しをすべて横書きに変更
- Conceptページのヘッダー／フッターはTopと同じ共通パーツを継続使用
- Conceptページの共通 `menu-style.css` / `main.css` 参照をTopと同じバージョン指定に統一

## Loading animation audit (2026-09-09)

初期表示時の霧ローディングを対象に、通常時の`holdDuration`を550ms、穴の拡大を2600ms、拡大後の保持を300ms、フェードを1400msへ調整しました。合計時間は約3.4秒から約4.85秒へ延長され、動きを緩やかにしています。`prefers-reduced-motion`時の短縮設定と、その他のアニメーション・JavaScriptは変更していません。CSS／JSのキャッシュバスターも更新しました。

## Scope

- Target: Concept、Artists、Contact、FAQ、Access の見出し・本文、フォーム文言、ヘッダー／フッター文字、Artistsスライドショーのgallery.htmlリンク、gallery.htmlのカテゴリ・カード・ページネーション
- Non-target: Artists以外のHTML本文・構造、フォーム送信処理、既存の背景アニメーション・FAQ動作・ボタン実装
- Recovery copy: `backups/` 内の作業前コピー（commit対象外）

## Change

指定された文章へ差し替え、既存の `pc-br` の仕組みを維持しました。Concept 内の改行タグはすべて `<br class="pc-br" />` に統一しています。

対象範囲の見出し・本文・FAQ・Access・フォーム文言を横書き・左寄せに統一しました。本文は `--responsive-copy-size`、見出し・UI文字は見出し用の `clamp()` を使用しています。h1、h2、h3、小見出し、モーダル、送信ボタン、ヘッダー／フッター文字まで、画面幅に応じて最小値・最大値の間で変化します。

参照リポジトリの `src/gallery.html`、`src/style/gallery.css`、`src/style/sidebar.css`、`src/public/gallery-sidebar.html` を確認し、見出し・左側カテゴリ・半透明の作品パネル・画像付きカード一覧・ページラインの構成を `gallery.html` / `gallery.css` に反映しました。Artistsの背景画像非表示は維持し、`index.html` の既存スライドショー構造は変更していません。

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

ギャラリーページは参照元と同じ `gallery-containt` → `content` → `.work` → `.work-img` の構造に変更しました。作品は1件ごとの横配置、スマホでは縦積みとし、1ページ10件を基準に作品数からページボタンを自動生成します。画像ファイルの差し替えは行っていません。

`gallery.html` を実際の作家紹介ページとして整備し、作家・ジャンルのカテゴリ絞り込み、4作品の `.work` レイアウト、`#mizuki-01`〜`#mizuki-04` のアンカーを追加しました。既存画像はそのまま使用し、ジャンルはDigitalとして登録しています。作品は10件を1ページ単位として、`gallery.js`が作品数からページ数を自動生成します。Artistsの既存スライド内Mizukiカード4件とViewボタンは、指定された `https://mizukioyama.github.io/yurayura/gallery.html` へリンクします。

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Concept本文の一致 | PASS | ブラウザDOMで指定文と完全一致 |
| `br` 構造 | PASS | Concept内11個、無効タグ0個、全て `pc-br` |
| HTMLのブラウザ解釈 | PASS | localhostで `document.readyState=complete`、対象要素を取得 |
| Tidy構文確認 | PASS / 注意あり | 対象変更箇所に新規エラーなし。既存HTML5要素等の警告は Known Issues に記録 |
| 対象テキスト表示 | PASS | Concept、Artists、Contact、FAQ、Access、フォーム文言が `writing-mode: horizontal-tb`、左寄せ |
| 見出しサイズ | PASS | h1、h2、h3、小見出しが `clamp()` の計算値で表示 |
| ブレイクポイント | PENDING | CSSは4帯へ整理済み。今回の変更後の画面境界確認はMacロック中のため未完了 |
| フォントサイズ | PASS | 本文320px:12.4px、390px:13.9px、480px以上:最大14px。h2は18〜28px、h3は14〜20pxの範囲 |
| レスポンシブ表示 | PENDING | 変更前の確認記録はあるが、今回のCSS変更後の画面確認は未完了 |
| Artistsスライダー | PASS | `memberSlider`/`memberTrack`と既存`slide.js`を維持。Mizukiカード4件のリンク先だけ指定URLへ変更 |
| gallery.html | PASS | Art Index、左側カテゴリ、`gallery-containt` / `content` / `.work` 構造、4作品、`#mizuki-01`〜`#mizuki-04`を確認。画像ファイルは変更なし |
| カテゴリ | PASS | 作家「Mizuki」、ジャンル「Digital」の絞り込みUIとARIA状態同期を確認 |
| ページネーション | PASS | `pageSize=10`、作品数から`Math.ceil(filteredCards.length / pageSize)`でページ数を生成する実装を確認。参照元同様の1作品1行レイアウト |
| Mizuki / Viewリンク | PASS | indexの4カードとViewボタンが`https://mizukioyama.github.io/yurayura/gallery.html`を指定 |
| Viewボタン背景幅 | PASS | 既存の深緑背景・fluid指定・レスポンシブ幅ルールは変更していない |
| JavaScript console error | PASS | 表示確認時の error 0件 |
| FAQアコーディオン | PASS | 外側の分類は`.faq-heading`、回答内の`.faq-sub-question`をJSで開閉し、`is-open`とARIA状態を同期。同時に複数項目を開かない |
| セクション高さ | PASS | FV以外は`height:auto; min-height:0`、FVは`100vh`。既存のpadding・コンテンツ構造は維持 |
| スマホsection高さ | PASS | 320〜699pxでFV以外の上下paddingを72〜96pxへレスポンシブ調整。FVは100vhのまま |
| Concept/Artists高さと背景 | PASS | 両sectionの上下paddingを個別に縮小し、Artists背景画像だけを非表示。スライドショーを維持 |
| CSS反映 | PASS | `main.css?v=20260909-responsive-breakpoints`で今回のCSSを読み込む設定を確認 |
| Header/Footer文字間隔 | PASS | Footerリンクを`footer-link`へ統一し、Headerと同じPC/スマホの`letter-spacing`を適用 |
| フォームチェックボックス | PASS | 320/390/699/700/1024pxで問い合わせ種別4項目が2列2段。HTML順序、選択状態、必須検証は維持 |
| FVを除く全section左右Padding | PASS | 320/390/699/700/1024/1440pxでConcept/Artists/Contact/FAQ/Accessの左右44px、FVは左右0px。bodyの横スクロールなし |
| Contact・Q&A・Accessの左右余白 | PASS | Q&Aの`.faq-box`内側paddingを0pxにし、3セクションの内容位置を統一 |
| 差分範囲 | PASS | 今回の追加差分は `index.html` のArtistsリンク、`gallery.html` の作家紹介ページ化、レビュー資料、作業前バックアップ。フォーム・FAQ・既存JSは変更なし |

## Judgment

実装・静的検証を完了しました。参照リポジトリ側のギャラリーレイアウトは今回の対象外として保留しています。

## Responsive breakpoint audit (2026-09-09)

今回の追加監査で、従来のCSSには `320〜699px` と `700〜1239px` の境界が残っており、指定された4区分と一致していないことを確認しました。以下を修正しました。

- `〜375px`、`376〜480px`、`481〜1335px`、`1336px〜` の4区分をレスポンシブ設計の基準に統一
- 旧 `699px` 境界を `480px` 境界へ整理
- `section`、`section__inner`、カード、フォーム、Accessの地図・情報欄の最小幅／最大幅を調整
- スマホ幅の地図を幅100%にし、Viewボタンの既存の280px／480〜520pxルールを維持
- `slide.js`、`faq.js`、`form.js`、`allmenu.js`は変更せず、CSS読み込みのキャッシュバスターのみ更新

タブレット幅では、共通sectionの上下余白を`64〜96px`、Conceptを`96〜144px`、Artistsを`64〜104px`、Contact／FAQ／Accessを`72〜120px`で補間します。Artistsカードは`220〜320px`、Viewボタンは`360〜520px`、地図は内側幅に合わせて最大740px相当、フォームの入力欄と送信欄は狭いタブレットでも折り返せる設定にしました。Accessの駅情報と詳細情報は、幅に応じて2列／自動調整グリッドになります。

静的検証では、旧 `699px`／`1239px` の有効なメディアクエリが残っていないこと、JavaScript構文、差分空白を確認しました。HTMLの `tidy` は既存のHTML5要素と `&display` 表記に関する警告を継続して出力します。また、Access内の既存の `</wbr>` は今回の対象外として変更していません。

Macがロック中で、ブラウザのヘッドレス起動も終了したため、今回のCSS変更後の実機・ブラウザ画面確認は未完了です。そのため、commit / pushは表示確認後まで保留しています。復元用コピーはローカルの `backups/` に保持し、commit対象から除外します。

## Figma gallery frame implementation (2026-09-09)

ユーザー共有のFigma作家紹介フレーム（デスクトップ `18:1600`、モバイル `607:291`）を基準に、`gallery.html`のページ形状を更新しました。Figmaの一時アセットURLはコミット用コードへ持ち込まず、既存ローカル画像と既存機能を維持しています。

- ヒーローを「作家紹介」とし、白い半透明・ぼかし背景、PC中央配置、スマホ左寄せを実装
- ヒーロー下に紹介文とジャンル情報を追加
- PCは作品画像を2列、スマホは1列にし、PC画像幅340px／スマホ画像246×320pxを基準にレスポンシブ化
- 作品下のタイトル・作家情報、Figmaの余白感、Akaya Kanadakaのページ番号表記（`1P`）を反映
- 作家・ジャンル絞り込み、既存4作品、作品数連動のページングは維持
- Zen Maru Gothicを追加し、`gallery.css`のページ固有オーバーライドとして実装
- 編集前に`backups/gallery.html.before-figma-frame-20260909.html`、`backups/gallery.css.before-figma-frame-20260909.css`、`backups/gallery.js.before-figma-frame-20260909.js`を作成

### Verification update

| Check | Result | Evidence |
| --- | --- | --- |
| HTMLタグ構造 | PASS | 自作タグスタック検査で`HTML_TAG_STACK_OK` |
| `br`タグ | PASS | 4箇所すべて`<br />`の正しい空要素 |
| JavaScript構文 | PASS | `node --check assets/js/gallery.js` |
| PC表示 | PASS | ローカルブラウザでヒーロー、2列カード、メタ情報、1P、フッターを目視確認 |
| スマホ相当表示 | PASS | ローカルブラウザで左寄せタイトル、1列カード、246×320px画像、メタ情報を目視確認 |
| 絞り込み・ページングDOM | PASS | Category、作家／ジャンルボタン、`galleryPagination`、`1ページ目を表示`を確認 |
| index.htmlスライドショー | NOT TOUCHED | 今回の変更対象外 |
| 公開URL | NOT TESTED | 公開・pushはこの作業では実行していない |

## Top layout rollback (2026-09-12)

### Scope

公開 `mizukioyama/yurayura` の `main` を基点に、軽量化コミット `c90eeef654916011c34c120baf25055757381885` が追加したTop専用CSSの作品JPEG背景指定4件だけを除去しました。Concept / Gallery の後続修正は維持しています。

### Changes

- `assets/css/top-sections.css`: c90eeefの17行追加分を削除
- `index.html`: `top-sections.css` のキャッシュバスターを `v=20260912-top-sections-rollback` へ更新
- 編集前のCSSとindexを `backups/20260912_before_top_layout_rollback/` に保存

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| 正常時点CSS一致 | PASS | 作業後blob `9822daa41968281a66bfcedc39da329ba6ea91e9` が `28f69fc:assets/css/top-sections.css` と一致 |
| c90差分限定 | PASS | c90eeefはTop CSSの17行追加のみ。今回その逆差分を適用 |
| 差分空白 | PASS | `git diff --check` |
| Concept / Gallery保全 | PASS | `concept.html` / `gallery.html` と関連CSS・JSは未変更 |
| JavaScript構文 | PASS | `node --check assets/js/slide.js`、`node --check assets/js/gallery.js` |
| 公開main基点 | PASS | `origin/main` は `b92d12b5c49b494512ce3fa23b60f773dab22d7b` |
| 公開Topレイアウト | PASS | 公開Topでrollback版CSS、JPEG上書きなし、カード8件、横スクロールなし、Concept / Gallery導線を確認 |

### Judgment

Topのレイアウト変更原因に対する最小の巻き戻しです。公開Topの作品カード、Concept、Artists、3ページ導線を確認済みです。公開Concept / Galleryも表示・導線・横スクロールなしを確認しました。

## Top historical composition restore (2026-09-12)

### Root cause

前回の画像差し替え分を戻しても、`main.css` に残る全体向けレスポンシブ規則と `top-sections.css` のレイアウト上書きがTopへ適用され続けていました。そのため、Concept／Artistsが横組み・中央寄せの構成になり、Artistsのカードが一枚の大きな表示になっていました。

### Changes

- `assets/css/top-sections.css` は28f69fc時点の内容を保持し、c90eeefのJPEG背景指定も戻した状態を維持
- `assets/css/top-legacy.css` を追加し、Topだけに以前の縦組み、100vhセクション、420×280pxカード、15px間隔の連続スライダーを適用
- `index.html` はTop専用復元CSSのキャッシュバスターを追加し、`top-page`スコープを復元
- Concept / GalleryのHTML・CSS・JSは変更なし
- 編集前コピーは `backups/20260912_before_top_layout_restore/` に保持

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Historical Top CSS | PASS | `top-sections.css` が28f69fc時点のblobと一致 |
| Top-only scope | PASS | 復元CSSの全セレクタを `.top-page` 配下に限定 |
| Local visual layout | PASS | Concept縦組み、Artists縦組み、連続カード、背景表示をブラウザで確認 |
| Static checks | PASS | `git diff --check`、`node --check assets/js/slide.js`、`node --check assets/js/gallery.js` |
| Concept / Gallery source preservation | PASS | 対象ページと関連CSS・JSに差分なし |
| Public deployment | PASS | `main` の `2397dd1` を公開ブラウザで確認。Top、Concept、Galleryを再読込 |

### Judgment

Topの表示崩れに対して、共有ページへ波及しない復元用CSSで以前の構成へ戻しました。公開Topの縦組み・複数カード表示、公開Concept / Galleryの表示を確認し、今回の復元を完了とします。

## Header / Footer restoration (2026-09-12)

### Scope

TopのHeader表示状態と共通Footerの構造だけを確認・復元しました。Concept本体には着手していません。

### Changes

- `assets/js/allmenu.js` を以前の動作へ戻し、デスクトップではスクロール後もHeader本体を表示
- 縮小メニューは320〜699pxのスマートフォンで、1画面分スクロールした場合だけ有効化
- `assets/parts/header.html` / `assets/parts/footer.html` は28f69fc時点と一致しているため変更なし
- 作業前コピーを `backups/20260912_before_header_footer_restore/` に保存

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Desktop header | PASS | ローカルブラウザでスクロール後も左側の縦型Headerを確認 |
| Footer | PASS | ローカルブラウザで中央の縦型Footerナビとコピーを確認 |
| JavaScript | PASS | `node --check assets/js/allmenu.js`、ブラウザエラー0件 |
| Concept body untouched | PASS | Concept本文・構造・関連CSS・JSに差分なし（読み込みURLの更新のみ） |
| Public deployment | PASS | push後の公開Topを再読込し、左側の縦型Header、中央のFooter、公開ブラウザのエラー0件を確認 |

### Public verification

- 公開URL `https://mizukioyama.github.io/yurayura/index.html` を再読込して確認
- デスクトップ表示でHeader本体の `TOP / CONCEPT / GALLERY` が左側に表示され、＋ボタンだけにならないことを確認
- ページ末尾でFooterの中央縦型ナビとコピーライトを確認
- 公開ブラウザのコンソールエラーは0件

## Top label correction (2026-09-12)

### Scope

共通Header / Footerの日本語ラベルだけを、指定どおり`トップページ`から`トップ`へ変更しました。Concept / Galleryのラベル、本文、リンク先、縦書き、左右順は維持しています。

### Changes

- Header / Footerの表示ラベルとaria-labelを`トップ`へ変更
- `CONCEPT / 世界観`、`GALLERY / 作品`は変更なし
- 各リンクの英語名＋日本語説明が1つの選択・クリック範囲になる構成を維持
- 左から`TOP → CONCEPT → GALLERY`の表示順を維持
- キャッシュバスターを`20260912-nav-top`へ更新
- 編集前コピーを`backups/20260912_before_top_label_update/`に保存

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| ラベル | PASS | ローカルDOMでHeader / Footerの日本語ラベルが`トップ`、`世界観`、`作品`であることを確認 |
| 縦書き | PASS | 6リンクすべて`writing-mode: vertical-rl`を維持 |
| 左右順 | PASS | Header / Footerともに左から`TOP → CONCEPT → GALLERY`を確認 |
| 選択範囲 | PASS | 6リンクすべて`inline-block`で英語名＋日本語説明を包含 |
| Concept / Gallery保全 | PASS | 本文・構造・関連CSS・JSは変更せず、共通読み込みURLのみ更新 |

### Public verification

- `main`へのpushは`fc50724`で成功
- 公開TopのアクセシビリティツリーでHeader / Footerの表示が`トップ`、`世界観`、`作品`へ更新されたことを確認
- 公開Topの本文、Concept導線、Gallery導線が表示され、既存構成が維持されていることを確認
- 公開ブラウザ上の確認URLは`nav-top-verify-20260912-r4`

## Navigation label update (2026-09-12)

### Scope

Header / Footerの共通ナビだけを対象に、英語名と日本語説明の表記を指定どおりに統一しました。Top・Concept本文、Gallery本文、リンク先は変更していません。

### Changes

- `Home` を `トップページ` に変更
- `TOP / トップページ`、`CONCEPT / 世界観`、`GALLERY / 作品` の組み合わせに統一
- 既存の `writing-mode: vertical-rl` を維持し、各リンクを `inline-block` 化して英語名から日本語説明までを1つの選択・クリック範囲に設定
- 縦書きの表示順を左から `TOP → CONCEPT → GALLERY`（トップ → 世界観 → 作品）に調整
- `index.html` / `concept.html` のCSS・JSキャッシュバスターと、動的パーツ取得URLを更新して公開環境の古いラベル残りを防止
- 編集前コピーを `backups/20260912_before_nav_label_update/` に保存

### Verification

| Check | Result | Evidence |
| --- | --- | --- |
| ナビ文言 | PASS | ローカルDOMで3項目の表示名を確認 |
| 縦書き | PASS | 6リンクすべて `writing-mode: vertical-rl` |
| 左右順 | PASS | Header / Footerともに左から `TOP → CONCEPT → GALLERY` の矩形位置を確認 |
| 選択範囲 | PASS | 各英語名＋日本語説明が1つの `inline-block` リンク範囲 |
| Concept / Gallery保全 | PASS | 本文・構造・関連CSS・JSに差分なし（`index.html` / `concept.html` は読み込みURLのみ更新） |

### Public verification

- 公開Topをキャッシュ更新URLで再読込し、3項目の日本語ラベルが更新されていることを確認
- 公開Topのスクリーンショットで、英語名と日本語説明が縦書きで表示されることを確認
- 公開Topのスクリーンショットで、左から `TOP → CONCEPT → GALLERY` の順を確認
- 公開TopのDOMで左座標が `トップページ → 世界観 → 作品` の順になることを確認
- 公開ブラウザのコンソールエラーは0件
