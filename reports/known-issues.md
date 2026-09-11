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
