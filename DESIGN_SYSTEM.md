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
- Shared paper uses a static micro-fiber WebP. The body and opaque Vanta background stack share the same image, scale and opacity; no texture layer is placed over text or artwork.
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

The menu uses two20px lines crossing at±45deg at the exact button center, with a240ms transform and160ms fade; existing44/48px circles, focus, Escape, inert and scroll lock remain. Phase5 static original washi-micro.webp used fine fibers and particles at shared opacity0.34, preserves the ivory fallback, and replaces the animated SVG noise filter. Artist images, card SVGs, existing Fog/Vanta and card/section interactions remain unchanged. Reduced motion stops guide movement and menu/card transitions.

Outside the low-landscape override, compact tablet Concept frames retain their640px minimum. Low landscape viewports use the height-bounded frame described below.

## Low landscape FV and micro paper

The portrait and regular desktop rules stay unchanged. Only `(orientation: landscape) and (max-height: 720px)` uses the available viewport height minus the reserved Header. The editorial 640px minimum is suspended in this mode. H1 and subtitles share a title column to the right of the existing Concept Scroll axis; Gallery's event links occupy a separate row below its H1. Gallery PC rules (1200px+) remain unchanged, including its hidden Scroll.

The complete Scroll group is anchored12px above the available viewport end, with safe-area padding. Its static parent translateY(-100%) accounts for the actual label and bar height. The140/280px bar remains preferred; only insufficient height causes an even-pixel shortening based on measured Header/label/safe-area dimensions. Resize, orientation media changes, fonts.ready and visualViewport.resize update the size through a requestAnimationFrame scheduler. visualViewport scale changes from pinch zoom do not trigger layout shrinkage. TOP keeps its viewport center and3.2s guide animation; short landscape title/copy scales are owned by user-settings.css and explicit line breaks remain intact.

Phase5 used the static1024px washi-micro.webp at512 CSS pixel repeat size/opacity/ivory fallback; Phase6 below supersedes size/opacity. At the Phase5 half scale it contained0.5–2.6 CSS pixel straight fibers and micro-particles (Phase6 native scale doubles these lengths), not visible curved line art. Runtime WebP is21,132bytes. The procedural SVG comparison source and generation/validation scripts remain in the local review package. The old washi-body.svg is retained but no longer referenced by body. Card SVGs/paper, Artist artwork, Fog/Vanta and other motion are unchanged.

## Phase 6: paper visibility and reading rhythm

Phase6 used the previous1024px WebP at native1024 CSS px and opacity0.6; Phase7 below supersedes this material and density. Body paper was attenuated by the opaque-color Vanta surface (wrapper opacity0.52/0.6) on TOP/Concept; a shared static ::after inside .vanta-wrap restores it without moving the canvas or covering artwork. Other pages retain their body layer. No new texture download or animated grain is added.

Spacing tokens in visual-shared.css:8/16/24/32/48/64/96px. Participation components use these for card padding, image/text rhythm, grid gap and related-navigation spacing. Existing mobile44px and tablet110px gutters remain per side (88/220px combined); no new interpretation is imposed on other layouts. Under360px, participation cards use one column to protect title readability. Related navigation uses32px vertical padding instead of another full64/96px section on each side.

Reuse the existing slide.js IntersectionObserver reveal, with20px movement,800ms ease-out and100ms two-card stagger. Extend it to participation and editorial headings; avoid nested targets. Existing FV targets keep their transforms, TOP H1 remains stationary and centered, Fog/Vanta and3.2s guide stay unchanged. No JS/reduced-motion means content remains visible; touch does not depend on hover. Card-image feedback moves4px on fine-pointer hover or keyboard focus. Paper is always static.

## Phase 7: tactile paper, navigation and mobile type

Paper is now original washi-grain.webp,512×512 lossless WebP78,008bytes, containing dense low-contrast grain and650 short0.8–3px fibers. Shared opacity0.72 and native512px tile preserve ivory. Periodic noise filtering and wrapped fibers avoid a seam; no salient curves or animated grain. The earlier micro material had only about1.3% changed pixels in a representative blank region and a mean RGB difference near0.06/255, even though the layer was present. Diagnostic high-contrast backgrounds prove the layer is painted; opacity/order alone cannot add the missing surface density. Retain the old asset for recovery. Body/Vanta background stack, Footer and open menu use the same paper. No paper is overlaid on artwork, controls or text. Actual Android perceptual acceptance remains separate.

Desktop Header: content max1200px, navigation560px/5 equal columns,16px gap. Mobile/tablet panel: shared352px column,24px edge padding,8px row gap,48px main links/44px sublinks and safe, independently scrolling low-height panel. Existing44/48px close circle,20px±45deg lines and Escape/inert/focus/scroll lock remain unchanged. Existing page gutters are preserved.

Below768px: body14.25px, editorial H1 is92% of its original scale, H2/H3 about92.5/95% of original shared roles; TOP decorative H2 uses its own compact feature-role scale. TOP H1 and small metadata remain unchanged. Native form inputs keep16px. Role variables and semantic aliases remain in user-settings.css. Reading paragraphs use20px spacing and participation H2 uses24px bottom spacing. Desktop/tablet typography stays on the original scale.

Keep20px/800ms reveal and4px card-image feedback. Interaction duration180ms is shared. Fine-pointer hover is separate from keyboard focus, transient active feedback and persistent selected/current state. Preserve card paper on hover by changing only background-color. Liquid buttons also gate hover to fine pointers, keep44px minimum hit area, use contrasting focus outlines and disable transforms/transitions under reduced motion, including their Shadow DOM. No extra reveal observer or animation library.

Phase7 network refinement: main.css paper fallback uses the same grain image/opacity as the shared layer. A fresh-context trace reproduced an intermittent request for both old and new paper due to CSS application timing; the matching fallback removes that redundant old-image request. No artwork or Vanta setting is changed.

### TOP lower heading and participation card feedback (2026-10-22)
TOP's WITH YURAYURA eyebrow is centered directly above its Japanese H2 with16px separation and32px to the card grid; this rule is scoped to the TOP paths section. Participation cards lift as a complete surface using individual translate(-8px vertically) and a soft shadow over500ms; active uses-2px and a smaller shadow. The independent transform retains20px/800ms scroll reveal. Fine-pointer hover, keyboard focus and transient touch active remain separate; reduced motion disables displacement/transitions. Static card paper/SVGs and body washi-grain.webp remain unchanged. Unreferenced noise.css (liner mask/open-props) and liquid-button Shadow DOM's CSS-generated dotted overlay are removed; no noise-only bitmap was present. Fog/Vanta procedural noise and legitimate border masks remain part of their protected effects.


### TOP content and ordinary text-link feedback (2026-10-22)
TOP follows About → Concept → Information → Gallery → WITH YURAYURA. The independent join-title recruitment section is removed; the participate.html page, stopped-application notice and shared navigation remain. Only TOP's card label changes to「参加について」. Its event copy identifies Iwate/Tochigi as candidates under consideration, with dates/venue undecided. TOP Gallery follows content height with64px bottom spacing; the next section starts64px later (48px on mobile).
Participation card hover/focus now uses680ms at-8px, active120ms at-2px, while reveal remains20px/800ms. Ordinary prose/path-action/FAQ/footer text links use fragment-cloned background underlines (350ms) and color feedback (250ms); no geometry change or extra DOM. Fine-pointer hover is separate from focus and touch; reduced motion switches instantly. Footer feedback retains a light color on its dark surface. Liquid buttons, cards, menu controls, Gallery filters and modal buttons keep their individual designs.

## Phase 8: viewport-distance Header and participation reading frame

Header keeps its existing100% width, inner max width, reserved async height, palette and typography. The loaded .header is fixed at viewport top inside #js-header's unchanged flow placeholder. At >=1200px it hides for scrollY >= settled viewport height*0.70; below1200px the ratio is0.80. Direction does not override this absolute threshold. The280ms transform/opacity transition is disabled for reduced motion. Hidden Header is inert/aria-hidden; if it owns focus, focus moves to main without scrolling and a temporary tabindex is restored on blur. Open menu always takes precedence, and close re-evaluates after scroll restoration.

allmenu.js initializes the controller immediately after Header fragment injection. One passive scroll listener schedules one requestAnimationFrame; pageshow/popstate/hashchange/load re-evaluate restored positions. Width changes commit viewport dimensions immediately; height-only/visualViewport changes settle for180ms to avoid address-bar jitter. At normal scale use min(innerHeight,visualViewport.height); at pinch zoom use innerHeight. No70vw/80vw layout rule exists.

Brand is one row「ゆらゆら - 体感するArt展」with original logo/meta font roles and4px gaps; Footer branding is unchanged. Header text uses the same350ms underline/250ms color/easing as Footer, with palette-specific colors, persistent current state and fine-pointer/focus/reduced-motion rules. Subnavigation underline belongs to its text span, not its full tap target. Existing close geometry and full-height menu remain.

Only participate-page owns its regular desktop/tablet hero override: min-height100svh minus the reserved Header; title block has no generic inset/padding duplication. Low landscape720px or less continues the shared compact rules. Seven native details cards expose confirmed facts versus undecided conditions, with64px summaries and no application form. Concept's original statement text is unchanged; paragraph grouping and24px spacing improve reading. Artworks, static paper, FV effects and Gallery behavior remain protected.


## Phase 9: more visible static washi (2026-10-22)

The Phase 7 grain layer was present but visually faint because the source texture uses low alpha values; the shared opacity (0.72), 512×512 repeat, layer order and Vanta wrapper remain unchanged. The selected B variant raises mean alpha by about 46% using a nonlinear tone curve while preserving the ivory base and the existing fiber pattern. The actual-page comparison at 390px and desktop showed B gives the paper texture a readable presence without competing with copy or artwork; A remained too subtle. The shared `--paper-image` still feeds body, Vanta, Footer and open menu, and `main.css` keeps the same fallback. No CSS, animation, layout, menu, Gallery or participation behavior changed. The updated 512×512 WebP is 97,426 bytes (19,418 bytes, or 24.9%, above the previous 78,008-byte asset); Android-device acceptance and browser LCP/CLS measurements remain separate checks.

### Non-TOP FVの共通編集

正式な非TOPページのFV配置は `assets/css/concept-fv.css` を正本とする。
`.fv.page-fv` の直下に `.fv__inner.page-fv__inner`、その中に
`.fv__ttl.page-fv__title` と `.fv__txt.page-fv__subtitle` を置き、Scrollを兄弟にする。
`section` / `header` と `aria-labelledby` はページの意味に合わせて維持する。

- `page-fv--concept`：Conceptの背景演出とスマホの読み始め位置を維持。
- `page-fv--reading`：Information / Contact / Policy / Profile / Exhibitions / Venues / Support / Participateの読み物用フレーム。
- `page-fv--participate`：Header予約高を差し引く既存の参加ページ例外。
- Galleryは `main.gallery.page-fv--gallery` 内に作品一覧も含む。共通のタイトル用クラスを使うが、独立したFVラッパーを追加せず、Gallery専用CSSの配置とPC Scroll非表示を維持する。

共通FVのCSSは各ページの最後に読み込む。Typographyの数値は引き続き
`user-settings.css` の既存トークン、Scrollの3.2秒アニメーションは `main.css`、
全体のScroll変数と低い横画面の共通座標は `visual-shared.css` が所有する。
`allmenu.js` は `.page-fv` のタイトル・副題と使用可能な領域を測定する。
TOPおよび開発・旧ページはこの編集契約の対象外。配置変更時は指定幅、横画面、
通常モーションとReduced Motionで変更前後を比較する。
