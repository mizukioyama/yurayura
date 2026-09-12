# Known issues

## Top section layout update (2026-09-12)

- ローカルブラウザではConceptの2列配置、Artistsの中央寄せ、作品画像の表示、Viewボタンのまとまりを確認済みです。
- GitHub Pages反映後のTop表示は公開ブラウザで確認済みです。実機スマートフォンは未確認です。
- 作品名は現状のHTMLどおり `Mizuki` を維持しています。作品名・作家情報そのものの追加変更は今回の対象外です。
- 既存 `slide.js` のクリック処理は `.works-link` を対象にしており、Topカードの既存リンク構造は今回変更していません。
- 今回、ファイル削除・課金・フォーム送信・外部サービスへのデータ送信は行っていません。

## Current task update (2026-09-12)

- 既存サイトが参照している `assets/img/favicon.ico` と `assets/img/apple-touch-icon.png` はcheckout内に存在しないため、Conceptでも同じ参照を維持しています。今回の対象外です。
- 実機スマートフォンでの受入確認は未実施です。ローカルブラウザでの表示・DOM確認は完了しています。
- GitHub Pagesはpush直後に反映待ちが発生しましたが、現在は公開URLのHTTP 200とブラウザ表示を確認済みです。
- 公開TopではHeaderの「世界観」クリックから公開Conceptへの遷移を確認済みです。Header / Footer全リンクの実機クリック・タップ確認は未完了です。
- 今回、ファイル削除・課金・フォーム送信・外部サービスへのデータ送信は行っていません。

## Loading animation status (2026-09-09)

通常時の霧ローディングは約4.85秒へ延長し、穴の拡大とフェードを緩やかにしました。画面上での体感確認はMacロック中のため未実施です。`prefers-reduced-motion`時は短縮設定を維持しています。

## Current responsive audit status (2026-09-09)

`index.html`、`assets/css/main.css`、`assets/css/form.css`、`assets/css/menu-style.css`のブレイクポイントを、`〜375px`、`376〜480px`、`481〜1335px`、`1336px〜`を基準に整理しました。旧 `699px`／`1239px` の有効な境界は削除・置換しています。

タブレット範囲には、section上下余白、見出し、Artistsカード、Viewボタン、FAQ内側余白、Accessのグリッドと地図、フォーム入力欄／送信欄のclamp調整を追加しました。今回の変更後の画面確認は未完了です。

今回の変更後のブラウザ画面確認は未完了です。Macがロック中で、ヘッドレスChromeも起動時に終了したためです。CSSとJavaScriptの静的確認は完了していますが、画面崩れなし・タップ操作・スライダーの実動作は未確認です。

`tidy`のHTML4互換検査では既存の`canvas`、`main`、`section`、`article`等のHTML5要素と、Google Fonts URLの`&display`表記が警告・エラーになります。Access内の既存の`</wbr>`も今回のレスポンシブ対象外のため残しています。

ギャラリーのレイアウトはデザインカンプ待ちで保留です。今回のレスポンシブ監査ではギャラリーHTML・CSSを変更していません。

## Existing validation notices

`tidy` のHTML4互換検査では、既存コードの `canvas`、`main`、`section`、`article` などのHTML5要素と、既存の `&display` 表記が警告・エラーとして出力されます。今回の変更による新規警告ではありません。

## Acceptance boundary

実機スマートフォンでのユーザー受入確認は未実施です。参照リポジトリはGit経由で取得し、`src/gallery.html`、`src/style/gallery.css`、`src/style/sidebar.css`、`src/public/gallery-sidebar.html`を基準に実装しています。

前回変更時点では320〜1440pxの確認記録がありますが、今回のブレイクポイント変更後の画面確認は未完了です。

Artistsのスライドショーは維持しています。Mizukiカード4件とViewボタンは`https://mizukioyama.github.io/yurayura/gallery.html`へ遷移します。公開URLでの実機表示は未確認です。

フォームの問い合わせ種別チェックボックスは2列2段へ変更済みです。320px幅でも各項目が収まり、既存の`form.js`による選択・必須検証は維持しています。

FVを除く全sectionの左右Paddingは44pxです。FVは既存レイアウト維持のため左右0pxです。320px幅でも横スクロールは発生していません。

Q&Aの`.faq-box`内側paddingは0pxに変更し、Contact・Q&A・Accessの左右余白を統一しています。

FAQは外側の分類を通常見出し、回答内の詳細項目を`faq.js`で1項目ずつ開閉する仕様です。実機でのタップ確認は未実施です。

外側見出しの背景は元のFAQ質問と同じ背景画像・境界表現です。

FV以外の全sectionは内容量に応じた自然な高さ、FVは100vhです。

スマホ幅ではFV以外の上下paddingを72〜96pxのレスポンシブ値にしています。実機スマートフォンでの最終受入確認は未実施です。

Concept/Artistsは専用のclamp値で上下paddingをさらに縮小しています。Artistsの背景画像コンテナは非表示で、既存スライドショーを表示します。

Conceptは意図的に共通sectionより広い上下余白を設定し、展示コンセプトの静かな見せ方を優先しています。

`main.css`には`v=20260909-responsive-breakpoints`のキャッシュバスターを付けています。

Footerリンクは`footer-link`クラスへ分離し、Headerと同じ文字間隔を指定しています。

今回の作業ではファイル削除を行っていません。復元用コピーは `backups/` に保持しています。

作家紹介ページは`gallery.html`として追加しました。参照元と同じ`gallery-containt` / `content` / `.work`構造の作品レイアウト、作家・ジャンル（Digital）絞り込み、作品10件単位の自動ページネーションを実装しています。現在の登録作品は4件のため、初期表示は4作品の縦積み表示です。画像ファイルの差し替えは行っていません。外部公開URLでの実機表示確認は未実施です。

## Figma gallery frame update (2026-09-09)

gallery.htmlの形をFigma作家紹介フレームに合わせて更新しました。Figma側の一時画像URLは使用せず、ローカルの既存作品画像を利用しています。そのため、ヒーロー画像の色味・作品画像の内容はFigmaカンプのプレースホルダーと完全一致しませんが、ページ構造、余白、カード寸法、タイポグラフィ、レスポンシブ配置を優先しています。

作品数は現在4件で、10件単位の設定によりページ番号は1Pのみです。作品追加時は`gallery.js`が自動的にページ数を増やします。

ローカルブラウザでPC幅とスマホ相当幅を確認済みです。実機スマートフォン、GitHub Pagesの公開URL、実際のFigmaデスクトップ／モバイル幅との完全なピクセル一致は未確認です。

今回もファイル削除、課金、公開、pushは行っていません。編集前コピーは`backups/`に保持しています。

## Top layout rollback (2026-09-12)

- 公開mainの巻き戻しコミットは `11bd8fbd8559cd0387a9d6b1a83f9d59f1d0df06`。公開Topの反映を確認済みです。
- GitHub Pagesの公開Topはrollback版CSS、JPEG上書きなし、横スクロールなしを確認済みです。
- 実機スマートフォンでの受入確認は未実施です。
- Concept / Galleryの後続変更は保持され、公開表示・導線・横スクロールなしを確認済みです。
- 今回、ソース削除・課金・フォーム送信・外部サービスへのデータ送信は行っていません。

## Top historical composition restore (2026-09-12)

- GitHub Pages上のTop、Concept、Galleryは公開ブラウザで確認済みです。
- 実機スマートフォンでの受入確認は未実施です。Top専用CSSには699px以下の旧モバイル構成を含めています。
- `backups/20260912_before_top_layout_restore/` はロールバック用に保持しており、削除していません。
- Concept / Galleryのソースは変更していません。公開ブラウザで表示と既存ナビゲーションを確認済みです。

## Header / Footer restoration (2026-09-12)

- 公開Topのデスクトップ表示で、スクロール後も左側のHeader本体が表示されることを確認済みです。
- スマートフォン実機でのHeader縮小メニュー操作は未確認です。
- 共通Header / Footerパーツ自体は変更せず、スクロール判定だけを以前の仕様へ戻しています。
- Concept本体の実装・修正は次の段階として保留しています。

## Navigation label update (2026-09-12)

- Header / Footerの共通ナビは `TOP / トップページ`、`CONCEPT / 世界観`、`GALLERY / 作品` に更新し、縦書き表示を確認済みです。
- 表示順は公開Topでも左から `TOP → CONCEPT → GALLERY`（トップ → 世界観 → 作品）です。
- 各リンクは英語名から日本語説明までを含む1つの選択・クリック範囲です。
- `index.html` / `concept.html` と動的パーツ取得にナビ更新用のキャッシュバスターを付けています。
- スマートフォン実機でのタップ範囲確認は未実施です。ローカルDOMでは6リンクの範囲を確認しています。
- 公開Topのデスクトップ表示でも、3項目の縦書きラベルと公開反映を確認済みです。

## Top label correction (2026-09-12)

- 現行の共通Header / Footerは`TOP / トップ`、`CONCEPT / 世界観`、`GALLERY / 作品`です。
- 左からTOP → CONCEPT → GALLERYの順、縦書き、各項目の1リンク範囲を維持しています。
- スマートフォン実機でのタップ範囲確認は未実施です。ローカルDOMで選択範囲を確認しています。

- 一時的なDNS解決エラーは解消し、公開Topのラベル更新を確認済みです。`main`へのpushも成功しています。

## Header / Footer label alignment (2026-09-12)

- ローカルでは6リンクの文字開始位置、リンク高さ、区切り線の位置・高さを統一済みです。
- 公開Topでの最終配置確認は、今回の変更をpushした後に実施します。
- スマートフォン実機でのタップ範囲確認は未実施です。

## Header link interaction fix (2026-09-12)

- Headerリンクのクリック不能は、親要素の`pointer-events: none`が原因でした。リンク自身を`auto`に戻して修正済みです。
- ローカルでHeaderの「世界観」からConceptへの遷移を確認済みです。
- 公開環境での今回のクリック操作と、スマートフォン実機でのタップ確認は未実施です。

## Artists section correction (2026-09-12)

- 作品セクションの説明文中央寄せとViewボタン幅はローカル・公開ブラウザで確認済みです。
- 背景は既存の作品セクション背景指定を維持しています。
- スマートフォン実機での見え方とタップ操作は未確認です。

## Artists full-width backgrounds (2026-09-12)

- ボタン背景帯とスライドショーの画面幅100%表示はローカルで確認済みです。
- 公開Topでも画面幅100%表示と既存ボタン背景画像の維持を確認済みです。
- スマートフォン実機での最終確認は未実施です。

## Header scroll collapse restoration (2026-09-12)

- 現行JSに処理は残っていましたが、PCでは`is-compact`が解除され、判定位置も画面高100％でした。
- PC・モバイル共通で画面高60％を閾値にする処理へ復旧し、ローカルで縮小・上部復帰を確認済みです。
- 公開Topで新しいキャッシュバスターのJS読み込み、60％閾値での縮小、上部復帰を確認済みです。
- スマートフォン実機の表示・タップ確認は未実施です。

## Shared Header unification and exhibitor alignment (2026-09-12)

- Galleryだけ独自の横長Headerだったため、Top / Conceptと同じ共通Headerへ切り替えました。
- ローカルで3ページ共通の構成・固定位置・縦書きナビを確認済みです。
- Topの「出展者紹介」は中央揃えへ調整済みです。
- 公開Top / Concept / Galleryで共通Header、3リンク、日本語ラベル、縦書き表示を確認済みです。
- スマートフォン実機の表示・タップ確認は未実施です。

## Hamburger menu layout correction (2026-09-12)

- 展開メニューだけに残っていた旧来の大きな列間隔・余白指定を削除し、通常Headerと同じレイアウトへ統一しました。
- `main.css`のタブレット幅用後勝ち指定も同じ値へ修正しました。
- ローカルのTop / Concept / Galleryで開閉、3リンク、Concept遷移、横はみ出しなしを確認済みです。
- 公開Top / Concept / Galleryで今回の展開メニューを確認済みです。
- スマートフォン実機での表示・タップ確認は未実施です。

## H2 centering and goods FAQ removal (2026-09-12)

- 全ページの`h2`を中央寄せに統一しました。
- TopのQ&Aから「販売する作品、グッズ（購入場所について）」と配下の購入場所・ECサイト関連を削除しました。
- 期間・アクセス・購入・主催者のFAQは残しています。
- 公開Top / Concept / Galleryで今回の見出し中央寄せとQ&A変更を確認済みです。
- スマートフォン実機での表示確認は未実施です。

## FAQ title and answer revision (2026-09-12)

- 「よくある質問」は中央寄せに統一しました。
- アクセスFAQへ、既存のAccess欄と同じ会場住所を追加しました。
- 回答文の誤字と表現を修正しました。予約・入場料など、根拠のない項目は追加していません。
- 公開Topで今回のFAQ変更を確認済みです。
- スマートフォン実機での表示確認は未実施です。

## Breakpoint and font-size calibration (2026-09-12)

- 主ブレイクポイントを`767px / 768px / 1199px / 1200px`に整理しました。
- 本文は最低14px、見出しは画面幅に応じて`clamp()`で拡縮する設定です。
- 480px以下のHeaderなど、狭い画面専用の設定は操作性維持のため残しています。
- 公開3ページで新CSSの読み込みと表示を確認済みです。
- スマートフォン実機での表示・タップ確認は未実施です。
