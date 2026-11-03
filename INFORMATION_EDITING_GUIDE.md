# Information 更新手順

## 正本と公開範囲
- 開催日・場所・会場・Artist・作品数・サイト別の紹介文：`assets/data/exhibitions.json`。既存の開催判定・参加募集判定を再利用する。
- 公開可能なお知らせ：`assets/data/news.json`。初期値は `[]`。空の場合はNews見出し・ページ内リンクも表示しない。
- 日程のない現行の企画検討案：Informationの`data-information-planning`内。岩手県または栃木県は候補で、開催地・会期・会場は未定。確定した開催データがある時はこの案内を非表示にする。
- 過去の静的記録はHTML内に残すが、内容はJSONから同期する。`INFORMATION:*`コメント間は直接編集しない。

これらはすべて公開用ファイル。非公開の案・内部メモ・個人連絡先・未承認の日付は保存しない。`published:false`や非表示CSSは秘密保持にならない。内部資料はリポジトリ外で管理する。

## 開催記録・予定を更新する
1. 公開承認済みの事実だけをexhibitions.jsonへ追加・修正する。id/editionは一意。日時は既存のISO形式と明示的なUTC offsetを使う。日程未定はstartsAt/endsAtを両方null、場所未定はcity/venueをnullにする。片方だけnullにはしない。
2. Yurayura/Portfolioのja/en紹介文は役割を分け、既存の言語フィールドを保持する。galleryUrlは作品を実際に掲載している既存ページだけに設定する。18作品を次の開催に使い回さない。
3. `node scripts/export-public-events.cjs --check` を実行する。
4. `node scripts/sync-information.cjs` を実行する。公開済みJSONからUpcoming/年別Archive/Newsの静的HTMLと、影響するCSS/JSとInformation用JSONの内容ハッシュ参照を同期する。Pagesのbuild設定は追加しない。更新時だけ使う編集補助で、フレームワーク・常設buildサービスは不要。
5. `node scripts/sync-information.cjs --check` と `node --test tests/*.test.cjs` を実行する。
6. 開催決定時はTOP・共通Headerの「未定」表記と募集案内も同じ公開差分で確認する。今回の更新補助はHeaderやTOPの文章を自動変更しない。
7. JavaScript有効/無効・375〜1440pxで確認し、差分をレビューする。本文の変更だけならCSS・Typographyは編集しない。

同期コマンドはinformation.htmlの指定領域と、information.css/information-content.js/exhibition-state.jsを参照するHTMLのcache値だけを更新する。他ページ本文やJSONは書き換えない。

終了判定は終了瞬間を含まず、表示日はAsia/Tokyo。境界の日にデータを更新・公開する時は同期を再実行する。静的HTMLは最後に同期した時点の確定情報であり、JS無効時のリアルタイム判定は行わない。募集はexhibition-state.jsの既存検証を通す。次回企画の確定と応募受付の開始は別判断で、Information改修だけで受付を開始しない。

## お知らせを追加する
news.jsonに次の公開済み項目だけを追加する（サンプルの架空告知をそのまま公開しない）。
- `id`：重複しない英小文字・数字・ハイフン
- `date`：実際の告知日（YYYY-MM-DD）
- `title`：見出し（200字以内）
- `summary`：本文（任意、2000字以内）
- `url`：任意。既存の`./ページ.html`またはそのアンカー。外部URL・スクリプトURLは受け付けない。

公開予定の原稿はこのJSONへ入れず、公開すると決まった時に追加する。通常の同期・check・表示確認後、別途承認を得て公開する。日付降順で表示される。

## 障害時と保護事項
- 開催データが読めない時：「開催なし」と断定せずエラーを表示。静的Archiveは残る。
- Newsの取得・検証に失敗した時：直前の公開静的告知を維持。架空の告知や空カードは作らない。
- 第1回の記録は開催期間・横浜・Gallery Charlotte.Usagi・4 Artist・18作品・Galleryへのリンクを残す。すべての過去展示で「展示の背景と記録」リンクはInformationでは自動生成しない。将来の開催記録も同じ方針とし、Galleryの作品リンクは維持する。正本JSONのportfolioDetailUrlは他の用途のため保持し、Conceptへの代替導線も追加しない。駅/徒歩/バス/住所/地図/開催時間/過去来場FAQは追加しない。
- `#past-exhibitions`・第1回の見出しIDを維持する。旧`#faq`はContact案内の段落へ接続する。Header/Footer/TOP/Galleryをこの更新のために書き換えない。
- `user-settings.css`がTypography正本。
- Commit/PR/本番反映は承認された別工程で行う。

## 企画状況の表記
- 現行の候補（岩手県または栃木県）は`data-information-planning`の「企画検討中」。開催地・会期・会場は未定のままにする。
- 調整段階に入ったことを本人が公開確認できた場合にだけ、同じ企画案内の状態を「開催調整中」へ変える。日付がnullであることだけを根拠に、調整していると推測しない。
- 確定して公開承認された開催だけをexhibitions.jsonへ登録する。日付のある今後の公開開催は「開催決定」、開催期間中は「開催中」、終了後は「開催終了」と表示する。公開承認済みでも日付が未定の記録は「開催日未定」と区別する。
- 企画案内と開催データに同じ事実を二重登録しない。公開開催を追加すると企画案内は非表示になる。非公開の候補や内部の調整メモは公開HTML/JSONに置かない。
- 開催地域は固定の選択肢にしていない。city/venue/editionと日時を公開確認して追加すれば、別地域・別年の記録を同じ年別Archiveへ追加できる。
