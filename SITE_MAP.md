# ゆらゆら Site / File Map

## 1. Public Site

Base URL:

`https://mizukioyama.github.io/yurayura/`

Repository: `mizukioyama/yurayura`  
Default branch: `main`

## 2. Canonical page set

2026-09-22のPhase 1 repository監査で、現行の正式導線として確認できたページ：

| Status | Page | Source | Public URL | Evidence |
|---|---|---|---|---|
| CANONICAL | TOP | `index.html` | `/yurayura/` | sitemap / header / footer |
| CANONICAL | Concept | `concept.html` | `/yurayura/concept.html` | sitemap / header / footer |
| CANONICAL | Gallery | `gallery.html` | `/yurayura/gallery.html` | sitemap / header / footer |

header / footerはこの3ページだけを主要ナビゲーションとしている。

## 3. Classification

| Status | Meaning |
|---|---|
| CANONICAL | 正式な公開・編集対象 |
| SUPPORTING | 正式ページを支えるasset / component |
| LEGACY | 旧ページ・旧実装 |
| DEV_ONLY | 開発・検証専用 |
| BACKUP | バックアップ |
| UNKNOWN | 証拠不足・要確認 |

UNKNOWNは削除しない。

## 4. Other root HTML files

| File | Classification | Evidence / action |
|---|---|---|
| `artist.html` | LEGACY candidate | titleは「出展者募集」。sitemap・header・footer・現行HTMLから内部参照なし。削除/redirectは公開URL確認後 |
| `gust.html` | LEGACY candidate | titleは「施術参加者募集」。sitemap・header・footer・現行HTMLから内部参照なし。削除/redirectは公開URL確認後 |
| `top.html` | LEGACY redirect | `noindex,follow`、canonicalはTOP、即時 `./` redirect |
| `test.html` | DEV_ONLY | Fog Hole試作用コード。内部参照なし |
| `github-manual.html` | DEV_ONLY | GitHubコマンド手順ページ。公式サイト機能ではなく内部参照なし |

`top.html` 以外の上記HTMLではrepository検索上 `noindex` を確認できない。
GitHub Pagesの配信sourceがmain/rootである場合、URLを直接知っている利用者・crawlerから到達可能な可能性があるため、後続SEO/cleanupで扱う。

## 5. Non-page root items

| Path | Classification | Role / action |
|---|---|---|
| `assets/` | SUPPORTING | 本番CSS / JS / images / parts |
| `backups/` | BACKUP + SUPPORTING混在 | 原則backup。ただし現役依存あり。下記参照 |
| `reports/` | DEV_ONLY / historical | 旧監査資料6件、約442KB。runtime参照なし |
| `README.md` | DEV_ONLY documentation | 最小説明 |
| `memo.md` | LEGACY documentation | 旧pushメモ |
| `robots.txt` | SUPPORTING | Project Site配下。host-root authoritative robotsではない |
| `sitemap.xml` | SUPPORTING | canonical 3URL |
| root `.DS_Store` | cleanup candidate | OS metadata |
| `assets/.DS_Store` | cleanup candidate | OS metadata |

## 6. Critical active backup dependency

`assets/css/main.css` の先頭で次を読み込んでいる：

`@import url("../../backups/20260912_before_hamburger_menu_fix/main.css");`

そのため、
`backups/20260912_before_hamburger_menu_fix/main.css`
は名前上はbackupでも、現在は **SUPPORTING / runtime dependency**。

同directory内の他ファイルまで現役とは限らない。
この依存をcanonical CSSへ移すまでは、当該directoryを削除しない。

他の `../../backups/` runtime参照はrepository検索では確認されていない。

## 7. Repository inventory snapshot

2026-09-22時点：

- root HTML: 8 files
- root directories: `assets/`, `backups/`, `reports/`
- `assets/css/`: 19 CSS files / 約98.8KB
- `assets/js/`: 12 JS files / 約50.1KB
- `assets/img/`: 26 files + 1 directory / 約54.2MB
- `backups/`: 8 backup directories
- `reports/`: 6 files / 約442KB
- branches: `main`, `perf-ui-improvements-20260909`

画像領域は容量が大きく、Phase 5 performance auditの主要対象。

## 8. Shared parts

### Header / Footer

`assets/parts/header.html`  
`assets/parts/footer.html`

`assets/js/allmenu.js` がfetchして挿入する。

正式ナビゲーション：
- TOP
- CONCEPT
- GALLERY

### CSS
`assets/css/`

TOPの主な構成：
- `reset.css`
- `menu-style.css`
- `main.css`
- `concept.css`
- `top-legacy.css`
- `top-artists.css`
- `form.css`
- `liquid.css`
- `fog-hole.css`
- `fv-animation.css`

Galleryは複数のGallery専用CSSを追加読込している。
統合前にcascade / override順を監査する。

### JavaScript
`assets/js/`

主な機能：
- shared menu / footer
- FV animation
- fog-hole
- liquid button
- Gallery filter / modal
- FAQ
- form
- custom cursor / typography

TOP CDN：
- Three.js r134
- Vanta Fog

## 9. TOP section map

1. Header
2. Fog / FV
3. Concept
4. Artists
5. Contact
6. FAQ
7. Access
8. Footer

## 10. Gallery map

- H1 Gallery
- 作家と作品
- Artist filter
- Genre filter
- artwork cards
- pagination
- artwork modal
- artist profile
- contact / Instagram
- footer

Galleryの作品データ更新では、
表示カード・filter値・modal内容・alt・プロフィールをセットで確認する。

## 11. URL / Path Rule

GitHub Pages Project Siteのbase pathは `/yurayura/`。

absolute pathを使う場合はbase path欠落に注意する。
相対path変更時は、
- root page
- nested path
- GitHub Pages public URL
の3点で確認する。

## 12. Update Rule

ページ追加・削除・rename時は必ず以下を更新する。

- `SITE_MAP.md`
- `sitemap.xml`
- header / footer
- canonical / OGP URL
- internal links
- `AUDIT_LOG.md`（監査を伴う場合）
- `ROADMAP.md`（必要な場合）
