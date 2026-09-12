# ChatGPT review requests

## Top section layout review (2026-09-12)

1. TopのConceptが、見出しと本文の2列構成で読みやすく、右側の過剰な空白が抑えられているか。
2. Conceptの `Conceptを読む` が本文側の自然な位置にあり、Conceptページへ遷移できるか。
3. TopのArtistsで、見出し・紹介文・作品カード・Viewボタンが中央のまとまりとして表示されるか。
4. Artistsの作品画像が作家名ラベルに覆われず、既存スライダーの自動移動とGallery遷移が維持されているか。
5. 320〜480px相当で、Concept／Artists／Viewボタンに横はみ出しがなく、既存のヘッダー・フッターと調和しているか。

### Evidence already checked

- ローカルブラウザでTopのConcept導線、Artistsの中央寄せ配置、作品画像、View導線を確認
- 公開ブラウザでTopのConcept導線、Artistsの中央寄せ配置、作品画像、カード幅内のViewボタンを確認
- 公開ブラウザでTOP / CONCEPT / GALLERYのナビゲーションとGalleryリンクを確認
- `git diff --check` と `node --check assets/js/slide.js` を実行
- Topだけに適用する専用CSSとし、既存のHTML本文・画像・スライダーJSを保持

## Current task review (2026-09-12)

1. `concept.html` のHero、コンセプト本文、作品写真2点、Gallery導線がTopと同じトーンで見えるか。
2. 320〜480pxのスマホ幅で、縦組みHero、本文、作品写真、ボタンに横はみ出しがないか。
3. Topの `Conceptを読む` と、全ページの `TOP / CONCEPT / GALLERY` が正しいページへ遷移するか。
4. 既存Galleryの4作品、絞り込み、ページネーション、フォーム、FAQ、背景アニメーションが従来どおりか。

### Evidence already checked

- ローカルブラウザでConceptの本文、2枚の既存作品画像、Galleryリンクを確認
- ローカルブラウザでTopのConcept導線とGalleryの4作品・ナビを確認
- `node --check` と `git diff --check` を実行
- 編集前コピーを `backups/` に保存

### Publication evidence

- `https://mizukioyama.github.io/yurayura/concept.html` はHTTP 200で取得できる
- 公開Topの `Conceptを読む` は `concept.html` を指す
- 公開ConceptのGallery導線は `gallery.html` を指す
- 公開ページのDOMで既存画像2点と本文を確認済み

### Clarification review

- Concept内のh2などの見出しが横書きであること
- Conceptのヘッダー／フッターがTopと同じ共通パーツ・表示であること

## Loading animation review

- 初期表示時の霧ローディングが急に完了せず、約4.85秒かけて緩やかに進むこと
- `prefers-reduced-motion`時は従来どおり短縮されること
- FVの背景アニメーション、スライダー、FAQ、フォーム動作に変更がないこと

## Current review gate (2026-09-09)

今回のレビュー対象は `index.html` のレスポンシブ表示だけです。ギャラリーのレイアウト設計はユーザーがデザインカンプを共有するまで保留してください。

- ブレイクポイントが `〜375 / 376〜480 / 481〜1335 / 1336〜` の4区分で実装されていること
- 699px／700px境界の急なレイアウト切り替えが解消されていること
- 320px、390px、699px、700px、1440pxで横はみ出しがないこと
- Concept、Artists、Contact、FAQ、Access、フォーム、地図、Viewボタンが各幅で収まること
- `slide.js`、FAQ、フォーム送信、背景アニメーションに不要な変更がないこと
- 481〜1335pxで、section余白、見出し、Artistsカード、Viewボタン、フォーム、FAQ、Access、地図のサイズが連続的に変化すること
- 481px付近でフォーム送信欄とAccess情報が横にはみ出さず、1335px付近で過度に拡大しないこと

実装後のブラウザ画面確認はMacロック中のため未完了です。表示確認が完了するまで、実装を最終合格・commit済みとは判定しません。

## Review target

1. Concept、Artists、Contact、FAQ、Access、フォーム、ヘッダー／フッターの文字サイズとArtistsからgallery.htmlへのリンク、gallery.htmlのカテゴリ／作品レイアウトだけが変更されていること
2. 指定文の句読点・表記が保持されていること
3. 本文が12〜14px、h1/h2/h3等がそれぞれの範囲で `clamp()` になっていること
4. Artists以外のHTML本文、背景アニメーション、フォーム送信処理に変更がないこと。Artistsのスライドショー構造は維持すること
5. 参照リポジトリの`src/gallery.html` / `src/style/gallery.css` / `src/style/sidebar.css` / `src/public/gallery-sidebar.html`と照合して設計していること
6. ギャラリーが参照元と同じ1作品1行の`.work`レイアウトで、作家・ジャンルで絞り込め、作品数に応じてページ数を自動生成すること

## Review evidence

- Concept本文のブラウザDOMテキストは指定文と一致
- Concept内の `br` は11個、全て `class="pc-br"`
- 390x844で対象テキストの表示とページ横幅のはみ出しなし
- 320x568でもページ横幅のはみ出しなし
- 375/376/480/481/1335/1336pxの境界を確認
- 1440x900でも横書き・左寄せ・ページ横幅のはみ出しなし
- h1/h2/h3、小見出し、フォーム、ヘッダー／フッターの計算後サイズを確認
- indexのArtistsスライドショーが維持され、Mizukiカード4件とViewボタンが`https://mizukioyama.github.io/yurayura/gallery.html`へリンクすることを確認
- gallery.htmlは参照元と同じ`gallery-containt`、`content`、`.work`、`.work-img`の構造になっていることを確認
- gallery.htmlは作家・ジャンルのカテゴリを表示し、1作品1行の参照レイアウトと作品数連動のページネーションを持つことを確認
- 4枚の作品画像は既存の`assets/img/*.webp`をそのまま読み込むことを確認
- `gallery.html`が作家紹介ページとして取得でき、4作品の`.work`と4つのアンカーが存在することを確認
- `gallery.js`の`pageSize=10`とフィルタ後作品数によるページ数自動生成を確認
- 既存のスライダーIDと`slide.js`を維持し、無限スライドショーを変更していないことを確認
- Viewボタンの既存のfluid幅・背景ルールを変更していないことを確認
- フォームの問い合わせ種別4項目は320/390/699/700/1024pxで2列2段、HTML順序は展示・作品／購入・その他のままであることを確認
- `form.js`は変更せず、チェック状態取得・1つ以上必須の検証が維持されていることを確認
- `index.html`のフォームCSSにキャッシュバスターを付け、最新の2列2段CSSが読み込まれることを確認
- FVを除く全sectionの左右Paddingが320/390/700/1024pxで44px、FVは左右0pxで既存レイアウトを維持していることを確認
- Q&Aの内側余白を0pxにし、Contact・Q&A・Accessの左右余白が揃っていることを確認
- 外側の「期間と場所と時間」「アクセス」などは通常見出し、回答内の詳細項目はアコーディオンとして開閉し、同時に複数開かないことを確認。質問順は展示概要、アクセス、販売作品・グッズ、購入、主催者の順
- 外側の見出し背景が元のFAQ質問と同じ背景画像・境界表現であることを確認
- FV以外の全sectionが内容量に応じた自然な高さ、FVだけが100vhであることを確認
- スマホ幅のFV以外の上下余白が`clamp()`/`calc()`で72〜96pxに収まり、縦長化が抑えられていることを確認
- Concept/Artistsの上下余白が追加で縮小され、Artists背景画像だけが非表示で、カード画像・スライドショーが残っていることを確認
- Conceptのみ、展示の雰囲気に合わせて上下余白を共通sectionより広いレスポンシブ値に調整したことを確認
- `main.css?v=20260909-slider-external-gallery`のキャッシュバスターにより最新CSSが読み込まれることを確認
- Footerリンクの文字間隔がHeaderと同じPC`0.8rem`、スマホ`0.2rem`で読み込まれることを確認
- 表示時のJavaScript errorなし
- 参照リポジトリはGit経由で取得して上記ファイルを確認済み。公開URLでのブラウザ実機表示確認はレビュー時に実施する

## Figma frame review request (2026-09-09)

今回の追加レビュー対象は、ユーザー共有Figmaの作家紹介フレームに合わせた`gallery.html`の形です。

- PCでヒーローの「作家紹介」が中央に表示され、白背景の2列作品グリッドになること
- スマホ相当幅でタイトルが横書き左寄せ、作品が1列、画像が246×320pxで収まること
- 紹介文、ジャンル情報、作品下のタイトル／作者情報、ページ番号の余白がFigmaの構成に沿うこと
- 作家・ジャンル絞り込みが既存どおり使え、ページ数が作品数から自動生成されること
- `index.html`のスライドショー、フォーム、FAQ、その他の既存ページを変更していないこと
- 一時的なFigmaアセットURLをコードへ固定していないこと

### Verification evidence

- ローカルブラウザでPC幅のヒーロー、2列作品、1P、フッターを目視確認
- ローカルブラウザでスマホ相当幅の左寄せタイトル、1列作品、246×320px画像を目視確認
- DOM上で作家／ジャンルカテゴリと自動生成された`1ページ目を表示`を確認
- HTMLタグスタック検査、`node --check assets/js/gallery.js`、`git diff --check`を実行

## Top layout rollback review (2026-09-12)

1. 公開Topで軽量化前の作品カード画像とカードレイアウトへ戻っているか。
2. TopのConcept / Artistsの見出し、本文、導線、スライダー表示が維持されているか。
3. CSSキャッシュバスター更新後に旧Top CSSが残らず読み込まれているか。
4. ConceptページとGalleryページの画像、ナビゲーション、既存導線が変更されていないか。

### Evidence

- `assets/css/top-sections.css` の作業後blobが28f69fc時点と一致
- c90eeef追加分17行を対象に限定して巻き戻し
- `git diff --check`、JavaScript構文確認を実施
- 公開URL確認はpushおよびGitHub Pages反映後に実施

### Public verification result

- 公開Topで `top-sections.css?v=20260912-top-sections-rollback` の読み込みを確認
- 公開TopでJPEG背景上書きなし、作品カード8件、横スクロールなし、Concept / Gallery導線を確認
- 公開Conceptで本文、作品画像3点、Gallery導線、横スクロールなしを確認
- 公開Galleryで4作品、ページネーション、3ページナビ、横スクロールなしを確認
- Top / Concept / Galleryの公開コンソールエラーは0件

## Top historical composition restore review (2026-09-12)

1. 公開TopのConceptが以前の縦組みレイアウトへ戻っているか。
2. 公開TopのArtistsが縦組み本文、420×280pxカード、複数カードの連続表示へ戻っているか。
3. Top専用復元CSSがConcept / Galleryへ影響していないか。
4. キャッシュバスターにより公開環境で最新のTop復元CSSが読み込まれているか。

### Evidence

- `assets/css/top-sections.css` は28f69fc時点と一致
- `assets/css/top-legacy.css` は `.top-page` 配下だけを対象
- ローカルブラウザでConcept / Artistsの縦組みとカード表示を目視確認
- Concept / GalleryのHTML・CSS・JSは今回の差分なし

### Public verification result

- `main` のコミット `2397dd1` を公開ブラウザで確認
- 公開TopのConceptは縦組み、Artistsは複数カードの連続表示へ復元
- 公開Conceptは表示確認、公開Galleryは作家紹介ヒーローとナビゲーションを確認

## Header / Footer restoration review (2026-09-12)

1. デスクトップのスクロール後もHeader本体が左側に表示され、＋ボタンだけにならないか。
2. Footerの中央配置、縦型ナビ、コピーライト表示が維持されているか。
3. Conceptページに不要な変更が入っていないか。

### Local evidence

- デスクトップ相当のローカル表示でHeader / Footerを目視確認
- `node --check assets/js/allmenu.js` とブラウザコンソールエラー0件を確認

### Public evidence

- 公開Topを再読込し、デスクトップの左側に `TOP / CONCEPT / GALLERY` のHeader本体が表示されることを確認
- ページ末尾で中央の縦型Footerナビとコピーライトを確認
- 公開ブラウザのコンソールエラーは0件
