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
- The shared page-grain layer is static on Concept, Information, Contact, and Policy; the TOP grain and its loading/Vanta/scroll-guide motion remain page-specific and unchanged.
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
