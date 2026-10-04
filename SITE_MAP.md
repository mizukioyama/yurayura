# ゆらゆら Site / File Map

この資料は、ページ構成、公開分類、index状態、canonical、sitemap掲載URLの正本。
SEO方針は `YURAYURA_MASTER_SPEC.md`、検証方法は `QA_CHECKLIST.md` を参照する。

## 1. Public Site

Base URL:

`https://mizukioyama.github.io/yurayura/`

Repository: `mizukioyama/yurayura`  
Default branch: `main`

## 2. Page, index, and canonical source of truth

GitHub PagesのrootにあるHTMLは、noindexであってもURLを知る人がアクセスできる。`noindex` は検索index向けの指定であり、認証・アクセス制限ではない。

| Page / source | Purpose | Classification / availability | Index state | Canonical | Sitemap |
|---|---|---|---|---|---|
| TOP / `index.html` | 企画と開催情報の公式入口 | CANONICAL / public | indexable | `https://mizukioyama.github.io/yurayura/` | included |
| Concept / `concept.html` | 企画コンセプトの公式ページ | CANONICAL / public | indexable | `https://mizukioyama.github.io/yurayura/concept.html` | included |
| Gallery / `gallery.html` | 作家と作品の公式ページ | CANONICAL / public | indexable | `https://mizukioyama.github.io/yurayura/gallery.html` | included |
| Site Policy / `policy.html` | 著作権・個人情報・外部サービス等の案内 | CANONICAL / public | indexable | `https://mizukioyama.github.io/yurayura/policy.html` | included |
| `artist.html` | 出展者募集の旧ページ | LEGACY / public URL | `noindex,follow` | not set | excluded |
| `gust.html` | 施術参加者募集の旧ページ | LEGACY / public URL | `noindex,follow` | not set | excluded |
| `github-manual.html` | GitHubコマンドの開発用手順 | DEV_ONLY / public URL | `noindex,follow` | not set | excluded |
| `test.html` | Fog Holeの検証用ページ | DEV_ONLY / public URL | `noindex,follow` | not set | excluded |
| `top.html` | TOPへ転送する旧URL | LEGACY / public redirect | `noindex,follow` | `https://mizukioyama.github.io/yurayura/` | excluded |

正式な検索対象はCANONICALの4ページ。noindex対象や転送URLを正式なサイト導線・indexableページとして扱わない。

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

## 4. Legacy and development pages

Section 2の表がroot HTML全件の公開分類・index状態・canonical・sitemap状態の正本。legacy pageの削除や転送は、公開URLとHTML/CSS/JavaScriptからの参照を別途確認してから判断する。

## 5. Non-page root items

| Path | Classification | Role / action |
|---|---|---|
| `assets/` | SUPPORTING | 本番CSS / JS / images / parts |
| `backups/` | BACKUP | 過去状態はGit履歴から復元する。現行sourceのruntime依存なし |
| `robots.txt` | SUPPORTING | Project Site配下。host-root authoritative robotsではない |
| `sitemap.xml` | SUPPORTING | indexable URLはこの資料の表と一致させる |

## 6. Backup and runtime status

`assets/css/main.css` がcanonical CSSです。tracked tree内のobsolete backup CSSは削除済みで、現行HTML / CSS / JavaScriptのactive backup CSS dependencyは0です。過去状態はGit履歴から復元します。

Public treeへ日付付きsource backupを追加しない。runtime依存が見つかった場合は、backupを削除せず依存を別タスクとして解消する。

## 7. Content and visual structure

各ページの企画・機能上の役割は `YURAYURA_MASTER_SPEC.md`、視覚ルールは `DESIGN_SYSTEM.md`、確認項目は `QA_CHECKLIST.md` を参照する。この資料では本文構成や視覚仕様を重複して定義しない。

## 8. Shared parts

### Header / Footer

`assets/parts/header.html`  
`assets/parts/footer.xml`

`assets/js/allmenu.js` がcanonical pagesへfetchして挿入する。`assets/parts/footer.html` は旧include.js経由のlegacy source。

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

## 9. URL / Path Rule

GitHub Pages Project Siteのbase pathは `/yurayura/`。

absolute pathを使う場合はbase path欠落に注意する。
相対path変更時は、
- root page
- nested path
- GitHub Pages public URL
の3点で確認する。

## 10. Update Rule

ページ追加・削除・rename時は必ず以下を更新する。

- `SITE_MAP.md`
- `sitemap.xml`
- header / footer
- canonical / OGP URL
- internal links

index状態またはcanonicalを変更した場合は、この資料とsitemapの整合を確認する。監査履歴や一時作業計画はこの資料へ蓄積しない。
