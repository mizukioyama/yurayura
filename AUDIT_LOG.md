# ゆらゆら Audit Log

## Purpose

監査で得た事実・証拠・分類・判断理由を記録する。
ROADMAPは「次に何をするか」に集中させ、詳細な調査結果はここへ残す。

## Rules

- 推測を事実として記録しない。
- 日付と対象commit / branchを記録する。
- 公開状態とrepository内の存在を区別する。
- ファイル分類は `CANONICAL / SUPPORTING / LEGACY / DEV_ONLY / BACKUP / UNKNOWN` を使う。
- 削除判断には参照元・公開URL・sitemap・header/footer・GitHub Pagesへの影響確認を伴わせる。
- 未解決事項は `OPEN` と明記する。

---

## 2026-09-22 — Phase 1 baseline audit

Status: IN PROGRESS

Target repository: `mizukioyama/yurayura`  
Target branch: `main`

### Scope

- GitHub Pages publication source / routes
- root HTML classification
- sitemapとの差分
- backups / reports
- .DS_Store
- source / asset inventory

### Findings

監査開始後に追記する。
