# ゆらゆら CSS Variables Guide

## 目的

このファイルは、最終調整をユーザー自身で行うためのCSS編集ガイド。

最終的には主要な調整値を `assets/css/user-settings.css` に集約する。
それまでは、下記の「現在の場所」を参照して変更する。

---

## 1. 色

現在の基準値は、
`backups/20260912_before_hamburger_menu_fix/main.css`
の `:root` にある。

```css
--color-txt: #303a05;
--color-bg: #f3f3ed;
--color-shadow-green: #3c4606;
```

意味：

| 現在の変数 | 意味 | 将来の分かりやすい名前 |
|---|---|---|
| `--color-txt` | 基本文字色・線色 | `--color-text` |
| `--color-bg` | 基本背景色 | `--color-background` |
| `--color-shadow-green` | Footerなどの濃色 | `--color-footer-background` |

例：

```css
--color-text: #303a05;
--color-background: #f3f3ed;
--color-footer-background: #3c4606;
```

---

## 2. フォント

現在：

```css
--font-base: "Shippori Mincho", serif;
--font-jp: "ab-yuhitsukaisho", "Noto Serif JP", serif;
--font-btn: "Akaya Kanadaka", system-ui;
```

意味：

| 変数 | 用途 |
|---|---|
| `--font-base` | 本文・基本フォント |
| `--font-jp` | ロゴ・和文装飾 |
| `--font-btn` | ボタン等 |

フォント名を変更する場合は、HTML側でそのフォントが読み込まれていることも確認する。

---

## 3. 本文文字サイズ

現在の本文共通サイズは主に：

```css
--responsive-copy-size
```

で管理されている。

現在は画面幅ごとに `clamp()` が設定されているため、
単純に1か所だけ変えると全画面幅へ反映されない場合がある。

### clampの読み方

```css
clamp(12px, calc(1vw + 10px), 14px)
```

は、

- 最小：12px
- 画面幅に応じて変化
- 最大：14px

という意味。

最終調整で文字サイズを固定したい場合は、

```css
--responsive-copy-size: 14px;
```

のようにpxへ変更してよい。

見た目を一定に保ちたい文字サイズはpx優先。

---

## 4. TOP / Conceptの左右余白

現在：

```css
--top-section-inline-padding: 54px;
```

主な場所：
- `assets/css/top-legacy.css`
- `assets/css/concept.css`
- `assets/css/top-artists.css` から参照

この値を変更すると、
TOP / Concept / Artists周辺の左右余白へ影響する。

例：

```css
--top-section-inline-padding: 44px;
```

---

## 5. ボタン文字サイズ

`assets/css/liquid.css`

```css
--button-font-size: clamp(12px, calc(0.45vw + 10.5px), 16px);
```

固定したい場合：

```css
--button-font-size: 14px;
```

---

## 6. スマホHeader / Footer

`assets/css/menu-style.css`

767px以下で以下の変数が使われている。

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

### 例

Headerを画面端から少し離す：

```css
--site-nav-top: 20px;
--site-nav-side: 24px;
```

メニュー文字を大きくする：

```css
--site-nav-meta-size: 14px;
--site-nav-logo-size: 16px;
```

---

## 7. 直接変更しない方がよいもの

最終整理が終わるまでは、以下はユーザー調整対象にしない。

- `z-index`
- `position: fixed / absolute`
- transform
- Gallery modal座標
- Fog / Canvasサイズ計算
- `!important` の追加・削除
- backup CSSへの依存関係
- cache-busting query string

これらは複数ページへ影響する可能性が高い。

---

## 8. 最終的な目標構成

最終整理後は、ユーザーが基本的に次だけ触ればよい構成へ変更する。

`assets/css/user-settings.css`

イメージ：

```css
:root {
  /* ===== 色 ===== */
  --color-text: #303a05;
  --color-background: #f3f3ed;
  --color-footer-background: #3c4606;

  /* ===== フォント ===== */
  --font-body: "Shippori Mincho", serif;
  --font-display: "ab-yuhitsukaisho", "Noto Serif JP", serif;
  --font-button: "Akaya Kanadaka", system-ui;

  /* ===== 文字サイズ ===== */
  --font-body-size: 14px;
  --font-button-size: 14px;

  /* ===== レイアウト ===== */
  --section-side-padding: 54px;

  /* ===== アニメーション ===== */
  --motion-fast: 0.25s;
  --motion-normal: 0.4s;
}
```

既存CSS側はこれらを参照する。

---

## 9. 編集ルール

ユーザーが最後に調整するときは、原則：

1. `user-settings.css` を変更
2. ブラウザで確認
3. 375 / 390 / 430 / 768 / 1024 / 1280 / 1440pxで確認
4. 問題がある場合のみ個別CSSを見る

という流れにする。

## 10. 今後の移行方針

Visual baseline取得後：

1. active backup CSSを正式なassets側へ移す
2. semantic variableを新設
3. 旧変数をaliasとして一時維持
4. 全ページを新変数へ段階移行
5. 表示差分ゼロを確認
6. 旧変数・不要aliasを削除
7. `user-settings.css` をユーザー最終調整の入口にする
