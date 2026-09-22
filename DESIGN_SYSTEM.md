# ゆらゆら Design System

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
