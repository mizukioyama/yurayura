# ゆらゆら Official Website Master Specification

## 1. Project

名称：ゆらゆら  
種別：グループ展 / 体感するArt展  
公式Webサイト：`https://mizukioyama.github.io/yurayura/`

## 2. Core Concept

中心となる考え方：

> ゆらぎの間で、理解するのではなく、体感する。

「ゆらゆら」は、作品を説明だけで理解させるのではなく、
作品・空間・時間・光・余白・気配の重なりを、それぞれの感覚で体験してもらう展示企画。

Webサイトも同じ思想を持ち、
情報を伝える機能性と、展示の空気を感じられる体験性を両立する。

## 3. Current Published Event Facts

以下は2026-09-22時点で現行公開ソースに掲載されている情報。
ユーザー確定情報との照合が完了するまでは「掲載中の事実」であり、無条件の正本とは扱わない。

- 開催期間：2026年10月6日（火）〜10月12日（月）
- 会場：Gallery Charlotte.Usagi
- 住所：〒231-0868 神奈川県横浜市中区石川町1丁目19-8
- 通常日：11:30〜20:00
- 初日 10/06：13:00〜20:00
- 最終日 10/12：11:30〜13:00
- LightUp：20:00〜21:00
- JR石川町駅 元町口から徒歩約1分
- みなとみらい線 元町・中華街駅 5番出口・元町口から徒歩約13分

公開前には必ず最新のユーザー確定情報と一致しているか再確認する。

### Fact authority
- ユーザーが明示的に確定した展示情報を最優先する。
- HTML・FAQ・Access・OGP・構造化データに同じ事実が複数存在する場合、すべて一致させる。
- 不一致を見つけた場合は、推測修正ではなく差分として記録する。

## 4. Current Artist Set

現行Gallery UIに表示されている作家カテゴリ：
- Mizuki
- かおる
- 咲
- クリカン

ただし、作品・プロフィール・画像・在廊・販売情報は推測せず、確認済み情報だけ掲載する。

## 5. Website Goals

優先順位：

1. 展示日時・場所・アクセスを迷わず確認できる
2. 「ゆらゆら」のコンセプトを短時間で理解・体感できる
3. 作家と作品へ自然に移動できる
4. 問い合わせ方法が明確
5. モバイルで快適に閲覧できる
6. 視覚演出が情報閲覧を邪魔しない
7. 開催前・開催中・終了後にも再利用できる

## 6. Information Architecture

主要な役割：

### TOP
- 展示の第一印象
- コンセプト導入
- 作家 / 作品への導線
- FAQ
- 問い合わせ
- 会場・アクセス
- 開催情報

### Concept
- 展示思想の詳細
- 「理解する」ではなく「体感する」の背景

### Gallery
- 作家と作品
- Artist / Genre絞り込み
- 作品詳細
- 作家プロフィール
- 問い合わせ導線

追加ページは必要性を確認してから正式公開対象にする。

正式なindexable page setは `SITE_MAP.md` と `sitemap.xml` の一致を監査して確定する。

## 7. Visual Identity

キーワード：
- ゆらぎ
- 静けさ
- 余白
- 気配
- 透明感
- 揺れ
- 光
- 空間
- 体感
- 柔らかい違和感

演出は「目立たせるため」ではなく、展示の空気を伝えるために使用する。

## 8. Current Visual / Technical Characteristics

現行サイトには以下の表現がある。
- Vanta Fog / Three.js
- fog-hole / fog-boundary
- liquid button
- custom cursor
- section animation
- Gallery filter / modal
- FAQ accordion
- Google Maps embed
- Google Apps Script contact form
- Shippori Mincho
- Akaya Kanadaka

これらは一律維持・一律削除ではなく、役割・負荷・アクセシビリティを監査して判断する。

## 9. Responsive Policy

モバイルを別物として軽視しない。
PCの縮小版ではなく、閲覧環境に適した構成を優先する。

基準確認幅：
1440 / 1280 / 1024 / 768 / 430 / 390 / 375px

## 10. Performance Policy

見た目を犠牲にしてPageSpeedの点数だけを上げない。

優先順位：
1. 不要読込の削減
2. offscreen停止 / lazy loading
3. reduced motion
4. 画像適正化
5. JS実行量削減
6. レンダリングブロック削減
7. 必要なビジュアル表現の品質維持

改善は必ずBefore / Afterで比較する。

## 11. SEO / Discoverability

最低限：
- unique title
- meta description
- H1
- canonical
- OGP
- sitemap
- internal links
- meaningful alt
- Event構造化データは可視情報と完全一致させる

注意：
GitHub Pages Project Siteの
`/yurayura/robots.txt`
はhost-root `/robots.txt` ではない。
robots対応のためだけにhost-rootサイトを変更しない。

## 12. Accessibility

- キーボード操作
- focus可視化
- modal focus / close
- FAQ button semantics
- form label
- color contrast
- meaningful alt
- decorative imageは空alt
- reduced motion
- touch target
を確認する。

## 13. Do Not Do

- 既存の見た目を理由なく全面刷新しない
- 未確認の作家情報を追加しない
- SEO目的だけで不自然な文章を追加しない
- アニメーションを増やすこと自体を目的にしない
- バックアップファイルを監査せず削除しない
- 公開URL構造を理由なく変えない

## 14. Long-term Use

2026年展示終了後も、
- archive
- 過去展示
- 次回開催
- 作家・作品記録
へ拡張可能な設計を意識する。

ただし、現時点では将来機能を先回りして複雑化しない。
