# ゆらゆら Official Website Roadmap

## Rule

Evidence first.
見た目だけで判断せず、現状確認 → 実装 → 検証の順で進める。
完了した内容を延々と残さず、現在の次作業が分かる状態を維持する。

## Phase 0 - Governance

- [x] AGENTS.md
- [x] YURAYURA_MASTER_SPEC.md
- [x] SITE_MAP.md
- [x] DESIGN_SYSTEM.md
- [x] QA_CHECKLIST.md
- [x] ROADMAP.md
- [x] AUDIT_LOG.md

## Phase 1 - Baseline / Repository Audit

### Priority 1 — repository / publication truth

完了条件：
- 正式公開routeが確定している
- root HTMLと主要directoryが分類済み
- sitemapとの差分が説明できる
- 削除候補と「削除禁止 / 要確認」が分離されている
- 結果が `SITE_MAP.md` と `AUDIT_LOG.md` に反映されている

この段階ではファイル削除・URL変更・大規模CSS整理を行わない。
- [ ] 現在のGitHub Pages公開source / branch設定を確認
- [ ] 全公開routeを確定
- [ ] sitemap 3URLと実際の公開ページの差分を監査
- [ ] `artist.html` / `gust.html` / `test.html` / `top.html` / `github-manual.html` の参照・公開状態を分類
- [ ] `backups/` / `reports/` の必要性を監査
- [ ] root / assets配下の `.DS_Store` を削除候補として確認
- [ ] source file inventoryを作成

### Priority 2 — visual / runtime baseline
- [ ] TOP baseline 1440 / 390
- [ ] Concept baseline 1440 / 390
- [ ] Gallery baseline 1440 / 390
- [ ] 1440 / 1280 / 1024 / 768 / 430 / 390 / 375で主要layout確認
- [ ] console / resource error
- [ ] horizontal overflow
- [ ] text wrapping
- [ ] header / footer / menu

## Phase 2 - Content / Event Integrity

- [ ] 開催日・曜日・時間を全ページで照合
- [ ] 会場名・住所・アクセスを全ページで照合
- [ ] FAQとAccessの重複情報に矛盾がないか確認
- [ ] 出展者4名の正式表記を確定
- [ ] TOP Artists cardが現在Mizuki繰り返し表示になっている状態を正式データへ更新
- [ ] Gallery作品データを正式作品へ更新
- [ ] artist profileを正式情報へ更新
- [ ] 展示終了後に残す情報 / 変更する情報を事前整理

## Phase 3 - SEO / Discoverability

- [ ] TOP / Concept / Galleryの title / meta / H1 / canonical audit
- [ ] OGP画像・説明audit
- [ ] sitemap audit
- [ ] internal links audit
- [ ] artwork / artist alt audit
- [ ] Event structured dataを可視情報と一致させて検討
- [ ] Gallery / Artist structured data機会を検討
- [ ] Project Site robots.txtの扱いを文書化
- [ ] Search Consoleの必要設定を確認

## Phase 4 - UX / Accessibility

- [ ] TOP情報優先順位
- [ ] 初見ユーザーが「いつ・どこで」を短時間で確認できるか検証
- [ ] FAQ usability
- [ ] Contact form usability
- [ ] Gallery filter usability
- [ ] Gallery modal keyboard / touch
- [ ] focus visible
- [ ] touch target
- [ ] contrast
- [ ] heading hierarchy
- [ ] reduced motion

## Phase 5 - Performance / Motion

- [ ] PageSpeed / Lighthouse baseline Mobile / Desktop
- [ ] Core Web Vitals関連指標を記録
- [ ] Vanta Fog / Three.js負荷監査
- [ ] fog-hole / fog-boundary負荷監査
- [ ] custom cursor負荷監査
- [ ] liquid button負荷監査
- [ ] offscreen / hidden-tab停止
- [ ] image dimensions / format / lazy loading
- [ ] render-blocking resources
- [ ] font loading
- [ ] Before / After比較

### Rule
演出を削ることを目的にしない。
同じ世界観をより軽く実現できる場合のみ置換・最適化する。

## Phase 6 - Pre-event Finalization

開催前：
- [ ] 日付・時間・会場の最終確認
- [ ] 作家・作品情報の最終確認
- [ ] 全リンク
- [ ] form
- [ ] Google Map
- [ ] Instagram
- [ ] OGP
- [ ] Mobile final QA
- [ ] Public deployment verification

開催中：
- [ ] 必要に応じて当日案内
- [ ] 緊急変更があればTOP優先で反映

開催後：
- [ ] 「開催予定」表現を終了状態へ変更
- [ ] archive方針決定
- [ ] 写真・記録追加可否検討
- [ ] 次回開催との情報構造を検討

## Maintenance

- [ ] 不要ファイルを証拠付きで整理
- [ ] CSS overrideの増殖を定期監査
- [ ] cache-busting version表記を整理
- [ ] public links定期確認
- [ ] 作品・作家情報更新時にGallery regression確認

## Next Priority

**Phase 1 - Baseline / Repository Audit**

最初の作業：
現在の公開route、source、legacy / test / backupファイルを正確に分類する。

この分類が終わるまで、大規模なCSS統合・ファイル削除・URL変更は行わない。
