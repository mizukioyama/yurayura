# ゆらゆら Design System

この資料は視覚・レイアウト・animationのルールを定める。企画目的・機能仕様は `YURAYURA_MASTER_SPEC.md` を正本とし、ここでは重複して定義しない。

## 1. Design Principle

ゆらゆらのデザインは、
「見せる」より「感じてもらう」ことを重視する。

キーワード：
- ゆらぎ
- 余白
- 静けさ
- 空気
- 光
- 重なり
- 透明感
- 柔らかな動き

装飾を増やすより、情報と空気のバランスを整える。

## 2. Typography

現行主要フォント：
- Shippori Mincho
- Akaya Kanadaka

### Rules
- 本文の可読性を最優先する。
- 長文で装飾書体を多用しない。
- 固定した見た目を維持したい文字サイズ・字間はpx基準を優先。
- responsive typographyは `clamp(px, calc(... + vw), px)` のように上下限を持たせる。
- 行間は本文量に合わせ、狭くしすぎない。
- 日本語の不自然な1文字改行を避ける。

## 3. Layout

- 大きな余白を世界観の一部として扱う。
- sectionごとの役割を明確にする。
- desktopの位置関係をmobileへそのまま縮小しない。
- 横スクロールはGalleryの意図したfilter UIなどを除き発生させない。

確認幅：
1440 / 1280 / 1024 / 768 / 430 / 390 / 375px

## 4. Color / Surface

既存サイトの色・背景を正本として扱い、色を変える場合はページ全体の関係を確認する。

背景画像、霧、半透明レイヤー、ノイズ等を重ねすぎて本文コントラストを下げない。

### Current background system
- Base paper color: `--color-bg` (`#f3f3ed`). Keep page backgrounds transparent where they should reveal the shared body grain.
- Shared grain uses the existing inline fractal-noise layer. On Concept, Information, Contact, and Policy it is static at 3.5% opacity; TOP retains its existing animated treatment and Gallery retains its existing page behavior.
- Use a restrained tint from the existing olive text color only for meaningful information surfaces, such as archived exhibition records and the contact form section. Do not alternate section backgrounds mechanically.
- Keep form controls and artwork cards on their established opaque surfaces.

## 4.1 Responsive content rhythm
- Keep Concept's full-height FV as the visual reference.
- Information and Contact use a shorter viewport-aware FV so the next content begins sooner; the title position remains aligned to the shared title rule.
- Preserve broad horizontal padding and calm section spacing, while using bounded `clamp()` values rather than oversized fixed spacers.
- The Policy body remains a long-form reading column; its copy stays left-aligned even when its section label uses the shared heading treatment.

## 4.2 Typography scale
- Keep `Shippori Mincho` for the primary text and `Akaya Kanadaka` for the existing decorative roles.
- Current responsive settings: body 15–16px, heading level 2 20–30px, heading level 3 15–21px, small headings and buttons 13–16px across 375–1440px.
- Preserve semantic hierarchy and line-height/letter-spacing rules; do not enlarge text by changing isolated selectors.

## 5. Motion

### Purpose
アニメーションは以下の目的のいずれかを持つこと。
- 展示の空気を伝える
- 視線誘導
- 状態変化
- 操作feedback
- section transition

### Current motion vocabulary
- Fog
- fog-hole
- loading boundary
- liquid button
- custom cursor
- scroll / section appearance
- Gallery modal / filter

### Rules
- 同じ領域に複数の重いアニメーションを重ねない。
- WebGL / Canvasは必要性を説明できる場合だけ使用。
- offscreen時は可能なら停止する。
- `visibilitychange` を考慮する。
- `prefers-reduced-motion: reduce` を尊重する。
- Shared body paper is a static micro-fiber WebP displayed as a512 CSS pixel tile; animated grain is disabled across pages. Fog/Vanta/loading retain their existing motion.
- mobileでは負荷を下げても世界観が保てる設計を優先する。
- animationがLCP / CLS / INP / scrollを悪化させないことを確認する。

## 6. Images

- 作品画像の色・質感を壊す過圧縮は禁止。
- 表示サイズより極端に大きい画像を送らない。
- thumbnailとdetailを分ける価値がある場合は用途別assetを検討。
- WebP / AVIFは画質比較後に採用。
- below-the-foldはlazy loadingを基本候補とする。
- width / heightまたはaspect-ratioでlayout shiftを防ぐ。
- 装飾画像は `alt=""`。
- 作品・作家画像は意味のあるaltを設定。

## 7. Buttons / Interaction

Liquid Buttonを含め、
- hoverだけで意味を伝えない
- keyboard focusを確認
- touch targetを十分確保
- active / disabled / loading状態が必要な場合は視覚化
する。

## 8. Header / Footer

header / footerは共有部品として扱う。
一ページだけ個別修正して差異を作らない。

変更時は主要全ページで確認する。

## 9. Gallery

Galleryは作品閲覧を主役にする。

- filterは分かりやすく
- cardの画像比率を不用意に変えない
- modalで作品が小さくなりすぎない
- profile情報と作品情報を混同しない
- mobile touch操作を確認
- filter変更後の件数・表示状態を確認

## 10. Accessibility

最低限：
- focus visible
- semantic heading
- button / link区別
- dialog semantics
- keyboard close
- ESC close（対応可能なmodal）
- form label
- contrast
- reduced motion

## 11. CSS / Override Policy

- 共通ルールは可能な限り共有CSSへ置く。
- ページ固有差分はページスコープを付ける。
- `!important`、日時入りcache-busting、後置きoverrideを増やす前に既存cascadeを確認する。
- 同じプロパティの上書きを新しいCSSファイルで積み重ねる方法を常態化させない。
- レイアウト修正時は「正しいsource」を先に特定し、生成物・旧backup・legacy CSSを直接正本扱いしない。

## 12. Design Change Gate

大きなビジュアル変更を行う前に、
1. 現在のスクリーンショット
2. 変更目的
3. 変更後スクリーンショット
4. desktop / mobile比較
を残す。

「新しい方が派手」という理由だけで採用しない。


## 13. User-editable variables

最終調整でユーザーが直接変更する値は、
原則 `assets/css/user-settings.css` に集約する。

カテゴリ：
- Color
- Typography
- Font size
- Section spacing
- Header / Footer
- Button
- Safe motion duration

構造を壊しやすい `position`、`z-index`、transform、modal geometry等は
user settingsへ安易に公開しない。

詳細は `CSS_VARIABLES_GUIDE.md` を参照。

## Participation components
Conceptの参加導線は2列×2段のリンクカード。`participation.css` が参加ページ共通の読み幅・余白・カード・detailsを管理する。44pxのmobile余白、110pxのtablet余白を基準とし、359px以下は24pxへ縮める。既存FV・Gallery形状・3.2秒演出は既存sourceを維持する。

モバイルメニューは主要5リンクと参加関連4リンクをまとめ、関連リンクは2列で表示する。短い画面では縦スクロールで全リンクに到達できる。開くときの短いfadeはreduced-motionで無効。PCの主要ナビゲーション配置とFVは維持。

共通Headerのfetch挿入前から最小領域を確保し、初期レイアウト移動を防ぐ。TOPのScrollは計算位置確定後に表示する。FV本体の高さ、Scrollの最終計算ルールと3.2秒の流れは維持する。

## Phase 2 visual refinements
TOPのH1はHeader領域を差し引き、dynamic viewport中央へ置く。短い画面はTypography変数のcompact scaleを使用。ScrollはFV内の下端24pxとsafe-areaを守り、既存scrollGuideFlow 3.2秒を維持する。
参加カードは既存2×2を維持し、オリジナルSVG4点（支援・会場・参加・プロフィール）を5:3の共通枠で表示する。画像は装飾扱い、alt空、寸法指定とlazy読み込み。Artist作品は使用しない。カード面だけ静止した継ぎ目対応のpaper-fiber SVGを使用し、body・Gallery・既存FV背景は維持する。hover/focus時のみ2pxの移動とopacity変化を使用し、reduced-motionでは移動を無効化する。新しい固定layout寸法は偶数pxを基本とする。

Headerのメニューボタンは本文のmobile/tablet gutterに揃え、Header予約領域の垂直中央へ置く。ブランドリンクの44px hit領域は疑似要素で確保し、Header高さを増やさない。Footer主要リンクはブランドと同じ左端へ揃える。

TOPのFVラッパーだけ共通revealの10px移動を抑制し、開始時も中央を維持する。既存のopacity fadeとFog/Vanta/Scroll、他セクションのreveal移動は維持する。

## Shared Scroll / paper / menu refinement

`visual-shared.css` owns Concept-derived Scroll horizontal axes: PC 20vmin, intermediate 10vw, mobile 22px. Text remains vertical with 0.4rem tracking, 1px line and 6px gap; duration remains3.2s. Desktop editorial guides share FV bottom0; Information/Contact use the same100svh desktop frame as Concept to keep the left guide clear of titles. Compact editorial guides share a title/subtitle-aware bounded rule, retaining the shared line length by reserving a640px compact reading frame (tablet at least100svh). Extremely constrained views can still shorten the line as a safety fallback. TOP retains its viewport-center title and shared bottom0px desktop /8px compact (safe-area priority) with the same shared guide length; Gallery retains its CSS hero geometry and hidden PC guide. No additional guides are added to pages without them.

The menu uses two20px lines crossing at±45deg at the exact button center, with a240ms transform and160ms fade; existing44/48px circles, focus, Escape, inert and scroll lock remain. Static original washi-micro.webp uses fine fibers and particles at shared opacity0.34, preserves the ivory fallback, and replaces the animated SVG noise filter. Artist images, card SVGs, existing Fog/Vanta and card/section interactions remain unchanged. Reduced motion stops guide movement and menu/card transitions.

Outside the low-landscape override, compact tablet Concept frames retain their640px minimum. Low landscape viewports use the height-bounded frame described below.

## Low landscape FV and micro paper

The portrait and regular desktop rules stay unchanged. Only `(orientation: landscape) and (max-height: 720px)` uses the available viewport height minus the reserved Header. The editorial 640px minimum is suspended in this mode. H1 and subtitles share a title column to the right of the existing Concept Scroll axis; Gallery's event links occupy a separate row below its H1. Gallery PC rules (1200px+) remain unchanged, including its hidden Scroll.

The complete Scroll group is anchored12px above the available viewport end, with safe-area padding. Its static parent translateY(-100%) accounts for the actual label and bar height. The140/280px bar remains preferred; only insufficient height causes an even-pixel shortening based on measured Header/label/safe-area dimensions. Resize, orientation media changes, fonts.ready and visualViewport.resize update the size through a requestAnimationFrame scheduler. visualViewport scale changes from pinch zoom do not trigger layout shrinkage. TOP keeps its viewport center and3.2s guide animation; short landscape title/copy scales are owned by user-settings.css and explicit line breaks remain intact.

Body uses the static1024px washi-micro.webp at the existing512 CSS pixel repeat size/opacity/ivory fallback. It contains only0.5–2.6 CSS pixel straight fibers and micro-particles, not visible curved line art. Runtime WebP is21,132bytes. The procedural SVG comparison source and generation/validation scripts remain in the local review package. The old washi-body.svg is retained but no longer referenced by body. Card SVGs/paper, Artist artwork, Fog/Vanta and other motion are unchanged.
