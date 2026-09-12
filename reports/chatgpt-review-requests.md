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

## Navigation label update review (2026-09-12)

1. `TOP / トップページ`、`GALLERY / 作品`、`CONCEPT / 世界観` が縦書きで表示されるか。
2. 左から `TOP → CONCEPT → GALLERY`（トップ → 世界観 → 作品）の順になっているか。
3. 英語名から日本語説明までが各リンク1つの選択・クリック範囲になっているか。
4. Top・Concept・Galleryの本文と既存リンク先が変更されていないか。

### Local evidence

- Header / Footerの6リンクで、文言、`display: inline-block`、`writing-mode: vertical-rl` を確認
- Header / Footerの左右座標で左から `TOP → CONCEPT → GALLERY` の順を確認
- 各リンクの矩形範囲に英語名と日本語説明が含まれることをDOMで確認
- `menu-style.css` と `allmenu.js` のキャッシュバスターを確認

### Public evidence

- 公開Topで `TOP / トップページ`、`CONCEPT / 世界観`、`GALLERY / 作品` の縦書き表示を確認
- 公開Topで左から `TOP → CONCEPT → GALLERY` の順を確認
- キャッシュ更新URLで再読込後も公開ブラウザのコンソールエラーは0件

## Top label correction review (2026-09-12)

1. Header / Footerの表示が左から`トップ - TOP`、`世界観 - CONCEPT`、`作品 - GALLERY`の順であること。
2. 日本語ラベルが`トップ`であり、`トップページ`が現行ナビに残っていないこと。
3. 3項目が縦書きで、英語名から日本語説明まで各リンク1つの選択・クリック範囲であること。
4. Concept / Galleryの本文と既存リンク先に影響がないこと。

### Local evidence

- ローカルDOMでHeader / Footerの6リンクのラベル、左右座標、`inline-block`、`vertical-rl`を確認
- `index.html` / `concept.html` / 動的パーツ取得のキャッシュバスターを`20260912-nav-top`へ更新

### Public evidence

- `main`へのpush成功は確認済み（`fc50724`）
- 公開TopのアクセシビリティツリーでHeader / Footerの`トップ`、`世界観`、`作品`を確認
- 公開Topの本文とConcept / Galleryへの既存リンクが表示されることを確認

## Header / Footer label alignment review (2026-09-12)

1. `トップ - TOP`、`世界観 - CONCEPT`、`作品 - GALLERY`の英語・日本語ラベルの開始位置が揃っていること。
2. 3項目の区切り線が同じ高さ・長さで揃っていること。
3. 各項目が1つのリンク範囲で、Top / Concept / Galleryの既存リンク先を維持していること。
4. Top / Concept / Gallery本文へ影響がないこと。

### Local evidence

- Header / Footerの6リンクで、リンク高さ、英語・日本語ラベルのY座標、線のY座標・高さを測定
- ローカルブラウザのエラー0件を確認

## Header link interaction fix review (2026-09-12)

1. HeaderのTOP / CONCEPT / GALLERYがクリック可能であること。
2. Headerの「世界観」クリックで`concept.html`へ遷移すること。
3. 縦書き・文字位置・線位置・既存リンク先が維持されていること。
4. Top / Concept / Gallery本文へ影響がないこと。

### Local evidence

- 実効`pointer-events`を確認し、3つのHeaderリンクすべて`auto`
- Headerの「世界観」リンクを実際にクリックし、`concept.html`への遷移を確認

### Public evidence

- 公開Topのキャッシュ更新URLでHeaderの `トップ` / `世界観` / `作品` とhrefを確認
- 公開TopのHeader「世界観」をクリックし、`https://mizukioyama.github.io/yurayura/concept.html` への遷移を確認
- 公開Topのアクセシビリティツリーで、Header / Footerの3リンクが表示されることを確認
- スマートフォン実機のタップ操作は未確認

## Artists section correction review (2026-09-12)

1. 作品セクションの見出し直下の説明文が中央寄せで表示されること。
2. Viewボタンが全幅に広がらず、中央の適切な幅で表示されること。
3. 作品セクションの背景表示が現状のまま維持されること。
4. Concept / Galleryと作品カード、スライダーの表示に影響がないこと。

### Evidence

- `assets/css/top-artists.css` をTopページだけへ追加
- ローカル表示で説明文の中央寄せ、Viewボタン幅520px、背景URL維持を確認
- ローカル表示で横スクロールなしを確認
- 公開Topで新しいTop専用CSSの読み込み、説明文の中央寄せ、Viewボタン幅520px、背景URL維持を確認
- 公開Concept / GalleryでTop専用CSSが読み込まれていないことを確認
- スマートフォン実機での最終受入確認は未実施

## Artists full-width backgrounds review (2026-09-12)

1. 作品セクションのボタン背景帯が画面幅100%で表示されること。
2. スライドショー表示領域が画面幅100%で表示されること。
3. ボタン本体の中央配置、説明文、作品カード、既存背景が維持されること。
4. 横スクロールが発生しないこと。

### Evidence

- ボタン背景帯とスライドショーを、作品セクション内の左右余白を超えて画面幅へ拡張
- ローカル表示で両方の表示領域が画面幅と一致することを確認
- 公開Topで新しいTop専用CSSの読み込み、ボタン背景帯・スライドショーの画面幅一致、背景画像維持を確認
- 公開Topで横スクロールなしを確認

## Header scroll collapse restoration (2026-09-12)

1. 画面高の60％地点までスクロールするとHeaderが縮小・格納されること。
2. ページ上部へ戻るとHeaderが元の表示へ戻ること。
3. 縮小後にメニューボタンが表示され、メニュー開閉が維持されること。
4. Header / Footerのリンク、Topレイアウト、Concept / Galleryに影響がないこと。

### Local evidence

- viewport高720px、閾値432pxで初期状態が展開されることを確認
- scrollY720pxで`is-compact=true`、メニューボタン表示を確認
- scrollY0pxへ戻した後、`is-compact=false`、Header一覧表示、メニューボタン非表示を確認
- `node --check assets/js/allmenu.js` と`git diff --check`を通過

### Public evidence

- `main`のコミット`49ab314`反映後、公開Topで`allmenu.js?v=20260912-header-scroll-60`の読み込みを確認
- viewport高929px、閾値557.4pxでscrollY929px時のHeader縮小とメニューボタン表示を確認
- scrollY0pxへ戻し、アニメーション完了後のHeader一覧再表示とメニューボタン非表示を確認
- 公開Topで横スクロールなし、Top本文と既存ナビゲーションを確認
- スマートフォン実機の確認は未実施

## Shared Header unification and exhibitor alignment (2026-09-12)

1. Top / Concept / GalleryのHeader構成が共通パーツで統一されていること。
2. 3ページでHeaderの固定位置、縦書きナビ、`TOP / トップ`、`CONCEPT / 世界観`、`GALLERY / 作品`が揃うこと。
3. Topの作品セクションの「出展者紹介」が中央揃えであること。
4. Galleryの4作品、既存フィルター、横はみ出しなしを維持すること。

### Local evidence

- ローカルGalleryで共通HeaderのDOM、3リンク、日本語ラベル、メニューボタンを確認
- Top / Galleryで固定位置、縦書き、左76.8px・上44.8pxの一致を確認
- Topで「出展者紹介」の中央位置と`text-align: center`を確認
- Galleryの作家紹介見出し、4作品、既存フィルター、横はみ出しなしを確認

### Public evidence

- `main`のコミット`c5127ac`反映後、公開Top / Concept / Galleryで共通HeaderとTopの中央揃えを確認
- 公開3ページで共通Headerの3リンク、日本語ラベル、縦書き表示を確認
- 公開GalleryでHeader固定表示、4作品、横はみ出しなしを確認
- スマートフォン実機の確認は未実施

## Hamburger menu layout correction (2026-09-12)

1. ハンバーガー展開時のメニューが常時表示Headerと同じ構成・寸法・間隔であること。
2. 左から`TOP → CONCEPT → GALLERY`、日本語ラベルが`トップ / 世界観 / 作品`の順であること。
3. 開閉時の`aria-expanded`、スクロールロック、既存リンク遷移が正常であること。
4. Top / Concept / Gallery本文、作品表示、横幅に影響がないこと。

### Local evidence

- 3ページで展開時の`gap:40px`、`padding:0`、`writing-mode:vertical-rl`を確認
- 3ページで開閉後の`is-compact`、`is-open`、`aria-expanded`、スクロールロックを確認
- 展開中のConceptリンクから`concept.html`への遷移を確認
- 3ページで横スクロールなしを確認
- `node --check assets/js/allmenu.js` と`git diff --check`を通過

### Public evidence

- `main`のコミット`d9d2c13`反映後、公開Top / Concept / Galleryで新しいCSS / JSキャッシュバスターの読み込みを確認
- 公開3ページで展開レイアウト、順序・文言、開閉、スクロールロック、横はみ出しなしを確認
- 公開Topの検証後は通常表示へ戻した
- スマートフォン実機の表示・タップは未確認

## H2 centering and goods FAQ removal (2026-09-12)

1. Top / Concept / Galleryの全`h2`が中央寄せであること。
2. TopのQ&Aからグッズ・購入場所・ECサイト関連の項目が削除されていること。
3. 期間、アクセス、購入、主催者のFAQが残っていること。
4. 3ページの本文、作品表示、既存リンク、横幅に影響がないこと。

### Local evidence

- 3ページの`h2`計13件で`text-align:center`を確認
- TopのQ&Aに残る見出し4件を確認し、グッズ・購入場所・ECサイト文言がないことを確認
- 3ページで横スクロールなしを確認

### Public evidence

- `main`のコミット`a7d6d99`反映後、公開3ページで新しいCSSキャッシュバスターの読み込みを確認
- 公開Topで全`h2`中央寄せ、グッズ・購入場所・ECサイト関連の削除、残りFAQ4件を確認
- 公開Concept / Galleryで全`h2`中央寄せ、共通Header、横はみ出しなしを確認
- 公開Topの検証後は通常表示へ戻した
- スマートフォン実機の表示確認は未確認

## FAQ title and answer revision (2026-09-12)

1. 「よくある質問」の見出しが中央寄せであること。
2. 期間・アクセス・購入・主催者のFAQ分類が残っていること。
3. 会場住所がアクセスFAQに追加されていること。
4. 回答の誤字・表現が修正され、既存の事実関係が保たれていること。
5. グッズ関連FAQがなく、3ページの既存表示に影響がないこと。

### Local evidence

- `よくある質問`の中央寄せを確認
- FAQ4分類、回答11項目、会場住所を確認
- 開催時間、購入方法、支払い、発送、領収書、企画背景の修正文を確認
- Topでグッズ・ECサイト・購入場所の文言がないことを確認
- Topで横スクロールなしを確認

### Public evidence

- `main`のコミット`7c67b28`反映後、公開Topで`main.css?v=20260912-faq-copy`の読み込みを確認
- 公開TopでFAQ見出し中央寄せ、4分類・11項目、会場住所、修正文、グッズ関連FAQなしを確認
- 公開Topで横スクロールなしを確認
- スマートフォン実機の表示確認は未確認

## Breakpoint and font-size calibration (2026-09-12)

1. モバイル`767px以下`、タブレット`768px〜1199px`、デスクトップ`1200px以上`の境界が揃っていること。
2. 本文・見出し・Galleryカテゴリの文字サイズが画面幅に応じて過度に小さくならないこと。
3. Top / Concept / Galleryの既存の縦書き・横書き・カード配置が保たれていること。
4. 3ページに横スクロールが発生しないこと。

### Local evidence

- 3ページで新キャッシュバスター`responsive-calibration`の読み込みを確認
- Top / Concept / Galleryのh2計13件が中央寄せであることを確認
- Top本文・FAQ本文の最小値14px、通常表示で16pxを確認
- Galleryカテゴリ見出し、紹介文、作品名・作者名のサイズを確認
- JavaScript構文、差分空白、レビューZIP整合性を確認

### Public evidence

- `main`のコミット`6c49c2f`反映後、公開3ページで`responsive-calibration`の読み込みを確認
- 公開Top / Concept / Galleryで文字サイズ、h2中央寄せ、横幅を確認
- 公開Galleryでカテゴリ見出し15px、紹介文18px、作品情報16pxを確認
- スマートフォン実機の表示・タップ確認は未確認

## All content buttons liquid unification (2026-09-12)

1. TopのConcept導線がTopのViewと同じ`liquid-button`構成であること。
2. Galleryの絞り込み・ページ移動が液晶グラス表示になっていること。
3. FAQ開閉、問い合わせ送信、モーダル操作の機能が維持されていること。
4. ConceptのGallery CTAと共通Header／Footerが維持されていること。
5. ハンバーガーのメニュー開閉を含む既存の専用操作が壊れていないこと。

### Evidence

- ローカルTopのConcept導線・FAQ、Galleryの操作ボタンを表示確認
- ローカル3ページでリンク、作品一覧、FAQ構造、共通ナビを確認
- `liquid-button.js`でネイティブ操作ボタンへ共通反応を付与し、既存の操作要素は保持
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

### Public addendum

- push後、公開TopのConcept導線と公開Galleryの絞り込みボタンを新しい液晶グラス表示で確認
- 公開3ページのリンク、作品一覧、FAQ構造、共通ナビを確認

## Concept FV label removal (2026-09-12)

1. ConceptページFV中央の「Concept」ラベルだけが削除されていること。
2. 「ゆらゆら」とFV本文の縦書きが維持されていること。
3. 左側の共通ナビにある「CONCEPT」とHeader／Footerのリンクが維持されていること。
4. FV以外のConcept本文・見出し・CTAが維持されていること。
5. 公開ページで削除後のHTMLが配信されていること。

### Evidence

- ローカルConceptのAXツリーでFV中央ラベルがなく、タイトル・本文・リンクが残ることを確認
- 公開ConceptのAXツリーとスクリーンショットで同内容を確認
- `git diff --check`、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

## Concept FV vertical restore (2026-09-12)

1. ConceptページのFV（CONCEPT、タイトル、FV本文）が縦書きであること。
2. FV以外のConcept本文・見出し・Gallery CTAが横書き／中央寄せのままであること。
3. 共通Header／Footerの縦書きメニューとリンクが維持されていること。
4. Conceptページの既存文章・画像・Galleryリンクが維持されていること。
5. 公開ページで新しいConcept CSSが読み込まれていること。

### Evidence

- ローカルConceptでFVの縦書き表示と、FV以外の本文・CTAを確認
- 公開Conceptで安定表示後のFV、共通ナビ、本文、Gallery CTAを確認
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認

## Body font-size range update (2026-09-12)

1. 本文の指定範囲がモバイル`12〜14px`、タブレット`13〜15px`、デスクトップ`14〜16px`であること。
2. 各本文サイズが`clamp()`で画面幅に応じて変化すること。
3. h2、h3、Gallery固有文字が本文との階層を保っていること。
4. 既存のFAQ、中央寄せ、リンク、横幅に影響がないこと。

### Local evidence

- `font-scale-v2`の読み込みを3ページで確認
- Top本文15.1px、h2 29.3px、FAQ見出し18.2pxを確認
- Concept本文16px、Galleryカテゴリ約14.6pxを確認
- 3ページで横スクロールなし、h2中央寄せを確認

### Public evidence

- `main`のコミット`b72deb2`反映後、公開3ページで`font-scale-v2`の読み込みを確認
- 公開Top / Concept / Galleryで文字サイズ、h2中央寄せ、横幅を確認
- 公開Topの本文15.7px、公開Galleryのカテゴリ15px・紹介文18px・作品情報15.7pxを確認
- スマートフォン実機の表示・タップ確認は未確認

## Concept horizontal text and liquid button update (2026-09-12)

1. ConceptページのFVに縦書きが残っておらず、ラベル・ロゴ・説明文が横書きで中央に揃っていること。
2. Conceptページ内の見出し・本文・説明ラベル・導線が中央寄せであること。
3. 「Galleryへ」ボタンがTopのViewと同じリキッドグラスの見た目・動作であること。
4. Conceptページの既存文章・画像・共通Header／Footer・Galleryリンクが維持されていること。
5. ハンバーガーの開閉とページ遷移を壊していないこと。

### Evidence

- ローカルConceptで横書き、中央寄せ、`liquid-button`を確認
- 公開Conceptで`Galleryへ ↗`リンク、既存コンテンツ、共通ナビを確認
- `liquid.css`、`liquid-button.js`の読み込み、JavaScript構文、差分空白を確認
- スマートフォン実機の表示・タップ確認は未確認

## Top Concept spacing update (2026-09-12)

1. TOPのConcept見出しが本文ブロックに対して中央に配置されていること。
2. 本文の行間が広すぎず、PC／スマホで読みやすく保たれていること。
3. 見出しサイズ・字間・見出し下余白が画面幅に応じて自然に変化すること。
4. Concept導線、作品セクション、FAQ、Access、共通ナビに影響がないこと。
5. TOPの横スクロールや本文の重なりが発生しないこと。

### Evidence

- 実効対象の`top-legacy.css`を更新し、TOPのConcept見出し・本文・導線をローカルで確認
- 公開Topを`top-concept-spacing-v2`クエリで読み込み、本文・導線・後続コンテンツを確認
- Concept／Galleryの公開コンテンツと共通ナビを確認
- `git diff --check`、JavaScript構文、編集前バックアップ、レビューZIPを確認
- スマートフォン実機の表示・タップ確認は未確認

## Writing direction update (2026-09-12)

1. FVのロゴ・説明文・Conceptラベル・Galleryの「作家紹介」が縦書きになっていること。
2. Header／Footerの全メニューが縦書きのまま維持されていること。
3. FV以外のTop／Concept／Galleryの見出し・本文・FAQ・作品情報・ボタンが横書きになっていること。
4. GalleryのPC／スマホ相当幅でFV見出しが画面内に収まり、本文のレイアウトが崩れないこと。
5. 3ページのリンク、作品一覧、FAQ、既存JS動作に影響がないこと。

### Evidence

- ローカル3ページで新しいwriting-mode指定と共通ナビ・本文・作品一覧を確認
- 公開3ページを`writing-mode-v1`クエリで読み込み、コンテンツとリンクを確認
- `git diff --check`、JavaScript構文、編集前バックアップを確認
- スマートフォン実機の表示・タップ確認は未確認
