# ゆらゆら Site / File Map

## 1. Public Site

Base URL:

`https://mizukioyama.github.io/yurayura/`

## 2. Confirmed sitemap URLs

現行 `sitemap.xml` に含まれるURL：

| Page | Source | Public URL | Current role |
|---|---|---|---|
| TOP | `index.html` | `/yurayura/` | 展示概要・導線・FAQ・Contact・Access |
| Concept | `concept.html` | `/yurayura/concept.html` | 展示コンセプト |
| Gallery | `gallery.html` | `/yurayura/gallery.html` | 作家・作品 |

この3URLは現行 `sitemap.xml` 上のindexable候補。
Phase 1監査でcanonical・内部リンク・公開状態を照合して正式setを確定するまでは「暫定」とする。

## 3. Classification

監査では以下の分類を使用する。

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

以下は現在リポジトリに存在するが、現行sitemapには含まれていない。

| File | Observed purpose | Status |
|---|---|---|
| `artist.html` | 作家関連ページ | 要監査。正式公開対象か確認 |
| `gust.html` | 募集系ページ | legacy / status要確認 |
| `github-manual.html` | GitHub操作マニュアル | 開発資料候補。公開必要性を監査 |
| `test.html` | test | 開発用候補。参照確認後に整理 |
| `top.html` | 小規模な旧TOP候補 | legacy候補。参照確認後に整理 |

削除・redirect・noindex判断はリンク参照と公開状態を確認してから行う。

## 5. Non-page root items

| Path | Role / action |
|---|---|
| `assets/` | 本番CSS / JS / images / parts |
| `backups/` | バックアップ候補。監査前削除禁止 |
| `reports/` | 過去監査資料候補。必要性を監査 |
| `README.md` | 現在は最小説明 |
| `memo.md` | 旧pushメモ。将来整理候補 |
| `robots.txt` | Project Site配下のためhost-root authoritative robotsではない |
| `sitemap.xml` | 現在3URL |
| `.DS_Store` | 不要候補 |
| `assets/.DS_Store` | 不要候補 |

## 6. Shared assets

### CSS
`assets/css/`

現行TOPで確認できる主なCSS：
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

Galleryには追加で複数のGallery専用CSSが存在する。
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
- custom font / cursor related behavior

CDN：
- Three.js r134
- Vanta Fog

## 7. TOP section map

現行 `index.html` の主要構成：

1. Header
2. Fog / FV
3. Concept
4. Artists
5. Contact
6. FAQ
7. Access
8. Footer

変更時はsection anchor、header/footer導線、mobile layoutを同時確認する。

## 8. Gallery map

現行 `gallery.html`：

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
- `ROADMAP.md`（必要な場合）
