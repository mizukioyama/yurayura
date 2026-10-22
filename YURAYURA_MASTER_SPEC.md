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

## 3. Latest Archived Event Facts

以下はユーザーから終了済みと確認された2026年10月の横浜開催に関する、過去展示の掲載記録。会期・会場・住所等は過去開催の案内にのみ使用し、次回開催情報として扱わない。詳細値は公開前にユーザー確定情報と照合する。

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

1. 「ゆらゆら」の世界観を短時間で知り、感じられる
2. Concept・Gallery・Informationへ迷わず移動できる
3. 次回開催情報と、過去開催の記録・会場案内を区別して確認できる
4. 問い合わせ方法が明確
5. モバイルで快適に閲覧できる
6. 視覚演出が情報閲覧を邪魔しない
7. 開催前・開催中・終了後にも再利用できる

## 6. Information Architecture

主要な役割：

### TOP
- First Viewで展示の第一印象を伝える
- About YURAYURAで企画を短く紹介する
- Concept・Gallery・Informationへの導線を設ける
- 会期、会場名、住所、アクセス詳細は掲載しない

### Information
- 次回開催の会期・会場・開催地（未確定時は準備中と案内）
- 確認済みの開催情報と過去展示のアクセス記録
- 開催時点を明示した展示FAQ
- 特定の地域に企画を固定しない更新可能な構成

### Contact
- お問い合わせFAQと公式フォーム
- 個人情報の取り扱いとSite Policyへの案内

### Concept
- 展示思想の詳細
- 「理解する」ではなく「体感する」の背景

### Gallery
- 作家と作品
- Artist / Genre絞り込み
- 作品詳細
- 作家プロフィール
- 問い合わせ導線

ページごとの公開分類、index状態、canonical、具体的なURLは `SITE_MAP.md` を正本とする。`sitemap.xml` はそこに記録されたindexable URLと一致させる。

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
- Native FAQ details / summary
- Contact form and privacy dialog
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

### 恒久方針
- 「ゆらゆら」という企画・ブランドを、特定の市区町村や都道府県に固定しない。
- 横浜・神奈川などの地域情報は、その地域で行う個別Eventの開催情報として扱う。
- Event structured dataを使う場合、名称・説明・日時・会場・住所などは、確認済みの開催情報とページ上の可視情報に一致させる。未確定情報や推測を補わない。
- 検索対象にするページは `SITE_MAP.md` のindexableページに限る。非正式ページ・開発用ページは検索index対象にしない。`noindex` はアクセス制御ではないため、公開可能性の判断とは分ける。
- sitemapには `SITE_MAP.md` でindexableと定義したURLだけを掲載する。URL一覧やcanonicalをこの仕様書へ重複記載しない。
- SEOのためだけに表示本文やデザインを不自然に変えない。

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

## 継続開催・参加導線
Conceptから支援者・支援会場・参加申し込み・主催者プロフィールへ接続する。Galleryの既存URLと18作品を維持し、`exhibitions.html` を開催別入口とする。開催分類は `exhibition-state.js` と公開開催データを用い、開始時刻を含み終了時刻を含まない区間で判定する。日時はoffset必須、表示はAsia/Tokyo。非公開・不正日時は開催中として扱わない。受付先未確定の募集は企画中とし、送信機能を設けない。受付開始には受付先の締切制御と別途検証が必要。販売はすべて準備中。

### 開催日未定と読込失敗
公開承認済みで開始・終了がともにnullの開催は「開催日未定」として開催予定に表示する。片側だけ未定・不正日時は配信データ生成で拒否する。非公開開催は表示分類前に除外。Informationと展示作品入口は同じ公開データで分類する。取得失敗時はエラー案内と第1回の静的記録へのリンクを示し、「開催なし」と断定しない。

### Phase 8: 次回参加案内の確定範囲

全国各地での継続開催を目指す。第1回は2026年10月に横浜で開催。次回は岩手県または栃木県での開催を検討しているが、開催地・会期・会場は未定。現在は出展申し込みを受け付けていない。参加費・募集人数/期間・展示区画・作品数/サイズ・選考・搬入搬出・正式受付先は未確定として案内する。過去の「展示経験不問」「コンセプトへの共感・新しい表現への挑戦」を次回の確定条件へ転用しない。Contactはお問い合わせ専用で、応募受付には用いない。

### 募集状態表示と更新手順（PR #44最終調整）

参加ページのdata-recruitment-statusとdata-recruitment-copyは、exhibition-state.jsのrecruitmentViewを共通の正本とする。情報なし/準備中/受付開始前/受付中/終了/取得失敗を分け、応募方法・FAQ・募集条件の文言も同時に切り替える。HTMLの初期値は受付停止・未定という安全なfallbackで、JavaScript無効/読込前にも受付中としない。現在の公開JSONには募集情報がなく、受付停止のまま。

受付中の必要条件は公開承認済みの開催・募集、offset付きの有効な開始/終了日時、開始時刻以上/終了時刻未満、receiverVerifiedがboolean trueであること。開催または募集データの不正/取得失敗/未確認受信先では受付中にしない。過去の募集準備データが確認済みの受付中データを隠さないよう選択する。状態が変わらない場合はDOMを書き換えず、ライブ領域の重複読み上げを避ける。

将来の更新手順：
1. 募集条件・期間・正式な受付先と受信側締切制御を確定し、公開承認を得る。Contactはお問い合わせ専用を維持する。
2. 参加要項と受付方法、Information等の開催案内を同じ公開差分で整合させる。状態依存の段落を固定文言として追加せず、data-recruitment-copyまたはrecruitmentViewを更新する。現在の「未定」を受付中のまま残さない。
3. 公開データ生成はreceiverVerified:falseを維持する。正式な受信先の検証・募集開始承認が整った場合のみ、承認対象の公開差分でrecruitment.published:trueとreceiverVerified:trueを設定する。今回この操作は実施しない。
4. 6状態と不正データ、JSTの開始直前/開始/終了直前/終了をfixtureで再検証。正式データに試験用受信先やfixtureを保存しない。公開・受付開始は別途承認する。
5. 終了時刻で表示は自動終了する。ブラウザ時計による案内は受信側の受付制御の代わりではない。読み込み済みタブは公開データ変更を再読み込みする必要があるため、緊急停止は受信側でも必ず実施する。
