# ゆらゆら QA Checklist

## Current acceptance status

- SEO Formal Apply: `SEO FORMAL APPLY COMPLETE`。これはSEO metadata、index設定、Event structured data、sitemapの正式反映に対する判断であり、サイト全体のruntime QA完了を意味しない。
- Site runtime QA: `SITE RUNTIME QA — PARTIALLY NOT VERIFIED`。未実施のruntime項目をPASSとして扱わない。
- 現在のページ別index状態・canonical・sitemap対象は `SITE_MAP.md` を正本とする。

## 1. Before Change

- [ ] 最新mainを確認
- [ ] 対象URLを確認
- [ ] 対象ファイルと共有依存を確認
- [ ] Before screenshot / baselineを確保
- [ ] `README.md` に記載された参照順で、対象作業の正本を確認

## 2. Source / Publication Integrity

- [ ] 編集対象がCANONICAL sourceである
- [ ] legacy / backupを正本として編集していない
- [ ] sitemap / canonical / internal linkの役割と矛盾しない
- [ ] 同じ展示情報が複数箇所にある場合は値を照合

## 3. Build / Static Integrity

現在は静的サイトとして、少なくとも以下を確認する。

- [ ] HTML parse上の明確な破綻なし
- [ ] CSS / JS 404なし
- [ ] image / font 404なし
- [ ] console errorなし
- [ ] CSPを設定しているページでは、違反とresource failureを確認
- [ ] GitHub Pages public URLで同じ結果

CSPが未設定のページを「CSP検証PASS」とみなさない。runtime項目は変更範囲に応じて確認し、未実施の項目は未確認のまま記録する。

## 4. Required Viewports

重要変更：
- [ ] 1440
- [ ] 1280
- [ ] 1024
- [ ] 768
- [ ] 430
- [ ] 390
- [ ] 375

最低限の軽微変更：
- [ ] 1440
- [ ] 768
- [ ] 390

## 5. Layout

- [ ] horizontal overflowなし
- [ ] 意図しない重なりなし
- [ ] header / menu正常
- [ ] footer正常
- [ ] section間余白正常
- [ ] 日本語の不自然な改行なし
- [ ] button / linkが画面外へ出ない
- [ ] fixed / absolute要素が本文を隠さない

## 6. TOP

- [ ] FVが表示される
- [ ] fog / boundaryが意図通り
- [ ] Concept導線
- [ ] Artist / Gallery導線
- [ ] Contact form
- [ ] FAQ accordion
- [ ] Access
- [ ] Google Map
- [ ] footer

## 7. Concept

- [ ] H1 / heading hierarchy
- [ ] 本文可読性
- [ ] header / footer
- [ ] TOPへ戻れる
- [ ] mobile wrapping

## 8. Gallery

- [ ] Artist filter
- [ ] Genre filter
- [ ] 「すべて」reset
- [ ] result表示
- [ ] artwork cards
- [ ] pagination
- [ ] modal open
- [ ] modal close
- [ ] next / prev
- [ ] image
- [ ] caption
- [ ] artist profile
- [ ] Instagram link
- [ ] keyboard / touch
- [ ] modal中body scroll制御
- [ ] mobileで作品が見切れない

## 9. Contact

本番送信を避け、可能な限りmockで確認する。

- [ ] required fields
- [ ] email validation
- [ ] consent
- [ ] type selection
- [ ] submit loading
- [ ] success
- [ ] error
- [ ] modal close
- [ ] duplicate submit防止

## 10. Event Facts

公開前に再確認：

- [ ] 2026/10/06〜10/12
- [ ] 曜日
- [ ] 会場名
- [ ] 住所
- [ ] 初日時間
- [ ] 通常時間
- [ ] 最終日時間
- [ ] LightUp
- [ ] 交通案内
- [ ] 問い合わせ先
- [ ] 出展者名

## 11. SEO

indexable pageごとに確認する。対象ページ、canonical、noindex、sitemapの正確な対応表は `SITE_MAP.md` を参照する。

- [ ] unique title
- [ ] meta description
- [ ] H1
- [ ] canonical
- [ ] og:title
- [ ] og:description
- [ ] og:url
- [ ] og:image
- [ ] meaningful alt
- [ ] sitemap収録
- [ ] internal incoming link
- [ ] no accidental noindex
- [ ] Event structured dataを使う場合、確認済み開催情報と可視本文に一致

## 12. Accessibility

- [ ] keyboard navigation
- [ ] focus visible
- [ ] button semantics
- [ ] modal semantics
- [ ] form labels
- [ ] color contrast
- [ ] alt
- [ ] decorative alt empty
- [ ] touch target
- [ ] reduced motion

## 13. Motion / Performance

- [ ] animationが操作をブロックしない
- [ ] reduced motion
- [ ] hidden tabで過剰実行しない
- [ ] offscreen heavy animation監査
- [ ] LCP要素確認
- [ ] CLS確認
- [ ] JS long task確認
- [ ] image loading確認
- [ ] mobile performance確認

## 14. After Change

- [ ] Before / Afterを比較
- [ ] 意図した差分だけ
- [ ] regressionなし
- [ ] public deploy確認
- [ ] runtime変更を公開する場合はpublic URLで確認
- [ ] 残課題をlocal reportへ記録し、未確認項目をPASS扱いしない
