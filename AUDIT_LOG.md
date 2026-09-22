# ゆらゆら Audit Log

## Purpose

監査で得た事実・証拠・分類・判断理由を記録する。
ROADMAPは「次に何をするか」に集中させ、詳細な調査結果はここへ残す。

## Rules

- 推測を事実として記録しない。
- 日付と対象branchを記録する。
- 公開状態とrepository内の存在を区別する。
- ファイル分類は `CANONICAL / SUPPORTING / LEGACY / DEV_ONLY / BACKUP / UNKNOWN` を使う。
- 削除判断には参照元・公開URL・sitemap・header/footer・GitHub Pagesへの影響確認を伴わせる。
- 未解決事項は `OPEN` と明記する。

---

## 2026-09-22 — Phase 1 baseline audit

Status: IN PROGRESS

Target repository: `mizukioyama/yurayura`  
Target branch: `main`

### Repository / publication findings

- default branch: `main`
- detected branches: `main`, `perf-ui-improvements-20260909`
- rootに `.github/workflows/` や `docs/` は確認されていない
- GitHub Pages設定API自体は現在のconnectorでは取得不可
- したがってPages sourceの「Settings上の exact value」はOPEN
- repository構造と現行Project Site構成から、main/root配信が有力だが、Settings値そのものとは区別する

### Canonical navigation

`sitemap.xml`:
1. `/yurayura/`
2. `/yurayura/concept.html`
3. `/yurayura/gallery.html`

shared header / footer:
- TOP
- CONCEPT
- GALLERY

よってrepository内の正式導線は上記3ページで一致。

### Root HTML classification

| File | Classification | Evidence |
|---|---|---|
| `index.html` | CANONICAL | sitemap + shared nav |
| `concept.html` | CANONICAL | sitemap + shared nav |
| `gallery.html` | CANONICAL | sitemap + shared nav |
| `top.html` | LEGACY redirect | noindex + canonical TOP + immediate redirect |
| `artist.html` | LEGACY candidate | 出展者募集 / no internal refs |
| `gust.html` | LEGACY candidate | 施術参加者募集 / no internal refs |
| `test.html` | DEV_ONLY | Fog Hole test code / no internal refs |
| `github-manual.html` | DEV_ONLY | GitHub command manual / no internal refs |

Repository検索上、`top.html` 以外の非canonical root HTMLには `noindex` が確認されていない。

### Backup findings

`backups/` contains 8 dated directories.

Critical:
`assets/css/main.css` imports:
`../../backups/20260912_before_hamburger_menu_fix/main.css`

Therefore this specific backup CSS is an active runtime dependency and must not be removed yet.

Repository検索で確認できた `../../backups/` runtime referenceは現時点でこの1件。

### Reports

`reports/`:
- `review-report.md`
- `chatgpt-review-package.zip`
- `chatgpt-review-requests.md`
- `known-issues.md`
- `next-actions.md`
- `user-checklist.md`

Total approximately 442KB.

現行runtimeからの参照は確認されず、過去の作業・監査記録として扱う。
新しい `AGENTS.md / ROADMAP.md / AUDIT_LOG.md` と役割が重複するため、後続cleanup候補。ただし今フェーズでは削除しない。

### Repository inventory

- root HTML: 8
- CSS: 19 files / ~98.8KB
- JS: 12 files / ~50.1KB
- images: 26 files + 1 directory / ~54.2MB
- reports: 6 files / ~442KB
- backup directories: 8

Notable large image files:
- `artists-bg.png`: ~19.3MB
- `yurayura_dm.png`: ~10.8MB
- `btn-img.jpg`: ~6.5MB
- `yurayura-dm-bgimg.png`: ~6.2MB

Performance optimization is deferred until baseline measurements are captured.

### Cleanup candidates identified, not deleted

- root `.DS_Store`
- `assets/.DS_Store`
- DEV_ONLY root HTML
- LEGACY recruitment pages
- historical reports
- unused backup snapshots

### OPEN

1. GitHub Pages Settingsのexact source / branch / folderを独立確認
2. orphan root HTMLの実公開HTTP状態を確認
3. visual baseline 1440 / 390
4. seven-viewport runtime/layout baseline
5. active backup CSS dependencyを解消する前のvisual regression evidence

### Next

Phase 1 Priority 2:
visual / runtime baselineを取得し、その後にactive backup CSS dependency解消を安全に行う。


---

## 2026-09-22 — Phase 1 Priority 2 static runtime baseline

Status: STARTED

### TOP / `index.html`

- CSS references: 10
- JS references: 10
- Three.js CDN + Vanta Fog CDN are loaded
- `fog-hole` canvas is present
- local animation/runtime includes FV animation, fog-hole, liquid button, custom/shared menu behavior
- main background uses `bg-img.webp`
- Artists background uses `artists-bg.webp`
- canonical HTML itself does not contain a `prefers-reduced-motion` guard
- Google Map iframe uses lazy loading

### Concept / `concept.html`

- CSS references: 8
- JS references: 7
- Three.js CDN + Vanta Fog CDN are loaded
- `fog-hole` canvas is present
- canonical HTML itself does not contain a `prefers-reduced-motion` guard
- artwork images are referenced from the page

### Gallery / `gallery.html`

- CSS references: 9
- JS references: 3
- no Three.js / Vanta CDN on this page
- no canvas in the canonical HTML
- 4 current artwork card image references
- Gallery-specific CSS is split across 5 files in addition to shared CSS
- card images in the current HTML do not use `loading="lazy"`
- canonical HTML itself does not contain a `prefers-reduced-motion` guard

### Baseline implications

1. TOP / Concept are the motion-heavy canonical pages.
2. Gallery is lighter in JS but has fragmented CSS and image-loading opportunities.
3. `assets/css/main.css` remains coupled to a backup CSS file; do not normalize it before visual evidence exists.
4. reduced-motion support must be audited in external CSS/JS before concluding it is absent globally.
5. Visual screenshots / runtime measurements remain OPEN because the current connector cannot execute the site in a browser.

### Next execution step

Capture 1440px and 390px screenshots for TOP / Concept / Gallery and record:
- horizontal overflow
- console errors
- resource errors
- header/footer/menu state
- text wrapping
- animation state
- Gallery filter/modal state

After the baseline exists, normalize the active backup CSS dependency before any broad cleanup.
