# Support 商品紹介の更新

## 管理先
- ページ構成・公開可能な紹介文：`support.html`
- Support固有のカタログ配置：`assets/css/support.css`
- 色・Typography・余白：既存の共通CSSと`user-settings.css`が正本。Support CSSに文字サイズの別設定を追加しない。
- 販売リンク：既存`assets/data/shop-links.json`だけ。価格・在庫・送料・注文・決済はSquareで管理し、紹介用ファイルへ複製しない。
- Original Artの作品名・Artist・技法・サイズ・作品画像はGalleryが正本。現在のSupportはGalleryへ案内するだけで、作品情報を二重に保有しない。Gallery掲載は商品販売・画像の商用利用許諾を意味しない。

## 現在の掲載内容
画像は未掲載。仮表紙・架空写真は使わない。
- デジタル商品：既存の企画名「ゆらゆらの記録 Vol.1」。企画中で、完成・販売していないことを明示。内容・形式・価格・販売日は未確定。
- Original Art：Galleryへの作品鑑賞導線。販売対象を断定しない。
- Goods：ポストカード・展示記録冊子を検討中という既存情報。素材・サイズ・実物は未確認。
- オーダー制作：準備中。Contactは問い合わせ先で、受付開始・受注保証ではない。

## 商品を追加できる条件と構造
1. 商品の実在・名称・内容・画像の利用許諾と用途を確認する。内部メモ、個人情報、未承認の価格・条件を公開ディレクトリに入れない。
2. 該当カテゴリの`.support-entry__body`内に`article.support-product`を追加する。見出しは一意なIDを付けたH3（既存`.path-eyebrow`の共通小見出しサイズを利用）、articleに`aria-labelledby`を設定。複数商品は同じ構造で縦に連ねる。新しいカード用JSや商品台帳は不要。
3. 許諾済みの実画像がある場合だけ、articleの先頭にfigure/imgを追加する。実寸のwidth/height、内容に即したalt、`loading="lazy" decoding="async"`を付ける。画像は横幅に収まり高さauto、切り抜かない。未確定画像の空枠は作らない。許諾済みの説明以外はfigcaptionに書かない。
4. `.support-facts`のdlへ確認済みの形式・素材・サイズ等だけを記載する。価格や在庫はSquareの正式情報へ案内する。Original Artの個別紹介が必要になった時はGalleryの正本からの共有方法を先に検討し、手作業の第二台帳は作らない。
5. `data-shop-section`、`.path-status`、`data-shop-category-copy`、`data-shop-category`、`data-shop-notice`を残す。カテゴリごとにこれらの連携対象を1組だけ配置する。コピー対象の段落構造も維持する。
6. 今回は購入ボタンを新設していない。既存カテゴリリンクはhrefなし・hidden。将来、購入リンクを使う場合もcommerceの承認ゲートを通す。HTMLへSquare URLを直接入力しない。個別商品リンクのSupport表示は未実装なので、必要になった時に既存`resolve`/`applyLink`とArtist照合を再利用する限定変更・テストを行う。独自の承認判定を作らない。
7. 販売開始前に実商品の許諾、Squareの商品・配送・決済・カートを別途確認し、本人の公開承認を得る。既存のSquare問い合わせはUI改修と別課題。

## ローカル確認
- `node --test tests/*.test.cjs`
- `node scripts/check-commerce-readiness.cjs`
- `git diff --check`
- Support CSSを変えたら、support.htmlの該当参照を内容SHA-256先頭12文字に更新する。
- 320 / 375 / 390 / 768 / 1200 / 1440px、キーボード、JS無効、Reduced Motion、EC JSON取得失敗を確認する。
- 商品画像追加時には比率・alt・容量・CLS・noimageindex維持を確認する。
- 最終文面・デザインの本人確認後、別途承認された手順でのみCommit・PR・公開する。

## 日常更新の早見表

### 商品名・説明文を変える
該当する`article.support-product`のH3と説明段落を編集する。既存IDと`aria-labelledby`の対応を保つ。カテゴリ名はH2と索引リンクの両方を変え、リンク先IDは維持する。
`data-shop-category-copy`付き段落は販売承認後にcommerce.jsが置き換える領域なので、商品固有の恒久的な説明はその外へ置く。作品の情報変更は先にGalleryの正本を確認する。

### カテゴリを追加する
既存の`section.path-section`と`.support-entry`構造を再利用し、一意のsection ID・H2 IDを付ける。索引へそのsection IDを指すリンクを1件追加する。専用の文字サイズ・新しいレイアウトCSSは通常不要。
表示上のカテゴリ追加とECカテゴリ追加は別。現在shop-links.jsonが受け付けるカテゴリは`original-art`と`goods`のみ。digitalやcommissionを推測でJSONへ追加すると検証に失敗する。販売カテゴリを拡張する場合は、別の限定実装・契約テスト・公開承認が必要。

### 商品リンクを登録する（販売開始が別途承認された後のみ）
既存Gallery商品の販売マッピングはshop-links.jsonのproductsへ登録する。既存のartworkId・artistIdの対応、Squareの実商品URL・商品ID・正しいchannel、published・saleApproved・imageUseApprovedを確認し、既存のcheck-commerce-readiness.cjsで検証する。カテゴリURLも本人が確認した実URLだけを登録する。
Supportの現在のリンクはカテゴリ単位。個別の商品紹介から商品ページへのリンクを表示する処理はまだない。必要時は既存commerceの`resolve(config, 'artwork', artworkId)` / `applyLink`を使い、Artist一致と全承認条件を確認する小さな表示アダプターを別途実装・検証する。URLのHTML直書き、商品名からのURL推測、独自の承認フラグは使わない。デジタル商品・独立したGoodsには未対応の識別設計が必要な場合もあるため、Galleryの作品IDを流用しない。
Squareの問い合わせ回答が確定するまで、現在のenabled/publicationApproved=false、null URL、空のマッピングを維持する。この手順書の記載はリンク有効化の承認ではない。

### 商品の公開・非公開
紹介だけを非表示にする場合は対象articleへ`hidden`を付ける。カテゴリ全体を非表示にする場合はsectionにも`hidden`を付け、索引リンクを同じ候補から外す。再表示は確認済みの商品だけ。非表示は秘密保持ではないため、非公開原稿・未承認データはHTML/JSONへ入れずリポジトリ外で管理する。
購入リンクの非公開は紹介のhiddenとは別。既存の商品マッピングのpublished=false、saleApproved=falseまたは対応URLの未登録でリンクを遮断する。全販売導線の停止には既存の両グローバルフラグをfalseにする。商品1件の非公開だけでカテゴリリンク・Artistリンク全体まで止まるとは限らないので、対象ごとに表示を確認する。Square内の販売・在庫を変更する操作とは別である。

### 販売開始前のチェック
- [ ] 実商品・画像の利用許諾、仕様と紹介文が確定
- [ ] Squareサポート回答と実カート/決済問題の解消を確認
- [ ] Squareの価格・在庫・送料・配送・返品条件を本人が確認
- [ ] 実URLと商品/Artistの対応を確認（ダミーURLを登録しない）
- [ ] 未承認・データ取得失敗・商品切替時にリンクが出ないことを確認
- [ ] 商品紹介UIの公開と販売開始を別々に明示承認

今回の最終レビューは販売開始前のUI候補の確認のみ。外部管理画面・商品登録・決済は操作しない。
