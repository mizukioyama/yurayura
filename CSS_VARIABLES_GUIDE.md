# ゆらゆら CSS調整ガイド

## 目的

この資料は、mizukiさん本人が最終的なレイアウト・サイズ・余白・フォントサイズを調整するときの案内です。プロジェクトルールと最終調整の開始条件は `AGENTS.md`、視覚基準は `DESIGN_SYSTEM.md` を参照してください。

`assets/css/user-settings.css` は全公開11ページの文字サイズの正本です。共有ロールは`:root`、独立した既存サイズは同ファイルのコンポーネント別セクションで編集します。色・font family・section幅・Gallery形状は文字サイズの設定とは分離しています。

技術cleanup、runtime問題、CSS依存、404、security、repository整理が終わり、`READY FOR USER FINAL LAYOUT / SIZE ADJUSTMENT` と引き継がれるまでは、最終的な見た目調整を始めないでください。現在残っている構造上の例外を、調整可能な共通変数と誤認しないための注意を含みます。

---

## 1. 共通設定と色

`assets/css/main.css` が共通CSSのcanonical sourceです。共通色変数 `--color-txt`、`--color-bg`、`--color-shadow-green` は同ファイルで定義され、active backup CSS dependencyは0です。

現時点で `user-settings.css` に共通色の調整変数はありません。色調整はまだ安全な共通設定として公開されていません。

---

## 2. Typography / font size

文字サイズは原則 `assets/css/user-settings.css` だけを編集します。component CSSは配置・色・行間・字間・動作を管理し、文字サイズの別の正本を作りません。移行前のstylesheetにあったセレクターとmedia条件を同ファイルの名前付きセクションへ集約しています。CSSの順序を並べ替えたり、同じタグという理由だけで値を統一しないでください。

| 基本ロール | 正本・調整箇所 | 適用範囲・例外 |
|---|---|---|
| FVタイトル | `--type-page-title-size` | 非TOPの共通タイトル。TOPの特大・compact・低い横画面は`--type-top-hero-*`で独立 |
| H2 | `--type-heading-2-size` | 共通セクション見出し。TOPの導入見出しは既存の専用式を維持 |
| H3 | `--type-heading-3-size` | 小見出し。compactの式は同ファイルの767px以下の定義 |
| 小見出し | `--type-small-heading-size` | 補助見出し・既存のmodal button |
| 本文 | `--type-body-size` | desktopは既存式の上限14px、767px以下は14.25px。legacy aliasは使わない |
| リード | component別の`.fv__txt`、`.information-subheading`等 | 標準本文と同じとは限らないため、独自式または共有ロールの直接参照を維持 |
| メタ情報 | component別のeyebrow、`.bottom-txt`、Gallery profile等 | 意味・継承単位が異なるサイズを同値だけで結合しない |
| ボタン | `--type-button-size`、`--type-compact-button-size`、`--type-liquid-*-size` | nativeとShadow DOMの既存スケールは異なる。Galleryのfilter/paginationは既存のfont継承が優先。Contact send/modalも名前付きselectorで独立 |
| ナビゲーション | `--type-navigation-label-size`、`--type-menu-logo-size`、`--type-menu-meta-size` | 共有ラベル9–10px。Header英語ラベル等の独立した既存式を維持 |

9つは意味の分類で、変数数の上限ではありません。独立したサイズ変数は19種類（trackingを除く）あり、TOPの画面高制御・ナビのlogo/meta・native/compact/Shadow DOMのサイズvariantを含みます。単発のサイズは同ファイルの既存selectorの`font-size`を直接編集し、1宣言のためだけに別名変数を作りません。

rootの共有ロールは現在のmediaによる上書きを含みます。例えばdesktop本文を調整する場合はrootの定義1か所、compact本文を調整する場合は767px以下の定義1か所を変更します。ロールの参照先をページ別にコピーしないでください。`--responsive-copy-size` / `--responsive-heading-2` / `--responsive-heading-3` / `--responsive-small-heading` / `--button-font-size`は廃止済みです。

`clamp()`の上下限・中間式・rem/emの継承関係をまとめて確認してください。異なる式を同じmin/maxへ変換するのはデザイン変更です。TOP低横画面は画面高・Header高に依存した実計算が必要なので、`--type-top-hero-landscape-*`からcompact/bodyを参照する派生式を維持します。これは無意味な別名ではありません。

Gallery PC副題の20px、フォームの`.modal-title` / `.modal-close` / `.send-btn`、操作glyphの0/30pxなども同ファイルのcomponent節が正本です。通常CSSからShadow DOM内部は選択できないため、`liquid-button.js`は正本変数をhost経由で継承します。同JS内の4つの旧値はサイトCSSがない単体利用だけのfallbackで、通常のサイズ調整箇所ではありません。

例外: reset.cssの1rem/100%/75%はブラウザー基礎の継承reset。現行11ページに未読込のworks-list.css/top-sections.cssは旧・外部利用を否定できないため保持します。有効化する際は同時にTypography移行と表示検証が必要です。新規のinline/JS/font shorthandでサイズを分散させないでください。

font familyの `--font-base`、`--font-jp`、`--font-btn` はcanonicalな `assets/css/main.css` にあります。フォント変更はHTMLのloadと共に監査が必要で、サイズ移行と混ぜません。

`node --test tests/*.test.cjs`は、サイズ正本の分散、廃止alias、無意味なpure alias、未定義/未参照のTypography token、Shadow DOM設定契約を検出します。テストPASSだけで見た目の同等性は証明できないため、computed font/改行/寸法のBefore/Afterも確認します。

---

## 3. Spacing / section width

TOPとConceptの一部では `--top-section-inline-padding` が使われています。宣言元は `assets/css/top-legacy.css` と `assets/css/concept.css`、Artists領域では `assets/css/top-artists.css` の `--artists-side-padding` がこの値を参照します。これは `user-settings.css` の共通設定ではなく、宣言がページ側に分かれています。最終調整時も、片方だけ変えてページ間にずれを作らないよう、両ページとArtists領域への影響を確認してください。

現時点で全ページ共通のsection width / side padding変数はありません。共通設定に集約する作業はCSS依存解消後の別作業です。

---

## 4. Breakpoints

共通のbreakpoint変数はありません。文字サイズの条件は`user-settings.css`、レイアウトの条件は対象stylesheetの`@media`を確認してください。

- Header / Footer：`assets/css/menu-style.css`
- TOP section / Artists：`assets/css/top-legacy.css`、`assets/css/top-artists.css`、`assets/css/top-sections.css`
- Concept：`assets/css/concept.css`、`assets/css/concept-fv.css`
- Gallery：`assets/css/gallery.css`、`assets/css/gallery-inline.css`、`assets/css/gallery-pc-restore.css`、`assets/css/gallery-category-pc.css`、`assets/css/gallery-label-fix.css`
- Contact form：`assets/css/form.css`

レイアウトのbreakpointを文字サイズへコピーしたり、既存の適用範囲を勝手に広げないでください。Typography用の元のmedia条件は正本に維持しています。

---

## 5. Header / Footer

`assets/css/menu-style.css`

モバイル向けの位置・間隔・寸法変数は `assets/css/menu-style.css` 内で定義されています。

| 変数 | 意味 |
|---|---|
| `--site-nav-top` | Header上位置 |
| `--site-nav-side` | 左右位置 |
| `--site-nav-inner-gap` | Header内部間隔 |
| `--site-nav-gap` | メニュー項目間隔 |
| `--site-nav-item-height` | 縦メニュー1項目の高さ |
| `--site-nav-link-width` | メニューリンク幅 |
| `--site-nav-logo-size` | 「ゆらゆら」ロゴ文字サイズ |
| `--site-nav-meta-size` | 日付・小文字等 |
| `--site-nav-letter-spacing` | メニュー文字間 |
| `--site-nav-border-height` | メニュー内の縦線 |
| `--site-footer-padding-top` | Footer上余白 |
| `--site-footer-padding-bottom` | Footer下余白 |

`menu-style.css`にもモバイル用のlogo / meta文字サイズ変数がありますが、後から読み込まれる `user-settings.css` の共通selectorが文字サイズを指定します。文字サイズの入口は `--type-menu-logo-size` と `--type-menu-meta-size` です。位置、縦メニュー寸法、Footer余白は `menu-style.css` 側の設定です。desktopのHeader / Footerのlayout値は同ファイル内の直接指定が中心で、共通の安全な調整変数にはなっていません。

---

## 6. Gallery

Galleryには現在、調整専用の共通variable setはありません。表示領域ごとに次を確認します。

| 対象 | 主なstylesheet |
|---|---|
| ページ全体、intro、filter、card、mobile layout | `assets/css/gallery.css` |
| カード・画像・作品リンクの共通宣言、modal、responsive差分 | `assets/css/gallery-inline.css` |
| desktop表示の復元 | `assets/css/gallery-pc-restore.css` |
| desktop category表示 | `assets/css/gallery-category-pc.css` |
| category labelの例外 | `assets/css/gallery-label-fix.css` |
| filter、pagination、modalの動作 | `assets/js/gallery.js` |

カードの同値宣言は `gallery-inline.css` 冒頭の共有ルールで編集し、画像height・カード余白・grid等の差だけを元のmedia範囲で管理します。Artist/Genreの見出しは `.gallery-filter-title` を使い、HTMLの文字を表示します。旧ラベル生成用Modifierは使いません。

modal座標、作品画像の比率、filter・paginationの動作は安全なユーザー設定値として公開されていません。これらを変える必要がある場合は、個別の変更とQAとして扱います。

---

## 7. 現在のユーザー設定範囲と例外

現行の `user-settings.css` はTypography値の唯一の編集先です。次の値は構造や複数ページへ影響するため、ユーザー設定として公開されるまでは直接変更しないでください。

- `z-index`
- `position: fixed / absolute`
- transform
- Gallery modal座標
- Fog / Canvasサイズ計算
- `!important` の追加・削除
- backup CSSへの依存関係
- cache-busting query string
- breakpoint / media query
- 共通色・font familyを持つbackup CSS
- Galleryのfilter / pagination / modal構造

layout・構造値を変える必要がある場合は、CSS調整ではなく技術変更として影響範囲と検証方法を先に決めます。

---

## 8. 最終調整までの前提

`user-settings.css` は調整入口として既に存在しますが、全カテゴリを集約した最終形ではありません。まだないvariableをこのガイドだけで作ったり、例示値をCSSへ追加したりしないでください。

canonical CSS移行とbackup CSS依存解消は完了し、active backup CSS dependencyは0です。最終調整を始める前に、最新branchのbrowser baselineと残る例外を確認し、`READY FOR USER FINAL LAYOUT / SIZE ADJUSTMENT` の引き継ぎを行います。

---

## 9. 最終調整の進め方

開始できる状態が明示された後、次の順で調整します。

1. `user-settings.css` にある既存の調整用variableから対象を選ぶ。
2. 変数で扱えないpage-specific exceptionは、該当stylesheetとcascadeを確認してから扱う。
3. Desktop / mobileを含む `QA_CHECKLIST.md` のviewportと項目で確認する。
4. 表示・文章の折り返し・共通Header / Footer・Gallery操作への影響を確認する。
5. 未確認の見た目をPASSにせず、残った例外を引き継ぐ。

HTML、JavaScript、backup CSS、animation、modal geometryの直接変更は、この調整ガイドの範囲外です。

## 10. CSS移行の現在地

`assets/css/main.css` がcanonical runtime stylesheetです。active backup CSS dependencyは0で、tracked treeからobsolete backup CSSは除去済みです。旧backup CSS全体のコピーは行わず、承認済みのselector/property cleanupだけをcanonical CSSへ反映しています。

Typographyの共有変数と独自サイズ指定は `assets/css/user-settings.css` に集約済みです。追加variableが必要な場合も独立した役割・scope・実際の消費先を確認し、layout変更とは分離します。

## 参加ページ
`assets/css/participation.css` の `--path-content`、`--path-reading`、`--path-gap`、`--path-section-space` が4カードと参加ページの調整値です。FVは既存の共通ルールを引き継ぎます。

## TOP hero and participation visuals
TOPの文字サイズはuser-settings.cssの`--type-top-hero-size`、`--type-top-hero-tracking`、`--type-top-hero-compact-size`。中央の座標はtop-legacy.css、Header予約高はmenu-style.cssの`--site-header-size`とbreakpointで共有する。既存Scroll演出の周期は変更しない。カード画像と紙質感・hover/focusはparticipation.cssで共有する。

## Shared Scroll and static body paper

`assets/css/visual-shared.css` owns `--fv-scroll-left` and `--fv-scroll-line`. Bounded editorial FV geometry is computed by `initializeScrollGuidePosition` in allmenu.js; TOP H1 remains independently owned by top-legacy.css. Body paper is controlled by the shared paper variables documented below; main.css body::before retains fallbacks for legacy pages; the runtime image is participation/washi-grain.webp. Keep changes scoped and verify contrast, Scroll overlap and all breakpoints.

## Low landscape viewport safety

`visual-shared.css` owns the height-conditioned override. `--compact-viewport-height`, `--compact-header-height` and per-guide `--compact-scroll-line` are runtime bounds, updated in allmenu.js. Keep their calculations scoped to landscape height720px or less; do not copy absolute top coordinates into individual pages. `--type-top-hero-landscape-size` and `--type-top-hero-landscape-copy-size` in user-settings.css retain the compact typography while respecting Header clearance. main.css retains the existing body background layer geometry and opacity; its fallback points to the same static participation/washi-grain.webp used by visual-shared.css. Normal portrait layout and Gallery PC rules remain the fallback outside the compact condition.

### Phase 6 shared controls

`visual-shared.css`: `--paper-image`, `--paper-size` (1024px1024px), `--paper-opacity` (0.6) are shared by body and Vanta background paper. Do not lift the grain above artwork. `--space-2` through `--space-8` map to8/16/24/32/48/64/96px and are used by participation components. Existing gutters remain unchanged.
`--motion-reveal-distance`20px, `--motion-reveal-duration`800ms, `--motion-feedback-duration`360ms, `--motion-card-lift`-4px and `--motion-ease-out` control non-FV feedback. Reduced-motion disables these transforms/transitions.

### Phase 7 controls (supersede Phase6 paper values)

`visual-shared.css`: --paper-image points to participation/washi-grain.webp; --paper-size512px512px, --paper-opacity0.72. Footer/open-menu backgrounds share this static material; do not move grain above artwork. --motion-interaction-duration180ms controls ordinary feedback; existing20px/800ms reveals remain.
`menu-style.css`: --header-content-max1200px / --nav-desktop-width560px / --nav-desktop-gap16px / --nav-panel-width352px / --nav-panel-gap8px / --nav-panel-inline24px / --nav-item-padding8px. Mobile content gutters are unchanged.
`user-settings.css`: --type-page-title-size owns shared editorial/Gallery titles. Below768px the scale is92% of the original; --type-body-size14.25px, compactH2/H3 and --type-feature-heading-size for TOP decorative section titles. Do not shrink TOP H1, metadata or input controls with a global multiplier. Check320/359/375/390/430/600/767 and768 boundary after changes.

TOP lower card feedback: `visual-shared.css` owns `--card-float-duration:500ms` and `--card-float-lift:-8px`. Whole-card individual `translate` is separate from the reveal `transform`; reduced-motion disables movement. TOP's eyebrow/title rules are scoped to `[aria-labelledby="paths-title"]` and do not change other `.path-eyebrow` labels.

Latest card feedback uses --card-float-duration680ms, overridden to120ms only during :active; reveal timings remain unchanged. --text-link-line-duration350ms / --text-link-color-duration250ms control ordinary links. --text-link-color has a light Footer override; do not apply the body dark hover color to the Footer.

## Phase 8 Header追尾

Header幅は変更しない。閾値はallmenu.jsのviewport高さ×0.70（1200px以上）／×0.80（それ未満）。Headerの固定・280ms transitionはmenu-style.css、Header/Footerの350ms下線・250ms色変化はvisual-shared.cssが所有。高さだけのresizeは180ms待って再評価する。--site-header-sizeの予約領域を消すとFVとCLSが変わるため維持する。
参加ページの通常PC/タブレットFV例外はparticipation.cssの.information-page.participate-pageに限定。低い横画面の共通指定は変更しない。

## 非TOP FVとHeader/Footerの共通操作

FVの位置・フレーム・スマホPaddingは `concept-fv.css` の `.page-fv` と `.page-fv__inner` を1か所で編集する。
ConceptはPCを含む全幅の正本。ページ名別のコピーや `page-fv--reading` / `page-fv--participate` は使用しない。
Galleryは1200px以上だけ既存のPC専用配置を維持する。TOPの `.fv` は対象外。
共有ラベル文字サイズは `user-settings.css` の `--type-navigation-label-size`（9px / 0.9vw / 10px）。
`.site-brand` と `.site-nav-label` は共有Typography用で、Header/Footer固有の配置クラスを置換しない。
`--type-menu-meta-size` と `.header-logo` は既存の別の詳細度・旧Markup互換用に維持する。
