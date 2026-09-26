# ゆらゆら CSS調整ガイド

## 目的

この資料は、mizukiさん本人が最終的なレイアウト・サイズ・余白・フォントサイズを調整するときの案内です。プロジェクトルールと最終調整の開始条件は `AGENTS.md`、視覚基準は `DESIGN_SYSTEM.md` を参照してください。

`assets/css/user-settings.css` は既にあり、TOP・Concept・Galleryでページ固有CSSの後に読み込まれています。ただし、現在集約されているのは主に文字サイズです。色・font family・section幅・Gallery形状などはまだ一か所に集約されていません。

技術cleanup、runtime問題、CSS依存、404、security、repository整理が終わり、`READY FOR USER FINAL LAYOUT / SIZE ADJUSTMENT` と引き継がれるまでは、最終的な見た目調整を始めないでください。現在残っている構造上の例外を、調整可能な共通変数と誤認しないための注意を含みます。

---

## 1. 共通設定と色

現行の共通色変数 `--color-txt`、`--color-bg`、`--color-shadow-green` は、`assets/css/main.css` がruntimeでimportしているbackup CSS側にあります。現在の実効値を支える依存が残っているため、backup CSSを直接編集したり、ここから変更を指示したりしないでください。CSS依存解消の作業で正式CSSへ移し、表示維持を確認してから調整入口を整理します。

現時点で `user-settings.css` に共通色の調整変数はありません。色調整はまだ安全な共通設定として公開されていません。

---

## 2. Typography / font size

現在の共通文字サイズ設定は `assets/css/user-settings.css` にあります。

| 調整したい箇所 | 変数 | 用途・注意 |
|---|---|---|
| 本文 | `--type-body-size` | 既存の `--responsive-copy-size` aliasから参照 |
| 見出し2 | `--type-heading-2-size` | `--responsive-heading-2` aliasから参照 |
| 見出し3 | `--type-heading-3-size` | `--responsive-heading-3` aliasから参照 |
| 小見出し | `--type-small-heading-size` | `--responsive-small-heading` aliasから参照 |
| button | `--type-button-size` | 既存の `--button-font-size` aliasから参照 |
| Header / Footerのロゴ | `--type-menu-logo-size` | desktop / mobile共通のlogo selectorへ適用 |
| Header / Footerの補助文字 | `--type-menu-meta-size` | lead、date、link等の共通文字へ適用 |

`clamp()`で画面幅に応じて変化する値は、最小値・中間の計算式・最大値をまとめて確認してください。本文サイズなどを変えるときは、関連するaliasを別々に上書きせず、対応する `--type-*` を確認します。

font familyの `--font-base`、`--font-jp`、`--font-btn` は現在backup CSS側にあります。フォントの変更はHTMLのfont loadと共に監査が必要で、`user-settings.css`から安全に調整できる状態ではありません。

フォームの `.modal-title`、`.modal-close`、`.send-btn` は `user-settings.css` 内の個別指定です。`.modal-btn` は小見出し変数を使います。フォーム文字サイズを調整するときは、この例外も個別に確認してください。

---

## 3. Spacing / section width

TOPとConceptの一部では `--top-section-inline-padding` が使われています。宣言元は `assets/css/top-legacy.css` と `assets/css/concept.css`、Artists領域では `assets/css/top-artists.css` の `--artists-side-padding` がこの値を参照します。これは `user-settings.css` の共通設定ではなく、宣言がページ側に分かれています。最終調整時も、片方だけ変えてページ間にずれを作らないよう、両ページとArtists領域への影響を確認してください。

現時点で全ページ共通のsection width / side padding変数はありません。共通設定に集約する作業はCSS依存解消後の別作業です。

---

## 4. Breakpoints

共通のbreakpoint変数はありません。実際の `@media` を対象stylesheetで確認してください。

- Header / Footer：`assets/css/menu-style.css`
- TOP section / Artists：`assets/css/top-legacy.css`、`assets/css/top-artists.css`、`assets/css/top-sections.css`
- Concept：`assets/css/concept.css`、`assets/css/concept-fv.css`
- Gallery：`assets/css/gallery.css`、`assets/css/gallery-inline.css`、`assets/css/gallery-pc-restore.css`、`assets/css/gallery-category-pc.css`、`assets/css/gallery-label-fix.css`
- Contact form：`assets/css/form.css`

breakpointやmedia queryの移動・統一は、画面の切替範囲を変えるruntime変更です。最終調整用の値として `user-settings.css` へ追加しないでください。

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
| desktop / tablet / mobileのmodalとレイアウト例外 | `assets/css/gallery-inline.css` |
| desktop表示の復元 | `assets/css/gallery-pc-restore.css` |
| desktop category表示 | `assets/css/gallery-category-pc.css` |
| category labelの例外 | `assets/css/gallery-label-fix.css` |
| filter、pagination、modalの動作 | `assets/js/gallery.js` |

modal座標、作品画像の比率、filter・paginationの動作は安全なユーザー設定値として公開されていません。これらを変える必要がある場合は、個別の変更とQAとして扱います。

---

## 7. 現在のユーザー設定範囲と例外

現行の `user-settings.css` で調整用variableとして集約されているのは主にTypographyです。次の値は構造や複数ページへ影響するため、ユーザー設定として公開されるまでは直接変更しないでください。

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

技術cleanupとbackup CSS依存解消で、現在の見た目を維持したまま共通値を整理した後に、最終的な調整対象と安全な入口を再確認します。`READY FOR USER FINAL LAYOUT / SIZE ADJUSTMENT` の引き継ぎ前に、デザイン値を変更しません。

---

## 9. 最終調整の進め方

開始できる状態が明示された後、次の順で調整します。

1. `user-settings.css` にある既存の調整用variableから対象を選ぶ。
2. 変数で扱えないpage-specific exceptionは、該当stylesheetとcascadeを確認してから扱う。
3. Desktop / mobileを含む `QA_CHECKLIST.md` のviewportと項目で確認する。
4. 表示・文章の折り返し・共通Header / Footer・Gallery操作への影響を確認する。
5. 未確認の見た目をPASSにせず、残った例外を引き継ぐ。

HTML、JavaScript、backup CSS、animation、modal geometryの直接変更は、この調整ガイドの範囲外です。

## 10. 今後の移行方針

CSS依存解消とbaseline比較を含む別の技術作業で、次の順に整理します。

1. active backup CSSを正式なassets側へ移す
2. semantic variableを新設
3. 旧変数をaliasとして一時維持
4. 全ページを新変数へ段階移行
5. 表示差分ゼロを確認
6. 旧変数・不要aliasを削除
7. 全カテゴリの安全な調整variableと未集約の例外を確認し、`user-settings.css` を最終調整の入口として引き継げる状態にする

この作業は見た目を変えない技術cleanupとして扱い、表示差分を確認するまではbackupを削除しません。
